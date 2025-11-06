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