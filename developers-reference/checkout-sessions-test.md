# Testing Checkout Sessions API Endpoints

This document contains curl commands to test all the endpoints defined in the CheckoutSessionsClient and checkout-sessions.controller.

## Setup

Replace the following values in your requests if needed:
- `API_KEY`: Your API key (lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee)
- `API_BASE_URL`: Your API base URL (default: https://api.lomi.africa/v1)

## 1. Create a Checkout Session

### Create a valid checkout session

```bash
curl -X POST "https://api.lomi.africa/v1/checkout-sessions" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "success_url": "https://example.com/success",
    "cancel_url": "https://example.com/cancel",
    "allowed_providers": ["ORANGE", "WAVE", "NOWPAYMENTS"],
    "amount": 5000,
    "currency_code": "XOF",
    "title": "Test Checkout",
    "public_description": "Test checkout session from API",
    "customer_email": "test@example.com",
    "customer_name": "Test User",
    "customer_phone": "+123456789",
    "metadata": { "test": true, "source": "api_test" },
    "expiration_minutes": 30,
    "allow_coupon_code": true
  }'
```

### Test error handling with invalid payload (missing required fields)

```bash
curl -X POST "https://api.lomi.africa/v1/checkout-sessions" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "success_url": "https://example.com/success",
    "amount": 5000
  }'
```

### Test error handling with invalid currency_code

```bash
curl -X POST "https://api.lomi.africa/v1/checkout-sessions" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "success_url": "https://example.com/success",
    "cancel_url": "https://example.com/cancel",
    "allowed_providers": ["ORANGE", "WAVE", "MTN"],
    "amount": 5000,
    "currency_code": "INVALID_CODE",
    "title": "Test Checkout"
  }'
```

### Test error handling with invalid provider

```bash
curl -X POST "https://api.lomi.africa/v1/checkout-sessions" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "success_url": "https://example.com/success",
    "cancel_url": "https://example.com/cancel",
    "allowed_providers": ["INVALID_PROVIDER"],
    "amount": 5000,
    "currency_code": "XOF",
    "title": "Test Checkout"
  }'
```

## 2. Get a Checkout Session by ID

First, create a session using the command above, and note the `checkout_session_id` from the response. Then use that ID in the following command:

```bash
# Replace CHECKOUT_SESSION_ID with the actual ID from the creation response
curl -X GET "https://api.lomi.africa/v1/checkout-sessions/CHECKOUT_SESSION_ID" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Test error handling with invalid session ID

```bash
curl -X GET "https://api.lomi.africa/v1/checkout-sessions/invalid-id" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

## 3. List Checkout Sessions

### List all checkout sessions

```bash
curl -X GET "https://api.lomi.africa/v1/checkout-sessions" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Test pagination

```bash
curl -X GET "https://api.lomi.africa/v1/checkout-sessions?limit=5&page=1" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Test filtering by status

```bash
curl -X GET "https://api.lomi.africa/v1/checkout-sessions?status=open" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Test filtering by status and pagination

```bash
curl -X GET "https://api.lomi.africa/v1/checkout-sessions?status=open&limit=3&page=1" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

## 4. Error Handling Tests

### Test with invalid API key

```bash
curl -X GET "https://api.lomi.africa/v1/checkout-sessions" \
  -H "X-API-Key: invalid_api_key"
```

### Test with missing Authorization header

```bash
curl -X GET "https://api.lomi.africa/v1/checkout-sessions"
```

## Usage Instructions

1. Open a terminal window.
2. Copy and paste the desired curl command.
3. Replace any placeholder values as needed.
4. Run the command to test the endpoint.
5. Review the response for success or error information.

**Note**: For proper testing, first create a checkout session, then use the returned ID to test the get and list endpoints. The examples above test both success paths and error handling for each endpoint. 