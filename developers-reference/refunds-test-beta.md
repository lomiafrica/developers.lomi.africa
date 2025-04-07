# Testing Refunds API Endpoint

This document contains curl commands to test the `GET /refunds/{id}` endpoint defined in the RefundsClient and refunds.controller.

## Setup

Replace the following values in your requests if needed:
- `YOUR_API_KEY`: Your Lomi API key (e.g., lomi_sk_...)
- `YOUR_VALID_REFUND_ID`: The UUID of a refund that exists and belongs to the merchant associated with YOUR_API_KEY.
- `API_BASE_URL`: Your API base URL (default: https://api.lomi.africa/v1)

**Note:** You will need a valid refund ID created through the platform or other means to test the success case.

## 1. Get Refund Details (Success Case)

Retrieves details for a specific, valid refund ID.

```bash
# Replace YOUR_VALID_REFUND_ID with an actual refund ID
curl -X GET "https://api.lomi.africa/v1/refunds/YOUR_VALID_REFUND_ID" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "refund_id": "YOUR_VALID_REFUND_ID",
    "transaction_id": "...",
    "amount": ...,
    "refunded_amount": ...,
    "fee_amount": ...,
    "reason": "...",
    "status": "...",
    "metadata": { ... },
    "created_at": "...",
    "updated_at": "..."
  },
  "environment": "..."
}
```

## 2. Error Handling Tests

### Test with Non-Existent Refund ID

Tests the case where the refund ID does not exist.

```bash
curl -X GET "https://api.lomi.africa/v1/refunds/00000000-0000-0000-0000-000000000000" \
  -H "X-API-Key: YOUR_API_KEY"
```

**Expected Response (404 Not Found):**
```json
{
  "error": {
    "status": 404,
    "code": "NOT_FOUND",
    "message": "Refund not found or does not belong to this merchant",
    "details": null,
    "timestamp": "..."
  }
}
```

### Test with Invalid UUID Format for Refund ID

Tests the parameter validation.

```bash
curl -X GET "https://api.lomi.africa/v1/refunds/invalid-refund-id-format" \
  -H "X-API-Key: YOUR_API_KEY"
```

**Expected Response (400 Bad Request):**
```json
{
  "error": {
    "status": 400,
    "code": "INVALID_REQUEST",
    "message": "Invalid Refund ID in URL",
    "details": {
        "_errors": [],
        "id": {
            "_errors": [
                "Invalid uuid"
            ]
        }
    },
    "timestamp": "..."
  }
}
```

### Test with Invalid API Key

Tests the authentication middleware.

```bash
curl -X GET "https://api.lomi.africa/v1/refunds/YOUR_VALID_REFUND_ID" \
  -H "X-API-Key: invalid_api_key"
```

**Expected Response (401 Unauthorized - or specific error from auth middleware):**
```json
{
  "error": {
    "status": 401,
    "code": "UNAUTHORIZED",
    "message": "Invalid API key",
    "details": null,
    "timestamp": "..."
  }
}
```
*(Note: The exact 401 error message/code might vary based on the auth middleware implementation)*

### Test with Missing API Key Header

Tests the authentication middleware requirement.

```bash
curl -X GET "https://api.lomi.africa/v1/refunds/YOUR_VALID_REFUND_ID"
```

**Expected Response (401 Unauthorized):**
```json
{
  "error": {
    "status": 401,
    "code": "UNAUTHORIZED",
    "message": "API key is missing",
    "details": null,
    "timestamp": "..."
  }
}
```
*(Note: The exact 401 error message/code might vary based on the auth middleware implementation)*

## Usage Instructions

1.  Replace placeholder values (`YOUR_API_KEY`, `YOUR_VALID_REFUND_ID`) with actual values.
2.  Open a terminal window.
3.  Copy and paste the desired curl command.
4.  Run the command.
5.  Review the HTTP status code and JSON response body to verify the endpoint behavior.