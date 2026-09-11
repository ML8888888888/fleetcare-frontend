import { ConfigProvider, theme } from 'antd'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { colors } from './theme/tokens'
import './App.css'

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: colors.blue,
          colorBgBase: colors.bg,
          colorBgContainer: colors.panel,
          colorBgLayout: colors.bg,
          colorBorder: colors.border,
          colorText: colors.text,
          colorTextSecondary: colors.textDim,
          borderRadius: 8,
          fontFamily: '-apple-system, "Segoe UI", Roboto, Arial, sans-serif',
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  )
}

export default App
