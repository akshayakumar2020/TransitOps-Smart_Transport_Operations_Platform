import React, { useState, useEffect } from 'react'
import { Layout, Menu, Avatar, Dropdown, Tag, Input, Badge, Tooltip } from 'antd'
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
  BellOutlined,
  SearchOutlined,
  ClockCircleOutlined,
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
  const [time, setTime] = useState(new Date())

  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const isManager = user?.role === 'FLEET_MANAGER'
  const isSafety = user?.role === 'SAFETY_OFFICER'
  const isAnalyst = user?.role === 'FINANCIAL_ANALYST'

  const menuItems = items
    .filter((item) => {
      if (isSafety) {
        return item.key === '/dashboard' || item.key === '/drivers'
      }
      if (isAnalyst) {
        return (
          item.key === '/dashboard' ||
          item.key === '/fuel-expenses' ||
          item.key === '/reports'
        )
      }
      if (!isManager) {
        return item.key === '/trips'
      }
      return true
    })
    .map((item) => {
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

  const pageTitle =
    menuItems.find((i) => i.key === location.pathname)?.label || 'TransitOps'

  const roleConfig = {
    FLEET_MANAGER: { color: 'blue', label: '🛡 Fleet Manager' },
    SAFETY_OFFICER: { color: 'orange', label: '🟠 Safety Officer' },
    FINANCIAL_ANALYST: { color: 'purple', label: '🟣 Financial Analyst' },
    DRIVER: { color: 'green', label: '🟢 Driver' },
  }

  const currentRole = roleConfig[user?.role] || {
    color: 'default',
    label: user?.role,
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme='dark'
        width={250}
        style={{
          background: '#0f172a',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 80,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            🚚
          </div>

          {!collapsed && (
            <div>
              <div
                style={{
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 20,
                  lineHeight: 1.1,
                }}
              >
                TransitOps
              </div>
              <div
                style={{
                  color: '#94a3b8',
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                Smart Fleet Platform
              </div>
            </div>
          )}
        </div>

        {/* Menu */}
        <Menu
          theme='dark'
          mode='inline'
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            background: '#0f172a',
            padding: '12px 8px',
            borderInlineEnd: 'none',
          }}
        />

        {/* Sidebar Footer */}
        {!collapsed && (
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              left: 16,
              right: 16,
              padding: 16,
              borderRadius: 14,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div
              style={{
                color: '#e2e8f0',
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              Fleet Health
            </div>

            <div
              style={{
                width: '100%',
                height: 8,
                borderRadius: 999,
                background: 'rgba(255,255,255,0.08)',
                overflow: 'hidden',
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: '92%',
                  height: '100%',
                  borderRadius: 999,
                  background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                }}
              />
            </div>

            <div
              style={{
                color: '#94a3b8',
                fontSize: 12,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>System Healthy</span>
              <span>v1.0</span>
            </div>
          </div>
        )}
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header
          style={{
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            height: 72,
            borderBottom: '1px solid rgba(226,232,240,0.8)',
            boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
          }}
        >
          {/* Left */}
          <div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#0f172a',
                lineHeight: 1.1,
              }}
            >
              {pageTitle}
            </div>

            <div
              style={{
                fontSize: 13,
                color: '#64748b',
                marginTop: 2,
              }}
            >
              Fleet Operations Center
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Search */}
            <Input
              placeholder='Search vehicles, drivers, trips...'
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              style={{
                width: 300,
                borderRadius: 10,
              }}
            />

            {/* Notifications */}
            <Tooltip title='Notifications'>
              <Badge count={3} size='small'>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    background: '#fff',
                  }}
                >
                  <BellOutlined style={{ fontSize: 18, color: '#334155' }} />
                </div>
              </Badge>
            </Tooltip>

            {/* Clock */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: 10,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#334155',
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              <ClockCircleOutlined />
              {time.toLocaleTimeString()}
            </div>

            {/* Role */}
            <Tag color={currentRole.color} style={{ padding: '4px 10px' }}>
              {currentRole.label}
            </Tag>

            {/* User */}
            <Dropdown menu={userMenu} placement='bottomRight'>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  padding: '6px 10px',
                  borderRadius: 12,
                  transition: 'all .2s',
                }}
              >
                <Badge dot color='#22c55e' offset={[-4, 28]}>
                  <Avatar
                    icon={<UserOutlined />}
                    style={{ backgroundColor: '#2563eb' }}
                  />
                </Badge>

                <div style={{ lineHeight: 1.2 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      color: '#0f172a',
                    }}
                  >
                    {user?.name}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: '#64748b',
                    }}
                  >
                    Online
                  </div>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: 24,
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 18,
              border: '1px solid rgba(226,232,240,0.8)',
              boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
              padding: 24,
              minHeight: 'calc(100vh - 140px)',
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}