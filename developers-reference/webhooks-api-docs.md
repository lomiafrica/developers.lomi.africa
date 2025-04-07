# Webhooks API Documentation

The Webhooks API allows merchants to manage webhook endpoints to receive notifications about events occurring in their Lomi account, such as successful payments or subscription renewals.

## Base URL

`https://api.lomi.africa/v1`

## Authentication

All API requests require authentication using an API key. Provide your API key in the request header:

`X-API-Key: your_api_key`

## Webhook Events

When creating or updating a webhook, you specify which events should trigger notifications. Available events are defined by the `WebhookEvent` enum:

| Event Enum                      | Description                                    | Data Payload Type |
|---------------------------------|------------------------------------------------|-------------------|
| `PAYMENT_SUCCEEDED`             | A one-time payment is successfully completed.  | Transaction       |
| `PAYMENT_FAILED`                | A one-time payment attempt failed.             | Transaction       |
| `CHECKOUT_COMPLETED`            | A checkout session was successfully completed. | CheckoutSession   |
| `SUBSCRIPTION_CREATED`          | A new subscription is created.                 | Subscription      |
| `SUBSCRIPTION_RENEWED`          | A subscription successfully renews.            | Subscription      |
| `SUBSCRIPTION_PAYMENT_FAILED`   | A scheduled subscription payment failed.       | Subscription      |
| `SUBSCRIPTION_CANCELED`         | A subscription is canceled.                    | Subscription      |
| `REFUND_COMPLETED`              | A refund is successfully processed.            | Refund            |
| `PROVIDER_STATUS_CHANGED`       | The status of a connected provider changes.    | ProviderSetting   |
| `test.webhook`                  | A test event generated via the API.            | TestPayload       |

## Webhook Security

Lomi signs webhook events it sends to your endpoint, allowing you to verify that the events were sent by Lomi and not a third party.

*   **Signature Header:** Each webhook request includes an `X-Lomi-Signature` header.
*   **Verification:** Use the webhook's `secret` (provided only upon creation) along with the raw request body to verify the signature. Detailed instructions will be available in the developer documentation.

## Endpoints

### List Webhooks

Retrieves a list of all webhooks configured for the authenticated merchant's organization.

**Endpoint:** `GET /webhooks`

**Example Response (200 OK):**

```json
{
  "data": [
    {
      "id": "wh_a1b2c3d4e5f6",
      "organization_id": "org_f6e5d4c3b2a1",
      "url": "https://example.com/webhook-receiver",
      "events": ["PAYMENT_SUCCEEDED", "SUBSCRIPTION_RENEWED"],
      "active": true,
      "created_at": "2025-04-06T12:00:00.000Z",
      "updated_at": "2025-04-06T12:00:00.000Z",
      "description": "Primary production webhook"
    }
    // ... more webhook objects (secret is NOT included)
  ]
}
```

**Possible Error Responses:**

| Status Code | Error Code        | Description                                           |
|-------------|-------------------|-------------------------------------------------------|
| 401         | UNAUTHORIZED      | Organization ID not found in request or invalid API key. |
| 404         | NOT_FOUND         | Merchant account not found for this organization.     |
| 500         | DATABASE_ERROR    | Database operation failed while fetching webhooks.    |
| 500         | INTERNAL_ERROR    | An unexpected error occurred while listing webhooks.  |

---

### Create Webhook

Creates a new webhook endpoint for the authenticated merchant's organization. The webhook secret is returned **only** in this response. Store it securely.

**Endpoint:** `POST /webhooks`

**Request Body:**

```json
{
  "url": "https://example.com/new-webhook-receiver",
  "authorized_events": ["PAYMENT_SUCCEEDED", "PAYMENT_FAILED"],
  "description": "Webhook for payment events"
}
```

*   `url` (string, required): The HTTPS URL where Lomi should send webhook events. Must be unique per merchant.
*   `authorized_events` (array of `WebhookEvent` enums, required): List of event enums this webhook should receive. Must contain at least one valid event.
*   `description` (string, optional): A description for the webhook (stored in metadata).

