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
