import { Button, Input, Select, Table } from 'antd'
import type { TableColumnsType } from 'antd'
import { useMemo, useState } from 'react'
import ProbBar from '../../components/common/ProbBar'
import RiskPill from '../../components/common/RiskPill'
import Sparkline from '../../components/common/Sparkline'
import { fleetStats, vehicles } from '../../data/mock'
import type { RiskClass, VehicleRow } from '../../data/mock'
import { classColors, colors } from '../../theme/tokens'

const actionClass: Record<VehicleRow['action'], string> = {
  inspect: 'action-inspect',
  plan: 'action-plan',
  monitor: 'action-monitor',
}

const actionLabel: Record<VehicleRow['action'], string> = {
  inspect: 'Inspect Now',
  plan: 'Plan Inspection',
  monitor: 'Monitor',
}

function Vehicles() {
  const [query, setQuery] = useState('')
  const [cls, setCls] = useState<RiskClass | 'all'>('all')
  const [page, setPage] = useState(1)
  const pageSize = 5

  const filtered = useMemo(() => {
    return vehicles.filter((row) => {
      const matchQuery = row.id.toLowerCase().includes(query.trim().toLowerCase())
      const matchClass = cls === 'all' || row.cls === cls
      return matchQuery && matchClass
    })
  }, [query, cls])

  const columns: TableColumnsType<VehicleRow> = [
    {
      title: 'Vehicle ID',
      dataIndex: 'id',
      render: (id: string) => <span style={{ color: colors.text, fontWeight: 600 }}>{id}</span>,
    },
    { title: 'Component', dataIndex: 'component' },
    { title: 'Current Time Step', dataIndex: 'timeStep' },
    {
      title: 'Predicted Class',
      dataIndex: 'classLabel',
      render: (label: string, row) => <RiskPill cls={row.cls}>{label}</RiskPill>,
    },
    {
      title: 'Risk Score',
      dataIndex: 'riskScore',
      render: (score: number) => (
        <span style={{ color: colors.text, fontWeight: 600 }}>{score} /100</span>
      ),
    },
    {
      title: 'Prob. (0-1-2-3-4)',
      dataIndex: 'probs',
      render: (probs: number[]) => <ProbBar probs={probs} />,
    },
    {
      title: 'Trend',
      dataIndex: 'trend',
      render: (trend: number[], row) => (
        <Sparkline values={trend} color={classColors[row.cls]} />
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (action: VehicleRow['action']) => (
        <Button size="small" className={actionClass[action]}>
          {actionLabel[action]}
        </Button>
      ),
    },
  ]

  return (
    <div className="fc-card">
      <div className="card-title" style={{ alignItems: 'center' }}>
        VEHICLE RISK OVERVIEW
        <div className="vehicles-toolbar">
          <Input
            className="search-input"
            placeholder="Search vehicle ID..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            style={{ width: 220 }}
          />
          <Select
            value={cls}
            style={{ width: 130 }}
            onChange={(value) => {
              setCls(value)
              setPage(1)
            }}
            options={[
              { value: 'all', label: 'All classes' },
              { value: 4, label: 'Class 4' },
              { value: 3, label: 'Class 3' },
              { value: 2, label: 'Class 2' },
              { value: 1, label: 'Class 1' },
              { value: 0, label: 'Class 0' },
            ]}
          />
        </div>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        pagination={{
          current: page,
          pageSize,
          total: filtered.length,
          showSizeChanger: false,
          onChange: setPage,
          showTotal: (_total, range) =>
            `Showing ${range[0]} to ${range[1]} of ${fleetStats.total.toLocaleString()} vehicles`,
        }}
        size="middle"
      />
    </div>
  )
}

export default Vehicles