**Example Response (201 Created):**

```json
{
  "data": {
      "id": "wh_new1b2c3d4e5f6",
      "organization_id": "org_f6e5d4c3b2a1",
      "url": "https://example.com/new-webhook-receiver",
      "events": ["PAYMENT_SUCCEEDED", "PAYMENT_FAILED"],
      "active": true, // Webhooks are active by default
      "created_at": "2025-04-06T14:00:00.000Z",
      "updated_at": "2025-04-06T14:00:00.000Z",
      "description": "Webhook for payment events"
  },
  "secret": "whsec_abc123def456..." // Store this secret securely! It won't be shown again.
}
```

**Possible Error Responses:**

| Status Code | Error Code        | Description                                                      |
|-------------|-------------------|------------------------------------------------------------------|
| 400         | INVALID_REQUEST   | Invalid request body (missing/invalid fields, invalid URL/events). |
| 401         | UNAUTHORIZED      | Organization ID not found in request or invalid API key.         |
| 404         | NOT_FOUND         | Merchant account not found for this organization.                |
| 409         | CONFLICT          | A webhook with this URL already exists for your organization.    |
| 500         | DATABASE_ERROR    | Database operation failed while creating the webhook.            |
| 500         | INTERNAL_ERROR    | An unexpected error occurred (e.g., fetching after creation).    |

---

### Get Webhook

Retrieves details for a specific webhook belonging to the authenticated merchant's organization. The webhook secret is **not** returned.

**Endpoint:** `GET /webhooks/{id}`

**Path Parameters:**

| Parameter | Type         | Required | Description               |
|-----------|--------------|----------|---------------------------|
| id        | string (UUID)| Yes      | ID of the webhook (starts with `wh_`) |

**Example Response (200 OK):**

```json
{
  "data": {
      "id": "wh_a1b2c3d4e5f6",
      "organization_id": "org_f6e5d4c3b2a1",
      "url": "https://example.com/webhook-receiver",
      "events": ["PAYMENT_SUCCEEDED", "SUBSCRIPTION_RENEWED"],
      "active": true,
      "created_at": "2025-04-06T12:00:00.000Z",
      "updated_at": "2025-04-06T12:15:00.000Z",
      "description": "Updated description"
  }
  // Secret is NOT included
}
```

**Possible Error Responses:**

| Status Code | Error Code        | Description                                            |
|-------------|-------------------|--------------------------------------------------------|
| 400         | INVALID_REQUEST   | Invalid Webhook ID format.                             |
| 401         | UNAUTHORIZED      | Organization ID not found in request or invalid API key. |
| 404         | NOT_FOUND         | Webhook not found or doesn't belong to the merchant. |
| 500         | DATABASE_ERROR    | Database operation failed while fetching the webhook.  |
| 500         | INTERNAL_ERROR    | An unexpected error occurred.                          |

---

### Update Webhook

Updates details for a specific webhook belonging to the authenticated merchant's organization.

**Endpoint:** `PATCH /webhooks/{id}`

**Path Parameters:**

| Parameter | Type         | Required | Description               |
|-----------|--------------|----------|---------------------------|
| id        | string (UUID)| Yes      | ID of the webhook (starts with `wh_`) |

**Request Body (include only fields to update):**

```json
{
  "url": "https://example.com/updated-webhook-receiver",
  "authorized_events": ["PAYMENT_SUCCEEDED"],
  "is_active": false,
  "description": "Updated description"
}
```

*   `url` (string, optional): The new HTTPS URL. Must be unique per merchant if changed.
*   `authorized_events` (array of `WebhookEvent` enums, optional): The new list of event enums. Must contain at least one valid event if provided.
*   `is_active` (boolean, optional): Set to `false` to disable the webhook, `true` to enable.
*   `description` (string, optional): A new description for the webhook.

**Example Response (200 OK):**

