// Base types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Auth types
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  user_type?: 'student' | 'teacher' | 'professional';
}

export interface RegisterResponse {
  user_id: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user_id: string;
}

// User types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  user_type: 'student' | 'teacher' | 'professional';
  subscription_tier: 'free' | 'premium' | 'enterprise';
  notes_generated: number;
  current_learning_streak: number;
  longest_learning_streak: number;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateUserProfile {
  name?: string;
  user_type?: 'student' | 'teacher' | 'professional';
}

export interface UpdateUserResponse {
  updated_fields: string[];
}

// Note types
export interface NoteCreateRequest {
  video_id: string;
  video_title: string;
}

export interface NoteUpdateRequest {
  video_title?: string;
  content?: Record<string, any>;
  summary?: string;
  is_public?: boolean;
  folder_id?: string;
}

export interface NoteResponse {
  id: string;
  user_id: string;
  video_id: string;
  video_title: string;
  video_creator?: string;
  video_duration?: number;
  video_thumbnail_url?: string;
  content: Record<string, any>;
  summary?: string;
  is_public: boolean;
  view_count: number;
  folder_id?: string;
  created_at: string;
  updated_at: string;
  is_certified?: boolean;
}

export interface NoteGenerationStatusResponse {
  note_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message: string;
}

// Learning Aids types
export interface QuestionOption {
  text: string;
  is_correct: boolean;
}

// Updated QuizQuestionResponse to match component usage
export interface QuizQuestionResponse {
  id: string;
  quiz_id: string;
  question: string; // Changed from question_text to match component usage
  question_type: 'multiple_choice' | 'short_answer' | 'true_false';
  options?: string[]; // Simplified to string array as used in components
  correct_answer: string;
  explanation?: string;
}

export interface QuizResponse {
  id: string;
  note_id: string;
  title: string;
  description?: string;
  difficulty?: string; // Added difficulty property used in components
  questions: QuizQuestionResponse[];
  created_at: string;
}

// Updated QuizAttemptRequest to match component usage
export interface QuizAttemptRequest {
  answers: Record<string, string>;
}

// Updated QuizAttemptResponse to include detailed results
export interface QuizAttemptResponse {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  correct_answers: number; // Added for component usage
  total_questions: number;
  passed: boolean;
  attempt_date: string;
  question_results?: Array<{
    question: string;
    user_answer: string;
    correct_answer: string;
    correct: boolean;
  }>;
}

export interface FlashcardResponse {
  id: string;
  note_id: string;
  user_id: string;
  front_content: string;
  back_content: string;
  created_at: string;
  updated_at: string;
}

// Updated FlashcardProgressResponse to match component usage
export interface FlashcardProgressResponse {
  id: string
  flashcard_id: string
  user_id: string
  difficulty?: 'easy' | 'medium' | 'hard'
  last_reviewed?: string
  review_count: number
  ease_factor: number      // Add this field
  repetitions: number      // Add this field (maps to review_count in your component)
  next_review_date?: string
  created_at: string
  updated_at: string
}

// Updated FlashcardWithProgressResponse to be flattened for easier component usage
export interface FlashcardWithProgressResponse {
  id: string;
  note_id: string;
  user_id: string;
  front: string; // Simplified property names
  back: string;
  created_at: string;
  updated_at: string;
  progress?: FlashcardProgressResponse;
}

// Updated FlashcardProgressUpdateRequest to match component usage
export interface FlashcardProgressUpdateRequest {
  difficulty: 'easy' | 'medium' | 'hard'
  last_reviewed: string
  review_count: number
  ease_factor: number      // Required by backend
  repetitions: number      // Required by backend
}

// Collaboration types
export interface NoteShareRequest {
  shared_with_user_id: string;
  permissions: 'view' | 'comment' | 'edit';
}

export interface NoteShareResponse {
  id: string;
  note_id: string;
  shared_by_user_id: string;
  shared_with_user_id: string;
  permissions: string;
  created_at: string;
}

export interface CommentCreateRequest {
  comment_text: string;
  parent_comment_id?: string;
  highlight_id?: string;
}

export interface CommentResponse {
  id: string;
  note_id: string;
  user_id: string;
  comment_text: string;
  parent_comment_id?: string;
  highlight_id?: string;
  user_name?: string;
  user_email?: string;
  created_at: string;
  updated_at: string;
}

export interface NoteRelationshipCreateRequest {
  note_id_2: string;
  relationship_type: 'related' | 'prerequisite' | 'followup' | 'contradicts';
  description?: string;
}

export interface NoteRelationshipResponse {
  id: string;
  note_id_1: string;
  note_id_2: string;
  relationship_type: string;
  description?: string;
  created_at: string;
}

// Community types
export interface UserStatsResponse {
  notes_generated: number;
  current_learning_streak: number;
  longest_learning_streak: number;
}

export interface AchievementResponse {
  id: string;
  name: string;
  description: string;
  badge_icon_url?: string;
  criteria_json?: Record<string, any>;
}

export interface UserAchievementResponse {
  user_id: string;
  achievement: AchievementResponse;
  achieved_at: string;
}

export interface PublicNoteResponse extends NoteResponse {
  author_name?: string; // Used in original code but missing in current PublicNoteResponse
  user_name?: string; // Also used in API
  like_count: number; // Changed from likes_count to match API response
  likes_count?: number; // Keep for backward compatibility
  views?: number; // Alternative name for view_count
  tags?: string[]; // Add support for tags if available
  description?: string; // Add description field used in search
  duration?: string; // Add duration field
  thumbnail_url?: string; // Alternative to video_thumbnail_url
}

export interface CertifiedCollectionResponse {
  id: string;
  name: string;
  description?: string;
  curator_user_id?: string;
  image_url?: string;
  notes: NoteResponse[];
  created_at: string;
}

export interface LikeResponse {
  message: string;
}

// Learning Journeys types
export interface StudyPlanCreateRequest {
  goal: string;
  duration_days: number;
}

export interface StudyPlanModuleResponse {
  id: string;
  study_plan_id: string;
  module_type: 'video' | 'reading' | 'practice' | 'quiz' | 'project';
  resource_id?: string;
  title: string;
  description?: string;
  due_date: string;
  completed: boolean;
  completed_at?: string;
}

export interface StudyPlanResponse {
  id: string;
  user_id: string;
  goal: string;
  duration_days: number;
  start_date: string;
  end_date: string;
  status: 'generating' | 'active' | 'completed' | 'failed';
  modules: StudyPlanModuleResponse[];
  created_at: string;
  updated_at: string;
}

export interface RecommendationResponse {
  id: string;
  target_type: 'user' | 'general';
  target_id?: string;
  recommendation_type: 'video' | 'course' | 'article' | 'book';
  title: string;
  description: string;
  link: string;
  image_url?: string;
  source_provider?: string;
}

// Export types
export type ExportFormats = 'json' | 'markdown' | 'pdf';

export interface ExportFormatInfo {
  value: ExportFormats;
  name: string;
  description: string;
  media_type: string;
  file_extension: string;
}

export interface SupportedFormatsResponse {
  formats: ExportFormatInfo[];
}

// Health Check types
export interface HealthCheckResponse {
  status: string;
  service: string;
  version: string;
  gemini_client: string;
}

// Generic API error type
export interface ApiError {
  detail: string;
  status_code?: number;
}

// Pagination types (for future use)
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface NoteShareByEmailRequest {
  email: string;
  message?: string;
  permission: 'view' | 'comment';
}