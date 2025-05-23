# Digital Banking Application

A comprehensive full-stack digital banking application with secure authentication, role-based access control, and banking operations management.

## 🚀 Features

- **Authentication & Authorization**: JWT-based secure authentication with role-based access control
- **Customer Management**: Create, read, update, and delete customer profiles
- **Account Management**: Manage current and savings accounts
- **Operations**: Handle deposits, withdrawals, and transfers between accounts
- **Dashboard**: Data visualization with charts and analytics
- **Responsive UI**: Modern interface that works on desktop and mobile devices

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3
- **Security**: Spring Security with JWT
- **Database**: MySQL/H2
- **Build Tool**: Maven
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: Angular 17
- **UI Components**: Bootstrap 5
- **Charts**: Chart.js
- **HTTP Client**: Angular HTTP Client with Interceptors
- **Form Validation**: Angular Reactive Forms

## 📋 Prerequisites

- Java 17+
- Node.js 18+
- Angular CLI
- Maven
- MySQL (optional, can use H2 in-memory database)

## 🔧 Installation & Setup

### Backend

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/digital-banking.git
   cd digital-banking/backend
   ```

2. Configure the database in `application.properties`

3. Run the application
   ```bash
   mvn spring-boot:run
   ```

The backend will start on http://localhost:8085

### Frontend

1. Navigate to the frontend directory
   ```bash
   cd ../frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the development server
   ```bash
   ng serve
   ```

The frontend will be available at http://localhost:4200

## 🔐 Authentication

The application uses JWT for authentication:
- Default admin user: admin@gmail.com / 1234
- Default regular user: user@gmail.com / 1234

## 📱 Application Structure

### Backend
- **Controllers**: REST API endpoints
- **Services**: Business logic
- **Repositories**: Data access
- **Models**: Entity definitions
- **Security**: JWT configuration and filters

### Frontend
- **Components**: UI building blocks
- **Services**: API communication
- **Guards**: Route protection
- **Interceptors**: HTTP request/response handling
- **Models**: Data structures

## 🌟 Key Features

### Role-Based Access
- **Admins**: Full access to customer management, account operations, and system settings
- **Users**: Limited access to personal dashboard and profile

### Data Visualization
- Account balances and transaction history
- Operation trends and statistics

### Security Features
- JWT token authentication
- Password encryption
- Role-based authorization
- Protected API endpoints

## 📜 API Documentation

The API documentation is available at http://localhost:8085/swagger-ui.html when the backend is running.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
