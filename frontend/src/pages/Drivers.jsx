import React, { useEffect, useState } from 'react'
import { Table, Button, Tag, Modal, Form, Input, InputNumber, Select, Space, message, DatePicker } from 'antd'
import { PlusOutlined, EditOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import axiosClient from '../api/axiosClient'
import { useAuth } from '../context/AuthContext.jsx'

const STATUS_COLORS = {
  AVAILABLE: 'green',
  ON_TRIP: 'blue',
  OFF_DUTY: 'default',
  SUSPENDED: 'red',
}

export default function Drivers() {
  const { isFleetManager, isSafetyOfficer } = useAuth()
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form] = Form.useForm()
  const [statusFilter, setStatusFilter] = useState(undefined)

  const load = async () => {
    setLoading(true)
    try {
      const params = statusFilter ? { status: statusFilter } : {}
      const { data } = await axiosClient.get('/api/drivers', { params })
      setDrivers(data)
    } catch {
      message.error('Failed to load drivers')
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
    form.setFieldsValue({ ...record, licenseExpiryDate: record.licenseExpiryDate ? dayjs(record.licenseExpiryDate) : null })
    setModalOpen(true)
  }

  const onSubmit = async () => {
    try {
      const values = await form.validateFields()
      const payload = { ...values, licenseExpiryDate: values.licenseExpiryDate?.format('YYYY-MM-DD') }
      if (editing) {
        await axiosClient.put(`/api/drivers/${editing.id}`, payload)
        message.success('Driver updated')
      } else {
        await axiosClient.post('/api/drivers', payload)
        message.success('Driver registered')
      }
      setModalOpen(false)
      load()
    } catch (err) {
      if (err?.errorFields) return
      message.error(err?.response?.data?.message || 'Save failed')
    }
  }

  const isExpired = (date) => date && dayjs(date).isBefore(dayjs(), 'day')

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'License No.', dataIndex: 'licenseNumber', key: 'licenseNumber' },
    { title: 'Category', dataIndex: 'licenseCategory', key: 'licenseCategory' },
    {
      title: 'License Expiry', dataIndex: 'licenseExpiryDate', key: 'licenseExpiryDate',
      render: (d) => d ? <span style={{ color: isExpired(d) ? '#e03131' : 'inherit' }}>{d}{isExpired(d) ? ' (expired)' : ''}</span> : '-',
    },
    { title: 'Contact', dataIndex: 'contactNumber', key: 'contactNumber' },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (s) => <Tag color={STATUS_COLORS[s]}>{s?.replace('_', ' ')}</Tag>,
    },
    {
      title: 'Actions', key: 'actions',
      render: (_, record) => (isFleetManager || isSafetyOfficer) && (
        <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)}>Edit</Button>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
        <div>
          <div className="page-title">Driver Management</div>
          <div className="page-subtitle">Track driver profiles, license validity, and duty status</div>
        </div>
        <Space>
          <Select
            placeholder="Filter by status"
            allowClear
            style={{ width: 180 }}
            value={statusFilter}
            onChange={setStatusFilter}
            options={['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED'].map((s) => ({ value: s, label: s.replace('_', ' ') }))}
          />
          {(isFleetManager || isSafetyOfficer) && (
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Register Driver</Button>
          )}
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={drivers}
        loading={loading}
        bordered
        style={{ background: 'white', borderRadius: 12, overflow: 'hidden' }}
      />

      <Modal
        title={editing ? 'Edit Driver' : 'Register Driver'}
        open={modalOpen}
        onOk={onSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editing ? 'Save' : 'Register'}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Alex Johnson" />
          </Form.Item>
          <Form.Item name="licenseNumber" label="License Number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="licenseCategory" label="License Category" rules={[{ required: true }]}>
            <Input placeholder="e.g. LMV, HMV" />
          </Form.Item>
          <Form.Item name="licenseExpiryDate" label="License Expiry Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="contactNumber" label="Contact Number">
            <Input />
          </Form.Item>
          <Form.Item name="safetyScore" label="Safety Score (optional)">
            <InputNumber style={{ width: '100%' }} min={0} max={100} />
          </Form.Item>
          {editing && (
            <Form.Item name="status" label="Status">
              <Select
                disabled={editing.status === 'ON_TRIP'}
                options={['AVAILABLE', 'OFF_DUTY', 'SUSPENDED'].map((s) => ({ value: s, label: s.replace('_', ' ') }))}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  )
}
