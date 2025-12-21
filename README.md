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

ঠিক আছে 👍
নিচে **Auth API**, **Order API**, এবং **Site Setting API**–এর জন্য **pure `README.md` markdown code** দিলাম।
👉 এগুলো তুমি আগের `README.md`-এর মধ্যে **copy–paste করে add** করলেই হবে।

---

## 🔐 Auth API (`/auth`)

### 🔑 Login

**POST** `/auth/login`

```json
{
  "email": "user@gmail.com",
  "password": "123456"
}
```

**Response (example):**

```json
{
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "user": {
    "email": "user@gmail.com",
    "role": "customer"
  }
}
```

---

### ♻️ Refresh Token

**POST** `/auth/refresh-token`

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:**

```json
{
  "accessToken": "new_access_token"
}
```

---

## 📦 Order API (`/orders`)

### ➕ Create Order

**POST** `/orders`

```json
{
  "email": "user@gmail.com",
  "subtotal": 1000,
  "couponCode": "DISCOUNT20",
  "discountPercent": 20,
  "totalAmount": 800,
  "items": [
    {
      "productId": "64fabc12345",
      "price": 500,
      "quantity": 2
    }
  ]
}
```

✔ Coupon validation
✔ Subtotal & total verification
✔ Product existence check
✔ Auto invoice generation

---

### 📄 Get All Orders (Admin / Manager)

**GET** `/orders/all`

#### Query Parameters

* `search` → invoiceId
* `email`
* `page`
* `limit`
* `sortBy`
* `order` (asc | desc)

---

### 👤 Get Orders by User Email

**GET** `/orders/:email`

**Response:**

```json
{
  "totalOrders": 2,
  "orders": []
}
```

---

### ❌ Delete Order

**DELETE** `/orders/delete/:id`

---

## ⚙️ Site Setting API (`/site-setting`)

### ✏️ Update Site Settings

**PATCH** `/site-setting`

* Content-Type: `multipart/form-data`
* Image Fields:

  * `image1`
  * `image2`
  * `image3`
  * `image4`

```json
{
  "siteName": "Makeover Beauty",
  "logoText": "Beauty Store",
  "contactEmail": "support@beauty.com"
}
```

✔ Supports image upload
✔ JSON parsed from `data` field

---

### 📄 Get Site Settings

**GET** `/site-setting`

**Response:**

```json
{
  "siteName": "Makeover Beauty",
  "logo": "https://cloudinary.com/..."
}
```

---

## 🔒 Security Notes

* JWT based authentication
* Refresh token supported
* Role-based access control
* Server-side validation for:

  * Coupon
  * Price
  * User
  * Product

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
Full Stack Developer


✅ Ready for production & deployment 🚀
