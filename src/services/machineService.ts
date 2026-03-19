import { apiClient } from './apiClient';
import BackendConfig from './BackendConfig';

export interface MachinePlasticProjectRef {
  id: number;
  name: string;
}

export interface MachinePlasticResponse {
  id: number;
  name: string;
}

export interface MachineResponse {
  id: number;
  name: string;
  whatItDoes: string;
  howItWorksAndAcquired: string;
  operationComplicationsAndLessons: string;
  plastics: MachinePlasticResponse[];
  plasticProjectsInUse: MachinePlasticProjectRef[];
}

export interface MachineListResponse {
  machines: MachineResponse[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface MachineCreateRequest {
  name: string;
  whatItDoes: string;
  howItWorksAndAcquired: string;
  operationComplicationsAndLessons: string;
  plasticIds?: number[];
  plasticProjectIds?: number[];
}

export interface MachineUpdateRequest {
  name?: string;
  whatItDoes?: string;
  howItWorksAndAcquired?: string;
  operationComplicationsAndLessons?: string;
  plasticIds?: number[];
  plasticProjectIds?: number[];
}

export async function getMachines(search?: string, page = 1, pageSize = 100): Promise<MachineListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (search?.trim()) {
    params.set('search', search.trim());
  }

  return apiClient.get<MachineListResponse>(`${BackendConfig.endpoint.getAllMachines}?${params.toString()}`, false);
}

export async function getMachine(id: number): Promise<MachineResponse> {
  return apiClient.get<MachineResponse>(`${BackendConfig.endpoint.getMachineById}${id}`, false);
}

export async function createMachine(data: MachineCreateRequest): Promise<MachineResponse> {
  return apiClient.post<MachineResponse>(BackendConfig.endpoint.createMachine, data);
}

export async function updateMachine(id: number, data: MachineUpdateRequest): Promise<MachineResponse> {
  return apiClient.put<MachineResponse>(`${BackendConfig.endpoint.updateMachine}${id}`, data);
}

export async function deleteMachine(id: number): Promise<void> {
  await apiClient.delete(`${BackendConfig.endpoint.deleteMachine}${id}`);
}
