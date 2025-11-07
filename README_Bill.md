# 🛒 Retail Billing Software

A full-stack **Retail Billing System** built with **Spring Boot (Backend)** and **React (Frontend)**. This project simulates a real-world supermarket or retail store billing experience with product management, secure login, order tracking, and online payments.


## ✨ Features Implemented

- ✅ Category & Item Management (CRUD)
- ✅ User Login & Logout (Spring Security)
- ✅ Explore Items with Filters & Search
- ✅ Add to Cart & Place Orders
- ✅ Razorpay Payment Integration
- ✅ Order History & Dashboard
- ✅ Upload and Display Product Images
- ✅ Responsive UI with Bootstrap

---

## 🧑‍💻 Tech Stack

### 🚀 Backend:
- Java 17+
- Spring Boot
- Spring Security
- Spring Data JPA (Hibernate)
- MySQL / PostgreSQL
- Razorpay Payment Gateway
- Maven

### 💻 Frontend:
- React.js
- Axios
- React Router
- Bootstrap 5
- Toast Notifications

---

## 🗂️ Modules Breakdown

### 📦 Category Module
- Add/Edit/Delete Categories
- View categories in frontend
- APIs secured by Spring Security

### 🛍️ Item Module
- Manage products under each category
- Add product images
- Search, filter, and view in explore screen

### 🧾 Billing Module
- Add items to cart
- Calculate totals
- Checkout via Razorpay
- Save customer & order data

### 📊 Dashboard Module
- View orders placed
- Order history for each user
- Admin analytics/stats

---

## 🔐 Authentication

- Login & Logout functionality using **Spring Security**
- JWT or session-based login (depending on config)
- Role-based access control (admin/user)

---

## 💳 Payment Integration

- Razorpay integrated for secure payment handling
- Orders saved post successful transaction

---

## 🖼️ Image Handling

- Product images uploaded and stored **locally**
- Images displayed dynamically in the frontend

---

## 🚀 Getting Started

### Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run

cd frontend
npm install
npm start







