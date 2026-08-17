import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Alert,
  Checkbox,
  Select,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import truckLogo from "../assets/truck.svg";

import "./Login.css";

const { Title, Text } = Typography;
const { Option } = Select;

export default function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleRoleChange = (role) => {
    switch (role) {
      case "manager":
        form.setFieldsValue({
          email: "manager@transitops.com",
          password: "Password@123",
        });
        break;

      case "driver":
        form.setFieldsValue({
          email: "driver@transitops.com",
          password: "Password@123",
        });
        break;

      case "safety":
        form.setFieldsValue({
          email: "safety@transitops.com",
          password: "Password@123",
        });
        break;

      case "analyst":
        form.setFieldsValue({
          email: "analyst@transitops.com",
          password: "Password@123",
        });
        break;

      default:
        form.setFieldsValue({
          email: "",
          password: "",
        });
    }
  };

  const onFinish = async (values) => {
    setLoading(true);

    setError("");

    try {
      await login(values.email, values.password);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "Fleet Management",
    "Driver Assignment",
    "Route Planning",
    "Vehicle Maintenance",
    "Fuel & Expense Tracking",
    "Real-time Analytics",
  ];

  return (
    <div className="auth-container">
      {/* LEFT PANEL */}

      <motion.div
        className="left-panel"
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="left-content">
          <motion.div
            className="logo-box"
            animate={{ y: [0, -8, 0] }}
            transition={{
              repeat: Infinity,
              duration: 4,
            }}
          >
            <img src={truckLogo} alt="Truck" />
          </motion.div>

          <Title className="brand-title">TransitOps</Title>

          <Text className="brand-subtitle">
            Smart Transport Operations Platform
          </Text>

          <div className="divider"></div>

          <h3 className="feature-heading">
            One platform for every team
          </h3>

          <div className="feature-list">
            {features.map((feature, index) => (
              <motion.div
                className="feature-item"
                key={feature}
                initial={{
                  opacity: 0,
                  x: -30,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.4 + index * 0.12,
                }}
              >
                <FaCheck />

                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="copyright">
          © 2026 TransitOps. All rights reserved.
        </div>
      </motion.div>

      {/* RIGHT PANEL */}

      <div className="right-panel">
        <motion.div
          className="login-card"
          initial={{
            opacity: 0,
            y: 60,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <Title level={1} className="welcome-title">
            Welcome back 👋
          </Title>

          <Text className="welcome-text">
            Sign in to continue managing your transport operations.
          </Text>

          {error && (
            <Alert
              type="error"
              message={error}
              showIcon
              style={{
                marginTop: 25,
                marginBottom: 25,
              }}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Email is required",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="you@company.com"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Password is required",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                size="large"
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone />
                  ) : (
                    <EyeInvisibleOutlined />
                  )
                }
              />
            </Form.Item>

            <Form.Item
              label="Role"
              name="role"
              initialValue="manager"
            >
              <Select
                size="large"
                onChange={handleRoleChange}
              >
                <Option value="manager">
                  Fleet Manager
                </Option>

                <Option value="driver">
                  Driver
                </Option>

                <Option value="safety">
                  Safety Officer
                </Option>

                <Option value="analyst">
                  Operations Analyst
                </Option>

                <Option value="custom">
                  Custom Login
                </Option>
              </Select>
            </Form.Item>

            <div className="login-options">
              <Checkbox>Remember me</Checkbox>

              <a href="/">Forgot password?</a>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className="login-btn"
            >
              Sign In
            </Button>
          </Form>

          <div className="signup-section">
            <Text type="secondary">
              Don't have an account?
            </Text>

            <Link to="/signup">Create Account</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}