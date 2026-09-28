export type VehicleStatus = 'Priority Inspect' | 'Inspect' | 'Enhanced Monitor'

export type VehicleRecord = {
  vehicleId: string
  component: string
  timeStep: number
  predictedClass: VehicleStatus
  riskScore: number
  prob: number[]
  trend: number[]
}

export const vehicleData: VehicleRecord[] = [
  {
    vehicleId: 'VHC-89321',
    component: 'Component X',
    timeStep: 52481,
    predictedClass: 'Priority Inspect',
    riskScore: 92,
    prob: [0.02, 0.04, 0.08, 0.18, 0.68],
    trend: [66, 72, 75, 84, 92],
  },
  {
    vehicleId: 'VHC-55217',
    component: 'Component X',
    timeStep: 48102,
    predictedClass: 'Priority Inspect',
    riskScore: 88,
    prob: [0.03, 0.05, 0.08, 0.2, 0.64],
    trend: [62, 68, 74, 81, 88],
  },
  {
    vehicleId: 'VHC-66107',
    component: 'Component X',
    timeStep: 36890,
    predictedClass: 'Inspect',
    riskScore: 71,
    prob: [0.05, 0.08, 0.12, 0.58, 0.17],
    trend: [54, 61, 59, 68, 71],
  },
  {
    vehicleId: 'VHC-77834',
    component: 'Component X',
    timeStep: 41210,
    predictedClass: 'Inspect',
    riskScore: 67,
    prob: [0.06, 0.1, 0.14, 0.55, 0.15],
    trend: [48, 55, 57, 63, 67],
  },
  {
    vehicleId: 'VHC-33120',
    component: 'Component X',
    timeStep: 29340,
    predictedClass: 'Enhanced Monitor',
    riskScore: 60,
    prob: [0.08, 0.12, 0.52, 0.2, 0.08],
    trend: [52, 48, 55, 58, 60],
  },
]
