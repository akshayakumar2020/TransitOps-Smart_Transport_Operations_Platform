# 🚛 TransitOps Pro

> **Smart Transport Operations Platform**

TransitOps Pro is a modern Fleet & Transport Management System developed using **Spring Boot**, **React**, and **PostgreSQL**. The platform helps logistics organizations efficiently manage vehicles, drivers, trips, maintenance, fuel consumption, operational expenses, and reports through a centralized dashboard.

---

## 📂 Project Resources

All supporting files are available on Google Drive.

🔗 https://drive.google.com/file/d/1ViMPfBT9o1kq0OvLF_F6Buk_7QELSbMP/view?usp=drivesdk

---



## 📌 About the Project

TransitOps Pro digitizes daily transport operations by replacing manual spreadsheets with a secure and scalable web application.

The platform enables organizations to:

- Manage vehicles and drivers
- Schedule and monitor trips
- Track fuel consumption and expenses
- Record vehicle maintenance
- Generate operational reports
- Monitor fleet performance through dashboards

---

## ✨ Features

### Authentication
- Secure Login
- JWT Authentication
- Role-Based Access Control (RBAC)

### Dashboard
- Fleet Overview
- Active Trips
- Available Vehicles
- Drivers On Duty
- Fleet Utilization
- Operational Statistics

### Vehicle Management
- Register Vehicles
- Vehicle Status Tracking
- Vehicle Capacity Management
- Vehicle Availability

### Driver Management
- Register Drivers
- License Validation
- Driver Availability
- Contact Management

### Trip Management
- Create Trips
- Assign Drivers
- Assign Vehicles
- Dispatch Trips
- Complete Trips

### Maintenance
- Maintenance Records
- Vehicle Service History
- Maintenance Cost Tracking

### Fuel & Expense Management
- Fuel Logs
- Expense Tracking
- Operational Cost Analysis

### Reports
- Fleet Reports
- Driver Reports
- Fuel Reports
- Maintenance Reports

---

## 🏗️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend

- Java 21
- Spring Boot 3
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate
- Maven

### Database

- PostgreSQL

### Tools

- IntelliJ IDEA
- VS Code
- Swagger UI
- Postman
- Git & GitHub

---

## 📂 Project Structure

```
TransitOps-Pro
│
├── backend/
│
├── frontend/
│
├── database/
│
├── docs/
│
├── postman/
│
├── README.md
│
└── .gitignore
```

---

## 👥 User Roles

- Administrator
- Fleet Manager
- Driver
- Safety Officer
- Financial Analyst

---

## 🔄 Workflow

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

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/akshayakumar2020/TransitOps-Smart_Transport_Operations_Platform
```

---

### Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend URL

```
http://localhost:8081
```

Swagger UI

```
http://localhost:8081/swagger-ui/index.html
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL

```
http://localhost:5173
```

Login

```
http://localhost:5173/login
```

---

## 🗄️ Database

| Property | Value |
|----------|-------|
| Database | PostgreSQL |
| Port | 5432 |
| ORM | Hibernate |
| Migration | Spring Data JPA |

---

## 📅 Development Status

| Module | Status |
|---------|--------|
| Authentication | ✅ Completed |
| Dashboard | ✅ Completed |
| Vehicle Management | ✅ Completed |
| Driver Management | ✅ Completed |
| Trip Management | ✅ Completed |
| Maintenance | ✅ Completed |
| Fuel & Expenses | ✅ Completed |
| Reports | ✅ Completed |

---

## 🚀 Future Improvements

- Live Vehicle Tracking
- QR Code Vehicle Identification
- Driver Performance Analytics
- Predictive Maintenance
- Email Notifications
- Fleet Health Dashboard
- AI-Based Route Optimization

---

## 👨‍💻 Contributors

- Akshaya Kumar(Team Leader)
- Aditya Srivastava
- Aditya chauhan
- Akanksha Devi

---

## 📄 License

This project is licensed under the **MIT License**.
