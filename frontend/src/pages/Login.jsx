import React, { useState } from 'react'
import { Form, Input, Button, Typography, Alert, Radio } from 'antd'
import { MailOutlined, LockOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const { Title, Text } = Typography

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onFinish = async (values) => {
    setError('')
    setLoading(true)
    try {
      await login(values.email, values.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleSelect = (e) => {
    const role = e.target.value
    if (role === 'manager') {
      form.setFieldsValue({ email: 'manager@transitops.com', password: 'Password@123' })
    } else if (role === 'driver') {
      form.setFieldsValue({ email: 'driver@transitops.com', password: 'Password@123' })
    } else if (role === 'safety') {
      form.setFieldsValue({ email: 'safety@transitops.com', password: 'Password@123' })
    } else if (role === 'analyst') {
      form.setFieldsValue({ email: 'analyst@transitops.com', password: 'Password@123' })
    } else {
      form.setFieldsValue({ email: '', password: '' })
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 36 }}>🚚</div>
          <Title level={3} style={{ margin: 0, color: '#1a2a63' }}>TransitOps</Title>
          <Text type="secondary">Smart Transport Operations Platform</Text>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <Radio.Group onChange={handleRoleSelect} defaultValue="custom" buttonStyle="solid" style={{ width: '100%', textAlign: 'center' }}>
            <Radio.Button value="manager" style={{ width: '20%', fontSize: 11, padding: '0 2px' }}>Manager</Radio.Button>
            <Radio.Button value="driver" style={{ width: '20%', fontSize: 11, padding: '0 2px' }}>Driver</Radio.Button>
            <Radio.Button value="safety" style={{ width: '20%', fontSize: 11, padding: '0 2px' }}>Safety</Radio.Button>
            <Radio.Button value="analyst" style={{ width: '20%', fontSize: 11, padding: '0 2px' }}>Analyst</Radio.Button>
            <Radio.Button value="custom" style={{ width: '20%', fontSize: 11, padding: '0 2px' }}>Custom</Radio.Button>
          </Radio.Group>
        </div>

        {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}

        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Email is required' }]}>
            <Input prefix={<MailOutlined />} placeholder="you@company.com" size="large" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Password is required' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            Log In
          </Button>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text type="secondary">No account? <Link to="/signup">Sign up</Link></Text>
        </div>
      </div>
    </div>
  )
}
