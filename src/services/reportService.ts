import { apiClient } from './apiClient';
import BackendConfig from './BackendConfig';

export interface ReportResponse {
  id: number;
  title: string;
  shortTitle: string | null;
  content: string;
  summaryDescription: string | null;
  projectId: number;
  projectName: string;
  authorId: number;
  authorUsername: string;
  studyField: string;
  location: string;
  year: number | null;
  duration: number;
  thesisLink: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReportCreateRequest {
  title: string;
  shortTitle?: string;
  content: string;
  summaryDescription?: string;
  projectId: number;
  studyField?: string;
  location?: string;
  year?: number;
  duration?: number;
  thesisLink?: string;
}

export interface ReportUpdateRequest {
  title?: string;
  shortTitle?: string;
  content?: string;
  summaryDescription?: string;
  studyField?: string;
  location?: string;
  year?: number;
  duration?: number;
  thesisLink?: string;
}

// Convert backend report to match old experienceReport interface
function convertToLegacyReport(report: ReportResponse): any {
  return {
    id: report.id.toString(),
    title: report.title,
    shortTitle: report.shortTitle || report.title,
    description: report.content,
    summaryDescription: report.summaryDescription || report.content.substring(0, 200),
    projectId: report.projectId,
    projectName: report.projectName,
    authorId: report.authorId,
    authorUsername: report.authorUsername,
    deadline: { toDate: () => new Date(report.createdAt) } as any,
    studyField: report.studyField || 'general',
    location: report.location || 'global',
    year: report.year || new Date(report.createdAt).getFullYear(),
    duration: report.duration || 0,
    thesisLink: report.thesisLink,
  };
}

export async function getReport(id: string): Promise<any> {
  try {
    const report = await apiClient.get<ReportResponse>(
      `${BackendConfig.endpoint.getReportById}${id}`
    );
    return convertToLegacyReport(report);
  } catch (error) {
    console.error('Failed to fetch report:', error);
    return null;
  }
}

export async function getReports(
  projectId?: number,
  orderBy?: string,
  filterLocation?: string,
  filterStudyField?: string,
  setLastVisible?: any,
  lastVisible?: any,
  limit?: number
): Promise<any[]> {
  try {
    const params = new URLSearchParams();
    
    params.append('pageSize', (limit || 100).toString());
    params.append('page', '1');
    
    if (projectId) {
      params.append('projectId', projectId.toString());
    }
    
    if (orderBy && orderBy !== 'deadline') {
      params.append('orderBy', orderBy);
    } else {
      params.append('orderBy', 'createdAt');
    }
    params.append('orderDirection', 'desc');
    
    if (filterLocation && filterLocation !== 'location') {
      params.append('location', filterLocation);
    }
    
    if (filterStudyField && filterStudyField !== 'study_field') {
      params.append('studyField', filterStudyField);
    }
    
    const response = await apiClient.get<any>(
      `${BackendConfig.endpoint.getAllReports}?${params.toString()}`
    );
    
    const convertedReports = response.reports.map(convertToLegacyReport);
    
    if (setLastVisible) {
      setLastVisible(null);
    }
    
    return convertedReports;
  } catch (error) {
    console.error('Failed to fetch reports:', error);
    return [];
  }
}

export async function createReport(data: ReportCreateRequest): Promise<ReportResponse | null> {
  try {
    const report = await apiClient.post<ReportResponse>(
      BackendConfig.endpoint.createReport,
      {
        title: data.title,
        shortTitle: data.shortTitle,
        content: data.content,
        summaryDescription: data.summaryDescription,
        projectId: data.projectId,
        studyField: data.studyField || 'general',
        location: data.location || 'global',
        year: data.year,
        duration: data.duration || 0,
        thesisLink: data.thesisLink
      }
    );
    return report;
  } catch (error) {
    console.error('Failed to create report:', error);
    throw error;
  }
}

export async function updateReport(
  id: number,
  data: ReportUpdateRequest
): Promise<ReportResponse | null> {
  try {
    const report = await apiClient.put<ReportResponse>(
      `${BackendConfig.endpoint.updateReport}${id}`,
      data
    );
    return report;
  } catch (error) {
    console.error('Failed to update report:', error);
    throw error;
  }
}

export async function deleteReport(id: number): Promise<void> {
  try {
    await apiClient.delete(`${BackendConfig.endpoint.updateReport}${id}`);
  } catch (error) {
    console.error('Failed to delete report:', error);
    throw error;
  }
}