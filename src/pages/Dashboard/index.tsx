import { Link } from 'react-router-dom'
import RiskDonut from '../../components/common/RiskDonut'
import RiskPill from '../../components/common/RiskPill'
import {
  fleetStats,
  maintenanceSummary,
  riskSlices,
  topAlerts,
} from '../../data/mock'
import { colors } from '../../theme/tokens'

const overviewLegend = [...riskSlices].filter((s) => s.cls !== 0).reverse()

function Dashboard() {
  return (
    <>
      <div className="grid-4">
        <div className="fc-card stat-card">
          <div className="stat-top">
            <div className="stat-label">FLEET OVERVIEW</div>
            <div className="stat-icon" style={{ background: colors.blueDim, color: colors.blue }}>
              🚛
            </div>
          </div>
          <div className="stat-value">{fleetStats.total.toLocaleString()}</div>
          <div className="stat-sub">Total vehicles</div>
          <div className="stat-split">
            <div>
              <span className="n" style={{ color: colors.green }}>
                {fleetStats.active.toLocaleString()}
              </span>
              <span>Active</span>
            </div>
            <div>
              <span className="n" style={{ color: colors.orange }}>
                {fleetStats.inMaintenance}
              </span>
              <span>In maintenance</span>
            </div>
          </div>
        </div>

        <div className="fc-card stat-card">
          <div className="stat-top">
            <div className="stat-label">AT RISK (CLASS 3–4)</div>
            <div className="stat-icon" style={{ background: colors.redDim, color: colors.red }}>
              ⚠
            </div>
          </div>
          <div className="stat-value">{fleetStats.atRisk}</div>
          <div className="stat-sub">Vehicles</div>
          <div className="stat-split">
            <div>
              <span className="n" style={{ color: colors.orange }}>
                {fleetStats.high}
              </span>
              <span>High</span>
            </div>
            <div>
              <span className="n" style={{ color: colors.red }}>
                {fleetStats.critical}
              </span>
              <span>Critical</span>
            </div>
          </div>
        </div>

        <div className="fc-card stat-card">
          <div className="stat-top">
            <div className="stat-label">MAINTENANCE THIS WEEK</div>
            <div className="stat-icon" style={{ background: colors.yellowDim, color: colors.yellow }}>
              📅
            </div>
          </div>
          <div className="stat-value">{fleetStats.plannedThisWeek}</div>
          <div className="stat-sub">Planned</div>
          <div className="stat-split">
            <div>
              <span className="n" style={{ color: colors.green }}>
                {fleetStats.completed}
              </span>
              <span>Completed</span>
            </div>
            <div>
              <span className="n" style={{ color: colors.orange }}>
                {fleetStats.pending}
              </span>
              <span>Pending</span>
            </div>
          </div>
        </div>

        <div className="fc-card stat-card">
          <div className="stat-top">
            <div className="stat-label">AVG. RISK SCORE</div>
            <div className="stat-icon" style={{ background: colors.greenDim, color: colors.green }}>
              📈
            </div>
          </div>
          <div className="stat-value">
            {fleetStats.avgRisk}
            <span className="unit">/100</span>
          </div>
          <div className="stat-sub">Fleet average · last 7 days</div>
          <div className="stat-split">
            <div>
              <span className="n" style={{ color: colors.green }}>
                ↓ {Math.abs(fleetStats.avgRiskDelta)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="fc-card">
          <div className="card-title">
            RISK SNAPSHOT
            <Link className="link" to="/risk">
              Full analytics →
            </Link>
          </div>
          <div className="donut-wrap">
            <RiskDonut slices={riskSlices} total={fleetStats.total} />
            <div style={{ flex: 1 }}>
              {overviewLegend.map((slice) => (
                <div className="legend-row" key={slice.cls}>
                  <div className="legend-left">
                    <span className="dot" style={{ background: slice.color }} />
                    {slice.label} ({slice.range})
                  </div>
                  <div>
                    <span className="legend-val">{slice.count}</span>
                    <span className="legend-pct">{slice.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="fc-card">
          <div className="card-title">
            TOP RISK ALERTS
            <Link className="link" to="/vehicles">
              View all →
            </Link>
          </div>
          {topAlerts.map((alert) => (
            <div className="alert-item" key={alert.id}>
              <div>
                <div className="alert-id">{alert.id}</div>
                <div className="alert-meta">{alert.meta}</div>
              </div>
              <div className="alert-right">
                <RiskPill cls={alert.cls} />
                <div
                  className="alert-score"
                  style={{ color: alert.cls === 4 ? colors.red : colors.orange }}
                >
                  {alert.score}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fc-card">
        <div className="card-title">MAINTENANCE PLAN SUMMARY</div>
        <div className="maint-cols">
          <div className="maint-col">
            <div className="label" style={{ color: colors.red }}>
              Immediate (0–6 steps)
            </div>
            <div className="count">{maintenanceSummary.immediate}</div>
            <div className="sub">vehicles</div>
          </div>
          <div className="maint-col">
            <div className="label" style={{ color: colors.orange }}>
              Short term (6–24 steps)
            </div>
            <div className="count">{maintenanceSummary.shortTerm}</div>
            <div className="sub">vehicles</div>
          </div>
          <div className="maint-col">
            <div className="label" style={{ color: colors.textDim }}>
              Monitor (24+ steps)
            </div>
            <div className="count">{maintenanceSummary.monitor.toLocaleString()}</div>
            <div className="sub">vehicles</div>
          </div>
          <div
            className="maint-col"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div className="sub">Preventive</div>
              <div className="count" style={{ color: colors.green, fontSize: 18 }}>
                {maintenanceSummary.preventive}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="sub">If ignored</div>
              <div className="count" style={{ color: colors.red, fontSize: 18 }}>
                {maintenanceSummary.ignored}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
