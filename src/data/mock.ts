import { colors } from '../theme/tokens'

export type RiskClass = 0 | 1 | 2 | 3 | 4

export type RiskSlice = {
  cls: RiskClass
  label: string
  range: string
  count: number
  pct: number
  color: string
}

export type VehicleRow = {
  id: string
  component: string
  timeStep: string
  cls: RiskClass
  classLabel: string
  riskScore: number
  probs: number[]
  trend: number[]
  action: 'inspect' | 'plan' | 'monitor'
}

export const riskSlices: RiskSlice[] = [
  { cls: 0, label: 'Class 0', range: '>48 steps', count: 2479, pct: 58.2, color: colors.green },
  { cls: 1, label: 'Class 1', range: '24–48 steps', count: 536, pct: 12.6, color: colors.blue },
  { cls: 2, label: 'Class 2', range: '12–24 steps', count: 374, pct: 8.8, color: colors.yellow },
  { cls: 3, label: 'Class 3', range: '6–12 steps', count: 472, pct: 11.1, color: colors.orange },
  { cls: 4, label: 'Class 4', range: '0–6 steps', count: 395, pct: 9.3, color: colors.red },
]

export const fleetStats = {
  total: 4256,
  active: 3987,
  inMaintenance: 269,
  atRisk: 186,
  high: 112,
  critical: 74,
  plannedThisWeek: 37,
  completed: 28,
  pending: 9,
  avgRisk: 32,
  avgRiskDelta: -5,
}

export const topAlerts = [
  { id: 'VHC-89321', meta: 'Component X · 0–6 steps', cls: 4 as RiskClass, score: 92 },
  { id: 'VHC-55217', meta: 'Component X · 0–6 steps', cls: 4 as RiskClass, score: 88 },
  { id: 'VHC-66107', meta: 'Component X · 6–12 steps', cls: 3 as RiskClass, score: 71 },
]

export const maintenanceSummary = {
  immediate: 74,
  shortTerm: 151,
  monitor: 1856,
  preventive: '-$452,000',
  ignored: '$1,230,000',
}

export const riskTrend = {
  labels: ['May 13', 'May 15', 'May 17', 'May 19'],
  points: [90, 105, 60, 95, 88, 80, 50, 20],
}

export const riskByComponent = [
  { name: 'Component X', avgRisk: 68, class34: 142, pill: 3 as RiskClass },
  { name: 'Component Y', avgRisk: 41, class34: 58, pill: 2 as RiskClass },
  { name: 'Component Z', avgRisk: 27, class34: 24, pill: 1 as RiskClass },
  { name: 'Braking system', avgRisk: 55, class34: 89, pill: 3 as RiskClass },
  { name: 'Battery pack', avgRisk: 33, class34: 41, pill: 2 as RiskClass },
]

export const fleetSegments = [
  { name: 'Heavy trucks', count: 2140, pct: 64, color: colors.red },
  { name: 'Medium trucks', count: 1320, pct: 38, color: colors.orange },
  { name: 'Light trucks', count: 796, pct: 19, color: colors.yellow },
]

export const featureSignals = [
  { name: 'Temperature (f12)', level: 'High', tone: 'red' as const },
  { name: 'Vibration (f25)', level: 'Elevated', tone: 'orange' as const },
  { name: 'Oil contamination (f44)', level: 'Elevated', tone: 'orange' as const },
  { name: 'Pressure delta (f09)', level: 'Watch', tone: 'yellow' as const },
  { name: 'Load cycles (f31)', level: 'Normal', tone: 'green' as const },
]

export const vehicles: VehicleRow[] = [
  {
    id: 'VHC-89321',
    component: 'Component X',
    timeStep: '52,481',
    cls: 4,
    classLabel: '4 · 0–6 steps',
    riskScore: 92,
    probs: [2, 3, 6, 7, 82],
    trend: [16, 12, 17, 6, 2],
    action: 'inspect',
  },
  {
    id: 'VHC-55217',
    component: 'Component X',
    timeStep: '48,102',
    cls: 4,
    classLabel: '4 · 0–6 steps',
    riskScore: 88,
    probs: [1, 4, 7, 10, 78],
    trend: [18, 14, 15, 9, 3],
    action: 'inspect',
  },
  {
    id: 'VHC-66107',
    component: 'Component X',
    timeStep: '36,890',
    cls: 3,
    classLabel: '3 · 6–12 steps',
    riskScore: 71,
    probs: [4, 6, 12, 16, 28],
    trend: [8, 10, 6, 12, 9],
    action: 'plan',
  },
  {
    id: 'VHC-77834',
    component: 'Component X',
    timeStep: '41,210',
    cls: 3,
    classLabel: '3 · 6–12 steps',
    riskScore: 67,
    probs: [5, 10, 7, 17, 23],
    trend: [10, 7, 11, 8, 10],
    action: 'plan',
  },
  {
    id: 'VHC-33120',
    component: 'Component X',
    timeStep: '29,340',
    cls: 2,
    classLabel: '2 · 12–24 steps',
    riskScore: 60,
    probs: [8, 18, 33, 25, 0],
    trend: [6, 12, 9, 14, 11],
    action: 'monitor',
  },
]
