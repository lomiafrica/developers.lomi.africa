# Checkout Sessions API Documentation

The Checkout Sessions API allows merchants to create and manage payment sessions for their customers. A checkout session represents a payment intent that can be presented to customers via a hosted checkout page.

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

### Create a Checkout Session

Creates a new checkout session for collecting a payment.

**Endpoint:** `POST /checkout-sessions`

**Request Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| success_url | string | Yes | URL to redirect after successful payment |
| cancel_url | string | Yes | URL to redirect after cancelled payment |
| allowed_providers | array | Yes | Array of allowed payment provider codes (e.g., `ORANGE`, `WAVE`, `NOWPAYMENTS`, `MTN`). See list below. |
| amount | number | Yes | Amount to collect (in the smallest currency unit, e.g., cents for USD, centimes for XOF) |
| currency_code | string | Yes | 3-letter ISO currency code (e.g., `XOF`, `USD`). See list below. |
| title | string | No | Title displayed on the checkout page |
| public_description | string | No | Public description displayed on the checkout page |
| customer_email | string | No | Customer's email address (pre-fills checkout) |
| customer_name | string | No | Customer's full name (pre-fills checkout) |
| customer_phone | string | No | Customer's phone number (pre-fills checkout, potentially with country code) |
| product_id | string (UUID) | No | ID of an associated Lomi product |
| subscription_id | string (UUID) | No | ID of an associated Lomi subscription |
| plan_id | string (UUID) | No | ID of an associated Lomi subscription plan |
| metadata | object | No | Key-value pairs for additional custom data (max 50 keys, string values) |
| expiration_minutes | number | No | Minutes until the checkout session link expires (default: 30) |
| allow_coupon_code | boolean | No | Allow coupon codes to be applied during checkout (default: false) |

**Current Limitations & Notes:**
- While multiple currencies may be accepted by the API schema, **XOF** is the primary currency currently fully supported and tested across providers.
- Available providers are subject to merchant configuration and activation. Common codes include `ORANGE`, `WAVE`, `MTN`, `NOWPAYMENTS`.

**Example Request:**

```json
{
  "success_url": "https://example.com/success",
  "cancel_url": "https://example.com/cancel",
  "allowed_providers": ["ORANGE", "WAVE", "NOWPAYMENTS"],
  "amount": 5000,
  "currency_code": "XOF",
  "title": "Test Checkout Order #1234",
  "public_description": "Payment for test order via API",
  "customer_email": "test@example.com",
  "customer_name": "Test User",
  "customer_phone": "+221771234567", // Example Senegal number
  "metadata": { "order_id": "xyz789", "source": "api_test" },
  "expiration_minutes": 60,
  "allow_coupon_code": true
}
```

**Example Response:**

```json
{
  "data": {
    "checkout_session_id": "a465993b-98fb-49c3-9943-5b8eac17004c",
    "url": "https://checkout.lomi.africa/checkout/a465993b-98fb-49c3-9943-5b8eac17004c",
    "status": "open",
    "expires_at": "2025-04-04T15:21:49.955Z",
    "created_at": "2025-04-04T14:21:49.955Z",
    "merchant_id": "904d003c-3736-41d4-90a5-9de74d404fd7",
    "organization_id": "0979ec77-9fb1-4c9a-8c55-d7fb6c182c9c",
    "success_url": "https://example.com/success",
    "cancel_url": "https://example.com/cancel",
    "amount": 5000,
    "currency_code": "XOF",
    "allowed_providers": ["WAVE", "ORANGE"],
    "title": "Order #1234",
    "allow_coupon_code": true,
    "environment": "live"
  }
}
```

**Possible Error Responses:**

| Status Code | Error | Description |
|-------------|-------|-------------|
| 400 | Invalid request body | Request validation failed (e.g., missing required fields, invalid enum values for provider/currency). Details provided. |
| 401 | Merchant ID or Organization ID not found | Authentication failed (invalid or missing API key). |
| 500 | Failed to create checkout session | Internal server error (e.g., database issue). Details provided. |

### Get a Checkout Session

Retrieves details of a specific checkout session.

**Endpoint:** `GET /checkout-sessions/{id}`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | ID of the checkout session to retrieve |

**Example Response:**

```json
{
  "data": {
    "checkout_session_id": "a465993b-98fb-49c3-9943-5b8eac17004c",
    "merchant_id": "904d003c-3736-41d4-90a5-9de74d404fd7",
    "organization_id": "0979ec77-9fb1-4c9a-8c55-d7fb6c182c9c",
    "payment_link_id": null,
    "customer_id": null,
    "product_id": null,
    "subscription_id": null,
    "plan_id": null,
    "amount": 5000,
    "currency_code": "XOF",
    "status": "open",
    "url": "https://checkout.lomi.africa/checkout/a465993b-98fb-49c3-9943-5b8eac17004c",
    "success_url": "https://example.com/success",
    "cancel_url": "https://example.com/cancel",
    "customer_email": "customer@example.com",
    "customer_name": null,
    "customer_phone": null,
    "allowed_providers": ["WAVE", "ORANGE"],
    "metadata": null,
    "created_at": "2025-04-04T14:21:49.955Z",
    "updated_at": "2025-04-04T14:21:49.955Z",
    "expires_at": "2025-04-04T15:21:49.955Z"
  }
}
```

