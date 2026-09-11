import { classColors } from '../../theme/tokens'

type Props = {
  probs: number[]
}

function ProbBar({ probs }: Props) {
  const colors = [classColors[0], classColors[1], classColors[2], classColors[3], classColors[4]]
  const used = probs.reduce((sum, n) => sum + n, 0)
  const rest = Math.max(0, 100 - used)

  return (
    <div className="risk-bar-track">
      {probs.map((pct, i) =>
        pct > 0 ? (
          <div key={i} style={{ width: `${pct}%`, background: colors[i] }} />
        ) : null,
      )}
      {rest > 0 ? <div style={{ width: `${rest}%`, background: '#1a2233' }} /> : null}
    </div>
  )
}

export default ProbBar
