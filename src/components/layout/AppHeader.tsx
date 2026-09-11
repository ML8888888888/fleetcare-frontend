import { BellOutlined, QuestionOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import { useLocation } from 'react-router-dom'
import { pageMeta } from '../../config/navigation'

function AppHeader() {
  const { pathname } = useLocation()
  const meta = pageMeta[pathname] ?? { title: 'FleetCare', crumb: '' }

  return (
    <header className="app-header">
      <div>
        <h1>{meta.title}</h1>
        {meta.crumb ? <div className="crumbs">{meta.crumb}</div> : null}
      </div>
      <Space size={18}>
        <div className="icon-btn">
          <BellOutlined />
        </div>
        <div className="icon-btn">
          <QuestionOutlined />
        </div>
        <div className="user-chip">
          <div className="avatar">FM</div>
          Fleet Manager
        </div>
      </Space>
    </header>
  )
}

export default AppHeader
