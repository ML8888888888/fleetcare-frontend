import type { RiskClass } from '../../data/mock'

const labels: Record<RiskClass, string> = {
  0: 'Class 0',
  1: 'Class 1',
  2: 'Class 2',
  3: 'Class 3',
  4: 'Class 4',
}

type Props = {
  cls: RiskClass
  children?: React.ReactNode
}

function RiskPill({ cls, children }: Props) {
  return <span className={`risk-pill c${cls}`}>{children ?? labels[cls]}</span>
}

export default RiskPill
