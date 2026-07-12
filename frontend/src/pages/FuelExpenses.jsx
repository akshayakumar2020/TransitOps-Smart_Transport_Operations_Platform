import React, { useEffect, useState } from 'react'
import { Table, Button, Tabs, Modal, Form, InputNumber, Select, Input, DatePicker, message, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import axiosClient from '../api/axiosClient'

export default function FuelExpenses() {
  const [fuelLogs, setFuelLogs] = useState([])
  const [expenses, setExpenses] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [fuelModalOpen, setFuelModalOpen] = useState(false)
  const [expenseModalOpen, setExpenseModalOpen] = useState(false)
  const [fuelForm] = Form.useForm()
  const [expenseForm] = Form.useForm()

  const loadAll = async () => {
    setLoading(true)
    try {
      const [f, e, v] = await Promise.all([
        axiosClient.get('/api/fuel-logs'),
        axiosClient.get('/api/expenses'),
        axiosClient.get('/api/vehicles'),
      ])
      setFuelLogs(f.data)
      setExpenses(e.data)
      setVehicles(v.data)
    } catch {
      message.error('Failed to load fuel & expense data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAll() }, [])

  const openFuelModal = () => { fuelForm.resetFields(); fuelForm.setFieldsValue({ date: dayjs() }); setFuelModalOpen(true) }
  const openExpenseModal = () => { expenseForm.resetFields(); expenseForm.setFieldsValue({ date: dayjs() }); setExpenseModalOpen(true) }

  const onFuelSubmit = async () => {
    try {
      const values = await fuelForm.validateFields()
      await axiosClient.post('/api/fuel-logs', { ...values, date: values.date.format('YYYY-MM-DD') })
      message.success('Fuel log recorded')
      setFuelModalOpen(false)
      loadAll()
    } catch (err) {
      if (err?.errorFields) return
      message.error(err?.response?.data?.message || 'Failed to save fuel log')
    }
  }

  const onExpenseSubmit = async () => {
    try {
      const values = await expenseForm.validateFields()
      await axiosClient.post('/api/expenses', { ...values, date: values.date.format('YYYY-MM-DD') })
      message.success('Expense recorded')
      setExpenseModalOpen(false)
      loadAll()
    } catch (err) {
      if (err?.errorFields) return
      message.error(err?.response?.data?.message || 'Failed to save expense')
    }
  }

  const vehicleLabel = (v) => v ? `${v.nameModel} (${v.registrationNumber})` : '-'

  const fuelColumns = [
    { title: 'Vehicle', key: 'vehicle', render: (_, r) => vehicleLabel(r.vehicle) },
    { title: 'Liters', dataIndex: 'liters', key: 'liters' },
    { title: 'Cost', dataIndex: 'cost', key: 'cost', render: (c) => `$${c?.toFixed(2)}` },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ]

  const expenseColumns = [
    { title: 'Vehicle', key: 'vehicle', render: (_, r) => vehicleLabel(r.vehicle) },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (a) => `$${a?.toFixed(2)}` },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ]

  return (
    <div>
      <div className="page-title">Fuel & Expense Tracking</div>
      <div className="page-subtitle">Log fuel purchases and miscellaneous expenses per vehicle</div>

      <Tabs
        defaultActiveKey="fuel"
        items={[
          {
            key: 'fuel',
            label: 'Fuel Logs',
            children: (
              <>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={openFuelModal}>Add Fuel Log</Button>
                </div>
                <Table rowKey="id" columns={fuelColumns} dataSource={fuelLogs} loading={loading} bordered
                  style={{ background: 'white', borderRadius: 12, overflow: 'hidden' }} />
              </>
            ),
          },
          {
            key: 'expenses',
            label: 'Expenses',
            children: (
              <>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={openExpenseModal}>Add Expense</Button>
                </div>
                <Table rowKey="id" columns={expenseColumns} dataSource={expenses} loading={loading} bordered
                  style={{ background: 'white', borderRadius: 12, overflow: 'hidden' }} />
              </>
            ),
          },
        ]}
      />

      <Modal title="Record Fuel Log" open={fuelModalOpen} onOk={onFuelSubmit} onCancel={() => setFuelModalOpen(false)} okText="Save">
        <Form form={fuelForm} layout="vertical">
          <Form.Item name="vehicleId" label="Vehicle" rules={[{ required: true }]}>
            <Select options={vehicles.map((v) => ({ value: v.id, label: vehicleLabel(v) }))} />
          </Form.Item>
          <Form.Item name="liters" label="Liters" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="cost" label="Cost" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Record Expense" open={expenseModalOpen} onOk={onExpenseSubmit} onCancel={() => setExpenseModalOpen(false)} okText="Save">
        <Form form={expenseForm} layout="vertical">
          <Form.Item name="vehicleId" label="Vehicle" rules={[{ required: true }]}>
            <Select options={vehicles.map((v) => ({ value: v.id, label: vehicleLabel(v) }))} />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select options={['toll', 'repair', 'other'].map((t) => ({ value: t, label: t }))} />
          </Form.Item>
          <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
