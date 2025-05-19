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
      activity_logs: {
        Row: {
          action_type: string
          created_at: string | null
          id: string
          metadata: Json | null
          resource_id: string | null
          resource_type: string
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          resource_id?: string | null
          resource_type: string
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      feedback: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          note_id: string | null
          rating: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          note_id?: string | null
          rating?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          note_id?: string | null
          rating?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      folders: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_folder_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_folder_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_folder_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "folders_parent_folder_id_fkey"
            columns: ["parent_folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "folders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      highlights: {
        Row: {
          color: string | null
          content: string
          created_at: string | null
          id: string
          note_id: string
          timestamp_end: number | null
          timestamp_start: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          content: string
          created_at?: string | null
          id?: string
          note_id: string
          timestamp_end?: number | null
          timestamp_start?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          content?: string
          created_at?: string | null
          id?: string
          note_id?: string
          timestamp_end?: number | null
          timestamp_start?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "highlights_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "highlights_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      note_tags: {
        Row: {
          created_at: string | null
          note_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string | null
          note_id: string
          tag_id: string
        }
        Update: {
          created_at?: string | null
          note_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_tags_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "note_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
      notes: {
        Row: {
          content: Json
          created_at: string | null
          folder_id: string | null
          id: string
          is_public: boolean | null
          summary: string | null
          updated_at: string | null
          user_id: string
          video_creator: string | null
          video_duration: number | null
          video_id: string
          video_thumbnail_url: string | null
          video_title: string
          view_count: number | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          folder_id?: string | null
          id?: string
          is_public?: boolean | null
          summary?: string | null
          updated_at?: string | null
          user_id: string
          video_creator?: string | null
          video_duration?: number | null
          video_id: string
          video_thumbnail_url?: string | null
          video_title: string
          view_count?: number | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          folder_id?: string | null
          id?: string
          is_public?: boolean | null
          summary?: string | null
          updated_at?: string | null
          user_id?: string
          video_creator?: string | null
          video_duration?: number | null
          video_id?: string
          video_thumbnail_url?: string | null
          video_title?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      usage_limits: {
        Row: {
          advanced_features: boolean | null
          created_at: string | null
          id: string
          max_video_length: number
          monthly_notes_limit: number
          tier: string
          updated_at: string | null
        }
        Insert: {
          advanced_features?: boolean | null
          created_at?: string | null
          id?: string
          max_video_length: number
          monthly_notes_limit: number
          tier: string
          updated_at?: string | null
        }
        Update: {
          advanced_features?: boolean | null
          created_at?: string | null
          id?: string
          max_video_length?: number
          monthly_notes_limit?: number
          tier?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          default_note_format: string | null
          email_notifications: boolean | null
          id: string
          theme: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          default_note_format?: string | null
          email_notifications?: boolean | null
          id?: string
          theme?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          default_note_format?: string | null
          email_notifications?: boolean | null
          id?: string
          theme?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          field_of_study: string | null
          id: string
          industry: string | null
          institution: string | null
          notes_generated: number | null
          notes_saved: number | null
          role_position: string | null
          stripe_customer_id: string | null
          subscription_end_date: string | null
          subscription_status: string | null
          subscription_tier: string | null
          updated_at: string | null
          use_case: string | null
          user_type: string
          year_semester: string | null
          name: string | null;
        }
        Insert: {
          created_at?: string | null
          email: string
          field_of_study?: string | null
          id: string
          industry?: string | null
          institution?: string | null
          notes_generated?: number | null
          notes_saved?: number | null
          role_position?: string | null
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          use_case?: string | null
          user_type: string
          year_semester?: string | null
          name: string | null;
        }
        Update: {
          created_at?: string | null
          email?: string
          field_of_study?: string | null
          id?: string
          industry?: string | null
          institution?: string | null
          notes_generated?: number | null
          notes_saved?: number | null
          role_position?: string | null
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          use_case?: string | null
          user_type?: string
          year_semester?: string | null
          name: string | null;
        }
        Relationships: []
      }
    }
    Views: {
      user_stats: {
        Row: {
          avg_rating: number | null
          email: string | null
          id: string | null
          notes_generated: number | null
          notes_saved: number | null
          subscription_tier: string | null
          total_folders: number | null
          total_highlights: number | null
          total_notes: number | null
          user_type: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_user_limits: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      increment_notes_generated: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
      increment_notes_saved: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
      ensure_user_profile_exists: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}