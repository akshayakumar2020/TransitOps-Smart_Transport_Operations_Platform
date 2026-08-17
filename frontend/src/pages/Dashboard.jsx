import React, { useEffect, useState } from 'react'
import { Row, Col, Spin, Empty } from 'antd'
import FleetMap from '../components/FleetMap'
import {
  CarOutlined,
  ToolOutlined,
  RocketOutlined,
  UserOutlined,
  DashboardOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import axiosClient from '../api/axiosClient'

const PIE_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#64748b']

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  if (user?.role === 'DRIVER') {
    return <Navigate to="/trips" replace />
  }

  useEffect(() => {
    axiosClient.get('/api/dashboard/summary')
      .then((res) => setSummary(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>
  if (!summary) return <Empty description="Could not load dashboard" />

  const cards = [
    {
      label: 'Active Vehicles',
      value: summary.activeVehicles,
      icon: <CarOutlined style={{ color: '#ffffff' }} />,
      gradient: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
      path: '/vehicles'
    },
    {
      label: 'Available Vehicles',
      value: summary.availableVehicles,
      icon: <CheckCircleOutlined style={{ color: '#ffffff' }} />,
      gradient: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
      path: '/vehicles'
    },
    {
      label: 'In Maintenance',
      value: summary.vehiclesInMaintenance,
      icon: <ToolOutlined style={{ color: '#ffffff' }} />,
      gradient: 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)',
      path: '/maintenance'
    },
    {
      label: 'Active Trips',
      value: summary.activeTrips,
      icon: <RocketOutlined style={{ color: '#ffffff' }} />,
      gradient: 'linear-gradient(135deg, #be185d 0%, #f43f5e 100%)',
      path: '/trips'
    },
    {
      label: 'Pending Trips',
      value: summary.pendingTrips,
      icon: <ClockCircleOutlined style={{ color: '#ffffff' }} />,
      gradient: 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)',
      path: '/trips'
    },
    {
      label: 'Drivers On Duty',
      value: summary.driversOnDuty,
      icon: <UserOutlined style={{ color: '#ffffff' }} />,
      gradient: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
      path: '/drivers'
    },
    {
      label: 'Fleet Utilization',
      value: `${summary.fleetUtilization}%`,
      icon: <DashboardOutlined style={{ color: '#ffffff' }} />,
      gradient: 'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)',
      path: '/reports'
    },
  ]

  const fleetPieData = [
    { name: 'Available', value: summary.availableVehicles },
    { name: 'In Maintenance', value: summary.vehiclesInMaintenance },
    { name: 'On Trip', value: Math.max(summary.activeVehicles - summary.availableVehicles - summary.vehiclesInMaintenance, 0) },
  ]

  const tripsBarData = [
    { name: 'Active', trips: summary.activeTrips },
    { name: 'Pending', trips: summary.pendingTrips },
  ]

  return (
    <div>
      <div className="page-title">Fleet Dashboard</div>
      <div className="page-subtitle">Real-time status overview of vehicles, drivers, and trips</div>

      {/* Fleet Map + Fleet Status */}
<Row gutter={[24, 24]} style={{ marginTop: 24 }}>
  {/* Fleet Map */}
  <Col xs={24} lg={16}>
    <FleetMap />
  </Col>

  {/* Fleet Status Distribution */}
  <Col xs={24} lg={8}>
    <div
      style={{
        background: 'white',
        borderRadius: 16,
        padding: 24,
        border: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        height: '100%',
      }}
    >
      <div
        style={{
          fontWeight: 600,
          fontSize: 16,
          marginBottom: 20,
          color: '#0f172a',
        }}
      >
        Fleet Status Distribution
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={fleetPieData}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={95}
            paddingAngle={4}
          >
            {fleetPieData.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={PIE_COLORS[index % PIE_COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip contentStyle={{ borderRadius: 8 }} />
          <Legend
            iconType="circle"
            wrapperStyle={{ paddingTop: 10 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </Col>
</Row>

{/* Trips Summary */}
<Row gutter={[24, 24]} style={{ marginTop: 24 }}>
  <Col span={24}>
    <div
      style={{
        background: 'white',
        borderRadius: 16,
        padding: 24,
        border: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      <div
        style={{
          fontWeight: 600,
          fontSize: 16,
          marginBottom: 20,
          color: '#0f172a',
        }}
      >
        Trips Summary
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={tripsBarData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
          />

          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#64748b' }}
          />

          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#64748b' }}
          />

          <Tooltip
            cursor={{ fill: 'rgba(241,245,249,0.5)' }}
            contentStyle={{ borderRadius: 8 }}
          />

          <Bar
            dataKey="trips"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]}
            barSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </Col>
</Row>
    </div>
  )
}
