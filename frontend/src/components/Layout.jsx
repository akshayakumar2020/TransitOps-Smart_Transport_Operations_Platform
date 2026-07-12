import React, { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, Tag } from 'antd'
import {
  DashboardOutlined,
  CarOutlined,
  IdcardOutlined,
  RocketOutlined,
  ToolOutlined,
  DollarOutlined,
  BarChartOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const { Header, Sider, Content } = Layout

const items = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/vehicles', icon: <CarOutlined />, label: 'Vehicles' },
  { key: '/drivers', icon: <IdcardOutlined />, label: 'Drivers' },
  { key: '/trips', icon: <RocketOutlined />, label: 'Trips' },
  { key: '/maintenance', icon: <ToolOutlined />, label: 'Maintenance' },
  { key: '/fuel-expenses', icon: <DollarOutlined />, label: 'Fuel & Expenses' },
  { key: '/reports', icon: <BarChartOutlined />, label: 'Reports' },
]

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const isManager = user?.role === 'FLEET_MANAGER'
  const isSafety = user?.role === 'SAFETY_OFFICER'
  const isAnalyst = user?.role === 'FINANCIAL_ANALYST'

  const menuItems = items.filter(item => {
    if (isSafety) {
      // Safety Officer only tracks driver profiles, licenses, and duty status
      return item.key === '/dashboard' || item.key === '/drivers'
    }
    if (isAnalyst) {
      // Financial Analyst reviews operational expenses, fuel log, and reports
      return item.key === '/dashboard' || item.key === '/fuel-expenses' || item.key === '/reports'
    }
    if (!isManager) {
      // Drivers can only access the Trips module, which contains their assignments
      return item.key === '/trips'
    }
    return true
  }).map(item => {
    if (!isManager && !isSafety && !isAnalyst && item.key === '/trips') {
      return { ...item, label: 'My Trips' }
    }
    return item
  })

  const userMenu = {
    items: [
      { key: 'logout', icon: <LogoutOutlined />, label: 'Log out' },
    ],
    onClick: ({ key }) => {
      if (key === 'logout') {
        logout()
        navigate('/login')
      }
    },
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark" width={230}
        style={{ background: '#0f172a' }}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', paddingLeft: collapsed ? 0 : 20, color: 'white', fontWeight: 800, fontSize: 18, letterSpacing: 0.5 }}>
          {collapsed ? '🚚' : '🚚 TransitOps'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ background: '#0f172a', padding: '0 8px' }}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 64, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight: 600, color: '#1a2a63' }}>
            {menuItems.find((i) => i.key === location.pathname)?.label || 'TransitOps'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Tag color={user?.role === 'FLEET_MANAGER' ? 'blue' : (user?.role === 'SAFETY_OFFICER' ? 'orange' : (user?.role === 'FINANCIAL_ANALYST' ? 'purple' : 'green'))}>
              {user?.role?.replace('_', ' ')}
            </Tag>
            <Dropdown menu={userMenu} placement="bottomRight">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span style={{ fontWeight: 500 }}>{user?.name}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
