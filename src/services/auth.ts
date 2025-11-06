import { apiClient } from './apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  institute?: string;
  university?: string;
  isProfessor?: boolean;
}

export interface LoginResponse {
  token: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  institute?: string;
  university?: string;
  isProfessor: boolean;
}

export default async function logIn(email: string, password: string): Promise<boolean> {
  if (email === '' || password === '') {
    return false;
  }

  try {
    const response = await apiClient.post<LoginResponse>(
      '/login',
      { email, password },
      false
    );
    
    localStorage.setItem('token', response.token);
    console.log('Logged in successfully');
    return true;
  } catch (error: any) {
    const errorMessage = error.message || 'Login failed';
    console.error(errorMessage);
    alert(errorMessage);
    return false;
  }
}

export async function signUp(
  username: string,
  email: string,
  password: string,
  additionalData?: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    institute?: string;
    university?: string;
    isProfessor?: boolean;
  }
): Promise<boolean> {
  if (username === '' || email === '' || password === '') {
    return false;
  }

  try {
    await apiClient.post<void>(
      '/register',
      {
        username,
        email,
        password,
        firstName: additionalData?.firstName,
        lastName: additionalData?.lastName,
        phoneNumber: additionalData?.phoneNumber,
        institute: additionalData?.institute,
        university: additionalData?.university,
        isProfessor: additionalData?.isProfessor || false
      },
      false
    );
    
    console.log('Registration successful');
    return true;
  } catch (error: any) {
    const errorMessage = error.message || 'Registration failed';
    console.error(errorMessage);
    alert(errorMessage);
    return false;
  }
}

export async function logOut(): Promise<void> {
  localStorage.removeItem('token');
  console.log('User signed out');
}

export async function getCurrentUser(): Promise<UserResponse | null> {
  try {
    const user = await apiClient.get<UserResponse>('/me');
    return user;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}