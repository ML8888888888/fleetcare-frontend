export const vehicleEndpoints = {
  list: '/api/v1/vehicles',
  detail: (vehicleId: string) => `/api/v1/vehicles/${encodeURIComponent(vehicleId)}`,
  maintenance: (vehicleId: string) =>
    `/api/v1/vehicles/${encodeURIComponent(vehicleId)}/maintenance`,
} as const
