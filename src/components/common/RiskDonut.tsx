import type { RiskSlice } from '../../data/mock'

type Props = {
  slices: RiskSlice[]
  total: number
  size?: number
}

function RiskDonut({ slices, total, size = 140 }: Props) {
  const r = 15.9
  let offset = 25

  return (
    <svg width={size} height={size} viewBox="0 0 42 42">
      <circle cx="21" cy="21" r={r} fill="transparent" stroke="#1a2233" strokeWidth="5" />
      {slices.map((slice) => {
        const dash = `${slice.pct} ${100 - slice.pct}`
        const currentOffset = offset
        offset -= slice.pct
        return (
          <circle
            key={slice.cls}
            cx="21"
            cy="21"
            r={r}
            fill="transparent"
            stroke={slice.color}
            strokeWidth="5"
            strokeDasharray={dash}
            strokeDashoffset={currentOffset}
          />
        )
      })}
      <text x="21" y="19" textAnchor="middle" fontSize="6" fill="#e5e9f0" fontWeight="700">
        {total.toLocaleString()}
      </text>
      <text x="21" y="25" textAnchor="middle" fontSize="3.6" fill="#8892a6">
        Total
      </text>
    </svg>
  )
}

export default RiskDonut
