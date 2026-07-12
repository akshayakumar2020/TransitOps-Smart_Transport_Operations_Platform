import React, { useEffect, useState } from 'react'
import { Table, Button, Tag, Modal, Form, Input, InputNumber, Select, Space, message, Popconfirm } from 'antd'
import { PlusOutlined, RocketOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import axiosClient from '../api/axiosClient'
import { useAuth } from '../context/AuthContext.jsx'

const STATUS_COLORS = {
  DRAFT: 'default',
  DISPATCHED: 'blue',
  COMPLETED: 'green',
  CANCELLED: 'red',
}

export default function Trips() {
  const { isFleetManager } = useAuth()
  const [trips, setTrips] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [completeModal, setCompleteModal] = useState(null)
  const [form] = Form.useForm()
  const [completeForm] = Form.useForm()
  const [statusFilter, setStatusFilter] = useState(undefined)

  const loadTrips = async () => {
    setLoading(true)
    try {
      const params = statusFilter ? { status: statusFilter } : {}
      const { data } = await axiosClient.get('/api/trips', { params })
      setTrips(data)
    } catch {
      message.error('Failed to load trips')
    } finally {
      setLoading(false)
    }
  }

  const loadDropdownData = async () => {
    const [v, d] = await Promise.all([
      axiosClient.get('/api/vehicles', { params: { status: 'AVAILABLE' } }),
      axiosClient.get('/api/drivers', { params: { status: 'AVAILABLE' } }),
    ])
    setVehicles(v.data)
    setDrivers(d.data.filter((dr) => !dr.licenseExpiryDate || new Date(dr.licenseExpiryDate) >= new Date()))
  }

  useEffect(() => { loadTrips() }, [statusFilter])

  const openCreate = async () => {
    form.resetFields()
    await loadDropdownData()
    setModalOpen(true)
  }

  const onCreate = async () => {
    try {
      const values = await form.validateFields()
      await axiosClient.post('/api/trips', values)
      message.success('Trip created as DRAFT')
      setModalOpen(false)
      loadTrips()
    } catch (err) {
      if (err?.errorFields) return
      message.error(err?.response?.data?.message || 'Failed to create trip')
    }
  }

  const dispatchTrip = async (id) => {
    try {
      await axiosClient.put(`/api/trips/${id}/dispatch`)
      message.success('Trip dispatched')
      loadTrips()
    } catch (err) {
      message.error(err?.response?.data?.message || 'Dispatch failed')
    }
  }

  const cancelTrip = async (id) => {
    try {
      await axiosClient.put(`/api/trips/${id}/cancel`)
      message.success('Trip cancelled')
      loadTrips()
    } catch (err) {
      message.error(err?.response?.data?.message || 'Cancel failed')
    }
  }

  const openComplete = (record) => {
    completeForm.resetFields()
    completeForm.setFieldsValue({ finalOdometer: record.vehicle?.odometer })
    setCompleteModal(record)
  }

  const onComplete = async () => {
    try {
      const values = await completeForm.validateFields()
      await axiosClient.put(`/api/trips/${completeModal.id}/complete`, values)
      message.success('Trip completed')
      setCompleteModal(null)
      loadTrips()
    } catch (err) {
      if (err?.errorFields) return
      message.error(err?.response?.data?.message || 'Complete failed')
    }
  }

  const columns = [
    { title: 'Route', key: 'route', render: (_, r) => `${r.source} → ${r.destination}` },
    { title: 'Vehicle', key: 'vehicle', render: (_, r) => r.vehicle ? `${r.vehicle.nameModel} (${r.vehicle.registrationNumber})` : '-' },
    { title: 'Driver', key: 'driver', render: (_, r) => r.driver?.name || '-' },
    { title: 'Cargo (kg)', dataIndex: 'cargoWeight', key: 'cargoWeight' },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (s) => <Tag color={STATUS_COLORS[s]}>{s}</Tag>,
    },
    {
      title: 'Actions', key: 'actions',
      render: (_, record) => (
        <Space>
          {record.status === 'DRAFT' && isFleetManager && (
            <Button size="small" type="primary" icon={<RocketOutlined />} onClick={() => dispatchTrip(record.id)}>Dispatch</Button>
          )}
          {record.status === 'DISPATCHED' && (
            <>
              <Button size="small" type="primary" ghost icon={<CheckCircleOutlined />} onClick={() => openComplete(record)}>Complete</Button>
              {isFleetManager && (
                <Popconfirm title="Cancel this trip?" onConfirm={() => cancelTrip(record.id)}>
                  <Button size="small" danger icon={<CloseCircleOutlined />}>Cancel</Button>
                </Popconfirm>
              )}
            </>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
        <div>
          <div className="page-title">Trip Management</div>
          <div className="page-subtitle">Create, dispatch, complete, and cancel trips</div>
        </div>
        <Space>
          <Select
            placeholder="Filter by status"
            allowClear
            style={{ width: 180 }}
            value={statusFilter}
            onChange={setStatusFilter}
            options={['DRAFT', 'DISPATCHED', 'COMPLETED', 'CANCELLED'].map((s) => ({ value: s, label: s }))}
          />
          {isFleetManager && (
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>New Trip</Button>
          )}
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={trips}
        loading={loading}
        bordered
        style={{ background: 'white', borderRadius: 12, overflow: 'hidden' }}
      />

      <Modal title="Create Trip (Draft)" open={modalOpen} onOk={onCreate} onCancel={() => setModalOpen(false)} okText="Create">
        <Form form={form} layout="vertical">
          <Form.Item name="source" label="Source" rules={[{ required: true }]}>
            <Input placeholder="e.g. Warehouse A" />
          </Form.Item>
          <Form.Item name="destination" label="Destination" rules={[{ required: true }]}>
            <Input placeholder="e.g. Client Site B" />
          </Form.Item>
          <Form.Item name="vehicleId" label="Vehicle (available only)" rules={[{ required: true }]}>
            <Select
              placeholder="Select vehicle"
              options={vehicles.map((v) => ({ value: v.id, label: `${v.nameModel} — ${v.registrationNumber} (max ${v.maxLoadCapacity}kg)` }))}
              notFoundContent="No available vehicles"
            />
          </Form.Item>
          <Form.Item name="driverId" label="Driver (available, valid license)" rules={[{ required: true }]}>
            <Select
              placeholder="Select driver"
              options={drivers.map((d) => ({ value: d.id, label: `${d.name} (lic. exp. ${d.licenseExpiryDate})` }))}
              notFoundContent="No eligible drivers"
            />
          </Form.Item>
          <Form.Item name="cargoWeight" label="Cargo Weight (kg)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="plannedDistance" label="Planned Distance (km)">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Complete Trip" open={!!completeModal} onOk={onComplete} onCancel={() => setCompleteModal(null)} okText="Complete">
        <Form form={completeForm} layout="vertical">
          <Form.Item name="finalOdometer" label="Final Odometer (km)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="fuelConsumed" label="Fuel Consumed (L)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
