import { apiClient } from './apiClient';
import BackendConfig from './BackendConfig';

export interface ProjectResponse {
  id: number;
  name: string;
  shortTitle: string | null;
  description: string | null;
  summaryDescription: string | null;
  ownerId: number;
  ownerUsername: string;
  studyField: string;
  location: string;
  deadline: string | null;
  duration: number;
  createdAt: string | null;
}

export interface ProjectCreateRequest {
  name: string;
  shortTitle?: string;
  description?: string;
  summaryDescription?: string;
  studyField?: string;
  location?: string;
  deadline?: string;
  duration?: number;
}

export interface ProjectUpdateRequest {
  name?: string;
  shortTitle?: string;
  description?: string;
  summaryDescription?: string;
  studyField?: string;
  location?: string;
  deadline?: string;
  duration?: number;
}

// Convert backend project to match old Project interface
function convertToLegacyProject(project: ProjectResponse): any {
  return {
    id: project.id.toString(),
    title: project.name,
    shortTitle: project.shortTitle || project.name,
    description: project.description || '',
    summaryDescription: project.summaryDescription || project.description || '',
    ownerId: project.ownerId,
    ownerUsername: project.ownerUsername,
    deadline: project.deadline ? { toDate: () => new Date(project.deadline!) } as any : { toDate: () => new Date() } as any,
    studyField: project.studyField || 'general',
    location: project.location || 'global',
    duration: project.duration || 0,
    professorId: project.ownerId.toString(),
  };
}

export async function getProject(id: string): Promise<any> {
  try {
    const project = await apiClient.get<ProjectResponse>(
      `${BackendConfig.endpoint.GetProjectById}${id}`
    );
    return convertToLegacyProject(project);
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return null;
  }
}

export async function getProjects(
  orderBy?: string,
  filterLocation?: string,
  filterStudyField?: string,
  setLastVisible?: any,
  lastVisible?: any,
  limit?: number
): Promise<any[]> {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    
    params.append('pageSize', (limit || 100).toString());
    params.append('page', '1');
    
    if (orderBy && orderBy !== 'deadline') {
      params.append('orderBy', orderBy);
    } else {
      params.append('orderBy', 'deadline');
    }
    params.append('orderDirection', 'asc');
    
    if (filterLocation && filterLocation !== 'location') {
      params.append('location', filterLocation);
    }
    
    if (filterStudyField && filterStudyField !== 'study_field') {
      params.append('studyField', filterStudyField);
    }
    
    const response = await apiClient.get<any>(
      `${BackendConfig.endpoint.GetAllProjects}?${params.toString()}`
    );
    
    const convertedProjects = response.projects.map(convertToLegacyProject);
    
    if (setLastVisible) {
      setLastVisible(null);
    }
    
    return convertedProjects;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}

export async function createProject(data: ProjectCreateRequest): Promise<ProjectResponse | null> {
  try {
    const project = await apiClient.post<ProjectResponse>(
      BackendConfig.endpoint.createProject,
      {
        name: data.name,
        shortTitle: data.shortTitle,
        description: data.description,
        summaryDescription: data.summaryDescription,
        studyField: data.studyField || 'general',
        location: data.location || 'global',
        deadline: data.deadline,
        duration: data.duration || 0
      }
    );
    return project;
  } catch (error) {
    console.error('Failed to create project:', error);
    throw error;
  }
}

export async function updateProject(
  id: number,
  data: ProjectUpdateRequest
): Promise<ProjectResponse | null> {
  try {
    const project = await apiClient.put<ProjectResponse>(
      `${BackendConfig.endpoint.updateProject}/${id}`,
      data
    );
    return project;
  } catch (error) {
    console.error('Failed to update project:', error);
    throw error;
  }
}

export async function deleteProject(id: number): Promise<void> {
  try {
    await apiClient.delete(`${BackendConfig.endpoint.updateProject}/${id}`);
  } catch (error) {
    console.error('Failed to delete project:', error);
    throw error;
  }
}