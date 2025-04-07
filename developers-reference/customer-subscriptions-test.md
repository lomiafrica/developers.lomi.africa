# Testing Customer Subscriptions API Endpoints

This document provides `curl` commands to test the Customer Subscriptions API endpoints.

## Setup

- Replace `YOUR_API_KEY` with your actual API key.
- Replace `YOUR_MERCHANT_ID` with a valid merchant UUID for testing.
- Replace `API_BASE_URL` if your API is hosted elsewhere (default: `https://api.lomi.africa/v1`).
- You'll need existing subscription IDs to test the GET/PATCH/DELETE endpoints.

```bash
API_KEY="lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
MERCHANT_ID="904d003c-3736-41d4-90a5-9de74d404fd7"
API_BASE_URL="https://api.lomi.africa/v1"
```

## 1. List Customer Subscriptions

**Description:** Lists all subscriptions for a specific merchant with optional filtering.

### List all subscriptions for a merchant

```bash
curl -X GET "${API_BASE_URL}/customer-subscriptions?merchant_id=${MERCHANT_ID}" \
  -H "X-API-Key: ${API_KEY}"
```

### List with customer_id filter

```bash
curl -X GET "${API_BASE_URL}/customer-subscriptions?merchant_id=${MERCHANT_ID}&customer_id=CUSTOMER_ID" \
  -H "X-API-Key: ${API_KEY}"
```

### List with status filter

```bash
curl -X GET "${API_BASE_URL}/customer-subscriptions?merchant_id=${MERCHANT_ID}&status=active" \
  -H "X-API-Key: ${API_KEY}"
```

**Expected Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "subscription_id": "<subscription_uuid_1>",
      "merchant_id": "YOUR_MERCHANT_ID",
      "organization_id": "<organization_uuid>",
      "plan_id": "<plan_uuid>",
      "customer_id": "<customer_uuid>",
      "status": "active",
      // ... other subscription fields ...
    },
    // ... additional subscriptions ...
  ],
  "meta": {
    "limit": 20,
    "offset": 0,
    "total_returned": 5
  }
}
```

**Invalid Merchant ID Test:**

```bash
curl -X GET "${API_BASE_URL}/customer-subscriptions?merchant_id=invalid-uuid" \
  -H "X-API-Key: ${API_KEY}"
```

**Expected Error Response (400 Bad Request):**
```json
{
  "error": {
    "status": 400,
    "code": "INVALID_REQUEST",
    "message": "Invalid or missing merchant_id",
    "details": { /* Validation error details */ }
  }
}
```

## 2. Get Subscription Details

**Description:** Retrieves details for a specific subscription.

```bash
# Replace SUBSCRIPTION_ID with a valid subscription ID
SUBSCRIPTION_ID="<SUBSCRIPTION_ID>"

curl -X GET "${API_BASE_URL}/customer-subscriptions/${SUBSCRIPTION_ID}?merchant_id=${MERCHANT_ID}" \
  -H "X-API-Key: ${API_KEY}"
```

**Expected Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "subscription_id": "<SUBSCRIPTION_ID>",
    "merchant_id": "YOUR_MERCHANT_ID",
    "organization_id": "<organization_uuid>",
    "plan_id": "<plan_uuid>",
    "customer_id": "<customer_uuid>",
    "status": "active",
    "start_date": "2025-01-01T00:00:00.000Z",
    "end_date": null,
    "next_billing_date": "2025-02-01T00:00:00.000Z",
    // ... other fields ...
  }
}
```

**Test with Non-Existent Subscription ID:**

```bash
curl -X GET "${API_BASE_URL}/customer-subscriptions/00000000-0000-0000-0000-000000000000?merchant_id=${MERCHANT_ID}" \
  -H "X-API-Key: ${API_KEY}"
```

**Expected Error Response (404 Not Found):**
```json
{
  "error": {
    "status": 404,
    "code": "NOT_FOUND",
    "message": "Subscription not found"
  }
}
```

