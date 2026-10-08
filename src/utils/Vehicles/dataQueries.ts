export type VehicleStatus =
  | 'Priority Inspect'
  | 'Inspect'
  | 'Enhanced Monitor'
  | 'Monitor'
  | 'Continue'
  | 'Manual Review'

export type VehicleRecord = {
  vehicleId: string
  predictedClass: VehicleStatus
  riskScore: number
}

export type VehicleListResponse = {
  total: number
  page: number
  pageSize: number
  items: VehicleRecord[]
}
