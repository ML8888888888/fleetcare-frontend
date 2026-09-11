import { Navigate, createBrowserRouter } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import Dashboard from '../pages/Dashboard'
import NotFound from '../pages/NotFound'
import Risk from '../pages/Risk'
import Vehicles from '../pages/Vehicles'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'risk', element: <Risk /> },
      { path: 'vehicles', element: <Vehicles /> },
      { path: 'assistant', element: <Navigate to="/dashboard" replace /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