## 3. Update Subscription Status

**Description:** Updates a subscription's status, dates, or metadata.

```bash
# Replace SUBSCRIPTION_ID with a valid subscription ID
SUBSCRIPTION_ID="<SUBSCRIPTION_ID>"

curl -X PATCH "${API_BASE_URL}/customer-subscriptions/${SUBSCRIPTION_ID}?merchant_id=${MERCHANT_ID}" \
  -H "X-API-Key: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "paused",
    "metadata": { "reason": "Customer requested pause", "updated_by": "test_script" }
  }'
```

**Update next_billing_date:**

```bash
curl -X PATCH "${API_BASE_URL}/customer-subscriptions/${SUBSCRIPTION_ID}?merchant_id=${MERCHANT_ID}" \
  -H "X-API-Key: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "next_billing_date": "2025-03-01T00:00:00.000Z"
  }'
```

**Expected Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "subscription_id": "<SUBSCRIPTION_ID>",
    "merchant_id": "YOUR_MERCHANT_ID",
    // ... subscription details with updated fields ...
    "status": "paused",
    "metadata": {
      "reason": "Customer requested pause",
      "updated_by": "test_script"
    },
    "updated_at": "2025-01-15T10:30:00.000Z"
  }
}
```

**Test validation error (empty body):**

```bash
curl -X PATCH "${API_BASE_URL}/customer-subscriptions/${SUBSCRIPTION_ID}?merchant_id=${MERCHANT_ID}" \
  -H "X-API-Key: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Error Response (400 Bad Request):**
```json
{
  "error": {
    "status": 400,
    "code": "INVALID_REQUEST",
    "message": "Invalid request data",
    "details": "At least one field must be provided for update"
  }
}
```

## 4. Cancel Subscription

**Description:** Cancels a subscription and updates its status to 'cancelled'.

```bash
# Replace SUBSCRIPTION_ID with a valid subscription ID
SUBSCRIPTION_ID="<SUBSCRIPTION_ID>"

curl -X DELETE "${API_BASE_URL}/customer-subscriptions/${SUBSCRIPTION_ID}?merchant_id=${MERCHANT_ID}" \
  -H "X-API-Key: ${API_KEY}"
```

**Expected Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "subscription_id": "<SUBSCRIPTION_ID>",
    "merchant_id": "YOUR_MERCHANT_ID",
    // ... subscription details with updated status ...
    "status": "cancelled",
    "end_date": "2025-01-15T00:00:00.000Z",
    "updated_at": "2025-01-15T10:30:00.000Z"
  }
}
```

**Test cancelling a non-existent subscription:**

```bash
curl -X DELETE "${API_BASE_URL}/customer-subscriptions/00000000-0000-0000-0000-000000000000?merchant_id=${MERCHANT_ID}" \
  -H "X-API-Key: ${API_KEY}"
```

**Expected Error Response (404 Not Found):**
```json
{
  "error": {
    "status": 404,
    "code": "NOT_FOUND",
    "message": "Subscription not found or cancellation failed"
  }
}
```

## Testing API Key Authentication

**Test with invalid API key:**

```bash
curl -X GET "${API_BASE_URL}/customer-subscriptions?merchant_id=${MERCHANT_ID}" \
  -H "X-API-Key: invalid_api_key"
```

**Expected Error Response (401 Unauthorized):**
```json
{
  "error": {
    "status": 401,
    "code": "UNAUTHORIZED",
    "message": "Invalid API key"
  }
}
```

**Test with missing API key:**

```bash
curl -X GET "${API_BASE_URL}/customer-subscriptions?merchant_id=${MERCHANT_ID}"
```

**Expected Error Response (401 Unauthorized):**
```json
{
  "error": {
    "status": 401,
    "code": "UNAUTHORIZED",
    "message": "API key required"
  }
}
``` 