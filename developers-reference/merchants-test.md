# Testing Merchants API Endpoints

This document contains curl commands to test all the endpoints defined in the MerchantsClient and merchants.controller.

## Setup

Replace the following values in your requests if needed:
- `API_KEY`: Your API key (lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee)
- `API_BASE_URL`: Your API base URL (default: https://api.lomi.africa/v1)
- `MERCHANT_ID`: The merchant ID to use for testing

## 1. Get Merchant Details

### Get details for a specific merchant

```bash
curl -X GET "https://api.lomi.africa/v1/merchants/904d003c-3736-41d4-90a5-9de74d404fd7" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Test error handling with invalid merchant ID

```bash
curl -X GET "https://api.lomi.africa/v1/merchants/invalid-merchant-id" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

Expected response:
```json
{
  "error": {
    "status": 404,
    "code": "MERCHANT_NOT_FOUND",
    "message": "Merchant not found",
    "timestamp": "2023-04-01T12:30:45Z"
  }
}
```

## 2. Get Merchant Monthly Recurring Revenue (MRR)

### Get MRR for a merchant

```bash
curl -X GET "https://api.lomi.africa/v1/merchants/904d003c-3736-41d4-90a5-9de74d404fd7/mrr" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Test error handling with invalid merchant ID

```bash
curl -X GET "https://api.lomi.africa/v1/merchants/invalid-merchant-id/mrr" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

Expected response:
```json
{
  "error": {
    "status": 404,
    "code": "MERCHANT_NOT_FOUND",
    "message": "Merchant not found",
    "timestamp": "2023-04-01T12:30:45Z"
  }
}
```

## 3. Get Merchant Annual Recurring Revenue (ARR)

### Get ARR for a merchant

```bash
curl -X GET "https://api.lomi.africa/v1/merchants/904d003c-3736-41d4-90a5-9de74d404fd7/arr" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Test error handling with invalid merchant ID

```bash
curl -X GET "https://api.lomi.africa/v1/merchants/invalid-merchant-id/arr" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

Expected response:
```json
{
  "error": {
    "status": 404,
    "code": "MERCHANT_NOT_FOUND",
    "message": "Merchant not found",
    "timestamp": "2023-04-01T12:30:45Z"
  }
}
```

## 4. Get Merchant Account Balance

### Get balance for a specific currency

```bash
curl -X GET "https://api.lomi.africa/v1/merchants/904d003c-3736-41d4-90a5-9de74d404fd7/balance?currency_code=XOF" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Test error handling with missing currency_code parameter

```bash
curl -X GET "https://api.lomi.africa/v1/merchants/904d003c-3736-41d4-90a5-9de74d404fd7/balance" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

Expected response:
```json
{
  "error": {
    "status": 400,
    "code": "MISSING_PARAMETER",
    "message": "Currency code is required",
    "timestamp": "2023-04-01T12:30:45Z"
  }
}
```

### Test error handling with invalid merchant ID

```bash
curl -X GET "https://api.lomi.africa/v1/merchants/invalid-merchant-id/balance?currency_code=XOF" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

Expected response:
```json
{
  "error": {
    "status": 404,
    "code": "MERCHANT_NOT_FOUND",
    "message": "Merchant not found",
    "timestamp": "2023-04-01T12:30:45Z"
  }
}
```

## Error Handling Tests

### Test with invalid API key

```bash
curl -X GET "https://api.lomi.africa/v1/merchants/904d003c-3736-41d4-90a5-9de74d404fd7" \
  -H "X-API-Key: invalid_api_key"
```

Expected response:
```json
{
  "error": {
    "status": 401,
    "code": "UNAUTHORIZED",
    "message": "Invalid API key",
    "timestamp": "2023-04-01T12:30:45Z"
  }
}
```

### Test with missing Authorization header

```bash
curl -X GET "https://api.lomi.africa/v1/merchants/904d003c-3736-41d4-90a5-9de74d404fd7"
```

Expected response:
```json
{
  "error": {
    "status": 401,
    "code": "UNAUTHORIZED",
    "message": "Missing API key",
    "timestamp": "2023-04-01T12:30:45Z"
  }
}
```

## Response Structure

### Success Responses
All successful responses follow this structure:
```json
{
  "data": {
    // Response data specific to the endpoint
  }
}
```

### Error Responses
All error responses now include enhanced information:
```json
{
  "error": {
    "status": 404,                      // HTTP status code
    "code": "MERCHANT_NOT_FOUND",       // Error code for client-side handling
    "message": "Merchant not found",    // Human-readable message
    "details": "Additional error details (if available)",
    "timestamp": "2023-04-01T12:30:45Z" // When the error occurred
  }
}
```

## Usage Instructions

1. Open a terminal window.
2. Copy and paste the desired curl command.
3. Run the command to test the endpoint.
4. Review the response for success or error information.

**Note**: These examples test both success paths and error handling for each endpoint. You may need to replace the example merchant ID with a valid ID from your system. 