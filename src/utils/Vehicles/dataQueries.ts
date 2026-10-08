export type VehicleStatus =
  | 'Continue'
  | 'Monitor'
  | 'Enhanced Monitor'
  | 'Inspect'
  | 'Priority Inspect'

export const vehicleClasses: VehicleStatus[] = [
  'Continue',
  'Monitor',
  'Enhanced Monitor',
  'Inspect',
  'Priority Inspect',
]

export type VehicleRecord = {
  vehicleId: string
  state: string
  predictedClass: VehicleStatus
  riskScore: number
}

export type VehicleListResponse = {
  total: number
  page: number
  pageSize: number
  items: VehicleRecord[]
}
