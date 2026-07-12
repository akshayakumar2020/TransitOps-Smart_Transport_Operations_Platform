import React, { useEffect, useState } from 'react'
import { Table, Button, message, Card, Row, Col } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import axiosClient from '../api/axiosClient'

export default function Reports() {
  const [report, setReport] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await axiosClient.get('/api/reports/operational-cost')
      setReport(data)
    } catch {
      message.error('Failed to load report')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const downloadCsv = async () => {
    try {
      const res = await axiosClient.get('/api/reports/export/csv', { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'transitops-report.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch {
      message.error('CSV export failed')
    }
  }

  const totalOperationalCost = report.reduce((sum, r) => sum + (r.operationalCost || 0), 0)
  const totalFuelCost = report.reduce((sum, r) => sum + (r.fuelCost || 0), 0)
  const totalMaintenanceCost = report.reduce((sum, r) => sum + (r.maintenanceCost || 0), 0)

  const columns = [
    { title: 'Registration No.', dataIndex: 'registrationNumber', key: 'registrationNumber' },
    { title: 'Name / Model', dataIndex: 'nameModel', key: 'nameModel' },
    { title: 'Fuel Cost', dataIndex: 'fuelCost', key: 'fuelCost', render: (v) => `$${v?.toFixed(2)}` },
    { title: 'Maintenance Cost', dataIndex: 'maintenanceCost', key: 'maintenanceCost', render: (v) => `$${v?.toFixed(2)}` },
    { title: 'Operational Cost', dataIndex: 'operationalCost', key: 'operationalCost', render: (v) => `$${v?.toFixed(2)}` },
    { title: 'Distance (km)', dataIndex: 'totalDistance', key: 'totalDistance' },
    { title: 'Fuel Used (L)', dataIndex: 'totalFuelConsumed', key: 'totalFuelConsumed' },
    { title: 'Fuel Efficiency (km/L)', dataIndex: 'fuelEfficiency', key: 'fuelEfficiency' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
        <div>
          <div className="page-title">Reports & Analytics</div>
          <div className="page-subtitle">Operational cost, fuel efficiency, and utilization per vehicle</div>
        </div>
        <Button type="primary" icon={<DownloadOutlined />} onClick={downloadCsv}>Export CSV</Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Card><div className="page-subtitle" style={{ marginBottom: 4 }}>Total Operational Cost</div><div style={{ fontSize: 24, fontWeight: 700, color: '#1a2a63' }}>${totalOperationalCost.toFixed(2)}</div></Card>
        </Col>
        <Col span={8}>
          <Card><div className="page-subtitle" style={{ marginBottom: 4 }}>Total Fuel Cost</div><div style={{ fontSize: 24, fontWeight: 700, color: '#1a2a63' }}>${totalFuelCost.toFixed(2)}</div></Card>
        </Col>
        <Col span={8}>
          <Card><div className="page-subtitle" style={{ marginBottom: 4 }}>Total Maintenance Cost</div><div style={{ fontSize: 24, fontWeight: 700, color: '#1a2a63' }}>${totalMaintenanceCost.toFixed(2)}</div></Card>
        </Col>
      </Row>

      <Table
        rowKey="vehicleId"
        columns={columns}
        dataSource={report}
        loading={loading}
        bordered
        style={{ background: 'white', borderRadius: 12, overflow: 'hidden' }}
      />
    </div>
  )
}
