import { apiClient } from './apiClient';
import { UserResponse } from './auth';

export type ApprovalStatus = 'PENDING' | 'APPROVED';

// Sign-ups for the admin to review, newest first.
export async function getUsersByStatus(status: ApprovalStatus): Promise<UserResponse[]> {
  return apiClient.get<UserResponse[]>(`/admin/users?status=${status}`);
}

export async function approveUser(id: number): Promise<UserResponse> {
  return apiClient.post<UserResponse>(`/admin/users/${id}/approve`);
}

// Deletes the pending sign-up; the person can register again.
export async function rejectUser(id: number): Promise<void> {
  await apiClient.post<void>(`/admin/users/${id}/reject`);
}

// Deletes the account together with the master projects and reports it owns. The admin account cannot be deleted.
export async function deleteUser(id: number): Promise<void> {
  await apiClient.delete(`/admin/users/${id}`);
}

export type ChangeableUserType = 'member' | 'student' | 'professor';

// Changes a user's type. The admin account's type cannot be changed.
export async function changeUserType(id: number, userType: ChangeableUserType): Promise<UserResponse> {
  return apiClient.put<UserResponse>(`/admin/users/${id}/type`, { userType });
}
