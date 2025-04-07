# Testing Products API Endpoints

This document provides curl commands to test the Products API endpoints based on `products.controller.ts`.

## Setup

- **Replace `YOUR_API_KEY`** with a valid API key for a merchant.
- **Replace `https://api.lomi.africa/v1`** if using a different base URL.
- **Replace `VALID_PRODUCT_ID`** with a UUID of an existing product belonging to the authenticated merchant.
- **Replace `INVALID_PRODUCT_ID`** with a UUID that does not exist or does not belong to the merchant.

**Note:** The API uses the merchant details associated with the `YOUR_API_KEY` for operations.

## 1. Create Product

### Create a new product (Success)

```bash
curl -X POST "https://api.lomi.africa/v1/products" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "name": "Test Product API",
    "description": "Created via API test.",
    "price": 99.99,
    "currency_code": "XOF",
    "is_active": true,
    "image_url": "https://via.placeholder.com/150"
  }'
```

*Expected Response: 201 Created with product data.*

### Create a product (Validation Error)

```bash
curl -X POST "https://api.lomi.africa/v1/products" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "description": "Missing name and price.",
    "currency_code": "XOF"
  }'
```

*Expected Response: 400 Bad Request with `INVALID_REQUEST` error code.*

## 2. List Products

### List products (Default limit/offset)

```bash
curl -X GET "https://api.lomi.africa/v1/products" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

*Expected Response: 200 OK with a list of products and metadata.*

### List products (With pagination and filter)

```bash
curl -X GET "https://api.lomi.africa/v1/products?limit=5&offset=5&is_active=true" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

*Expected Response: 200 OK with up to 5 active products, skipping the first 5, and metadata.*

### List products (Invalid pagination)

```bash
curl -X GET "https://api.lomi.africa/v1/products?limit=-1" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

*Expected Response: 400 Bad Request with `INVALID_REQUEST` error code.*

## 3. Get Product Details

### Get details for a specific product (Success)

```bash
curl -X GET "https://api.lomi.africa/v1/products/57406346-3c49-4270-9645-7809ac63a2fd" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

*Expected Response: 200 OK with the product details.*

### Get details for a non-existent product

```bash
curl -X GET "https://api.lomi.africa/v1/products/INVALID_PRODUCT_ID" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

*Expected Response: 404 Not Found with `PRODUCT_NOT_FOUND` error code.*

## 4. Update Product

### Update a product (Success - Toggle is_active)

```bash
curl -X PATCH "https://api.lomi.africa/v1/products/7195da16-70a7-428f-bba5-2500ed96f1ca" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "is_active": false
  }'
```

*Expected Response: 200 OK with the updated product details.*

### Update a product (Missing required is_active field)

```bash
curl -X PATCH "https://api.lomi.africa/v1/products/7195da16-70a7-428f-bba5-2500ed96f1ca" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{}'
```

*Expected Response: 400 Bad Request with `INVALID_REQUEST` error code.*

### Update a product (Attempting to modify immutable fields)

```bash
curl -X PATCH "https://api.lomi.africa/v1/products/57406346-3c49-4270-9645-7809ac63a2fd" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "name": "Cannot Change Name",
    "price": 50.00,
    "is_active": true
  }'
```

*Expected Response: 400 Bad Request with `INVALID_REQUEST` error code. Only is_active can be modified.*

### Update a non-existent product

```bash
curl -X PATCH "https://api.lomi.africa/v1/products/INVALID_PRODUCT_ID" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "is_active": false
  }'
```

*Expected Response: 404 Not Found with `PRODUCT_NOT_FOUND` error code.*

## 5. Delete Product

### Delete a product (Success)

**Note:** Use a product ID you intend to delete!

```bash
curl -X DELETE "https://api.lomi.africa/v1/products/1375cf47-c8a2-46d8-82cf-cab370c99349" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

*Expected Response: 204 No Content.*

### Delete a non-existent product

```bash
curl -X DELETE "https://api.lomi.africa/v1/products/INVALID_PRODUCT_ID" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

*Expected Response: 404 Not Found with `PRODUCT_NOT_FOUND` error code.*

## General Error Tests

### Test with invalid API key

```bash
curl -X GET "https://api.lomi.africa/v1/products" \
  -H "X-API-Key: invalid_api_key"
```

*Expected Response: 401 Unauthorized with `UNAUTHORIZED` error code (or similar, depending on auth middleware).*

### Test with missing API key

```bash
curl -X GET "https://api.lomi.africa/v1/products"
```

*Expected Response: 401 Unauthorized with `UNAUTHORIZED` error code (or similar, depending on auth middleware).*

## Usage Instructions

1.  Replace placeholders (`YOUR_API_KEY`, `VALID_PRODUCT_ID`, etc.) with actual values.
2.  Open a terminal window.
3.  Copy and paste the desired curl command.
4.  Run the command and verify the HTTP status code and response body (especially the error code for failures). 