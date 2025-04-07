# Subscription Plans API Documentation

The Subscription Plans API allows you to create, retrieve, update, and delete subscription plans *for a specific merchant*. These plans define the pricing and billing cycle for recurring payments.

## Base URL

https://api.lomi.africa/v1


## Authentication

All API requests require authentication using an API key. Provide your API key in the request header:


## Endpoints

### Create Subscription Plan

Creates a new subscription plan for the specified merchant.

**Endpoint:** `POST /merchants/{merchant_id}/subscriptions`

**Path Parameters:**

| Parameter     | Type   | Required | Description                             |
|---------------|--------|----------|-----------------------------------------|
| `merchant_id` | string | Yes      | The unique identifier of the merchant. |

**Request Body:**

Requires a JSON object matching the `CreateSubscriptionPlan` schema (excluding `merchant_id`). Key fields include:

- `name` (string, required): The name of the plan.
- `amount` (number, required): The amount to be charged per billing cycle (in smallest currency unit).
- `currency_code` (string, required): The currency code (e.g., "XOF", "USD").
- `billing_frequency` (string, required): How often the subscription renews (e.g., "monthly", "yearly").
- `description` (string, optional): A description for the plan.
- `failed_payment_action` (string, optional): Action on failed payment (e.g., "cancel", "pause").
- `charge_day` (integer, optional): Day of month/week for charging (depends on frequency).
- `metadata` (object, optional): Key-value pairs for custom data.
- `is_active` (boolean, optional, default: true): Whether the plan is currently active.
- `first_payment_type` (string, optional): Type of the first payment.

**Example Request Body:**

```json
{
  "name": "Pro Monthly Plan",
  "amount": 1500000,
  "currency_code": "XOF",
  "billing_frequency": "monthly",
  "description": "Access to all pro features, billed monthly.",
  "metadata": {
    "internal_code": "PRO_M"
  }
}
```

**Example Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "plan_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "merchant_id": "904d003c-3736-41d4-90a5-9de74d404fd7",
    "organization_id": "org_abc123...",
    "name": "Pro Monthly Plan",
    "description": "Access to all pro features, billed monthly.",
    "amount": 1500000,
    "currency_code": "XOF",
    "billing_frequency": "monthly",
    "failed_payment_action": null,
    "charge_day": null,
    "metadata": {
      "internal_code": "PRO_M"
    },
    "is_active": true,
    "first_payment_type": "initial",
    "created_at": "2023-10-27T10:00:00Z",
    "updated_at": "2023-10-27T10:00:00Z"
  }
}
```

**Possible Error Responses:**

| Status Code | Error Code          | Description                                    |
|-------------|---------------------|------------------------------------------------|
| 400         | VALIDATION_FAILED   | Request body validation failed.                |
| 401         | UNAUTHORIZED        | Authentication failed or API key invalid.      |
| 404         | MERCHANT_NOT_FOUND  | The specified `merchant_id` was not found.     |
| 500         | DATABASE_ERROR      | Error creating the plan in the database.       |
| 500         | INTERNAL_ERROR      | Internal server error.                         |

---

### List Subscription Plans

Retrieves a list of subscription plans belonging to the specified merchant.

**Endpoint:** `GET /merchants/{merchant_id}/subscriptions`

**Path Parameters:**

| Parameter     | Type   | Required | Description                             |
|---------------|--------|----------|-----------------------------------------|
| `merchant_id` | string | Yes      | The unique identifier of the merchant. |

**Query Parameters:**

| Parameter | Type    | Required | Default | Description                                      |
|-----------|---------|----------|---------|--------------------------------------------------|
| `limit`   | integer | No       | 20      | Maximum number of plans to return.              |
| `offset`  | integer | No       | 0       | Number of plans to skip for pagination.          |

**Example Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "plan_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "merchant_id": "904d003c-3736-41d4-90a5-9de74d404fd7",
      // ... other plan fields ...
      "created_at": "2023-10-27T10:00:00Z",
      "updated_at": "2023-10-27T10:00:00Z"
    },
    {
      "plan_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "merchant_id": "904d003c-3736-41d4-90a5-9de74d404fd7",
      // ... other plan fields ...
      "created_at": "2023-09-15T14:00:00Z",
      "updated_at": "2023-09-15T14:00:00Z"
    }
    // ... more plans ...
  ]
}
```

**Possible Error Responses:**

| Status Code | Error Code          | Description                                    |
|-------------|---------------------|------------------------------------------------|
| 401         | UNAUTHORIZED        | Authentication failed or API key invalid.      |
| 404         | MERCHANT_NOT_FOUND  | The specified `merchant_id` was not found.     |
| 500         | DATABASE_ERROR      | Error retrieving plans from the database.      |
| 500         | INTERNAL_ERROR      | Internal server error.                         |

---

### Get Subscription Plan Details

Retrieves details for a specific subscription plan belonging to the specified merchant.

**Endpoint:** `GET /merchants/{merchant_id}/subscriptions/{plan_id}`

**Path Parameters:**

| Parameter     | Type   | Required | Description                             |
|---------------|--------|----------|-----------------------------------------|
| `merchant_id` | string | Yes      | The unique identifier of the merchant. |
| `plan_id`     | string | Yes      | The unique identifier of the plan.      |