```json
{
  "data": {
      "id": "wh_a1b2c3d4e5f6",
      "organization_id": "org_f6e5d4c3b2a1",
      "url": "https://example.com/updated-webhook-receiver",
      "events": ["PAYMENT_SUCCEEDED"],
      "active": false,
      "created_at": "2025-04-06T12:00:00.000Z",
      "updated_at": "2025-04-06T14:30:00.000Z",
      "description": "Updated description"
  }
  // Secret is NOT included
}
```

**Possible Error Responses:**

| Status Code | Error Code        | Description                                                          |
|-------------|-------------------|----------------------------------------------------------------------|
| 400         | INVALID_REQUEST   | Invalid request body or Webhook ID format.                           |
| 401         | UNAUTHORIZED      | Organization ID not found in request or invalid API key.             |
| 403         | FORBIDDEN         | Permission denied (e.g., trying to update another merchant's webhook). |
| 404         | NOT_FOUND         | Webhook not found or doesn't belong to the merchant.                 |
| 409         | CONFLICT          | Attempting to change URL to one that already exists for the merchant.|
| 500         | DATABASE_ERROR    | Database operation failed while updating the webhook.                |
| 500         | INTERNAL_ERROR    | An unexpected error occurred.                                        |

---

### Delete Webhook

Deletes a specific webhook belonging to the authenticated merchant's organization.

**Endpoint:** `DELETE /webhooks/{id}`

**Path Parameters:**

| Parameter | Type         | Required | Description               |
|-----------|--------------|----------|---------------------------|
| id        | string (UUID)| Yes      | ID of the webhook (starts with `wh_`) |

**Example Response (204 No Content):**

*(No response body)*

**Possible Error Responses:**

| Status Code | Error Code        | Description                                            |
|-------------|-------------------|--------------------------------------------------------|
| 400         | INVALID_REQUEST   | Invalid Webhook ID format.                             |
| 401         | UNAUTHORIZED      | Organization ID not found in request or invalid API key. |
| 403         | FORBIDDEN         | Permission denied.                                     |
| 404         | NOT_FOUND         | Webhook not found or doesn't belong to the merchant. |
| 500         | DATABASE_ERROR    | Database operation failed while deleting the webhook.  |
| 500         | INTERNAL_ERROR    | An unexpected error occurred.                          |

---

### Test Webhook

Triggers an internal simulation of sending a test event (`test.webhook`) payload. This verifies the webhook configuration exists and belongs to the merchant but **does not actually send an HTTP request** to the configured URL.

**Endpoint:** `POST /webhooks/{id}/test`

**Path Parameters:**

| Parameter | Type         | Required | Description               |
|-----------|--------------|----------|---------------------------|
| id        | string (UUID)| Yes      | ID of the webhook (starts with `wh_`) |

**Example Response (200 OK):**

```json
{
  "data": {
    "success": true,
    "message": "Test webhook initiated successfully (simulated).",
    "webhook_id": "wh_a1b2c3d4e5f6",
    "details": "This confirms the webhook is configured correctly but does not verify the endpoint URL is reachable or processes the event."
  }
}
```

**Possible Error Responses:**

| Status Code | Error Code        | Description                                                    |
|-------------|-------------------|----------------------------------------------------------------|
| 400         | INVALID_REQUEST   | Invalid Webhook ID format.                                     |
| 401         | UNAUTHORIZED      | Organization ID not found in request or invalid API key.       |
| 403         | FORBIDDEN         | Permission denied.                                             |
| 404         | NOT_FOUND         | Webhook not found or doesn't belong to the merchant.           |
| 500         | DATABASE_ERROR    | Database operation failed while testing the webhook.           |
| 500         | INTERNAL_ERROR    | An unexpected error occurred.                                  |

---

### Get Webhook Delivery Logs

Retrieves delivery attempt logs for a specific webhook. Logs are created when Lomi attempts to send an event notification to the webhook's URL.

**Endpoint:** `GET /webhooks/{id}/logs`

**Path Parameters:**

| Parameter | Type         | Required | Description               |
|-----------|--------------|----------|---------------------------|
| id        | string (UUID)| Yes      | ID of the webhook (starts with `wh_`) |

**Query Parameters:**

| Parameter   | Type    | Required | Description                                                |
|-------------|---------|----------|------------------------------------------------------------|
| limit       | number  | No       | Max number of logs to return (default: 25, max: 100).      |
| offset      | number  | No       | Number of logs to skip for pagination (default: 0).        |
| success     | boolean | No       | If `true`, only return successful delivery attempts (status 2xx). |
| failed      | boolean | No       | If `true`, only return failed delivery attempts (status non-2xx). |

**Example Response (200 OK):**

```json
{
  "data": [
    {
      "id": "log_123abc", // Log ID
      "webhook_id": "wh_a1b2c3d4e5f6",
      "event_type": "PAYMENT_SUCCEEDED",
      "attempt_number": 1,
      "success": true,
      "response_status": 200,
      "response_body_truncated": false, // Indicates if response_body was omitted/truncated
      "request_duration_ms": 150,
      "created_at": "2025-04-06T15:00:05.000Z",
      "payload_present": true // Indicates if payload was omitted/truncated
    },
    {
      "id": "log_456def",
      "webhook_id": "wh_a1b2c3d4e5f6",
      "event_type": "SUBSCRIPTION_RENEWED",
      "attempt_number": 1,
      "success": false,
      "response_status": 503,
      "response_body_truncated": true,
      "request_duration_ms": 2000,
      "created_at": "2025-04-06T15:05:10.000Z",
      "payload_present": true
    }
    // ... more log objects
  ],
  "meta": {
    // "total": 50, // Note: Total count for pagination meta is currently not implemented
    "limit": 25,
    "offset": 0
  }
}
```
*Note: `response_body` and `payload` are generally omitted for brevity/security in the list view but might be available on a dedicated log retrieval endpoint (if implemented).*

**Possible Error Responses:**

| Status Code | Error Code        | Description                                                              |
|-------------|-------------------|--------------------------------------------------------------------------|
| 400         | INVALID_REQUEST   | Invalid Webhook ID or pagination/filter parameters.                      |
| 401         | UNAUTHORIZED      | Organization ID not found in request or invalid API key.                 |
| 403         | FORBIDDEN         | Permission denied.                                                       |
| 404         | NOT_FOUND         | Webhook not found or doesn't belong to the merchant.                   |
| 500         | DATABASE_ERROR    | Database operation failed while retrieving logs.                         |
| 500         | INTERNAL_ERROR    | An unexpected error occurred.                                            |

---

### Retry Webhook Delivery

Manually triggers a retry attempt for a specific **failed** webhook delivery log. Lomi may also have automatic retry mechanisms in place.

**Endpoint:** `POST /webhooks/{id}/logs/{logId}/retry`

**Path Parameters:**

| Parameter | Type         | Required | Description                        |
|-----------|--------------|----------|------------------------------------|
| id        | string (UUID)| Yes      | ID of the webhook (starts with `wh_`) |
| logId     | string (UUID)| Yes      | ID of the failed delivery log (starts with `log_`) |

**Example Response (200 OK):**

```json
{
  "data": {
    "success": true,
    "message": "Webhook delivery queued for retry",
    "webhook_id": "wh_a1b2c3d4e5f6",
    "log_id": "log_456def"
  }
}
```

**Possible Error Responses:**

| Status Code | Error Code        | Description                                                                      |
|-------------|-------------------|----------------------------------------------------------------------------------|
| 400         | INVALID_REQUEST   | Invalid Webhook ID or Log ID format.                                             |
| 401         | UNAUTHORIZED      | Organization ID not found in request or invalid API key.                         |
| 403         | FORBIDDEN         | Permission denied.                                                               |
| 404         | NOT_FOUND         | Webhook or Log not found, log was already successful, or max retries exceeded/permission denied. |
| 500         | DATABASE_ERROR    | Database operation failed while attempting retry.                                |
| 500         | INTERNAL_ERROR    | An unexpected error occurred.                                                    |

---