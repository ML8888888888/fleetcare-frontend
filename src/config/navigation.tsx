import {
  CarOutlined,
  DashboardOutlined,
  RobotOutlined,
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
    key: '/assistant',
    label: 'AI Assistant',
    icon: <RobotOutlined />,
  },
]