**Possible Error Responses:**

| Status Code | Error | Description |
|-------------|-------|-------------|
| 401 | Merchant ID not found | Authentication failed (invalid or missing API key). |
| 403 | Permission denied | The requested checkout session does not belong to the authenticated merchant. |
| 404 | Checkout session not found | No checkout session found with the provided ID. |
| 500 | Failed to retrieve checkout session | Internal server error with details |

### List Checkout Sessions

Lists all checkout sessions for a merchant with optional filtering.

**Endpoint:** `GET /checkout-sessions`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| limit | number | No | Number of sessions to return (default: 20) |
| page | number | No | Page number for pagination (default: 1) |
| status | string | No | Filter by session status (open, completed, expired) |

**Example Response:**

```json
{
  "data": [
    {
      "checkout_session_id": "a465993b-98fb-49c3-9943-5b8eac17004c",
      "merchant_id": "904d003c-3736-41d4-90a5-9de74d404fd7",
      "organization_id": "0979ec77-9fb1-4c9a-8c55-d7fb6c182c9c",
      "payment_link_id": null,
      "customer_id": null,
      "product_id": null,
      "subscription_id": null,
      "plan_id": null,
      "amount": 5000,
      "currency_code": "XOF",
      "status": "open",
      "url": "https://checkout.lomi.africa/checkout/a465993b-98fb-49c3-9943-5b8eac17004c",
      "success_url": "https://example.com/success",
      "cancel_url": "https://example.com/cancel",
      "customer_email": "customer@example.com",
      "customer_name": null,
      "customer_phone": null,
      "allowed_providers": ["WAVE", "ORANGE"],
      "metadata": null,
      "created_at": "2025-04-04T14:21:49.955Z",
      "updated_at": "2025-04-04T14:21:49.955Z",
      "expires_at": "2025-04-04T15:21:49.955Z",
      "title": "Order #1234",
      "public_description": "Payment for your recent order",
      "allow_coupon_code": true
    }
    // Additional checkout sessions...
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20
  }
}
```

**Possible Error Responses:**

| Status Code | Error | Description |
|-------------|-------|-------------|
| 401 | Merchant ID not found | Authentication failed (invalid or missing API key). |
| 500 | Failed to list checkout sessions | Internal server error (e.g., database issue). Details provided. |

## Error Handling

Error responses follow a consistent format:

```json
{
  "error": {
    "status": 400, // HTTP Status Code
    "code": "INVALID_REQUEST", // Internal Error Code (e.g., INVALID_REQUEST, DATABASE_ERROR)
    "message": "Invalid request body", // General error message
    "details": { // Optional: More specific details, often validation errors
      "currency_code": ["Invalid enum value. Expected 'XOF' | ... but received 'INVALID_CODE'"]
    },
    "timestamp": "2023-10-27T10:30:00Z"
  }
}
```

## Rate Limits

API rate limits are enforced to ensure fair usage. Check the specific limits applicable to your API key type (Test vs. Live) in your merchant dashboard or the main API overview documentation.

- Live API keys: 60 requests per minute, 10,000 requests per day
- Test API keys: 120 requests per minute, 20,000 requests per day

## Webhooks

When a checkout session's status changes (e.g., completed, expired), a relevant webhook event might be sent to your configured webhook URLs. The primary event is `CHECKOUT_COMPLETED`. Configure webhooks via the Webhooks API or the merchant dashboard.

## Supported Payment Providers

Available payment providers depend on your merchant account setup and the region. Common provider codes include:
- `ORANGE` (Orange Money)
- `WAVE`
- `MTN` (MTN Mobile Money)
- `NOWPAYMENTS` (Cryptocurrency)
- *Others may be available based on integration.*

Check your merchant dashboard for the list of providers enabled for your account.

## Supported Currencies

While the API might accept various 3-letter ISO currency codes defined in the schema (XOF, USD, EUR, GHS, NGN, KES, MRO), **XOF** is the primary currency currently supported for processing payments through most integrated providers.

Support for other currencies depends on provider availability and merchant configuration.

## Checkout Session Lifecycle

1.  **Creation:** Create a checkout session via `POST /checkout-sessions`.
2.  **Redirection:** Redirect your customer to the `url` provided in the creation response.
3.  **Payment:** The customer selects a payment method on the Lomi checkout page and attempts payment.
4.  **Completion/Cancellation:** Based on the outcome, the customer is redirected to your `success_url` or `cancel_url`.
5.  **Notification:** A `CHECKOUT_COMPLETED` webhook event is typically sent upon successful payment (if webhooks are configured).
6.  **Status Update:** The session status changes to `completed` or `expired`.

## Implementation Notes

- Checkout sessions expire after the specified `expiration_minutes` (default: 30 minutes). Expired sessions cannot be paid.
- For security, **always create checkout sessions on your server-side**, never directly from a client-side application where your API key could be exposed.
- Use Test API keys for development and integration testing.
- Consider appending the `checkout_session_id` as a query parameter to your `success_url` and `cancel_url` to easily reconcile the session on your end after redirection (e.g., `https://example.com/success?session_id={CHECKOUT_SESSION_ID}`). 