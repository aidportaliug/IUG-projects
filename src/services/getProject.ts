import { apiClient } from './apiClient';
import BackendConfig from './BackendConfig';
import { Project } from '../models/project';

export interface ProjectResponse {
  id: number;
  name: string;
  description: string | null;
  ownerId: number;
  ownerUsername: string;
}

function convertToLegacyProject(project: ProjectResponse): Project {
  return {
    id: project.id.toString(),
    title: project.name,
    shortTitle: project.name,
    description: project.description || '',
    summaryDescription: project.description || '',
    ownerId: project.ownerId,
    ownerUsername: project.ownerUsername,
    deadline: new Date() as any,
    studyField: 'general',
    location: 'global',
    duration: 0,
    professorId: project.ownerId.toString(),
  } as Project;
}

export async function getProject(id: string): Promise<Project | null> {
  try {
    const project = await apiClient.get<ProjectResponse>(`${BackendConfig.endpoint.GetProjectById}${id}`);
    return convertToLegacyProject(project);
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return null;
  }
}
