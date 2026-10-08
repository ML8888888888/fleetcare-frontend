import { ArrowRightOutlined } from '@ant-design/icons'
import { Alert, Card, Col, Divider, Flex, List, Row, Space, Spin, Tag, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dashboardEndpoints } from '../../utils/dashboard/endpoints'
import { getJson } from '../../utils/http'

const { Text, Title } = Typography

const colors = {
  blue: '#1677ff',
  green: '#389e0d',
  orange: '#d46b08',
  red: '#cf1322',
  yellow: '#d4b106',
  muted: '#8c8c8c',
}

const actionMeta: Record<string, { label: string; color: string; tagColor: string }> = {
  CONTINUE: { label: 'Continue', color: '#e6f4ff', tagColor: 'green' },
  MONITOR: { label: 'Monitor', color: '#1677ff', tagColor: 'blue' },
  ENHANCED_MONITOR: { label: 'Enhanced Monitor', color: '#d4b106', tagColor: 'gold' },
  INSPECT: { label: 'Inspect', color: '#d46b08', tagColor: 'orange' },
  PRIORITY_INSPECT: { label: 'Priority Inspect', color: '#cf1322', tagColor: 'red' },
}

type DashboardSummary = {
  fleet: { total: number; analyzed: number }
  risk: { at_risk: number; high: number; critical: number; average_score: number }
  risk_snapshot: Array<{ action: string; count: number; percentage: number }>
  maintenance_plan: { immediate: number; short_term: number; monitor: number }
  top_risk_alerts: Array<{
    analysis_id: number
    vehicle_id: number
    state: string | null
    risk_score: number
    priority: string
    action: string
    reason: string | null
  }>
}

const cardTitleStyle = { fontSize: 12, letterSpacing: 0.5, color: colors.muted }
const sectionCardStyle = { height: '100%' }

function formatCount(value: number) {
  return value.toLocaleString()
}

function actionLabel(action: string) {
  return actionMeta[action]?.label ?? action.replaceAll('_', ' ')
}

function donutBackground(items: DashboardSummary['risk_snapshot']) {
  if (items.every((item) => item.count === 0)) {
    return '#f5f5f5'
  }

  let cursor = 0
  const stops = items.map((item) => {
    const start = cursor
    cursor += item.percentage
    const color = actionMeta[item.action]?.color ?? colors.muted
    return `${color} ${start}% ${cursor}%`
  })
  return `conic-gradient(${stops.join(', ')})`
}

