import { Layout, Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { navigationItems, settingsItem } from '../../config/navigation'

const { Sider } = Layout

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Sider className="app-sider" width={220} theme="dark" collapsible={false}>
      <div className="sidebar-brand">
        <div className="sidebar-logo">S</div>
        <div>
          <div className="name">SCANIA</div>
          <div className="sub">Predictive Maintenance</div>
        </div>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        items={navigationItems}
        selectedKeys={[location.pathname]}
        onClick={({ key }) => navigate(key)}
      />
      <div className="sidebar-footer">
        <Menu theme="dark" mode="inline" items={settingsItem} selectable={false} />
      </div>
    </Sider>
  )
}

export default Sidebar
