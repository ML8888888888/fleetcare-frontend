import {
  ArrowLeftOutlined,
  ArrowUpOutlined,
  CheckOutlined,
} from '@ant-design/icons'
import { Alert, Button, Card, Col, Flex, List, Row, Space, Tag, Typography } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getVehicleDetail } from '../../utils/Vehicles/vehicleDetails'
import type { VehicleTrendPoint } from '../../utils/Vehicles/vehicleDetails'

const { Text, Title } = Typography

const colors = {
  blue: '#1677ff',
  green: '#389e0d',
  orange: '#d46b08',
  red: '#cf1322',
  yellow: '#d4b106',
  muted: '#8c8c8c',
}

const riskSeries = [
  { key: 'risk48' as const, label: 'Risk48', color: colors.blue },
  { key: 'risk24' as const, label: 'Risk24', color: colors.yellow },
  { key: 'risk12' as const, label: 'Risk12', color: colors.orange },
  { key: 'risk6' as const, label: 'Risk6', color: colors.red },
]

const cardTitleStyle = { fontSize: 12, letterSpacing: 0.4, color: colors.muted }
const sectionCardStyle = { height: '100%' }

function RiskOverTimeChart({ points }: { points: VehicleTrendPoint[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const width = 560
  const height = 220
  const left = 36
  const right = 16
  const top = 16
  const bottom = 32
  const innerWidth = width - left - right
  const innerHeight = height - top - bottom
  const xAt = (index: number) => left + (points.length === 1 ? innerWidth / 2 : (index / (points.length - 1)) * innerWidth)
  const yAt = (value: number) => top + (1 - value) * innerHeight
  const hovered = hoveredIndex === null ? null : points[hoveredIndex]

  return (
    <div style={chartFrameStyle}>
      {hovered && hoveredIndex !== null && (
        <div style={tooltipStyle}>
          <Text strong>{hovered.label}</Text>
          {riskSeries.map((series) => (
            <Text key={series.key} style={{ color: series.color }}>
              {series.label} {hovered[series.key].toFixed(3)}
            </Text>
          ))}
        </div>
      )}
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Risk over operational time" style={chartSvgStyle}>
        {[0, 0.5, 1].map((tick) => (
          <g key={tick}>
            <line
              x1={left}
              x2={width - right}
              y1={yAt(tick)}
              y2={yAt(tick)}
              stroke="#f0f0f0"
            />
            <text x={left - 8} y={yAt(tick) + 4} fill={colors.muted} fontSize="11" textAnchor="end">
              {tick.toFixed(1)}
            </text>
          </g>
        ))}
        {riskSeries.map((series) => (
          <polyline
            key={series.key}
            fill="none"
            stroke={series.color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            points={points.map((point, index) => `${xAt(index)},${yAt(point[series.key])}`).join(' ')}
          />
        ))}
        {points.map((point, index) => (
          <g key={point.label}>
            {riskSeries.map((series) => (
              <circle
                key={series.key}
                cx={xAt(index)}
                cy={yAt(point[series.key])}
                r={hoveredIndex === index ? 5 : 3.5}
                fill={series.color}
              />
            ))}
            <rect
              x={xAt(index) - innerWidth / points.length / 2}
              y={top}
              width={innerWidth / points.length}
              height={innerHeight}
              fill="transparent"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
            <text x={xAt(index)} y={height - 8} fill={colors.muted} fontSize="11" textAnchor="middle">
              {point.label}
            </text>
          </g>
        ))}
      </svg>
      <Space size={16} wrap>
        {riskSeries.map((series) => (
          <Space key={series.key} size={6}>
            <span style={{ ...legendDotStyle, background: series.color }} />
            <Text type="secondary">{series.label}</Text>
          </Space>
        ))}
      </Space>
    </div>
  )
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <Card style={sectionCardStyle}>
      <Text style={cardTitleStyle}>{label}</Text>
      <Title level={4} style={{ margin: '8px 0 0' }}>
        {value}
      </Title>
    </Card>
  )
}

function VehicleDetailContent({ vehicleId }: { vehicleId: string }) {
  const navigate = useNavigate()
  const detail = getVehicleDetail(vehicleId)

  if (!detail) {
    return (
      <Card>
        <Space direction="vertical" size={12}>
          <Button type="link" icon={<ArrowLeftOutlined />} style={backButtonStyle} onClick={() => navigate('/vehicles')}>
            Vehicles
          </Button>
          <Title level={4} style={{ margin: 0 }}>Vehicle not found</Title>
          <Text type="secondary">This vehicle is not in the current fleet view.</Text>
        </Space>
      </Card>
    )
  }

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Button type="link" icon={<ArrowLeftOutlined />} style={backButtonStyle} onClick={() => navigate('/vehicles')}>
        Vehicles
      </Button>

      <Flex justify="space-between" align="center" gap={12} wrap style={{ width: '100%' }}>
        <Title level={3} style={{ margin: 0 }}>{detail.vehicleId}</Title>
        <Tag color={detail.tagColor} style={badgeStyle}>{detail.badge}</Tag>
      </Flex>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <SummaryMetric label="Predicted State" value={detail.predictedState} />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <SummaryMetric label="Action" value={detail.action} />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <SummaryMetric label="History" value={detail.history} />
        </Col>
      </Row>

      <Card title="CURRENT RISK">
        <Row gutter={[16, 16]}>
          {detail.risks.map((risk) => (
            <Col key={risk.label} xs={12} sm={6}>
              <Text style={cardTitleStyle}>{risk.label}</Text>
              <Title level={3} style={{ margin: '8px 0 0' }}>{risk.value}</Title>
            </Col>
          ))}
        </Row>
      </Card>

      <Card title="RISK OVER OPERATIONAL TIME">
        <RiskOverTimeChart points={detail.trend} />
      </Card>

      <Card title="WHY THIS ACTION?">
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Flex gap={12} align="center" wrap>
            <Tag color={detail.tagColor} style={{ margin: 0 }}>{detail.action}</Tag>
            <Text>Rule {detail.rule}</Text>
          </Flex>
          <List
            split={false}
            dataSource={detail.reasons}
            renderItem={(reason) => (
              <List.Item style={{ padding: '6px 0', justifyContent: 'flex-start' }}>
                <Space>
                  <CheckOutlined style={{ color: colors.green }} />
                  <Text>{reason}</Text>
                </Space>
              </List.Item>
            )}
          />
        </Space>
      </Card>

      <Card title="KEY FACTORS BEHIND THE PREDICTION">
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          {detail.factors.map((factor) => (
            <div key={factor.name}>
              <Flex justify="space-between" align="center" style={{ marginBottom: 6 }}>
                <Text>{factor.name}</Text>
                <ArrowUpOutlined style={{ color: colors.red }} />
              </Flex>
              <div style={factorTrackStyle} aria-hidden>
                <div style={{ ...factorBarStyle, width: `${Math.round(factor.impact * 100)}%` }} />
              </div>
            </div>
          ))}
          <Alert
            type="warning"
            showIcon
            title="Features are anonymised; this does not identify a specific mechanical fault."
          />
        </Space>
      </Card>
    </Space>
  )
}

const backButtonStyle = { padding: 0, height: 'auto' }
const badgeStyle = { margin: 0, maxWidth: '100%', padding: '2px 10px', letterSpacing: 0.6, whiteSpace: 'normal' as const }
const chartFrameStyle = { position: 'relative' as const, width: '100%' }
const chartSvgStyle = { display: 'block', width: '100%', height: 'auto' }
const tooltipStyle = {
  position: 'absolute' as const,
  top: 8,
  right: 8,
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 2,
  padding: '6px 10px',
  border: '1px solid #f0f0f0',
  borderRadius: 6,
  background: '#fff',
}
const legendDotStyle = { display: 'inline-block', width: 8, height: 8, borderRadius: '50%' }
const factorTrackStyle = {
  flex: 1,
  height: 8,
  borderRadius: 4,
  background: '#f0f0f0',
  overflow: 'hidden' as const,
}
const factorBarStyle = {
  height: '100%',
  borderRadius: 4,
  background: '#cf1322',
}

export default VehicleDetailContent
