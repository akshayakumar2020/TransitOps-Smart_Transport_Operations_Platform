# 🚛 TransitOps Pro - Smart Transport Operations Platform

> A modern, enterprise-grade Fleet & Transport Management System built using **Spring Boot**, **React**, and **PostgreSQL** to digitize logistics operations through intelligent fleet monitoring, trip management, maintenance tracking, fuel management, and real-time analytics.

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-brightgreen)
![React](https://img.shields.io/badge/React-19-61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)
![License](https://img.shields.io/badge/License-MIT-green)

---

# 📖 Overview

TransitOps Pro is an enterprise transport operations platform that helps logistics organizations efficiently manage their fleet, drivers, trips, maintenance schedules, fuel consumption, operational expenses, and reports from a centralized dashboard.

The system replaces spreadsheets and manual processes with a secure, scalable, and role-based ERP solution.

---

# 🎯 Problem Statement

Many logistics companies still rely on manual spreadsheets and paper records to manage transportation operations.

This results in:

- Vehicle scheduling conflicts
- Driver allocation issues
- Missed maintenance
- Fuel misuse
- Poor operational visibility
- High operational costs

TransitOps Pro solves these challenges by providing a centralized transport management platform with automated business validations and real-time analytics.

---

# ✨ Features

## 🔐 Authentication

- Secure Login
- JWT Authentication
- Role Based Access Control (RBAC)
- Session Management

---

## 🚛 Vehicle Management

- Vehicle Registration
- Vehicle Availability
- Vehicle Status
- Vehicle Details
- Capacity Management

---

## 👨 Driver Management

- Driver Registration
- License Management
- Driver Status
- Contact Details
- License Expiry Tracking

---

## 🚚 Trip Management

- Create Trip
- Assign Driver
- Assign Vehicle
- Dispatch Trip
- Complete Trip
- Trip Status

---

## 🔧 Maintenance

- Maintenance Records
- Open / Close Maintenance
- Vehicle Status Update
- Maintenance Cost Tracking

---

## ⛽ Fuel & Expense Management

- Fuel Logs
- Expense Tracking
- Operational Cost
- Fuel Consumption

---

## 📊 Dashboard

- Active Vehicles
- Available Vehicles
- Active Trips
- Pending Trips
- Drivers On Duty
- Fleet Utilization

---

## 📈 Reports

- Fuel Report
- Vehicle Report
- Driver Report
- Maintenance Report
- Expense Report

---

# 🖼️ Application Screenshots

## 🔐 Login

![Login](docs/screenshots/login.png)

---

## 📊 Dashboard

![Dashboard](docs/screenshots/dashboard.png)

---

## 👨 Driver Management

![Drivers](docs/screenshots/drivers.png)

---

## 🔧 Maintenance

![Maintenance](docs/screenshots/maintenance.png)

---

## ⛽ Fuel & Expense Management

![Fuel](docs/screenshots/fuel-expense.png)

---

# 🏗️ Project Structure

```
TransitOps-Pro
│
├── backend
│
├── frontend
│
├── docs
│   └── screenshots
│
├── database
│
├── postman
│
├── README.md
│
└── .gitignore
```

---

# 🛠️ Technology Stack

## Frontend

- React 19
- Vite
- Tailwind CSS
- Axios
- React Router

---

## Backend

- Java 21
- Spring Boot 3
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate
- Maven

---

## Database

- PostgreSQL

---

## Tools

- IntelliJ IDEA
- VS Code
- Git
- GitHub
- Swagger UI
- Postman

---

# 👥 User Roles

- Fleet Manager
- Driver
- Safety Officer
- Financial Analyst
- Administrator

---

# 🔄 System Workflow

```
Login
   │
   ▼
Dashboard
   │
   ├── Vehicle Management
   ├── Driver Management
   ├── Trip Management
   ├── Maintenance
   ├── Fuel & Expenses
   └── Reports
```

---

# 🚀 Running the Project

## Backend

Navigate to backend

```bash
cd backend
```

Run Spring Boot

```bash
mvn spring-boot:run
```

Backend runs on

```
http://localhost:8081
```

Swagger

```
http://localhost:8081/swagger-ui/index.html
```

---

## Frontend

Navigate to frontend

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run

```bash
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

Login Page

```
http://localhost:5173/login
```

---

# 🗄️ Database

Database

```
PostgreSQL
```

Default Port

```
5432
```

---

# 🚀 Future Enhancements

- Live GPS Tracking
- QR Code Vehicle Management
- Driver Performance Score
- Predictive Maintenance
- Email Notifications
- Mobile Application
- Fleet Health Dashboard
- AI Route Optimization

---

# 👨‍💻 Contributors
- Akshaya Kumar(Team Leader)
- Akanksha Devi
- Aditya Srivasatava
 -Aditya chauhan


---

# 📜 License

Licensed under the MIT License.

---

⭐ If you like this project, don't forget to give it a star.
