import React, { useEffect, useState } from 'react'
import { Table, Button, Tag, Modal, Form, Input, InputNumber, Select, Space, message, Select as AntSelect } from 'antd'
import { PlusOutlined, EditOutlined } from '@ant-design/icons'
import axiosClient from '../api/axiosClient'
import { useAuth } from '../context/AuthContext.jsx'

const STATUS_COLORS = {
  AVAILABLE: 'green',
  ON_TRIP: 'blue',
  IN_SHOP: 'orange',
  RETIRED: 'default',
}

export default function Vehicles() {
  const { isFleetManager } = useAuth()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form] = Form.useForm()
  const [statusFilter, setStatusFilter] = useState(undefined)

  const load = async () => {
    setLoading(true)
    try {
      const params = statusFilter ? { status: statusFilter } : {}
      const { data } = await axiosClient.get('/api/vehicles', { params })
      setVehicles(data)
    } catch (e) {
      message.error('Failed to load vehicles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [statusFilter])

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (record) => {
    setEditing(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const onSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editing) {
        await axiosClient.put(`/api/vehicles/${editing.id}`, values)
        message.success('Vehicle updated')
      } else {
        await axiosClient.post('/api/vehicles', values)
        message.success('Vehicle registered')
      }
      setModalOpen(false)
      load()
    } catch (err) {
      if (err?.errorFields) return
      message.error(err?.response?.data?.message || 'Save failed')
    }
  }

  const columns = [
    { title: 'Registration No.', dataIndex: 'registrationNumber', key: 'registrationNumber' },
    { title: 'Name / Model', dataIndex: 'nameModel', key: 'nameModel' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Max Load (kg)', dataIndex: 'maxLoadCapacity', key: 'maxLoadCapacity' },
    { title: 'Odometer (km)', dataIndex: 'odometer', key: 'odometer' },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (s) => <Tag color={STATUS_COLORS[s]}>{s?.replace('_', ' ')}</Tag>,
    },
    {
      title: 'Actions', key: 'actions',
      render: (_, record) => isFleetManager && (
        <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)}>Edit</Button>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
        <div>
          <div className="page-title">Vehicle Registry</div>
          <div className="page-subtitle">Manage your fleet's vehicles and their lifecycle status</div>
        </div>
        <Space>
          <Select
            placeholder="Filter by status"
            allowClear
            style={{ width: 180 }}
            value={statusFilter}
            onChange={setStatusFilter}
            options={['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED'].map((s) => ({ value: s, label: s.replace('_', ' ') }))}
          />
          {isFleetManager && (
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Register Vehicle</Button>
          )}
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={vehicles}
        loading={loading}
        bordered
        style={{ background: 'white', borderRadius: 12, overflow: 'hidden' }}
      />

      <Modal
        title={editing ? 'Edit Vehicle' : 'Register Vehicle'}
        open={modalOpen}
        onOk={onSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editing ? 'Save' : 'Register'}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="registrationNumber" label="Registration Number" rules={[{ required: true }]}>
            <Input placeholder="e.g. DL-01-AB-1234" />
          </Form.Item>
          <Form.Item name="nameModel" label="Name / Model" rules={[{ required: true }]}>
            <Input placeholder="e.g. Van-05" />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <AntSelect options={['truck', 'van', 'car', 'bike'].map((t) => ({ value: t, label: t }))} />
          </Form.Item>
          <Form.Item name="maxLoadCapacity" label="Max Load Capacity (kg)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="odometer" label="Odometer (km)">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="acquisitionCost" label="Acquisition Cost">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          {editing && (
            <Form.Item name="status" label="Status">
              <AntSelect
                disabled={editing.status === 'ON_TRIP' || editing.status === 'IN_SHOP'}
                options={['AVAILABLE', 'RETIRED'].map((s) => ({ value: s, label: s }))}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  )
}
