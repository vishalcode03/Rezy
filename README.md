# 🍽️ Rezy – Table Reservation & Food Ordering System

Rezy is a modern web-based application designed to simplify **restaurant table reservations and online food ordering**.  
It helps customers book tables in advance, order food seamlessly, and allows restaurants to manage reservations, menus, and orders efficiently.

---

## 🚀 Features

### 👨‍🍳 Customer Features
- User registration & login
- Browse restaurant menu
- Reserve table with date & time
- Place food orders online
- View order & reservation status

### 🏪 Restaurant/Admin Features
- Manage table availability
- Add / update food items
- Accept or reject reservations
- Track customer orders
- Order & reservation management dashboard

---

## 🛠️ Tech Stack

**Frontend**
- HTML5
- CSS3
- JavaScript
- React.js

**Backend**
- Node.js
- Express.js  


**Database**
- MongoDB / MySQL

**Tools**
- Git & GitHub
- REST APIs
- Postman

---

## 🧩 System Modules

- Authentication Module
- Table Reservation Module
- Food Ordering Module
- Order Management Module
- Admin Dashboard

---

## 📊 Database Tables (Sample)

### Users
- user_id
- name
- email
- password
- role

### Tables
- table_id
- capacity
- availability_status

### Reservations
- reservation_id
- user_id
- table_id
- date
- time
- status

### Food Items
- food_id
- name
- price
- category

### Orders
- order_id
- user_id
- total_amount
- order_status

---

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/rezy.git

# Navigate to project folder
cd rezy

# Install dependencies
npm install

# Start the server
npm start
