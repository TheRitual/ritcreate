export interface HealthCheckRequest {
  service?: string;
}

export interface HealthCheckResponse {
  status: number;
}
