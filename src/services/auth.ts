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
  isStudent?: boolean;
  isAdmin?: boolean;
  userType?: 'admin' | 'professor' | 'student' | 'member';
  // New sign-ups are PENDING until the admin approves them.
  approvalStatus?: 'PENDING' | 'APPROVED';
  createdAt?: string | null;
}

const userTypeLabels = { admin: 'Admin', professor: 'Professor', student: 'Student', member: 'Member' };

// Display name of the user's type; falls back to isProfessor for backends without userType.
export function userTypeLabel(user: UserResponse): string {
  return userTypeLabels[user.userType ?? (user.isProfessor ? 'professor' : 'student')];
}

export default async function logIn(email: string, password: string): Promise<boolean> {
  if (email === '' || password === '') {
    return false;
  }

  try {
    const response = await apiClient.post<LoginResponse>('/login', { email, password }, false);

    localStorage.setItem('token', response.token);
    console.log('Logged in successfully');
    return true;
  } catch (error: any) {
    throw new Error(error.message || 'Login failed');
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
    isStudent?: boolean;
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
        isStudent: additionalData?.isStudent || false,
      },
      false
    );

    console.log('Registration successful');
    return true;
  } catch (error: any) {
    throw new Error(error.message || 'Registration failed');
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

// Plastic projects: students and professors upload projects and edit their own; the admin edits and deletes any.
export function canUploadProjects(user?: UserResponse | null): boolean {
  return !!user && (!!user.isAdmin || !!user.isProfessor || !!user.isStudent);
}

export function canEditProject(user: UserResponse | null | undefined, project: { createdBy?: number | null }): boolean {
  return !!user && (!!user.isAdmin || (canUploadProjects(user) && project.createdBy === user.id));
}

export function canDeleteProjects(user?: UserResponse | null): boolean {
  return !!user?.isAdmin;
}
