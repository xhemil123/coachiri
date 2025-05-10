import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { MotivationPost } from '../types';
import { Send, Trash2 } from 'lucide-react';

type MotivationPostFormData = {
  content: string;
  image_url?: string;
};

const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const [posts, setPosts] = useState<MotivationPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<MotivationPostFormData>();
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('daily_motivation')
          .select('*')
          .order('post_date', { ascending: false });
        
        if (error) {
          console.error('Error fetching posts:', error);
          return;
        }
        
        if (data) {
          setPosts(data);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  const onSubmit = async (data: MotivationPostFormData) => {
    if (!isAdmin) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      const newPost = {
        content: data.content,
        image_url: data.image_url || null,
        post_date: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('daily_motivation')
        .insert(newPost);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      // Refresh posts
      const { data: updatedPosts } = await supabase
        .from('daily_motivation')
        .select('*')
        .order('post_date', { ascending: false });
      
      if (updatedPosts) {
        setPosts(updatedPosts);
      }
      
      // Reset form
      reset();
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('daily_motivation')
        .delete()
        .eq('post_id', postId);
      
      if (error) {
        console.error('Error deleting post:', error);
        return;
      }
      
      // Remove from state
      setPosts(posts.filter(post => post.post_id !== postId));
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-primary-500 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Admin Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Motivation Post</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="mb-4 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="form-control mb-4">
            <label htmlFor="content" className="label">
              Content
            </label>
            <textarea
              id="content"
              rows={4}
              className={`input ${errors.content ? 'input-error' : ''}`}
              placeholder="Enter your motivational content..."
              {...register('content', { 
                required: 'Content is required',
                maxLength: {
                  value: 500,
                  message: 'Content must be less than 500 characters',
                },
              })}
            ></textarea>
            {errors.content && (
              <p className="mt-1 text-sm text-error-500">{errors.content.message}</p>
            )}
          </div>
          
          <div className="form-control mb-6">
            <label htmlFor="image_url" className="label">
              Image URL (optional)
            </label>
            <input
              id="image_url"
              type="text"
              className="input"
              placeholder="https://example.com/image.jpg"
              {...register('image_url')}
            />
            <p className="mt-1 text-sm text-gray-500">
              Provide a URL to an inspiring image to accompany your post.
            </p>
          </div>
          
          <button
            type="submit"
            className="btn btn-primary flex items-center justify-center"
            disabled={submitting}
          >
            {submitting ? (
              <span className="animate-pulse">Posting...</span>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Post Motivation
              </>
            )}
          </button>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Manage Motivation Posts</h2>
        
        {posts.length === 0 ? (
          <p className="text-gray-600 py-4">No posts available.</p>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <div key={post.post_id} className="border-b pb-6 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-700 mb-2">{post.content}</p>
                    <p className="text-sm text-gray-500">
                      Posted on {new Date(post.post_date).toLocaleDateString()}
                    </p>
                    {post.image_url && (
                      <p className="text-sm text-gray-500 mt-1">
                        Image: {post.image_url}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeletePost(post.post_id)}
                    className="text-error-500 hover:text-error-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard