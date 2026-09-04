import { BellOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Layout, Space, Typography } from 'antd'

const { Header } = Layout

function AppHeader() {
  return (
    <Header className="app-header">
      <Typography.Title level={4}>Fleet Health Monitoring</Typography.Title>
      <Space size="middle">
        <BellOutlined className="header-action" />
        <Typography.Text>Fleet Manager</Typography.Text>
        <Avatar icon={<UserOutlined />} />
      </Space>
    </Header>
  )
}

export default AppHeader