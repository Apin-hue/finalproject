# API DOCUMENTATION
## Diadoek Restaurant Management System

Complete API reference dengan contoh request dan response.

---

## 📌 Base URL

```
http://localhost:3000/api
```

## 🔐 Authentication

Saat ini, API tidak memerlukan authentication. Untuk production, implementasikan JWT atau OAuth.

---

## 🏥 Health Check

### Health Status
**Endpoint:**
```
GET /health
```

**Response (200):**
```json
{
  "success": true,
  "message": "Diadoek Restaurant System API is running",
  "timestamp": "2024-04-24T10:30:00.000Z"
}
```

---

## 👥 CUSTOMER ENDPOINTS

### 1. Create Customer
**Endpoint:**
```
POST /customers
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "08123456789",
  "address": "Jl. Sudirman, Jakarta"
}
```

**Validations:**
- `name` (required): Non-empty string
- `email` (optional): Valid email format
- `phone` (optional): 10-15 digits
- `address` (optional): String

**Response (201):**
```json
{
  "success": true,
  "message": "Customer created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "08123456789",
    "address": "Jl. Sudirman, Jakarta"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Invalid email format"
}
```

---

### 2. Get All Customers
**Endpoint:**
```
GET /customers
```

**Query Parameters:** None

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "08123456789",
      "address": "Jl. Sudirman",
      "created_at": "2024-04-24T10:00:00.000Z",
      "updated_at": "2024-04-24T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### 3. Get Customer by ID
**Endpoint:**
```
GET /customers/:id
```

**Parameters:**
- `id` (required): Customer ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "08123456789",
    "address": "Jl. Sudirman"
  }
}
```

**Error (404):**
```json
{
  "success": false,
  "message": "Customer not found"
}
```

---

### 4. Update Customer
**Endpoint:**
```
PUT /customers/:id
```

**Parameters:**
- `id` (required): Customer ID

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "phone": "08987654321",
  "address": "Jl. Gatot Subroto"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Customer updated successfully",
  "data": {
    "id": 1,
    "name": "John Smith",
    "email": "john.smith@example.com",
    "phone": "08987654321",
    "address": "Jl. Gatot Subroto"
  }
}
```

---

### 5. Delete Customer
**Endpoint:**
```
DELETE /customers/:id
```

**Parameters:**
- `id` (required): Customer ID

**Response (200):**
```json
{
  "success": true,
  "message": "Customer deleted successfully"
}
```

---

## 🍽️ MENU ENDPOINTS

### 1. Create Menu
**Endpoint:**
```
POST /menus
```

**Request Body:**
```json
{
  "name": "Nasi Kuning",
  "description": "Nasi kuning dengan telur dan timun",
  "price": 25000,
  "category": "Rice",
  "stock": 10
}
```

**Validations:**
- `name` (required): Non-empty string
- `price` (required): > 0
- `category` (required): Non-empty string
- `stock` (optional): >= 0

**Categories:**
- Rice
- Soup
- Beverage
- Appetizer
- Dessert
- Side Dish

**Response (201):**
```json
{
  "success": true,
  "message": "Menu item created successfully",
  "data": {
    "id": 1,
    "name": "Nasi Kuning",
    "description": "Nasi kuning dengan telur dan timun",
    "price": 25000,
    "category": "Rice",
    "stock": 10,
    "is_available": 1
  }
}
```

---

### 2. Get All Menus
**Endpoint:**
```
GET /menus
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Nasi Kuning",
      "price": 25000,
      "category": "Rice",
      "stock": 10,
      "is_available": 1
    }
  ],
  "count": 1
}
```

---

### 3. Get Menu by Category
**Endpoint:**
```
GET /menus/category/:category
```

**Parameters:**
- `category` (required): Menu category

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Nasi Kuning",
      "price": 25000,
      "category": "Rice",
      "stock": 10
    },
    {
      "id": 2,
      "name": "Nasi Goreng",
      "price": 20000,
      "category": "Rice",
      "stock": 8
    }
  ],
  "count": 2
}
```

---

### 4. Update Menu
**Endpoint:**
```
PUT /menus/:id
```

**Request Body:**
```json
{
  "name": "Nasi Kuning Premium",
  "description": "Updated description",
  "price": 30000,
  "category": "Rice",
  "stock": 15,
  "is_available": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Menu item updated successfully",
  "data": {
    "id": 1,
    "name": "Nasi Kuning Premium",
    "price": 30000,
    "category": "Rice",
    "stock": 15
  }
}
```

---

### 5. Delete Menu
**Endpoint:**
```
DELETE /menus/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "Menu item deleted successfully"
}
```

---

## 📦 ORDER ENDPOINTS

### 1. Create Order
**Endpoint:**
```
POST /orders
```

**Request Body:**
```json
{
  "customer_id": 1,
  "items": [
    {
      "menu_id": 1,
      "quantity": 2,
      "price": 25000
    },
    {
      "menu_id": 2,
      "quantity": 1,
      "price": 20000
    }
  ],
  "payment_method": "cash"
}
```

**Validations:**
- `customer_id` (required): Valid customer ID
- `items` (required): Array dengan minimal 1 item
- `items[].menu_id` (required): Valid menu ID
- `items[].quantity` (required): > 0
- `items[].price` (required): > 0
- `payment_method` (required): cash|card|transfer|e-wallet
- Stock validation otomatis

**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "customer_id": 1,
    "total_amount": 70000,
    "status": "pending",
    "payment_method": "cash"
  }
}
```

**Error (400) - Insufficient Stock:**
```json
{
  "success": false,
  "message": "Insufficient stock for Nasi Kuning"
}
```

