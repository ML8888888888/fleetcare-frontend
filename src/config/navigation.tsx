import {
  AppstoreOutlined,
  CarOutlined,
  SettingOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

export const navigationItems: MenuProps['items'] = [
  {
    key: '/dashboard',
    label: 'Overview',
    icon: <AppstoreOutlined />,
  },
  {
    key: '/risk',
    label: 'Risk Analytics',
    icon: <WarningOutlined />,
  },
  {
    key: '/vehicles',
    label: 'Vehicle Table',
    icon: <CarOutlined />,
  },
]

export const settingsItem: MenuProps['items'] = [
  {
    key: 'settings',
    label: 'Settings',
    icon: <SettingOutlined />,
    disabled: true,
  },
]

export const pageMeta: Record<string, { title: string; crumb: string }> = {
  '/dashboard': { title: 'Overview', crumb: 'Fleet-wide summary' },
  '/risk': {
    title: 'Risk Analytics',
    crumb: 'Distribution, trends and contributing signals',
  },
  '/vehicles': {
    title: 'Vehicle Table',
    crumb: 'Full fleet risk list, searchable and filterable',
  },
}
