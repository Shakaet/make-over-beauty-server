# 🛒 Blooming Beauty Backend API Documentation

This is a **Node.js + Express + MongoDB** based backend API for an e-commerce / beauty product platform. It supports authentication, users, products, categories, brands, cart, orders, coupons, site settings, and role-based access.

---

## 🚀 Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB + Mongoose**
* **JWT Authentication**
* **Multer** (file upload)
* **Cloudinary** (image hosting)
* **Cookie Parser**
* **CORS**

---

## 🌐 Base URL

```
http://localhost:5000/api
```

---

## 🔐 Authentication

Some routes are protected and require authentication middleware.

---

## 👤 User Routes (`/users`)

### ➕ Create User

**POST** `/users`

```json
{
  "name": "John Doe",
  "email": "john@gmail.com",
  "role": "customer"
}
```

---

### 📄 Get All Users

**GET** `/users`

---

### 👤 Check Role

* **Customer** → `GET /users/getCustomer/:email`
* **Admin** → `GET /users/getadmin/:email`
* **Manager** → `GET /users/getmanager/:email`

---

### 🧑‍💼 Manager Access Control

* **Update Manager Access**

  * `PATCH /users/update-manager-access/:id`

* **Get Manager Access**

  * `GET /users/manager/access/:email`

---

## 📦 Product Routes (`/products`)

### ➕ Create Product

**POST** `/products/create-product`

* multipart/form-data
* Images:

  * `imagePrimary`
  * `imageSecondary`
  * `imageThird`
  * `imageFourth`

---

### 📄 Get All Products

**GET** `/products/all-products`

Query params:

* `search`
* `category`
* `tag`
* `minPrice`
* `maxPrice`
* `page`
* `limit`
* `sortBy`
* `order`

---

### 📦 Get Single Product

**GET** `/products/product/:id`

---

### ✏️ Update Product

**PATCH** `/products/update-product/:id`

---

### ❌ Delete Product

**DELETE** `/products/delete-product/:id`

---

## 🏷️ Category Routes (`/category`)

### ➕ Create Category

**POST** `/category`

```json
{
  "categoryName": "Makeup",
  "subCategories": ["Lipstick", "Foundation"]
}
```

---

### 📄 Get Categories

**GET** `/category`

---

### ✏️ Update Category

**PUT** `/category/:id`

---

### ❌ Delete Category

**DELETE** `/category/:id`

---

## 🏢 Brand Routes (`/brand`)

### ➕ Create Brand

**POST** `/brand`

```json
{
  "brandName": "Loreal"
}
```

---

### 📄 Get Brands

**GET** `/brand`

---

### ✏️ Update Brand

**PUT** `/brand/:id`

---

### ❌ Delete Brand

**DELETE** `/brand/:id`

---

## 🛒 Add To Cart Routes (`/addTocart`)

### ➕ Add Product to Cart

**POST** `/addTocart/:productId`

```json
{
  "userEmail": "user@gmail.com",
  "quantity": 2
}
```

✔ Stock auto-updated using MongoDB transaction

---

### 📄 Get All Cart Items

**GET** `/addTocart`

---

### 👤 Get User Cart

**GET** `/addTocart/:userEmail`

---

## 🎟️ Coupon Routes (`/coupons`)

### ✅ Validate Coupon

**POST** `/coupons/validate`

```json
{
  "code": "DISCOUNT20"
}
```

---

### ➕ Create Coupon

**POST** `/coupons/create`

```json
{
  "code": "DISCOUNT20",
  "discountPercentage": 20,
  "expiresAt": "2025-12-31",
  "isActive": true
}
```

---

## 📦 Order Routes (`/orders`)

> Handles order creation, listing, and management

---

## 🔐 Auth Routes (`/auth`)

> Login, JWT, cookie-based authentication

---

## ⚙️ Site Settings (`/site-setting`)

> Website configuration & settings APIs

---

## ❌ Error Handling

* **404 Middleware**
* **Global Error Handler**

---

## 📂 Project Structure

```
src/
 ├── modules/
 ├── middleware/
 ├── routes/
 ├── utils/
 └── app.js
```

---

## 🧑‍💻 Author

**Abdulla Al Shakaet**
MERN Stack Developer
📍 Chittagong, Bangladesh

---

## ⭐ Notes

* Uses **MongoDB Transactions** for cart & stock safety
* Supports **role-based access control**
* Image upload handled via **Cloudinary**

---

✅ Ready for production & deployment 🚀