---

### 2. Get All Orders
**Endpoint:**
```
GET /orders
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "customer_id": 1,
      "total_amount": 70000,
      "status": "pending",
      "payment_method": "cash",
      "created_at": "2024-04-24T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### 3. Get Order by ID
**Endpoint:**
```
GET /orders/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "customer_id": 1,
    "total_amount": 70000,
    "status": "pending",
    "payment_method": "cash",
    "items": [
      {
        "id": 1,
        "menu_id": 1,
        "name": "Nasi Kuning",
        "category": "Rice",
        "quantity": 2,
        "price": 25000
      }
    ]
  }
}
```

---

### 4. Get Orders by Customer
**Endpoint:**
```
GET /orders/customer/:customerId
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "customer_id": 1,
      "total_amount": 70000,
      "status": "pending"
    }
  ],
  "count": 1
}
```

---

### 5. Get Orders by Status
**Endpoint:**
```
GET /orders/status/:status
```

**Available Statuses:**
- pending
- confirmed
- preparing
- ready
- completed
- cancelled

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "customer_id": 1,
      "status": "pending"
    }
  ],
  "count": 1
}
```

---

### 6. Update Order Status
**Endpoint:**
```
PUT /orders/:id/status
```

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Valid Transitions:**
- pending → confirmed
- confirmed → preparing
- preparing → ready
- ready → completed
- Any status → cancelled

**Response (200):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "id": 1,
    "status": "confirmed"
  }
}
```

---

### 7. Cancel Order
**Endpoint:**
```
PUT /orders/:id/cancel
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

**Error (404) - Already Completed:**
```json
{
  "success": false,
  "message": "Order not found or already completed"
}
```

---

### 8. Get Order Summary
**Endpoint:**
```
GET /orders/:customerId/summary
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_orders": 5,
    "total_spent": 350000,
    "average_order_value": 70000
  }
}
```

---

## 💳 PAYMENT ENDPOINTS

### 1. Create Payment
**Endpoint:**
```
POST /payments
```

**Request Body:**
```json
{
  "order_id": 1,
  "amount": 70000,
  "payment_method": "cash"
}
```

**Payment Methods:**
- cash
- card
- transfer
- e-wallet

**Response (201):**
```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "id": 1,
    "order_id": 1,
    "amount": 70000,
    "payment_method": "cash",
    "status": "pending"
  }
}
```

---

### 2. Get All Payments
**Endpoint:**
```
GET /payments
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "order_id": 1,
      "amount": 70000,
      "payment_method": "cash",
      "status": "pending",
      "created_at": "2024-04-24T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### 3. Get Payment by ID
**Endpoint:**
```
GET /payments/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "order_id": 1,
    "amount": 70000,
    "payment_method": "cash",
    "status": "pending"
  }
}
```

---

### 4. Get Payments by Order
**Endpoint:**
```
GET /payments/order/:orderId
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "order_id": 1,
      "amount": 70000,
      "payment_method": "cash",
      "status": "completed"
    }
  ],
  "count": 1
}
```

---

### 5. Update Payment Status
**Endpoint:**
```
PUT /payments/:id/status
```

**Request Body:**
```json
{
  "status": "completed"
}
```

**Valid Statuses:**
- pending
- completed
- failed
- cancelled

**Response (200):**
```json
{
  "success": true,
  "message": "Payment status updated successfully",
  "data": {
    "id": 1,
    "status": "completed"
  }
}
```

---

## 📊 ANALYTICS ENDPOINTS

### 1. Get Daily Revenue
**Endpoint:**
```
GET /revenue/daily/:date
```

**Parameters:**
- `date` (required): Format YYYY-MM-DD

**Response (200):**
```json
{
  "success": true,
  "data": {
    "date": "2024-04-24",
    "total_revenue": 350000,
    "transaction_count": 5
  }
}
```

---

### 2. Get Revenue by Payment Method
**Endpoint:**
```
GET /revenue/by-method
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "payment_method": "cash",
      "total_amount": 200000,
      "transaction_count": 3
    },
    {
      "payment_method": "card",
      "total_amount": 150000,
      "transaction_count": 2
    }
  ]
}
```

---

## 🔄 Common API Patterns

### Pagination (Future Enhancement)
```
GET /orders?page=1&limit=10
GET /customers?page=1&limit=10
```

### Filtering (Future Enhancement)
```
GET /orders?status=completed&payment_method=cash
GET /menus?category=Rice&available=true
```

### Sorting (Future Enhancement)
```
GET /orders?sort=created_at&order=desc
GET /customers?sort=name&order=asc
```

---

## ❌ Error Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request (Validation error) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 📝 Response Format

Semua responses mengikuti format:

```json
{
  "success": true/false,
  "message": "Operation message",
  "data": {}
}
```

---

## 🔗 Example Complete Workflow

```bash
# 1. Create Customer
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'

# Response: customer_id = 1

# 2. Create Menu
curl -X POST http://localhost:3000/api/menus \
  -H "Content-Type: application/json" \
  -d '{"name":"Nasi Kuning","price":25000,"category":"Rice","stock":10}'

# Response: menu_id = 1

# 3. Create Order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customer_id":1,"items":[{"menu_id":1,"quantity":2,"price":25000}],"payment_method":"cash"}'

# Response: order_id = 1

# 4. Create Payment
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{"order_id":1,"amount":50000,"payment_method":"cash"}'

# Response: payment_id = 1

# 5. Complete Payment
curl -X PUT http://localhost:3000/api/payments/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'
```

---

**End of API Documentation**