function DashboardContent() {
  const navigate = useNavigate()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    getJson<DashboardSummary>(dashboardEndpoints.summary)
      .then((data) => {
        if (!cancelled) setSummary(data)
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : 'Unable to load the dashboard')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <Flex justify="center" style={{ padding: 48 }}>
        <Spin />
      </Flex>
    )
  }

  if (!summary) {
    return <Alert type="error" showIcon title="Unable to load the dashboard" description={errorMessage} />
  }

  const kpis = [
    {
      title: 'FLEET OVERVIEW',
      value: formatCount(summary.fleet.total),
      details: [
        { label: `${formatCount(summary.fleet.analyzed)} Analyzed`, type: 'success' as const },
      ],
    },
    {
      title: 'AT RISK',
      value: formatCount(summary.risk.at_risk),
      details: [
        { label: `${formatCount(summary.risk.high)} High`, type: 'warning' as const },
        { label: `${formatCount(summary.risk.critical)} Critical`, type: 'danger' as const },
      ],
    },
    {
      title: 'IMMEDIATE ACTION',
      value: formatCount(summary.maintenance_plan.immediate),
      details: [
        { label: `${formatCount(summary.maintenance_plan.short_term)} Short term`, type: 'warning' as const },
        { label: `${formatCount(summary.maintenance_plan.monitor)} Monitor`, type: 'secondary' as const },
      ],
    },
    {
      title: 'AVG. RISK SCORE',
      value: `${Math.round(summary.risk.average_score)} /100`,
      details: [
        { label: 'Fleet average risk percentile', type: 'secondary' as const },
      ],
    },
  ]

  const maintenancePlan = [
    { title: 'Immediate (0-6 steps)', value: formatCount(summary.maintenance_plan.immediate), color: colors.red },
    { title: 'Short term (6-24 steps)', value: formatCount(summary.maintenance_plan.short_term), color: colors.orange },
    { title: 'Monitor (24+ steps)', value: formatCount(summary.maintenance_plan.monitor), color: colors.blue },
  ]

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        {kpis.map((kpi) => (
          <Col key={kpi.title} xs={24} sm={12} lg={6}>
            <Card>
              <Text style={cardTitleStyle}>{kpi.title}</Text>
              <Title level={2} style={{ margin: '8px 0 16px', fontSize: 30 }}>
                {kpi.value}
              </Title>
              <Space size={12} wrap>
                {kpi.details.map((detail) => (
                  <Text key={detail.label} type={detail.type} style={{ fontSize: 13 }}>
                    {detail.label}
                  </Text>
                ))}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title="RISK SNAPSHOT"
            extra={<a href="#analytics">Full analytics <ArrowRightOutlined /></a>}
            style={sectionCardStyle}
          >
            <Row align="middle" gutter={[32, 24]}>
              <Col xs={24} sm={10}>
                <div
                  style={{ ...chartPlaceholderStyle, background: donutBackground(summary.risk_snapshot) }}
                  aria-label="Risk distribution chart"
                />
              </Col>
              <Col xs={24} sm={14}>
                <List
                  dataSource={summary.risk_snapshot}
                  split={false}
                  renderItem={(riskClass) => (
                    <List.Item style={{ padding: '8px 0' }}>
                      <Space>
                        <span style={{ ...legendDotStyle, background: actionMeta[riskClass.action]?.color ?? colors.muted }} />
                        <Text>{actionLabel(riskClass.action)}</Text>
                      </Space>
                      <Text strong>
                        {formatCount(riskClass.count)} <Text type="secondary">{riskClass.percentage}%</Text>
                      </Text>
                    </List.Item>
                  )}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="TOP RISK ALERTS"
            extra={<Typography.Link onClick={() => navigate('/vehicles')}>View all <ArrowRightOutlined /></Typography.Link>}
            style={sectionCardStyle}
          >
            <List
              dataSource={summary.top_risk_alerts}
              locale={{ emptyText: 'No high-risk vehicles' }}
              renderItem={(alert) => {
                const vehicleId = `VHC-${alert.vehicle_id}`
                return (
                  <List.Item>
                    <List.Item.Meta
                      title={<Typography.Link onClick={() => navigate(`/vehicles/${vehicleId}`)}>{vehicleId}</Typography.Link>}
                      description={alert.reason || `${alert.state ?? 'Unknown'} · ${actionLabel(alert.action)}`}
                    />
                    <Space direction="vertical" align="end" size={2}>
                      <Tag color={actionMeta[alert.action]?.tagColor ?? 'default'}>{alert.state ?? alert.priority}</Tag>
                      <Text strong>{Math.round(alert.risk_score)}%</Text>
                    </Space>
                  </List.Item>
                )
              }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="MAINTENANCE PLAN SUMMARY">
        <Row align="middle">
          {maintenancePlan.map((item, index) => (
            <Col key={item.title} xs={24} sm={12} lg={8}>
              <div style={summaryBlockStyle}>
                {index > 0 && <Divider type="vertical" style={dividerStyle} />}
                <Text type="secondary">{item.title}</Text>
                <Title level={2} style={{ margin: '8px 0 0' }}>
                  {item.value}
                </Title>
                <Text style={{ color: item.color }}>vehicles</Text>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </Space>
  )
}

const chartPlaceholderStyle = {
  width: 168,
  height: 168,
  maxWidth: '100%',
  margin: '0 auto',
  borderRadius: '50%',
  position: 'relative' as const,
}

const legendDotStyle = { width: 8, height: 8, borderRadius: '50%', display: 'inline-block' }
const summaryBlockStyle = { position: 'relative' as const, minHeight: 88, padding: '4px 20px' }
const dividerStyle = { position: 'absolute' as const, left: 0, top: 0, height: '100%' }

export default DashboardContent
