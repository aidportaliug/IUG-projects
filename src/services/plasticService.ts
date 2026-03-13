import { apiClient } from './apiClient';
import BackendConfig from './BackendConfig';

export interface PlasticResponse {
  id: number;
  name: string;
}

export interface PlasticListResponse {
  plastics: PlasticResponse[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PlasticProjectResponse {
  id: number;
  name: string;
  startDate: string;
  endDate: string | null;
  durationDays: number | null;
  country: string;
  product: string;
  financing: string;
  businessModel: string;
  wasteCollected: number;
  summary: string | null;
  plastics: PlasticResponse[];
}

export interface PlasticProjectListResponse {
  projects: PlasticProjectResponse[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PlasticCreateRequest {
  name: string;
}

export interface PlasticUpdateRequest {
  name?: string;
}

export interface PlasticProjectCreateRequest {
  name: string;
  startDate: string;
  endDate?: string;
  country: string;
  product: string;
  financing: string;
  businessModel: string;
  wasteCollected: number;
  summary?: string;
  plasticIds?: number[];
}

export interface PlasticProjectUpdateRequest {
  name?: string;
  startDate?: string;
  endDate?: string;
  country?: string;
  product?: string;
  financing?: string;
  businessModel?: string;
  wasteCollected?: number;
  summary?: string;
  plasticIds?: number[];
}

export async function getPlastics(search?: string, page = 1, pageSize = 100): Promise<PlasticListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (search?.trim()) {
    params.set('search', search.trim());
  }

  return apiClient.get<PlasticListResponse>(`${BackendConfig.endpoint.getAllPlastics}?${params.toString()}`, false);
}

export async function getPlastic(id: number): Promise<PlasticResponse> {
  return apiClient.get<PlasticResponse>(`${BackendConfig.endpoint.getPlasticById}${id}`, false);
}

export async function createPlastic(data: PlasticCreateRequest): Promise<PlasticResponse> {
  return apiClient.post<PlasticResponse>(BackendConfig.endpoint.createPlastic, data);
}

export async function updatePlastic(id: number, data: PlasticUpdateRequest): Promise<PlasticResponse> {
  return apiClient.put<PlasticResponse>(`${BackendConfig.endpoint.updatePlastic}${id}`, data);
}

export async function deletePlastic(id: number): Promise<void> {
  await apiClient.delete(`${BackendConfig.endpoint.deletePlastic}${id}`);
}

export async function getPlasticProjects(): Promise<PlasticProjectListResponse> {
  return apiClient.get<PlasticProjectListResponse>(BackendConfig.endpoint.getAllPlasticProjects, false);
}

export async function getPlasticProject(id: number): Promise<PlasticProjectResponse> {
  return apiClient.get<PlasticProjectResponse>(`${BackendConfig.endpoint.getPlasticProjectById}${id}`, false);
}

export async function createPlasticProject(data: PlasticProjectCreateRequest): Promise<PlasticProjectResponse> {
  return apiClient.post<PlasticProjectResponse>(BackendConfig.endpoint.createPlasticProject, data);
}

export async function updatePlasticProject(
  id: number,
  data: PlasticProjectUpdateRequest
): Promise<PlasticProjectResponse> {
  return apiClient.put<PlasticProjectResponse>(`${BackendConfig.endpoint.updatePlasticProject}${id}`, data);
}

export async function deletePlasticProject(id: number): Promise<void> {
  await apiClient.delete(`${BackendConfig.endpoint.deletePlasticProject}${id}`);
}
