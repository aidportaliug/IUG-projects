import { apiClient } from './apiClient';
import BackendConfig from './BackendConfig';
import { Project } from '../models/project';

export interface ProjectListResponse {
  projects: any[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Just in case
function convertToLegacyProject(project: any): Project {
  return {
    id: project.id.toString(),
    title: project.name,
    shortTitle: project.shortTitle || project.name,
    description: project.description || '',
    summaryDescription: project.summaryDescription || project.description || '',
    ownerId: project.ownerId,
    ownerUsername: project.ownerUsername,
    deadline: project.deadline
      ? ({ toDate: () => new Date(project.deadline) } as any)
      : ({ toDate: () => new Date() } as any),
    studyField: project.studyField || 'general',
    location: project.location || 'global',
    duration: project.duration || 0,
    professorId: project.ownerId.toString(),
  } as Project;
}

export const getProjects = async (
  order?: string,
  filterLocation?: string,
  filterStudyField?: string,
  setLastVisible?: React.Dispatch<React.SetStateAction<any | null>>,
  lastVisible?: any | null,
  givenLimit?: number
): Promise<Project[]> => {
  try {
    // Query parameters
    const params = new URLSearchParams();

    // Pagination
    params.append('pageSize', (givenLimit || 10).toString());

    // Sorting
    if (order && order !== 'deadline') {
      params.append('orderBy', order);
    } else {
      params.append('orderBy', 'deadline');
    }
    params.append('orderDirection', 'asc');

    // Filtering
    if (filterLocation && filterLocation !== 'location') {
      params.append('location', filterLocation);
    }

    if (filterStudyField && filterStudyField !== 'study_field') {
      params.append('studyField', filterStudyField);
    }

    // Fetch from backend
    const response = await apiClient.get<ProjectListResponse>(
      `${BackendConfig.endpoint.GetAllProjects}?${params.toString()}`
    );

    const convertedProjects = response.projects.map(convertToLegacyProject);

    // Update last visible for pagination
    if (setLastVisible) {
      setLastVisible(null);
    }

    return convertedProjects;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
};
