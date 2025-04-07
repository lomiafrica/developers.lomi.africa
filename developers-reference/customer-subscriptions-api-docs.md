# Customer Subscriptions API Documentation

The Customer Subscriptions API allows merchants to manage recurring payments for their customers. Subscriptions are automatically created after successful transactions for subscription plans and can be managed through these endpoints.

## Base URL

```
https://api.lomi.africa/v1
```

## Authentication

All API requests require authentication using an API key. Provide your API key in the request header:

```
X-API-Key: your_api_key
```

## Endpoints

### List Customer Subscriptions

Lists all subscriptions for a merchant with optional filtering by customer ID or status.

**Endpoint:** `GET /customer-subscriptions`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| merchant_id | string (UUID) | Yes | ID of the merchant |
| customer_id | string (UUID) | No | Filter subscriptions by customer ID |
| status | string | No | Filter by subscription status (pending, active, paused, cancelled, expired, past_due, trial) |
| limit | number | No | Number of results per page (default: 20) |
| offset | number | No | Number of results to skip (default: 0) |

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "subscription_id": "5f8e3c9d-f1b4-4c0a-8e8c-dc56c7e1dde4",
      "merchant_id": "904d003c-3736-41d4-90a5-9de74d404fd7",
      "organization_id": "0979ec77-9fb1-4c9a-8c55-d7fb6c182c9c",
      "plan_id": "129208a9-23a0-4827-83f3-58f5dde344f6",
      "plan_name": "Premium Monthly Plan",
      "plan_amount": 10000,
      "plan_currency_code": "XOF",
      "plan_billing_frequency": "monthly",
      "customer_id": "7210f6c9-a9c3-4a1e-9d9c-8e8f1e6b2c3d",
      "customer_name": "John Doe",
      "customer_email": "john.doe@example.com",
      "status": "active",
      "start_date": "2025-01-01T00:00:00.000Z",
      "end_date": null,
      "next_billing_date": "2025-02-01T00:00:00.000Z",
      "metadata": { "source": "checkout_session" },
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    },
    // Additional subscriptions...
  ],
  "meta": {
    "limit": 20,
    "offset": 0,
    "total_returned": 1
  }
}
```

**Possible Error Responses:**

| Status Code | Error | Description |
|-------------|-------|-------------|
| 400 | Invalid or missing merchant_id | The merchant ID is invalid or missing |
| 401 | API key required | Authentication failed or API key is missing |
| 401 | Invalid API key | The provided API key is invalid |
| 500 | Internal server error | An unexpected error occurred |

### Get Subscription Details

Retrieves details of a specific subscription.

**Endpoint:** `GET /customer-subscriptions/{subscription_id}`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| subscription_id | string (UUID) | Yes | ID of the subscription to retrieve |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| merchant_id | string (UUID) | Yes | ID of the merchant |

**Example Response:**

```json
{
  "success": true,
  "data": {
    "subscription_id": "5f8e3c9d-f1b4-4c0a-8e8c-dc56c7e1dde4",
    "merchant_id": "904d003c-3736-41d4-90a5-9de74d404fd7",
    "organization_id": "0979ec77-9fb1-4c9a-8c55-d7fb6c182c9c",
    "plan_id": "129208a9-23a0-4827-83f3-58f5dde344f6",
    "plan_name": "Premium Monthly Plan",
    "plan_description": "Access to all premium features",
    "plan_amount": 10000,
    "plan_currency_code": "XOF",
    "plan_billing_frequency": "monthly",
    "customer_id": "7210f6c9-a9c3-4a1e-9d9c-8e8f1e6b2c3d",
    "customer_name": "John Doe",
    "customer_email": "john.doe@example.com",
    "status": "active",
    "start_date": "2025-01-01T00:00:00.000Z",
    "end_date": null,
    "next_billing_date": "2025-02-01T00:00:00.000Z",
    "metadata": { "source": "checkout_session" },
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
}
```

**Possible Error Responses:**

| Status Code | Error | Description |
|-------------|-------|-------------|
| 400 | Invalid subscription_id | The subscription ID format is invalid |
| 400 | Invalid or missing merchant_id | The merchant ID is invalid or missing |
| 401 | API key required | Authentication failed or API key is missing |
| 404 | Subscription not found | No subscription found with the provided ID |
| 500 | Internal server error | An unexpected error occurred |

### Update Subscription

Updates a subscription's status, dates, or metadata.

**Endpoint:** `PATCH /customer-subscriptions/{subscription_id}`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| subscription_id | string (UUID) | Yes | ID of the subscription to update |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| merchant_id | string (UUID) | Yes | ID of the merchant |

**Request Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | string | No | New subscription status (active, paused, cancelled, expired, past_due, trial) |
| start_date | string (ISO8601) | No | New start date for the subscription |
| end_date | string (ISO8601) | No | New end date for the subscription |
| next_billing_date | string (ISO8601) | No | New next billing date for the subscription |
| metadata | object | No | Additional metadata for the subscription (will be merged with existing metadata) |

**Note:** At least one parameter must be provided for update.

**Example Request:**

```json
{
  "status": "paused",
  "metadata": {
    "reason": "Customer requested pause",
    "updated_by": "merchant_admin"
  }
}
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "subscription_id": "5f8e3c9d-f1b4-4c0a-8e8c-dc56c7e1dde4",
    "merchant_id": "904d003c-3736-41d4-90a5-9de74d404fd7",
    "organization_id": "0979ec77-9fb1-4c9a-8c55-d7fb6c182c9c",
    "plan_id": "129208a9-23a0-4827-83f3-58f5dde344f6",
    "plan_name": "Premium Monthly Plan",
    "plan_amount": 10000,
    "plan_currency_code": "XOF",
    "plan_billing_frequency": "monthly",
    "customer_id": "7210f6c9-a9c3-4a1e-9d9c-8e8f1e6b2c3d",
    "customer_name": "John Doe",
    "customer_email": "john.doe@example.com",
    "status": "paused",
    "start_date": "2025-01-01T00:00:00.000Z",
    "end_date": null,
    "next_billing_date": "2025-02-01T00:00:00.000Z",
    "metadata": {
      "source": "checkout_session",
      "reason": "Customer requested pause",
      "updated_by": "merchant_admin"
    },
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-15T10:30:00.000Z"
  }
}
```

**Possible Error Responses:**

| Status Code | Error | Description |
|-------------|-------|-------------|
| 400 | Invalid subscription_id | The subscription ID format is invalid |
| 400 | Invalid or missing merchant_id | The merchant ID is invalid or missing |
| 400 | At least one field must be provided for update | Request body is empty |
| 400 | Invalid request data | The request body contains invalid data |
| 401 | API key required | Authentication failed or API key is missing |
| 404 | Subscription not found or update failed | No subscription found with the provided ID |
| 500 | Internal server error | An unexpected error occurred |

### Cancel Subscription

Cancels a subscription, setting its status to 'cancelled'.

**Endpoint:** `DELETE /customer-subscriptions/{subscription_id}`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| subscription_id | string (UUID) | Yes | ID of the subscription to cancel |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| merchant_id | string (UUID) | Yes | ID of the merchant |

**Example Response:**

```json
{
  "success": true,
  "data": {
    "subscription_id": "5f8e3c9d-f1b4-4c0a-8e8c-dc56c7e1dde4",
    "merchant_id": "904d003c-3736-41d4-90a5-9de74d404fd7",
    "organization_id": "0979ec77-9fb1-4c9a-8c55-d7fb6c182c9c",
    "plan_id": "129208a9-23a0-4827-83f3-58f5dde344f6",
    "plan_name": "Premium Monthly Plan",
    "plan_amount": 10000,
    "plan_currency_code": "XOF",
    "plan_billing_frequency": "monthly",
    "customer_id": "7210f6c9-a9c3-4a1e-9d9c-8e8f1e6b2c3d",
    "customer_name": "John Doe",
    "customer_email": "john.doe@example.com",
    "status": "cancelled",
    "start_date": "2025-01-01T00:00:00.000Z",
    "end_date": "2025-01-15T00:00:00.000Z",
    "next_billing_date": null,
    "metadata": { "source": "checkout_session" },
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-15T10:30:00.000Z"
  }
}
```

**Possible Error Responses:**

| Status Code | Error | Description |
|-------------|-------|-------------|
| 400 | Invalid subscription_id | The subscription ID format is invalid |
| 400 | Invalid or missing merchant_id | The merchant ID is invalid or missing |
| 401 | API key required | Authentication failed or API key is missing |
| 404 | Subscription not found or cancellation failed | No subscription found with the provided ID |
| 409 | Cannot cancel subscription with status "..." | Only active, paused, pending or trial subscriptions can be cancelled |
| 500 | Internal server error | An unexpected error occurred |

## Error Handling

Error responses follow a consistent format:

```json
{
  "error": {
    "status": 400,
    "code": "INVALID_REQUEST",
    "message": "Error message description",
    "details": "Additional details or structured error data",
    "timestamp": "2025-01-15T10:30:00.000Z"
  }
}
```

## Subscription Statuses

| Status | Description |
|--------|-------------|
| pending | Subscription has been created but is not yet active |
| active | Subscription is active and billing normally |
| paused | Subscription is temporarily paused (no billing) |
| cancelled | Subscription has been cancelled by the merchant or customer |
| expired | Subscription has reached its end date |
| past_due | Payment for the subscription has failed but is being retried |
| trial | Subscription is in a trial period before regular billing begins |

## Webhook Events

Subscription-related events are sent to your configured webhook endpoints:

* `SUBSCRIPTION_CREATED` - When a new subscription is created
* `SUBSCRIPTION_RENEWED` - When a subscription is successfully renewed (new billing cycle)
* `SUBSCRIPTION_CANCELED` - When a subscription is cancelled

Configure webhooks in your merchant dashboard to receive these notifications.

## Notes

* Subscriptions are primarily created as a result of successful transactions for subscription plans, not directly through the API
* A subscription's status will automatically change to "expired" when the end_date is reached
* Billing is handled automatically according to the plan's billing_frequency and the subscription's next_billing_date 