type Props = {
  values: number[]
  color: string
}

function Sparkline({ values, color }: Props) {
  const w = 60
  const step = values.length > 1 ? w / (values.length - 1) : w
  const points = values.map((y, i) => `${i * step},${y}`).join(' ')

  return (
    <svg className="sparkline" viewBox="0 0 60 22">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  )
}

export default Sparkline
