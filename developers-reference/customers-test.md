# Testing Customers API Endpoints

This document contains curl commands to test all the endpoints defined in the CustomersClient and customers.controller.

## Setup

Using the same API key as in the checkout-sessions tests:
- `API_KEY`: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee
- `API_BASE_URL`: https://api.lomi.africa/v1

## 1. Create a Customer

### Create a valid customer

```bash
curl -X POST "https://api.lomi.africa/v1/customers" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone_number": "+221771234567",
    "country": "Senegal",
    "city": "Dakar",
    "address": "123 Main St",
    "postal_code": "12345",
    "is_business": false,
    "metadata": { "source": "api_test", "notes": "Test customer" }
  }'
```

### Test error handling with invalid payload (missing required fields)

```bash
curl -X POST "https://api.lomi.africa/v1/customers" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "email": "missing.name@example.com"
  }'
```

### Test error handling with invalid email format

```bash
curl -X POST "https://api.lomi.africa/v1/customers" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "name": "Invalid Email",
    "email": "not-an-email"
  }'
```

## 2. Get a Customer by ID

First, create a customer using the command above, and note the `customer_id` from the response. Then use that ID in the following command:

```bash
# Replace CUSTOMER_ID with the actual ID from the creation response
curl -X GET "https://api.lomi.africa/v1/customers/CUSTOMER_ID" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Test error handling with invalid customer ID

```bash
curl -X GET "https://api.lomi.africa/v1/customers/invalid-id" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

## 3. List Customers

### List all customers

```bash
curl -X GET "https://api.lomi.africa/v1/customers" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Test pagination

```bash
curl -X GET "https://api.lomi.africa/v1/customers?limit=5&page=1" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Test filtering by email

```bash
# Replace with an actual email you've used
curl -X GET "https://api.lomi.africa/v1/customers?email=john.doe@example.com" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Test filtering by phone number

```bash
# Replace with an actual phone number you've used
curl -X GET "https://api.lomi.africa/v1/customers?phone_number=+221771234567" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

## 4. Update a Customer

First, create a customer and note the ID. Then update it with the following command:

```bash
# Replace CUSTOMER_ID with the actual ID from a created customer
curl -X PATCH "https://api.lomi.africa/v1/customers/CUSTOMER_ID" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "phone_number": "+221779876543",
    "address": "456 New Address",
    "metadata": { "updated": true, "last_purchase": "2025-04-05T10:00:00Z" }
  }'
```

### Test error handling with invalid customer ID

```bash
curl -X PATCH "https://api.lomi.africa/v1/customers/invalid-id" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "name": "Updated Name"
  }'
```

### Test error handling with invalid data format

```bash
# Replace CUSTOMER_ID with the actual ID from a created customer
curl -X PATCH "https://api.lomi.africa/v1/customers/CUSTOMER_ID" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "email": "invalid-email-format"
  }'
```

## 5. Delete a Customer

First, create a customer and note the ID. Then delete it with the following command:

```bash
# Replace CUSTOMER_ID with the actual ID from a created customer
curl -X DELETE "https://api.lomi.africa/v1/customers/CUSTOMER_ID" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Test error handling with invalid customer ID

```bash
curl -X DELETE "https://api.lomi.africa/v1/customers/invalid-id" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

## 6. Error Handling Tests

### Test with invalid API key

```bash
curl -X GET "https://api.lomi.africa/v1/customers" \
  -H "X-API-Key: invalid_api_key"
```

### Test with missing Authorization header

```bash
curl -X GET "https://api.lomi.africa/v1/customers"
```

## Usage Instructions

1. Open a terminal window.
2. Copy and paste the desired curl command.
3. For commands that require a customer ID, first create a customer and use the returned ID.
4. Run the command to test the endpoint.
5. Review the response for success or error information.

**Note**: The test flow should typically be:
1. Create a customer
2. Get the customer details
3. List customers (with filters)
4. Update the customer
5. Delete the customer

This allows you to test the full customer lifecycle. 