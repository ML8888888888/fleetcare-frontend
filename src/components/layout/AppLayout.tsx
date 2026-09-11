import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import AppHeader from './AppHeader'
import Sidebar from './Sidebar'

const { Content } = Layout

function AppLayout() {
  return (
    <Layout className="app-layout" hasSider>
      <Sidebar />
      <Layout style={{ background: 'var(--bg)' }}>
        <AppHeader />
        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout
