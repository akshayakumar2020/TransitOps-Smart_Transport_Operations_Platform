import React, { useEffect, useState } from 'react'
import { Table, Button, Tag, Modal, Form, Input, InputNumber, Select, Space, message, Popconfirm } from 'antd'
import { PlusOutlined, CheckCircleOutlined } from '@ant-design/icons'
import axiosClient from '../api/axiosClient'

const STATUS_COLORS = { OPEN: 'orange', CLOSED: 'green' }

export default function Maintenance() {
  const [logs, setLogs] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()

  const loadLogs = async () => {
    setLoading(true)
    try {
      const { data } = await axiosClient.get('/api/maintenance')
      setLogs(data)
    } catch {
      message.error('Failed to load maintenance records')
    } finally {
      setLoading(false)
    }
  }

  const openCreate = async () => {
    form.resetFields()
    const { data } = await axiosClient.get('/api/vehicles', { params: { status: 'AVAILABLE' } })
    setVehicles(data)
    setModalOpen(true)
  }

  const onCreate = async () => {
    try {
      const values = await form.validateFields()
      await axiosClient.post('/api/maintenance', values)
      message.success('Maintenance record created — vehicle moved to In Shop')
      setModalOpen(false)
      loadLogs()
    } catch (err) {
      if (err?.errorFields) return
      message.error(err?.response?.data?.message || 'Failed to create record')
    }
  }

  const closeRecord = async (id) => {
    try {
      await axiosClient.put(`/api/maintenance/${id}/close`)
      message.success('Maintenance closed — vehicle back to Available')
      loadLogs()
    } catch (err) {
      message.error(err?.response?.data?.message || 'Failed to close record')
    }
  }

  useEffect(() => { loadLogs() }, [])

  const columns = [
    { title: 'Vehicle', key: 'vehicle', render: (_, r) => r.vehicle ? `${r.vehicle.nameModel} (${r.vehicle.registrationNumber})` : '-' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Cost', dataIndex: 'cost', key: 'cost', render: (c) => `$${c?.toFixed(2)}` },
    { title: 'Opened', dataIndex: 'createdDate', key: 'createdDate' },
    { title: 'Closed', dataIndex: 'closedDate', key: 'closedDate', render: (d) => d || '-' },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (s) => <Tag color={STATUS_COLORS[s]}>{s}</Tag>,
    },
    {
      title: 'Actions', key: 'actions',
      render: (_, record) => record.status === 'OPEN' && (
        <Popconfirm title="Close this maintenance record?" onConfirm={() => closeRecord(record.id)}>
          <Button size="small" type="primary" ghost icon={<CheckCircleOutlined />}>Close</Button>
        </Popconfirm>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
        <div>
          <div className="page-title">Maintenance</div>
          <div className="page-subtitle">Opening a record moves the vehicle to In Shop; closing restores it to Available</div>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>New Maintenance Record</Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={logs}
        loading={loading}
        bordered
        style={{ background: 'white', borderRadius: 12, overflow: 'hidden' }}
      />

      <Modal title="Create Maintenance Record" open={modalOpen} onOk={onCreate} onCancel={() => setModalOpen(false)} okText="Create">
        <Form form={form} layout="vertical">
          <Form.Item name="vehicleId" label="Vehicle" rules={[{ required: true }]}>
            <Select
              placeholder="Select vehicle"
              options={vehicles.map((v) => ({ value: v.id, label: `${v.nameModel} — ${v.registrationNumber}` }))}
              notFoundContent="No available vehicles"
            />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input placeholder="e.g. Oil Change" />
          </Form.Item>
          <Form.Item name="cost" label="Cost" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