**Example Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "plan_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "merchant_id": "904d003c-3736-41d4-90a5-9de74d404fd7",
    "organization_id": "org_abc123...",
    "name": "Pro Monthly Plan",
    "description": "Access to all pro features, billed monthly.",
    "amount": 1500000,
    "currency_code": "XOF",
    "billing_frequency": "monthly",
    // ... other plan fields ...
    "created_at": "2023-10-27T10:00:00Z",
    "updated_at": "2023-10-27T10:15:00Z"
  }
}
```

**Possible Error Responses:**

| Status Code | Error Code          | Description                                       |
|-------------|---------------------|---------------------------------------------------|\
| 401         | UNAUTHORIZED        | Authentication failed or API key invalid.         |
| 404         | NOT_FOUND           | Plan not found for the given merchant and plan ID.|\
| 500         | DATABASE_ERROR      | Error retrieving the plan from the database.      |
| 500         | INTERNAL_ERROR      | Internal server error.                            |

---

### Update Subscription Plan

Updates specific fields (`is_active` and/or `metadata`) of a subscription plan. Core details like amount and frequency are immutable via the API.

**Endpoint:** `PATCH /merchants/{merchant_id}/subscriptions/{plan_id}`

**Path Parameters:**

| Parameter     | Type   | Required | Description                             |
|---------------|--------|----------|-----------------------------------------|
| `merchant_id` | string | Yes      | The unique identifier of the merchant. |
| `plan_id`     | string | Yes      | The unique identifier of the plan.      |

**Request Body:**

Requires a JSON object containing at least one of the following optional fields:

- `is_active` (boolean): Set the plan's active status.
- `metadata` (object): Mergeable key-value pairs. Updates existing keys and adds new ones.

**Example Request Body (Update Status):**

```json
{
  "is_active": false
}
```

**Example Request Body (Update Metadata):**

```json
{
  "metadata": {
    "updated_by": "admin_user",
    "reason": "Seasonal promotion ended"
  }
}
```

**Example Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "plan_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "merchant_id": "904d003c-3736-41d4-90a5-9de74d404fd7",
    // ... other fields ...
    "is_active": false, // updated value
    "metadata": {
      "internal_code": "PRO_M",
      "updated_by": "admin_user",
      "reason": "Seasonal promotion ended"
    }, // updated value
    "created_at": "2023-10-27T10:00:00Z",
    "updated_at": "2023-10-27T11:05:00Z" // updated timestamp
  }
}
```

**Possible Error Responses:**

| Status Code | Error Code          | Description                                                    |
|-------------|---------------------|----------------------------------------------------------------|\
| 400         | VALIDATION_FAILED   | Request body invalid or empty (must provide `is_active` or `metadata`). |\
| 401         | UNAUTHORIZED        | Authentication failed or API key invalid.                      |\
| 404         | NOT_FOUND           | Plan not found for the merchant, or update check failed.       |\
| 500         | DATABASE_ERROR      | Error updating the plan in the database.                       |\
| 500         | INTERNAL_ERROR      | Internal server error.                                         |

---

### Delete Subscription Plan

Deletes a subscription plan. This operation will fail if the plan is currently associated with active subscriptions.

**Endpoint:** `DELETE /merchants/{merchant_id}/subscriptions/{plan_id}`

**Path Parameters:**

| Parameter     | Type   | Required | Description                             |
|---------------|--------|----------|-----------------------------------------|
| `merchant_id` | string | Yes      | The unique identifier of the merchant. |
| `plan_id`     | string | Yes      | The unique identifier of the plan.      |

**Example Response (204 No Content):**

*(No response body)*

**Possible Error Responses:**

| Status Code | Error Code          | Description                                       |
|-------------|---------------------|---------------------------------------------------|\
| 401         | UNAUTHORIZED        | Authentication failed or API key invalid.         |
| 404         | NOT_FOUND           | Plan not found for the given merchant and plan ID.|\
| 409         | CONFLICT            | Cannot delete plan because it is in use.          |\
| 500         | DATABASE_ERROR      | Error deleting the plan from the database.        |\
| 500         | INTERNAL_ERROR      | Internal server error.                            |

## Error Handling

Refer to the [Merchants API Documentation](./merchants-api-docs.md#error-handling) for the standard error response structure and common error codes.

Specific error codes related to subscriptions include:

| Error Code | Description                                      |
|------------|--------------------------------------------------|
| NOT_FOUND  | Plan not found for the specified merchant/plan ID. |
| CONFLICT   | Plan cannot be deleted because it's in use.      |

## Data Structures

### SubscriptionPlan Object

```json
{
  "plan_id": "uuid",
  "merchant_id": "uuid",
  "organization_id": "uuid",
  "name": "string",
  "description": "string | null",
  "amount": "number",
  "currency_code": "string (CurrencyCode enum)",
  "billing_frequency": "string (BillingFrequency enum)",
  "failed_payment_action": "string (FailedPaymentAction enum) | null",
  "charge_day": "integer | null",
  "metadata": "object | null",
  "is_active": "boolean",
  "first_payment_type": "string (FirstPaymentType enum) | null",
  "created_at": "timestampz",
  "updated_at": "timestampz"
}
```
```

**2. File: `api-docs/subscriptions-test.md`**

```markdown
# Testing Subscription Plans API Endpoints

This document provides `curl` commands to test the Subscription Plans API endpoints, which operate within the context of a specific merchant.

## Setup

- Replace `YOUR_API_KEY` with your actual API key.
- Replace `YOUR_MERCHANT_ID` with a valid merchant UUID for testing.
- Replace `API_BASE_URL` if your API is hosted elsewhere (default: `https://api.lomi.africa/v1`).
- You might need to create a plan first to test GET/PATCH/DELETE endpoints. Note the `plan_id` returned by the POST request.

```bash
API_KEY="YOUR_API_KEY"
MERCHANT_ID="YOUR_MERCHANT_ID"
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
    "name": "Basic Test Plan (Monthly)",
    "amount": 500000,
    "currency_code": "XOF",
    "billing_frequency": "monthly",
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

curl -X PATCH "${API_BASE_URL}/merchants/${MERCHANT_ID}/subscriptions/${PLAN_ID_TO_UPDATE}" \
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