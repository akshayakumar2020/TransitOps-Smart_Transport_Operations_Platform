import React, { useState } from 'react'
import { Form, Input, Button, Typography, Alert, Select } from 'antd'
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const { Title, Text } = Typography

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onFinish = async (values) => {
    setError('')
    setLoading(true)
    try {
      await signup(values)
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 36 }}>🚚</div>
          <Title level={3} style={{ margin: 0, color: '#1a2a63' }}>Create your account</Title>
          <Text type="secondary">Join TransitOps</Text>
        </div>

        {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}

        <Form layout="vertical" onFinish={onFinish} requiredMark={false} initialValues={{ role: 'DRIVER' }}>
          <Form.Item name="name" label="Full name" rules={[{ required: true, message: 'Name is required' }]}>
            <Input prefix={<UserOutlined />} placeholder="Alex Johnson" size="large" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Email is required' }]}>
            <Input prefix={<MailOutlined />} placeholder="you@company.com" size="large" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, min: 6, message: 'At least 6 characters' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select
              size="large"
              options={[
                { value: 'FLEET_MANAGER', label: 'Fleet Manager (full access)' },
                { value: 'DRIVER', label: 'Driver (trips only)' },
                { value: 'SAFETY_OFFICER', label: 'Safety Officer (compliance & scores)' },
                { value: 'FINANCIAL_ANALYST', label: 'Financial Analyst (expenses & reports)' },
              ]}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            Sign Up
          </Button>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text type="secondary">Already have an account? <Link to="/login">Log in</Link></Text>
        </div>
      </div>
    </div>
  )
}
