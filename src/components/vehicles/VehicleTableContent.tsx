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
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd'
import type { TableColumnsType } from 'antd'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { getJson, patchJson } from '../../utils/http'
import { vehicleClasses, type VehicleListResponse, type VehicleRecord, type VehicleStatus } from '../../utils/Vehicles/dataQueries'
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
}

const fallbackStatus: StatusConfig = { color: 'default', range: '', action: 'Open' }
const actionColors: Record<VehicleStatus, { background: string; color: string }> = {
  Continue: { background: '#e6f4ff', color: 'rgba(0, 0, 0, 0.88)' },
  Monitor: { background: '#1677ff', color: '#fff' },
  'Enhanced Monitor': { background: '#d4b106', color: '#fff' },
  Inspect: { background: '#d46b08', color: '#fff' },
  'Priority Inspect': { background: '#cf1322', color: '#fff' },
}
const stateColors: Record<string, string> = {
  C0: 'green',
  C1: 'blue',
  C2: 'gold',
  C3: 'orange',
  C4: 'red',
}
const pageSize = 10

function VehicleTableContent() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const searchTerm = searchParams.get('q') ?? ''
  const selectedStatus = searchParams.get('class') || 'All classes'
  const [searchInput, setSearchInput] = useState(searchTerm)
  const [vehicles, setVehicles] = useState<VehicleRecord[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [savingId, setSavingId] = useState<string | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = searchInput.trim()
      if (next === searchTerm) return
      setSearchParams((current) => {
        const params = new URLSearchParams(current)
        if (next) params.set('q', next)
        else params.delete('q')
        params.delete('page')
        return params
      }, { replace: true })
    }, 300)
    return () => window.clearTimeout(timer)
  }, [searchInput, searchTerm, setSearchParams])

  const openVehicle = (vehicleId: string) => {
    navigate(`/vehicles/${vehicleId}`, {
      state: { from: `${location.pathname}${location.search}` },
    })
  }

  const updatePage = (nextPage: number) => {
    setSearchParams((current) => {
      const params = new URLSearchParams(current)
      if (nextPage <= 1) params.delete('page')
      else params.set('page', String(nextPage))
      return params
    }, { replace: true })
  }

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
      width: '20%',
      render: (vehicleId: string) => (
        <Typography.Link onClick={() => openVehicle(vehicleId)}>
          {vehicleId}
        </Typography.Link>
      ),
    },
    {
      title: 'Predicted Class',
      dataIndex: 'state',
      key: 'state',
      width: '20%',
      render: (state: string) => <Tag color={stateColors[state] ?? 'default'}>{state}</Tag>,
    },
    {
      title: 'Risk Score',
      dataIndex: 'riskScore',
      key: 'riskScore',
      width: '20%',
      render: (score: number) => <Text strong>{score} /100</Text>,
    },
    {
      title: 'Action',
      key: 'action',
      width: '20%',
      render: (_, vehicle) => {
        const config = statusConfig[vehicle.predictedClass] ?? fallbackStatus
        const actionColor = actionColors[vehicle.predictedClass]
        return (
          <Button
            size="small"
            type="primary"
            style={actionColor ? { background: actionColor.background, borderColor: actionColor.background, color: actionColor.color } : undefined}
            onClick={() => openVehicle(vehicle.vehicleId)}
          >
            {vehicle.predictedClass || config.action}
          </Button>
        )
      },
    },
    {
      title: 'Maintenance',
      dataIndex: 'inMaintenance',
      key: 'inMaintenance',
      width: '20%',
      render: (inMaintenance: boolean, vehicle) => (
        <Switch
          checked={inMaintenance}
          checkedChildren="On"
          unCheckedChildren="Off"
          loading={savingId === vehicle.vehicleId}
          onChange={(checked) => {
            const previous = vehicle.inMaintenance
            setVehicles((current) =>
              current.map((item) =>
                item.vehicleId === vehicle.vehicleId ? { ...item, inMaintenance: checked } : item,
              ),
            )
            setSavingId(vehicle.vehicleId)
            patchJson<{ inMaintenance: boolean }>(vehicleEndpoints.maintenance(vehicle.vehicleId), {
              inMaintenance: checked,
            })
              .catch((error: unknown) => {
                setVehicles((current) =>
                  current.map((item) =>
                    item.vehicleId === vehicle.vehicleId ? { ...item, inMaintenance: previous } : item,
                  ),
                )
                setErrorMessage(error instanceof Error ? error.message : 'Unable to update maintenance')
              })
              .finally(() => setSavingId(null))
          }}
        />
      ),
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
            value={searchInput}
            placeholder="Search vehicle ID..."
            prefix={<SearchOutlined />}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Select
            value={selectedStatus}
            style={{ minWidth: 180 }}
            options={[
              { value: 'All classes', label: 'All classes' },
              ...vehicleClasses.map((vehicleClass) => ({
                value: vehicleClass,
                label: vehicleClass,
              })),
            ]}
            onChange={(value) => {
              setSearchParams((current) => {
                const params = new URLSearchParams(current)
                if (value === 'All classes') params.delete('class')
                else params.set('class', value)
                params.delete('page')
                return params
              }, { replace: true })
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
        tableLayout="fixed"
      />
      <Flex justify="flex-end" align="center" gap={16} wrap style={paginationStyle}>
        <Text type="secondary">Showing {from} to {to} of {total.toLocaleString()} vehicles</Text>
        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          showSizeChanger={false}
          onChange={updatePage}
        />
      </Flex>
    </Card>
  )
}

const paginationStyle = { marginTop: 24 }

export default VehicleTableContent
