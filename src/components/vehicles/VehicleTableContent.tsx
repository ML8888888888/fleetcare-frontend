import { SearchOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Flex,
  Input,
  Pagination,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd'
import type { TableColumnsType } from 'antd'
import { useMemo, useState } from 'react'
import { vehicleData } from '../../utils/Vehicles/dataQueries'
import type { VehicleRecord, VehicleStatus } from '../../utils/Vehicles/dataQueries'

const { Text, Title } = Typography

type StatusConfig = {
  color: string
  range: string
  action: string
}

const statusConfig: Record<VehicleStatus, StatusConfig> = {
  'Priority Inspect': { color: 'red', range: '0-6 steps', action: 'Inspect Now' },
  Inspect: { color: 'orange', range: '6-12 steps', action: 'Plan Inspection' },
  'Enhanced Monitor': { color: 'gold', range: '12-24 steps', action: 'Monitor' },
}

const probabilityColors = ['#389e0d', '#1677ff', '#d4b106', '#d46b08', '#cf1322']

function TrendLine({ values, status }: { values: number[]; status: VehicleStatus }) {
  const lineColor = statusConfig[status].color === 'red'
    ? '#cf1322'
    : statusConfig[status].color === 'orange'
      ? '#d46b08'
      : '#d4b106'
  const points = values.map((value, index) => `${index * 22},${32 - value * 0.22}`).join(' ')

  return (
    <svg width="92" height="36" viewBox="0 0 88 36" role="img" aria-label={`${status} risk trend`}>
      <polyline
        fill="none"
        stroke={lineColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        points={points}
      />
    </svg>
  )
}

function ProbabilityBar({ probabilities }: { probabilities: number[] }) {
  return (
    <div style={probabilityBarStyle} aria-label="Probability distribution">
      {probabilities.map((probability, index) => (
        <div
          key={probabilityColors[index]}
          style={{ width: `${probability * 100}%`, background: probabilityColors[index] }}
        />
      ))}
    </div>
  )
}

function VehicleTableContent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All classes')

  const filteredVehicles = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return vehicleData.filter((vehicle) => {
      const matchesSearch = vehicle.vehicleId.toLowerCase().includes(normalizedSearch)
      const matchesStatus = selectedStatus === 'All classes' || vehicle.predictedClass === selectedStatus
      return matchesSearch && matchesStatus
    })
  }, [searchTerm, selectedStatus])

  const columns: TableColumnsType<VehicleRecord> = [
    { title: 'Vehicle ID', dataIndex: 'vehicleId', key: 'vehicleId', width: 105 },
    { title: 'Component', dataIndex: 'component', key: 'component', width: 105 },
    { title: 'Current Time Step', dataIndex: 'timeStep', key: 'timeStep', width: 115 },
    {
      title: 'Predicted Class',
      dataIndex: 'predictedClass',
      key: 'predictedClass',
      width: 190,
      render: (status: VehicleStatus) => {
        const config = statusConfig[status]
        return <Tag color={config.color}>{status} : {config.range}</Tag>
      },
    },
    {
      title: 'Risk Score',
      dataIndex: 'riskScore',
      key: 'riskScore',
      width: 88,
      render: (score: number) => <Text strong>{score} /100</Text>,
    },
    {
      title: 'Prob. (0-1-2-3-4)',
      dataIndex: 'prob',
      key: 'prob',
      width: 125,
      render: (probabilities: number[]) => <ProbabilityBar probabilities={probabilities} />,
    },
    {
      title: 'Trend',
      dataIndex: 'trend',
      key: 'trend',
      width: 100,
      render: (trend: number[], vehicle) => <TrendLine values={trend} status={vehicle.predictedClass} />,
    },
    {
      title: 'Action',
      key: 'action',
      width: 128,
      render: (_, vehicle) => {
        const config = statusConfig[vehicle.predictedClass]
        const actionStyle = vehicle.predictedClass === 'Inspect'
          ? { background: '#faad14', borderColor: '#faad14', color: '#fff' }
          : undefined
        return <Button size="small" type="primary" danger={vehicle.predictedClass === 'Priority Inspect'} style={actionStyle}>{config.action}</Button>
      },
    },
  ]

  return (
    <Card
      title={<Title level={5} style={{ margin: 0 }}>VEHICLE RISK OVERVIEW</Title>}
      extra={
        <Space wrap>
          <Input.Search
            allowClear
            placeholder="Search vehicle ID..."
            prefix={<SearchOutlined />}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <Select
            value={selectedStatus}
            style={{ minWidth: 180 }}
            options={[
              { value: 'All classes', label: 'All classes' },
              { value: 'Priority Inspect', label: 'Priority Inspect' },
              { value: 'Inspect', label: 'Inspect' },
              { value: 'Enhanced Monitor', label: 'Enhanced Monitor' },
            ]}
            onChange={setSelectedStatus}
          />
        </Space>
      }
    >
      <Table<VehicleRecord>
        rowKey="vehicleId"
        columns={columns}
        dataSource={filteredVehicles}
        pagination={false}
        size="small"
        tableLayout="fixed"
      />
      <Flex justify="flex-end" align="center" gap={16} wrap style={paginationStyle}>
        <Text type="secondary">Showing 1 to 5 of 4,256 vehicles</Text>
        <Pagination simple total={4256} defaultCurrent={1} />
      </Flex>
    </Card>
  )
}

const probabilityBarStyle = {
  display: 'flex',
  width: 100,
  height: 8,
  overflow: 'hidden' as const,
  borderRadius: 4,
  background: '#f0f0f0',
}
const paginationStyle = { marginTop: 24 }

export default VehicleTableContent
