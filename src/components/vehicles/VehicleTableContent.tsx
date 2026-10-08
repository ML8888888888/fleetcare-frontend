import { SearchOutlined } from '@ant-design/icons'
import {
  Alert,
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
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getJson } from '../../utils/http'
import type { VehicleListResponse, VehicleRecord, VehicleStatus } from '../../utils/Vehicles/dataQueries'
import { vehicleEndpoints } from '../../utils/Vehicles/endpoints'

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
  Monitor: { color: 'blue', range: '24-48 steps', action: 'Monitor' },
  Continue: { color: 'green', range: '48+ steps', action: 'Continue' },
  'Manual Review': { color: 'purple', range: 'Review', action: 'Review' },
}

const fallbackStatus: StatusConfig = { color: 'default', range: '', action: 'Open' }
const pageSize = 10

function VehicleTableContent() {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All classes')
  const [page, setPage] = useState(1)
  const [vehicles, setVehicles] = useState<VehicleRecord[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchTerm(searchInput.trim())
      setPage(1)
    }, 300)
    return () => window.clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setErrorMessage('')

    getJson<VehicleListResponse>(vehicleEndpoints.list, {
      q: searchTerm,
      predicted_class: selectedStatus === 'All classes' ? undefined : selectedStatus,
      page,
      page_size: pageSize,
    })
      .then((data) => {
        if (cancelled) return
        setVehicles(data.items)
        setTotal(data.total)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setVehicles([])
        setTotal(0)
        setErrorMessage(error instanceof Error ? error.message : 'Unable to load vehicles')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [searchTerm, selectedStatus, page])

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
        const config = statusConfig[status] ?? fallbackStatus
        return <Tag color={config.color}>{config.range ? `${status} : ${config.range}` : status}</Tag>
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
        const config = statusConfig[vehicle.predictedClass] ?? fallbackStatus
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

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <Card
      title={<Title level={5} style={{ margin: 0 }}>VEHICLE RISK OVERVIEW</Title>}
      extra={
        <Space wrap>
          <Input.Search
            allowClear
            placeholder="Search vehicle ID..."
            prefix={<SearchOutlined />}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Select
            value={selectedStatus}
            style={{ minWidth: 180 }}
            options={[
              { value: 'All classes', label: 'All classes' },
              { value: 'Priority Inspect', label: 'Priority Inspect' },
              { value: 'Inspect', label: 'Inspect' },
              { value: 'Enhanced Monitor', label: 'Enhanced Monitor' },
              { value: 'Monitor', label: 'Monitor' },
              { value: 'Continue', label: 'Continue' },
              { value: 'Manual Review', label: 'Manual Review' },
            ]}
            onChange={(value) => {
              setSelectedStatus(value)
              setPage(1)
            }}
          />
        </Space>
      }
    >
      {errorMessage && (
        <Alert type="error" showIcon title="Unable to load vehicles" description={errorMessage} style={{ marginBottom: 16 }} />
      )}
      <Table<VehicleRecord>
        rowKey="vehicleId"
        columns={columns}
        dataSource={vehicles}
        loading={loading}
        pagination={false}
        size="small"
      />
      <Flex justify="flex-end" align="center" gap={16} wrap style={paginationStyle}>
        <Text type="secondary">Showing {from} to {to} of {total.toLocaleString()} vehicles</Text>
        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          showSizeChanger={false}
          onChange={setPage}
        />
      </Flex>
    </Card>
  )
}

const paginationStyle = { marginTop: 24 }

export default VehicleTableContent
