export type VehicleStatus = 'Priority Inspect' | 'Inspect' | 'Enhanced Monitor'

export type VehicleRecord = {
  vehicleId: string
  predictedClass: VehicleStatus
  riskScore: number
}

export const vehicleData: VehicleRecord[] = [
  {
    vehicleId: 'VHC-89321',
    predictedClass: 'Priority Inspect',
    riskScore: 92,
  },
  {
    vehicleId: 'VHC-55217',
    predictedClass: 'Priority Inspect',
    riskScore: 88,
  },
  {
    vehicleId: 'VHC-66107',
    predictedClass: 'Inspect',
    riskScore: 71,
  },
  {
    vehicleId: 'VHC-77834',
    predictedClass: 'Inspect',
    riskScore: 67,
  },
  {
    vehicleId: 'VHC-33120',
    predictedClass: 'Enhanced Monitor',
    riskScore: 60,
  },
]
