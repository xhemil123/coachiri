export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin_credentials: {
        Row: {
          admin_id: string
          email: string
          password: string
        }
        Insert: {
          admin_id?: string
          email: string
          password: string
        }
        Update: {
          admin_id?: string
          email?: string
          password?: string
        }
        Relationships: []
      }
      daily_motivation: {
        Row: {
          admin_id: string
          content: string
          image_url: string | null
          post_date: string
          post_id: string
        }
        Insert: {
          admin_id: string
          content: string
          image_url?: string | null
          post_date?: string
          post_id?: string
        }
        Update: {
          admin_id?: string
          content?: string
          image_url?: string | null
          post_date?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_motivation_admin_id_fkey"
            columns: ["admin_id"]
            referencedRelation: "admin_credentials"
            referencedColumns: ["admin_id"]
          }
        ]
      }
      meal_plans: {
        Row: {
          breakfast: string
          calorie_range_max: number
          calorie_range_min: number
          dinner: string
          lunch: string
          plan_id: string
          portions_multiplier: number
          snacks: string
        }
        Insert: {
          breakfast: string
          calorie_range_max: number
          calorie_range_min: number
          dinner: string
          lunch: string
          plan_id?: string
          portions_multiplier: number
          snacks: string
        }
        Update: {
          breakfast?: string
          calorie_range_max?: number
          calorie_range_min?: number
          dinner?: string
          lunch?: string
          plan_id?: string
          portions_multiplier?: number
          snacks?: string
        }
        Relationships: []
      }
      personal_info: {
        Row: {
          activity_level: Database["public"]["Enums"]["activity_level"]
          age: number
          bmi: number | null
          carbs_macro: number | null
          daily_calories: number | null
          fat_macro: number | null
          height: number
          info_id: string
          protein_macro: number | null
          sex: string
          target_weight_loss: number | null
          user_id: string
          weight: number
          weight_goal: Database["public"]["Enums"]["weight_goal"] | null
        }
        Insert: {
          activity_level: Database["public"]["Enums"]["activity_level"]
          age: number
          bmi?: number | null
          carbs_macro?: number | null
          daily_calories?: number | null
          fat_macro?: number | null
          height: number
          info_id?: string
          protein_macro?: number | null
          sex: string
          target_weight_loss?: number | null
          user_id: string
          weight: number
          weight_goal?: Database["public"]["Enums"]["weight_goal"] | null
        }
        Update: {
          activity_level?: Database["public"]["Enums"]["activity_level"]
          age?: number
          bmi?: number | null
          carbs_macro?: number | null
          daily_calories?: number | null
          fat_macro?: number | null
          height?: number
          info_id?: string
          protein_macro?: number | null
          sex?: string
          target_weight_loss?: number | null
          user_id?: string
          weight?: number
          weight_goal?: Database["public"]["Enums"]["weight_goal"] | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_info_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          }
        ]
      }
      user_favorites: {
        Row: {
          date_favorited: string
          favorite_id: string
          post_id: string
          user_id: string
        }
        Insert: {
          date_favorited?: string
          favorite_id?: string
          post_id: string
          user_id: string
        }
        Update: {
          date_favorited?: string
          favorite_id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "daily_motivation"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          }
        ]
      }
      users: {
        Row: {
          email: string
          password: string
          personal_info_id: string | null
          registration_date: string
          user_id: string
        }
        Insert: {
          email: string
          password: string
          personal_info_id?: string | null
          registration_date?: string
          user_id?: string
        }
        Update: {
          email?: string
          password?: string
          personal_info_id?: string | null
          registration_date?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      activity_level: "sedentary" | "light" | "moderate" | "active" | "very_active"
      weight_goal: "lose_weight"
    }
  }
}