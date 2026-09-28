import {
  CarOutlined,
  DashboardOutlined,
  LineChartOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

export const navigationItems: MenuProps['items'] = [
  {
    key: '/dashboard',
    label: 'Dashboard',
    icon: <DashboardOutlined />,
  },
  {
    key: '/vehicles',
    label: 'Vehicles',
    icon: <CarOutlined />,
  },
  {
    key: '/risk-analytics',
    label: 'Risk Analytics',
    icon: <LineChartOutlined />,
  },
]