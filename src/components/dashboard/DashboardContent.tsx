import { ArrowRightOutlined } from '@ant-design/icons'
import { Card, Col, Divider, List, Row, Space, Tag, Typography } from 'antd'
import {
  dashboardKpis,
  maintenancePlan,
  riskAlerts,
  riskClasses,
} from '../../utils/dashboard/dataQueries'

const { Text, Title } = Typography

const colors = {
  blue: '#1677ff',
  green: '#389e0d',
  orange: '#d46b08',
  red: '#cf1322',
  yellow: '#d4b106',
  muted: '#8c8c8c',
}

const cardTitleStyle = { fontSize: 12, letterSpacing: 0.5, color: colors.muted }
const sectionCardStyle = { height: '100%' }

function DashboardContent() {
  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        {dashboardKpis.map((kpi) => (
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
                <div style={chartPlaceholderStyle} aria-label="Risk distribution chart" />
              </Col>
              <Col xs={24} sm={14}>
                <List
                  dataSource={riskClasses}
                  split={false}
                  renderItem={(riskClass) => (
                    <List.Item style={{ padding: '8px 0' }}>
                      <Space>
                        <span style={{ ...legendDotStyle, background: riskClass.color }} />
                        <Text>{riskClass.label}</Text>
                      </Space>
                      <Text strong>
                        {riskClass.count} <Text type="secondary">{riskClass.percentage}</Text>
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
            extra={<a href="#alerts">View all <ArrowRightOutlined /></a>}
            style={sectionCardStyle}
          >
            <List
              dataSource={riskAlerts}
              renderItem={(alert) => (
                <List.Item>
                  <List.Item.Meta
                    title={alert.vehicle}
                    description={alert.description}
                  />
                  <Space direction="vertical" align="end" size={2}>
                    <Tag color={alert.tagColor}>{alert.className}</Tag>
                    <Text strong>{alert.risk}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Card title="MAINTENANCE PLAN SUMMARY">
        <Row align="middle">
          {maintenancePlan.map((item, index) => (
            <Col key={item.title} xs={24} sm={12} lg={6}>
              <div style={summaryBlockStyle}>
                {index > 0 && <Divider type="vertical" style={dividerStyle} />}
                {item.kind === 'financial' ? (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text type="secondary">Preventive</Text>
                      <Title level={4} style={{ ...financialValueStyle, color: colors.green }}>
                        -$452,000
                      </Title>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">If ignored</Text>
                      <Title level={4} style={{ ...financialValueStyle, color: colors.red }}>
                        $1,230,000
                      </Title>
                    </Col>
                  </Row>
                ) : (
                  <>
                    <Text type="secondary">{item.title}</Text>
                    <Title level={2} style={{ margin: '8px 0 0' }}>
                      {item.value}
                    </Title>
                    <Text style={{ color: item.color ?? colors.muted }}>vehicles</Text>
                  </>
                )}
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
  background:
    'conic-gradient(#e6f4ff 0 58.2%, #1677ff 58.2% 70.8%, #d4b106 70.8% 79.6%, #d46b08 79.6% 90.7%, #cf1322 90.7% 100%)',
  position: 'relative' as const,
}

const legendDotStyle = { width: 8, height: 8, borderRadius: '50%' }
const summaryBlockStyle = { position: 'relative' as const, minHeight: 88, padding: '4px 20px' }
const dividerStyle = { position: 'absolute' as const, left: 0, top: 0, height: '100%' }
const financialValueStyle = { margin: '8px 0 0', fontSize: 18 }

export default DashboardContent