import { Tabs } from 'antd'
import { useMemo, useState } from 'react'
import RiskDonut from '../../components/common/RiskDonut'
import RiskPill from '../../components/common/RiskPill'
import {
  featureSignals,
  fleetSegments,
  fleetStats,
  riskByComponent,
  riskSlices,
  riskTrend,
} from '../../data/mock'
import type { RiskSlice } from '../../data/mock'
import { colors } from '../../theme/tokens'

function TrendChart() {
  const xs = [10, 60, 110, 160, 210, 260, 310, 380]
  const points = riskTrend.points.map((y, i) => `${xs[i]},${y}`).join(' ')
  const area = `${points} 380,170 10,170`

  return (
    <svg width="100%" height="170" viewBox="0 0 400 170" preserveAspectRatio="none">
      <defs>
        <linearGradient id="riskTrendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.red} />
          <stop offset="100%" stopColor={colors.red} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke={colors.red} strokeWidth="2.5" />
      <polygon points={area} fill="url(#riskTrendFill)" opacity="0.15" />
      <g fill={colors.textFaint} fontSize="9">
        <text x="10" y="165">
          {riskTrend.labels[0]}
        </text>
        <text x="100" y="165">
          {riskTrend.labels[1]}
        </text>
        <text x="200" y="165">
          {riskTrend.labels[2]}
        </text>
        <text x="300" y="165">
          {riskTrend.labels[3]}
        </text>
      </g>
    </svg>
  )
}

function Risk() {
  const [tab, setTab] = useState('all')

  const slices: RiskSlice[] = useMemo(() => {
    if (tab !== 'class34') return riskSlices
    const high = riskSlices.filter((s) => s.cls >= 3)
    const total = high.reduce((sum, s) => sum + s.count, 0)
    return high.map((s) => ({ ...s, pct: Math.round((s.count / total) * 1000) / 10 }))
  }, [tab])

  const donutTotal =
    tab === 'class34' ? slices.reduce((sum, s) => sum + s.count, 0) : fleetStats.total

  return (
    <>
      <Tabs
        activeKey={tab}
        onChange={setTab}
        items={[
          { key: 'all', label: 'All Vehicles' },
          { key: 'class34', label: 'Class 3–4 Only' },
          { key: 'component', label: 'By Component' },
        ]}
      />

      {tab !== 'component' ? (
        <div className="grid-2">
          <div className="fc-card">
            <div className="card-title">
              {tab === 'class34' ? 'RISK DISTRIBUTION (Class 3–4)' : 'RISK DISTRIBUTION (All Vehicles)'}
            </div>
            <div className="donut-wrap">
              <RiskDonut slices={slices} total={donutTotal} size={170} />
              <div style={{ flex: 1 }}>
                {slices.map((slice) => (
                  <div className="legend-row" key={slice.cls}>
                    <div className="legend-left">
                      <span className="dot" style={{ background: slice.color }} />
                      {slice.label} ({slice.range})
                    </div>
                    <div>
                      <span className="legend-val">{slice.count.toLocaleString()}</span>
                      <span className="legend-pct">{slice.pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="fc-card">
            <div className="card-title">
              RISK TREND (Class 3–4 Vehicles)
              <span className="link">Last 7 days ▾</span>
            </div>
            <TrendChart />
          </div>
        </div>
      ) : null}

      <div className="grid-3">
        <div className="fc-card">
          <div className="card-title">RISK BY COMPONENT</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.8 }}>
            <thead>
              <tr>
                <th>Component</th>
                <th>Avg Risk</th>
                <th>Class 3–4</th>
              </tr>
            </thead>
            <tbody>
              {riskByComponent.map((row) => (
                <tr key={row.name}>
                  <td className="strong">{row.name}</td>
                  <td>{row.avgRisk} /100</td>
                  <td>
                    <RiskPill cls={row.pill}>{row.class34}</RiskPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="fc-card">
          <div className="card-title">FLEET SEGMENT</div>
          {fleetSegments.map((seg) => (
            <div className="segment-row" key={seg.name}>
              <div className="segment-meta">
                <span>{seg.name}</span>
                <span style={{ color: colors.textFaint }}>{seg.count.toLocaleString()}</span>
              </div>
              <div className="risk-bar-track" style={{ width: '100%' }}>
                <div style={{ width: `${seg.pct}%`, background: seg.color }} />
                <div style={{ width: `${100 - seg.pct}%`, background: '#1a2233' }} />
              </div>
            </div>
          ))}
        </div>

        <div className="fc-card">
          <div className="card-title">TOP FEATURE SIGNALS</div>
          {featureSignals.map((signal) => (
            <div className="signal-row" key={signal.name}>
              <span>{signal.name}</span>
              <span className={`tone-${signal.tone}`}>{signal.level}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Risk
