// src/app/models/client.model.ts
export interface ClientResponse {
  id: string;
  name: string;
  address: string;
  avatar: string;
  phone: string;
  birthDate: string;    // ISO date string, p.e. "1990-01-01"
  gender: string;
  createdAt: string;    // ISO timestamp
  updatedAt: string;    // ISO timestamp
  userId: string;
  hiredServicesIds: string[];
  workouts: string[];
}

export interface ClientCreateRequest {
  name: string;
  address: string;
  avatar?: string;
  phone: string;
  birthDate: string;
  gender: string;
  userId: string;
  hiredServicesIds?: string[];
  workouts?: string[];
}

export interface ClientUpdateRequest {
  name?: string;
  address?: string;
  avatar?: string;
  phone?: string;
  gender?: string;
  hiredServicesIds?: string[];
  workouts?: string[];
}
