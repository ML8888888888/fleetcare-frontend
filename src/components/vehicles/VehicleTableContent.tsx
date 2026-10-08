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
import { useNavigate } from 'react-router-dom'
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

function VehicleTableContent() {
  const navigate = useNavigate()
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
    {
      title: 'Vehicle ID',
      dataIndex: 'vehicleId',
      key: 'vehicleId',
      render: (vehicleId: string) => (
        <Typography.Link onClick={() => navigate(`/vehicles/${vehicleId}`)}>
          {vehicleId}
        </Typography.Link>
      ),
    },
    {
      title: 'Predicted Class',
      dataIndex: 'predictedClass',
      key: 'predictedClass',
      render: (status: VehicleStatus) => {
        const config = statusConfig[status]
        return <Tag color={config.color}>{status} : {config.range}</Tag>
      },
    },
    {
      title: 'Risk Score',
      dataIndex: 'riskScore',
      key: 'riskScore',
      render: (score: number) => <Text strong>{score} /100</Text>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, vehicle) => {
        const config = statusConfig[vehicle.predictedClass]
        const actionStyle = vehicle.predictedClass === 'Inspect'
          ? { background: '#faad14', borderColor: '#faad14', color: '#fff' }
          : undefined
        return (
          <Button
            size="small"
            type="primary"
            danger={vehicle.predictedClass === 'Priority Inspect'}
            style={actionStyle}
            onClick={() => navigate(`/vehicles/${vehicle.vehicleId}`)}
          >
            {config.action}
          </Button>
        )
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
      />
      <Flex justify="flex-end" align="center" gap={16} wrap style={paginationStyle}>
        <Text type="secondary">Showing 1 to 5 of 4,256 vehicles</Text>
        <Pagination simple total={4256} defaultCurrent={1} />
      </Flex>
    </Card>
  )
}

const paginationStyle = { marginTop: 24 }

export default VehicleTableContent
