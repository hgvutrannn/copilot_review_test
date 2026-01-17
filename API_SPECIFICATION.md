# API Specification

## Base URL
```
http://localhost:3001/api
```

## Endpoints

### 1. Health Check
- **GET** `/health`
- **Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### 2. Get All Users
- **GET** `/api/users`
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 3. Get User by ID
- **GET** `/api/users/:id`
- **Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```
- **Error Response (404):**
```json
{
  "success": false,
  "error": "User not found"
}
```

### 4. Create User
- **POST** `/api/users`
- **Request Body:**
```json
{
  "username": "jane_doe",
  "email": "jane@example.com"
}
```
- **Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "username": "jane_doe",
    "email": "jane@example.com",
    "created_at": "2024-01-15T11:00:00.000Z"
  }
}
```
- **Error Response (400):**
```json
{
  "success": false,
  "error": "Username and email are required"
}
```
- **Error Response (409):**
```json
{
  "success": false,
  "error": "User with this username or email already exists"
}
```

## Response Format Standards

All API responses MUST follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Important Notes

1. All timestamps must be in ISO 8601 format
2. User IDs must be integers
3. Username must be unique, max 50 characters
4. Email must be unique and valid format, max 100 characters
5. All error responses must include `success: false` and an `error` field
6. All success responses must include `success: true` and a `data` field
