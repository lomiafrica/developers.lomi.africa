# Testing Subscription Plans API Endpoints

This document provides `curl` commands to test the Subscription Plans API endpoints, which operate within the context of a specific merchant.

## Setup

- Replace `YOUR_API_KEY` with your actual API key.
- Replace `YOUR_MERCHANT_ID` with a valid merchant UUID for testing.
- Replace `API_BASE_URL` if your API is hosted elsewhere (default: `https://api.lomi.africa/v1`).
- You might need to create a plan first to test GET/PATCH/DELETE endpoints. Note the `plan_id` returned by the POST request.

```bash
API_KEY="lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
MERCHANT_ID="904d003c-3736-41d4-90a5-9de74d404fd7"
API_BASE_URL="https://api.lomi.africa/v1"
```

## 1. Create Subscription Plan

**Description:** Creates a new subscription plan for the specified merchant.

**Command:**

```bash
curl -X POST "${API_BASE_URL}/merchants/${MERCHANT_ID}/subscriptions" \
  -H "X-API-Key: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Basic Test Plan (Yearly)",
    "amount": 500000,
    "currency_code": "XOF",
    "billing_frequency": "yearly",
    "description": "Basic features, billed monthly.",
    "metadata": { "test_run": "'$(date +%s)'" }
  }'
```

**Expected Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "plan_id": "<generated_plan_uuid>", // Note this ID for later tests
    "merchant_id": "YOUR_MERCHANT_ID",
    // ... other plan fields ...
  }
}
```

**Test Validation Error (Missing Required Field):**

```bash
curl -X POST "${API_BASE_URL}/merchants/${MERCHANT_ID}/subscriptions" \
  -H "X-API-Key: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500000,
    "currency_code": "XOF",
    "billing_frequency": "monthly"
  }'
```

**Expected Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "details": { /* Zod error details */ }
}
```

## 2. List Subscription Plans

**Description:** Lists subscription plans for the specified merchant, with optional pagination.

**Command (Default Limit/Offset):**

```bash
curl -X GET "${API_BASE_URL}/merchants/${MERCHANT_ID}/subscriptions" \
  -H "X-API-Key: ${API_KEY}"
```

**Command (With Pagination):**

```bash
curl -X GET "${API_BASE_URL}/merchants/${MERCHANT_ID}/subscriptions?limit=5&offset=5" \
  -H "X-API-Key: ${API_KEY}"
```

**Expected Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "plan_id": "<plan_uuid_1>",
      "merchant_id": "YOUR_MERCHANT_ID",
      // ... other fields ...
    },
    {
      "plan_id": "<plan_uuid_2>",
      "merchant_id": "YOUR_MERCHANT_ID",
      // ... other fields ...
    }
    // ... potentially more plans ...
  ]
}
```

**Test with Invalid Merchant ID:**

```bash
curl -X GET "${API_BASE_URL}/merchants/invalid-merchant-uuid/subscriptions" \
  -H "X-API-Key: ${API_KEY}"
```

**Expected Error Response (400 Bad Request - likely due to UUID validation):**
```json
{
  "success": false,
  "message": "Validation failed",
  "details": { /* Zod error details */ }
}
```

## 3. Get Subscription Plan Details

**Description:** Retrieves details for a specific plan belonging to the merchant.

**Setup:** Replace `<PLAN_ID_TO_GET>` with a valid `plan_id` obtained from the Create or List endpoint.

```bash
PLAN_ID_TO_GET="<PLAN_ID_TO_GET>"

curl -X GET "${API_BASE_URL}/merchants/${MERCHANT_ID}/subscriptions/${PLAN_ID_TO_GET}" \
  -H "X-API-Key: ${API_KEY}"
```

**Expected Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "plan_id": "<PLAN_ID_TO_GET>",
    "merchant_id": "YOUR_MERCHANT_ID",
    // ... all other plan fields ...
  }
}
```

**Test with Non-Existent Plan ID:**

```bash
curl -X GET "${API_BASE_URL}/merchants/${MERCHANT_ID}/subscriptions/00000000-0000-0000-0000-000000000000" \
  -H "X-API-Key: ${API_KEY}"
```

**Expected Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Subscription plan not found"
}
```

## 4. Update Subscription Plan

**Description:** Updates the `is_active` status and/or `metadata` of a specific plan.

**Setup:** Replace `<PLAN_ID_TO_UPDATE>` with a valid `plan_id`.

**Command (Deactivate Plan):**

```bash
PLAN_ID_TO_UPDATE="<PLAN_ID_TO_UPDATE>"

curl -X PATCH "${API_BASE_URL}/merchants/${MERCHANT_ID}/subscriptions/129208a9-23a0-4827-83f3-58f5dde344f6" \
  -H "X-API-Key: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "is_active": false
  }'
```

**Command (Update Metadata):**

```bash
curl -X PATCH "${API_BASE_URL}/merchants/${MERCHANT_ID}/subscriptions/${PLAN_ID_TO_UPDATE}" \
  -H "X-API-Key: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "metadata": { "reason": "End of year sale", "updated_by": "test_script" }
  }'
```

**Expected Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "plan_id": "<PLAN_ID_TO_UPDATE>",
    "merchant_id": "YOUR_MERCHANT_ID",
    // ... other fields with updated values for is_active/metadata and updated_at ...
  }
}
```

**Test Validation Error (Empty Body):**

```bash
curl -X PATCH "${API_BASE_URL}/merchants/${MERCHANT_ID}/subscriptions/${PLAN_ID_TO_UPDATE}" \
  -H "X-API-Key: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "details": { /* Zod error details indicating at least one field required */ }
}
```

## 5. Delete Subscription Plan

**Description:** Deletes a specific subscription plan.

**Setup:** Replace `<PLAN_ID_TO_DELETE>` with a valid `plan_id` that is *not* currently used by any subscriptions.

```bash
PLAN_ID_TO_DELETE="<PLAN_ID_TO_DELETE>"

curl -X DELETE "${API_BASE_URL}/merchants/${MERCHANT_ID}/subscriptions/${PLAN_ID_TO_DELETE}" \
  -H "X-API-Key: ${API_KEY}"
```

**Expected Success Response (204 No Content):**
*(No response body)*

**Test Deleting Non-Existent Plan:**

```bash
curl -X DELETE "${API_BASE_URL}/merchants/${MERCHANT_ID}/subscriptions/00000000-0000-0000-0000-000000000000" \
  -H "X-API-Key: ${API_KEY}"
```

**Expected Error Response (404 Not Found):**
```json
{
    "success": false,
    "message": "Subscription plan not found for this merchant."
}
```

**Test Deleting Plan in Use (Requires setup):**
*(You would need to create a subscription associated with the plan first)*

**Expected Error Response (409 Conflict):**
```json
{
    "success": false,
    "message": "Cannot delete subscription plan: It is currently in use by subscriptions.",
    "details": {
        "code": "23503",
        "hint": "Delete associated subscriptions first."
    }
}
```

## Error Handling Notes

- Refer to the [Merchants API Test document](./merchants-test.md) for generic error tests (invalid API key, missing auth).
- Specific errors for subscription plans (Not Found, Conflict) are shown above.
