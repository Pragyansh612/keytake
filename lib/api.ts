import {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  UserProfile,
  UpdateUserProfile,
  UpdateUserResponse,
  NoteCreateRequest,
  NoteUpdateRequest,
  NoteResponse,
  NoteGenerationStatusResponse,
  QuizResponse,
  QuizAttemptRequest,
  QuizAttemptResponse,
  FlashcardWithProgressResponse,
  FlashcardProgressUpdateRequest,
  FlashcardProgressResponse,
  NoteShareRequest,
  NoteShareResponse,
  CommentCreateRequest,
  CommentResponse,
  NoteRelationshipCreateRequest,
  NoteRelationshipResponse,
  UserStatsResponse,
  UserAchievementResponse,
  PublicNoteResponse,
  CertifiedCollectionResponse,
  LikeResponse,
  StudyPlanCreateRequest,
  StudyPlanResponse,
  StudyPlanModuleResponse,
  RecommendationResponse,
  ExportFormats,
  SupportedFormatsResponse,
  HealthCheckResponse,
  ApiError,
  NoteShareByEmailRequest
} from '../types/types';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  // Token management
  private loadToken() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token');
    }
  }

  async setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);

      // Also set the httpOnly cookie via API
      try {
        await fetch('/api/auth/set-cookie', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: token })
        });
      } catch (error) {
        console.error('Failed to set auth cookie:', error);
      }
    }
  }

  async clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');

      // Also clear the httpOnly cookie via API
      try {
        await fetch('/api/auth/clear-cookie', {
          method: 'POST'
        });
      } catch (error) {
        console.error('Failed to clear auth cookie:', error);
      }
    }
  }

  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
        status_code: response.status
      }));

      // If we get 401/403, clear tokens and throw auth error
      if (response.status === 401 || response.status === 403) {
        await this.clearToken();
        throw new Error('Authentication required. Please log in again.');
      }

      throw new Error(errorData.detail);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    includeAuth: boolean = true
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      credentials: 'include', // Include cookies in requests
      headers: {
        ...this.getHeaders(includeAuth),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    return this.handleResponse<T>(response);
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return this.request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }, false);
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }, false);

    // Store tokens after successful login
    await this.setToken(response.access_token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('user_data', JSON.stringify({
        id: response.user_id,
        email: data.email
      }));
    }

    return response;
  }

  async logout(): Promise<{ message: string }> {
    try {
      const response = await this.request<{ message: string }>('/auth/logout', {
        method: 'POST',
      });
      return response;
    } finally {
      await this.clearToken();
    }
  }

  // User endpoints
  async getUserProfile(): Promise<UserProfile> {
    return this.request<UserProfile>('/users/me');
  }

  async updateUserProfile(data: UpdateUserProfile): Promise<UpdateUserResponse> {
    return this.request<UpdateUserResponse>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUserAccount(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/users/me', {
      method: 'DELETE',
    });
  }

  // Notes endpoints
  async createNote(data: NoteCreateRequest): Promise<NoteGenerationStatusResponse> {
    return this.request<NoteGenerationStatusResponse>('/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getNotes(params?: {
    folder_id?: string;
    is_public?: boolean;
  }): Promise<NoteResponse[]> {
    const searchParams = new URLSearchParams();
    if (params?.folder_id) searchParams.set('folder_id', params.folder_id);
    if (params?.is_public !== undefined) searchParams.set('is_public', String(params.is_public));

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request<NoteResponse[]>(`/notes${query}`);
  }

  async getNote(noteId: string): Promise<NoteResponse> {
    return this.request<NoteResponse>(`/notes/${noteId}`);
  }

  async updateNote(noteId: string, data: NoteUpdateRequest): Promise<NoteResponse> {
    return this.request<NoteResponse>(`/notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteNote(noteId: string): Promise<void> {
    return this.request<void>(`/notes/${noteId}`, {
      method: 'DELETE',
    });
  }

  // Learning Aids endpoints
  async generateLearningAids(noteId: string): Promise<{
    message: string;
    note_id: string;
    status: string;
  }> {
    return this.request<{
      message: string;
      note_id: string;
      status: string;
    }>(`/learning-aids/notes/${noteId}/generate`, {
      method: 'POST',
    });
  }

  async getQuizzesForNote(noteId: string): Promise<QuizResponse[]> {
    const response = await this.request<any[]>(`/learning-aids/notes/${noteId}/quizzes`);

    // Transform the response to match component expectations
    return response.map(quiz => ({
      ...quiz,
      questions: quiz.questions?.map((q: any) => ({
        id: q.id,
        quiz_id: q.quiz_id,
        question: q.question_text, // Map question_text to question
        question_type: q.question_type,
        options: q.options ?
          (Array.isArray(q.options) ?
            q.options.map((opt: any) => typeof opt === 'string' ? opt : opt.text) :
            JSON.parse(q.options).map((opt: any) => opt.text)
          ) : null, // Keep null for short_answer questions
        correct_answer: q.correct_answer,
        explanation: q.explanation
      })) || []
    }));
  }

  // Also update getQuizDetails method:
  async getQuizDetails(quizId: string): Promise<QuizResponse> {
    const response = await this.request<any>(`/learning-aids/quizzes/${quizId}`);

    return {
      ...response,
      questions: response.questions?.map((q: any) => ({
        id: q.id,
        quiz_id: q.quiz_id,
        question: q.question_text,
        question_type: q.question_type,
        options: q.options ?
          (Array.isArray(q.options) ?
            q.options.map((opt: any) => typeof opt === 'string' ? opt : opt.text) :
            JSON.parse(q.options).map((opt: any) => opt.text)
          ) : null,
        correct_answer: q.correct_answer,
        explanation: q.explanation
      })) || []
    };
  }

  async updateFlashcardProgress(
    flashcardId: string,
    data: FlashcardProgressUpdateRequest
  ): Promise<FlashcardProgressResponse> {
    return this.request<FlashcardProgressResponse>(`/learning-aids/flashcards/${flashcardId}/progress`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Collaboration endpoints
  async shareNote(noteId: string, data: NoteShareRequest): Promise<NoteShareResponse> {
    return this.request<NoteShareResponse>(`/collaboration/notes/${noteId}/share`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSharedNotes(): Promise<NoteResponse[]> {
    return this.request<NoteResponse[]>('/collaboration/notes/shared-with-me');
  }

  async addComment(noteId: string, data: CommentCreateRequest): Promise<CommentResponse> {
    return this.request<CommentResponse>(`/collaboration/notes/${noteId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getComments(noteId: string): Promise<CommentResponse[]> {
    return this.request<CommentResponse[]>(`/collaboration/notes/${noteId}/comments`);
  }

  async createNoteRelationship(
    noteId1: string,
    data: NoteRelationshipCreateRequest
  ): Promise<NoteRelationshipResponse> {
    return this.request<NoteRelationshipResponse>(`/collaboration/notes/${noteId1}/relationships`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getNoteRelationships(noteId: string): Promise<NoteRelationshipResponse[]> {
    return this.request<NoteRelationshipResponse[]>(`/collaboration/notes/${noteId}/relationships`);
  }

  // Community endpoints
  async getUserStats(): Promise<UserStatsResponse> {
    return this.request<UserStatsResponse>('/community/users/me/stats');
  }

  async getUserAchievements(): Promise<UserAchievementResponse[]> {
    return this.request<UserAchievementResponse[]>('/community/users/me/achievements');
  }

  async browsePublicNotes(params?: {
    is_certified?: boolean;
    sort_by?: 'newest' | 'views' | 'likes';
  }): Promise<PublicNoteResponse[]> {
    const searchParams = new URLSearchParams();
    if (params?.is_certified !== undefined) searchParams.set('is_certified', String(params.is_certified));
    if (params?.sort_by) searchParams.set('sort_by', params.sort_by);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request<PublicNoteResponse[]>(`/community/public/notes${query}`);
  }

  async likeNote(noteId: string): Promise<LikeResponse> {
    return this.request<LikeResponse>(`/community/notes/${noteId}/like`, {
      method: 'POST',
    });
  }

  async unlikeNote(noteId: string): Promise<LikeResponse> {
    return this.request<LikeResponse>(`/community/notes/${noteId}/like`, {
      method: 'DELETE',
    });
  }

  async getCertifiedCollections(): Promise<CertifiedCollectionResponse[]> {
    return this.request<CertifiedCollectionResponse[]>('/community/public/collections');
  }

  // Learning Journeys endpoints
  async createStudyPlan(data: StudyPlanCreateRequest): Promise<{
    message: string;
    study_plan_id: string;
    status: string;
  }> {
    return this.request<{
      message: string;
      study_plan_id: string;
      status: string;
    }>('/learning-journeys/study-plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getStudyPlans(): Promise<StudyPlanResponse[]> {
    return this.request<StudyPlanResponse[]>('/learning-journeys/study-plans');
  }

  async completeStudyPlanModule(moduleId: string): Promise<StudyPlanModuleResponse> {
    return this.request<StudyPlanModuleResponse>(`/learning-journeys/study-plans/modules/${moduleId}/complete`, {
      method: 'PUT',
    });
  }

  async getRecommendations(): Promise<RecommendationResponse[]> {
    return this.request<RecommendationResponse[]>('/learning-journeys/recommendations');
  }

  // Add this method to your existing ApiClient class
  async getFlashcards(noteId?: string): Promise<FlashcardWithProgressResponse[]> {
    const query = noteId ? `?note_id=${noteId}` : '';
    const response = await this.request<Array<{
      flashcard: {
        id: string;
        note_id: string;
        user_id: string;
        front_content: string;
        back_content: string;
        created_at: string;
        updated_at: string;
      };
      progress?: FlashcardProgressResponse;
    }>>(`/learning-aids/flashcards${query}`);

    // Transform the nested response to match component expectations
    return response.map(item => ({
      id: item.flashcard.id,
      note_id: item.flashcard.note_id,
      user_id: item.flashcard.user_id,
      front: item.flashcard.front_content, // Map front_content to front
      back: item.flashcard.back_content, // Map back_content to back
      created_at: item.flashcard.created_at,
      updated_at: item.flashcard.updated_at,
      progress: item.progress ? {
        ...item.progress,
        difficulty: item.progress.difficulty,
        last_reviewed: item.progress.last_reviewed,
        review_count: item.progress.repetitions // Map repetitions to review_count
      } : undefined
    }));
  }

  // FIXED: Update the quiz attempt method to send answers as an object/dictionary
  async submitQuizAttempt(quizId: string, data: QuizAttemptRequest): Promise<QuizAttemptResponse> {
    // Transform the array of answers to a dictionary format that the backend expects
    const answersDict: Record<string, string> = {};
    
    if (Array.isArray(data.answers)) {
      // If answers is an array, convert it to a dictionary
      data.answers.forEach((answer: any) => {
        answersDict[answer.question_id] = answer.selected_answer;
      });
    } else {
      // If answers is already an object, use it directly
      Object.assign(answersDict, data.answers);
    }

    const requestBody = {
      answers: answersDict
    };

    return this.request<QuizAttemptResponse>(`/learning-aids/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  }

  // Export endpoints
  async exportNote(noteId: string, format: ExportFormats): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/export/notes/${noteId}?format=${format}`, {
      credentials: 'include',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`
      }));
      throw new Error(errorData.detail);
    }

    return response.blob();
  }

  async getSupportedExportFormats(): Promise<SupportedFormatsResponse> {
    return this.request<SupportedFormatsResponse>('/export/formats', {}, false);
  }

  // Health check
  async healthCheck(): Promise<HealthCheckResponse> {
    return this.request<HealthCheckResponse>('/health', {}, false);
  }

  // Utility method to download exported file
  downloadFile(blob: Blob, filename: string) {
    if (typeof window === 'undefined') return;

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  // Utility method to handle file exports with proper naming
  async exportAndDownloadNote(noteId: string, format: ExportFormats, noteTitle?: string) {
    try {
      const blob = await this.exportNote(noteId, format);
      const safeName = noteTitle?.replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/\s+/g, '_').substring(0, 50) || 'note';
      const extension = format === 'json' ? '.json' : format === 'markdown' ? '.md' : '.pdf';
      this.downloadFile(blob, `${safeName}_export${extension}`);
    } catch (error) {
      throw new Error(`Failed to export note: ${error}`);
    }
  }

  async shareNoteByEmail(noteId: string, data: NoteShareByEmailRequest): Promise<NoteShareResponse> {
  return this.request<NoteShareResponse>(`/collaboration/notes/${noteId}/share-by-email`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
}

// Create and export a singleton instance
export const api = new ApiClient();

// Export the class for custom instances if needed
export default ApiClient;

// Helper functions for common patterns
export const useApiAuth = () => {
  const login = async (email: string, password: string) => {
    try {
      const response = await api.login({ email, password });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const register = async (email: string, password: string, name: string, user_type?: 'student' | 'teacher' | 'professional') => {
    try {
      const response = await api.register({ email, password, name, user_type });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  return { login, register, logout };
};

// Helper for error handling
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Helper for checking if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem('access_token'));
};