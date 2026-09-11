export const colors = {
  bg: '#0a0e1a',
  panel: '#111827',
  panel2: '#0f1523',
  border: '#1f2937',
  borderLight: '#263145',
  text: '#e5e9f0',
  textDim: '#8892a6',
  textFaint: '#5c6579',
  red: '#e6332a',
  redDim: '#3a1418',
  orange: '#f2a33d',
  orangeDim: '#3a2b12',
  yellow: '#e0c23d',
  yellowDim: '#39331a',
  green: '#3ecf7e',
  greenDim: '#123222',
  blue: '#4f8ff7',
  blueDim: '#132038',
} as const

export const classColors = {
  0: colors.green,
  1: colors.blue,
  2: colors.yellow,
  3: colors.orange,
  4: colors.red,
} as const
