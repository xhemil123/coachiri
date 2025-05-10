import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { MotivationPost, UserFavorite } from '../types';
import { PlusCircle } from 'lucide-react';
import MotivationCard from '../components/motivation/MotivationCard';

const MotivationFeed: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [posts, setPosts] = useState<MotivationPost[]>([]);
  const [userFavorites, setUserFavorites] = useState<UserFavorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch motivation posts
        const { data: postsData, error: postsError } = await supabase
          .from('daily_motivation')
          .select('*')
          .order('post_date', { ascending: false });
        
        if (postsError) {
          console.error('Error fetching motivation posts:', postsError);
          return;
        }
        
        if (postsData) {
          setPosts(postsData);
        }
        
        // Only fetch favorites for regular users, not admins
        if (user && !isAdmin) {
          // Fetch user favorites
          const { data: favoritesData, error: favoritesError } = await supabase
            .from('user_favorites')
            .select('*')
            .eq('user_id', user.user_id);
          
          if (favoritesError) {
            console.error('Error fetching user favorites:', favoritesError);
            return;
          }
          
          if (favoritesData) {
            setUserFavorites(favoritesData);
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, isAdmin]);
  
  const handleToggleFavorite = async (postId: string, isFavorited: boolean) => {
    if (!user || isAdmin) return; // Don't handle favorites for admin users
    
    if (isFavorited) {
      try {
        const { data, error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.user_id,
            post_id: postId,
          })
          .select()
          .single();
          
        if (error) {
          console.error('Error adding favorite:', error);
          return;
        }
        
        if (data) {
          setUserFavorites([...userFavorites, data]);
        }
      } catch (error) {
        console.error('Error adding favorite:', error);
      }
    } else {
      try {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.user_id)
          .eq('post_id', postId);
          
        if (error) {
          console.error('Error removing favorite:', error);
          return;
        }
        
        setUserFavorites(userFavorites.filter(fav => fav.post_id !== postId));
      } catch (error) {
        console.error('Error removing favorite:', error);
      }
    }
  };
  
  const filteredPosts = filter === 'all' 
    ? posts
    : posts.filter(post => userFavorites.some(fav => fav.post_id === post.post_id));
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-primary-500 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!user && !isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Daily Motivation</h1>
          <p className="mt-4 text-xl text-gray-600">
            Please sign in to view motivational content.
          </p>
          <div className="mt-8">
            <Link
              to="/login"
              className="btn btn-primary inline-flex items-center py-3 px-6 text-base"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Daily Motivation</h1>
        <p className="mt-2 text-lg text-gray-600">
          Daily inspiration to keep you motivated on your fitness journey.
        </p>
      </div>
      
      {!isAdmin && (
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setFilter('all')}
            >
              All Posts
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                filter === 'favorites'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setFilter('favorites')}
            >
              My Favorites
            </button>
          </div>
        </div>
      )}
      
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          {filter === 'all' ? (
            <p className="text-gray-600">
              No motivation posts available at the moment. Check back soon!
            </p>
          ) : (
            <p className="text-gray-600">
              You haven't favorited any posts yet. Browse the "All Posts" section and mark your favorites.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {filteredPosts.map(post => (
            <MotivationCard
              key={post.post_id}
              post={post}
              userId={user?.user_id}
              userFavorites={userFavorites}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MotivationFeed