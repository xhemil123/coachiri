import React from 'react';
import { MotivationPost, UserFavorite } from '../../types';
import { Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface MotivationCardProps {
  post: MotivationPost;
  userId: string;
  userFavorites: UserFavorite[];
  onToggleFavorite: (postId: string, isFavorited: boolean) => void;
}

const MotivationCard: React.FC<MotivationCardProps> = ({ 
  post, 
  userId,
  userFavorites,
  onToggleFavorite
}) => {
  const isFavorited = userFavorites.some(fav => fav.post_id === post.post_id);
  
  const toggleFavorite = async () => {
    try {
      if (isFavorited) {
        // Remove from favorites
        const favoriteToRemove = userFavorites.find(fav => fav.post_id === post.post_id);
        
        if (favoriteToRemove) {
          await supabase
            .from('user_favorites')
            .delete()
            .eq('favorite_id', favoriteToRemove.favorite_id);
        }
      } else {
        // Add to favorites
        await supabase.from('user_favorites').insert({
          user_id: userId,
          post_id: post.post_id,
          date_favorited: new Date().toISOString(),
        });
      }
      
      onToggleFavorite(post.post_id, !isFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {post.image_url && (
        <img 
          src={post.image_url} 
          alt="Motivation" 
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">{formatDate(post.post_date)}</p>
          <button
            onClick={toggleFavorite}
            className="flex items-center text-sm text-gray-500 hover:text-primary-500"
          >
            <Heart 
              className={`h-5 w-5 mr-1 ${isFavorited ? 'fill-primary-500 text-primary-500' : ''}`} 
            />
            {isFavorited ? 'Favorited' : 'Favorite'}
          </button>
        </div>
        
        <div className="prose">
          <p className="text-gray-800 text-lg leading-relaxed">
            "{post.content}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default MotivationCard;