// utils/api-client.ts
import { getAuthToken } from './auth-utils';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://keytake-backend.onrender.com';

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = BACKEND_URL) {
    this.baseURL = baseURL;
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const url = `${this.baseURL}${endpoint}`;
    const token = getAuthToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers,
    });
  }

  async get(endpoint: string): Promise<any> {
    const response = await this.makeRequest(endpoint, { method: 'GET' });
    return response.json();
  }

  async post(endpoint: string, data?: any): Promise<any> {
    const response = await this.makeRequest(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.json();
  }

  async put(endpoint: string, data?: any): Promise<any> {
    const response = await this.makeRequest(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.json();
  }

  async delete(endpoint: string): Promise<any> {
    const response = await this.makeRequest(endpoint, { method: 'DELETE' });
    return response.json();
  }
}

export const apiClient = new ApiClient();