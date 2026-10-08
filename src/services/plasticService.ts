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

export interface PlasticProjectDocument {
  id: number;
  projectId: number;
  kind: 'FILE' | 'LINK';
  title: string;
  // LINK: external URL. FILE: API path that serves the PDF (see documentHref).
  url: string;
  fileName: string | null;
  sizeBytes: number | null;
  createdAt: string;
}

export interface DocumentLinkRequest {
  title: string;
  url: string;
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
  documents: PlasticProjectDocument[];
  // ID of the user who uploaded the project; null for the seeded projects (admin-only).
  createdBy?: number | null;
  // API path of the project's picture; null shows the default picture (see projectImageHref).
  imageUrl?: string | null;
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
  links?: DocumentLinkRequest[];
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

const projectDocumentsPath = (projectId: number) =>
  `${BackendConfig.endpoint.getPlasticProjectById}${projectId}${BackendConfig.endpoint.plasticProjectDocuments}`;

export async function uploadPlasticProjectPdf(
  projectId: number,
  file: File,
  title?: string
): Promise<PlasticProjectDocument> {
  const formData = new FormData();
  if (title?.trim()) {
    formData.append('title', title.trim());
  }
  formData.append('file', file, file.name);
  return apiClient.postForm<PlasticProjectDocument>(projectDocumentsPath(projectId), formData);
}

export async function addPlasticProjectLink(
  projectId: number,
  link: DocumentLinkRequest
): Promise<PlasticProjectDocument> {
  return apiClient.post<PlasticProjectDocument>(projectDocumentsPath(projectId), link);
}

export async function deletePlasticProjectDocument(projectId: number, documentId: number): Promise<void> {
  await apiClient.delete(`${projectDocumentsPath(projectId)}/${documentId}`);
}

// Where to open a document: the external URL for links, the backend file endpoint for uploaded PDFs.
const projectImagePath = (projectId: number) => `${BackendConfig.endpoint.getPlasticProjectById}${projectId}/image`;

// Sets or replaces the project's picture (shrink it first with prepareImage).
export async function uploadPlasticProjectImage(projectId: number, image: Blob): Promise<PlasticProjectResponse> {
  const formData = new FormData();
  formData.append('file', image, 'picture.jpg');
  return apiClient.putForm<PlasticProjectResponse>(projectImagePath(projectId), formData);
}

export async function deletePlasticProjectImage(projectId: number): Promise<void> {
  await apiClient.delete(projectImagePath(projectId));
}

// Full URL of the project's picture, or undefined when it has none.
export function projectImageHref(project: { imageUrl?: string | null }): string | undefined {
  return project.imageUrl ? `${BackendConfig.baseURL}${project.imageUrl}` : undefined;
}

export function documentHref(document: PlasticProjectDocument): string {
  return document.kind === 'FILE' ? `${BackendConfig.baseURL}${document.url}` : document.url;
}
