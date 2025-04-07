# Payment Links API Documentation

The Payment Links API allows merchants to create, manage, and retrieve shareable links for collecting payments for specific products, subscription plans, or instant amounts.

## Base URL

https://api.lomi.africa/v1

## Authentication

All API requests require authentication using an API key. Provide your API key in the request header:

X-API-Key: your_api_key


## Endpoints

### Create a Payment Link

Creates a new payment link. The type of link (`product`, `plan`, `instant`) determines which other parameters are required (`product_id`, `plan_id`, or `price` respectively).

**Endpoint:** `POST /payment-links`

**Request Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| merchant_id | string (UUID) | No | ID of the merchant creating the link. **Note:** This is typically inferred from the API key via authentication middleware and does not need to be provided in the request body. |
| organization_id | string (UUID) | No | ID of the organization. (Inferred from `merchant_id` if not provided). |
| link_type | string | Yes | Type of payment link (`product`, `plan`, `instant`). |
| title | string | Yes | Title displayed on the payment link page. |
| currency_code | string | Yes | 3-letter ISO currency code (e.g., `XOF`). |
| product_id | string (UUID) | Yes (if `link_type` is `product`) | ID of the Lomi product associated with this link. |
| plan_id | string (UUID) | Yes (if `link_type` is `plan`) | ID of the Lomi subscription plan associated with this link. |
| price | number | Yes (if `link_type` is `instant`) | Amount to collect for an instant payment link. |
| public_description | string | No | Public description displayed on the payment link page. |
| private_description | string | No | Internal description for the merchant (not shown to customer). |
| allowed_providers | array | No | Array of allowed payment provider codes (e.g., `ORANGE`, `WAVE`). If empty or null, uses merchant defaults. |
| allow_coupon_code | boolean | No | Allow coupon codes to be applied (default: false). |
| is_active | boolean | No | Whether the link is active upon creation (default: true). |
| expires_at | string (datetime) | No | ISO 8601 timestamp when the link should expire. |
| success_url | string (URL) | No | URL to redirect after successful payment. Defaults to organization settings or Lomi default. |
| cancel_url | string (URL) | No | URL to redirect after cancelled payment. Defaults to organization settings or Lomi default. |
| metadata | object | No | Key-value pairs for additional custom data. |

**Example Request (Instant Link):**

```json
{
  "link_type": "instant",
  "title": "Consultation Fee",
  "price": 15000,
  "currency_code": "XOF",
  "public_description": "One-hour consultation session",
  "allowed_providers": ["WAVE", "ORANGE"],
  "success_url": "https://example.com/consultation-success",
  "allow_coupon_code": false
}
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "link_id": "d7e8f0a1-b2c3-4d5e-8f9a-0b1c2d3e4f5a",
    "merchant_id": "904d003c-3736-41d4-90a5-9de74d404fd7",
    "organization_id": "0979ec77-9fb1-4c9a-8c55-d7fb6c182c9c",
    "link_type": "instant",
    "url": "https://pay.lomi.africa/instant/d7e8f0a1-b2c3-4d5e-8f9a-0b1c2d3e4f5a",
    "product_id": null,
    "product_name": null,
    "product_price": null,
    "plan_id": null,
    "plan_name": null,
    "plan_amount": null,
    "title": "Consultation Fee",
    "public_description": "One-hour consultation session",
    "private_description": null,
    "price": 15000.00,
    "currency_code": "XOF",
    "allowed_providers": ["WAVE", "ORANGE"],
    "allow_coupon_code": false,
    "is_active": true,
    "expires_at": null,
    "success_url": "https://example.com/consultation-success",
    "metadata": null,
    "created_at": "2023-10-27T10:00:00.000Z",
    "updated_at": "2023-10-27T10:00:00.000Z"
  }
}
```

**Possible Error Responses:**

| Status Code | Code | Description |
|-------------|------|-------------|
| 400 | INVALID_REQUEST | Request validation failed (e.g., missing required fields, invalid enum values, missing conditional field like `price` for `instant` type). Details provided. |
| 400 | INVALID_REFERENCE | `product_id` or `plan_id` provided does not exist. |
| 401 | UNAUTHORIZED | Authentication failed or `merchant_id` missing from context/body. |
| 404 | NOT_FOUND | Could not determine `organization_id` for the given `merchant_id`. |
| 409 | RESOURCE_CONFLICT | Creation failed due to a conflict, likely a duplicate URL or constraint violation. |
| 500 | DATABASE_ERROR | Failed to execute the create operation in the database. |
| 500 | INTERNAL_ERROR | Unexpected server error. |

---

### List Payment Links

Lists payment links for the authenticated merchant, with optional filtering and pagination.

**Endpoint:** `GET /payment-links`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| link_type | string | No | Filter by link type (`product`, `plan`, `instant`). |
| currency_code | string | No | Filter by 3-letter ISO currency code (e.g., `XOF`). |
| is_active | boolean | No | Filter by active status (`true` or `false`). |
| page | number | No | Page number for pagination (default: 1). |
| page_size | number | No | Number of items per page (default: 50, max: 100). |
| include_expired | boolean | No | Include expired links in the results (default: false). |

**Example Request:**

DELETE /payment-links/d7e8f0a1-b2c3-4d5e-8f9a-0b1c2d3e4f5a


**Example Response:**

*   **Status Code:** `204 No Content` (On successful deletion)

**Possible Error Responses:**

| Status Code | Code | Description |
|-------------|------|-------------|
| 400 | INVALID_REQUEST | Invalid `link_id` format provided in the path. |
| 401 | UNAUTHORIZED | Authentication failed (invalid or missing API key). |
| 404 | NOT_FOUND | No payment link found with the provided `link_id` for the authenticated merchant (pre-delete check failed or link already deleted). |
| 500 | DATABASE_ERROR | Failed to delete the payment link from the database. |
| 500 | INTERNAL_ERROR | Unexpected server error. |

---

### Update Payment Link

Updates configurable details of a payment link. 

**Important:** Core link details (title, description, price/product/plan, currency, quantity settings) AND the `is_active` status are fixed after creation and cannot be changed via this API endpoint. To modify these, create a new link or use internal tools if available.

**Endpoint:** `PATCH /payment-links/{link_id}`

**Parameters:**

| Parameter | Location | Type | Required | Description |
|-----------|----------|------|----------|-------------|
| link_id | path | string (UUID) | Yes | ID of the payment link to update. |

**Request Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| expires_at | string (datetime) | No | ISO 8601 timestamp when the link should expire. Set to `null` to remove expiration. |
| success_url | string (URL) | No | URL to redirect after successful payment. |
| cancel_url | string (URL) | No | URL to redirect after cancelled payment. |
| allowed_providers | array | No | Array of allowed payment provider codes (e.g., `ORANGE`, `WAVE`). Replaces the existing list. |
| allow_coupon_code | boolean | No | Enable or disable coupon code usage for this link. |
| metadata | object | No | Key-value pairs for additional custom data. Replaces existing metadata. |

**Example Request:**

```json
{
  "expires_at": "2025-12-31T23:59:59Z",
  "success_url": "https://example.com/new-success",
  "allow_coupon_code": true,
  "allowed_providers": ["WAVE"],
  "metadata": { "source": "api_update" }
}
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    // ... updated payment link object ...
  }
}
```

**Possible Error Responses:**

| Status Code | Code | Description |
|-------------|------|-------------|
| 400 | INVALID_REQUEST | Request validation failed (e.g., invalid URL format). Details provided. |
| 401 | UNAUTHORIZED | Authentication failed (invalid or missing API key). |
| 404 | NOT_FOUND | No payment link found with the provided `link_id` for the authenticated merchant. |
| 500 | DATABASE_ERROR | Failed to execute the update operation in the database. |
| 500 | INTERNAL_ERROR | Unexpected server error. |

---

## Error Handling

Error responses follow a consistent format:

```json
{
  "error": {
    "status": 400, // HTTP Status Code
    "code": "INVALID_REQUEST", // Internal Error Code
    "message": "Invalid request data", // General error message
    "details": { // Optional: More specific details
      "link_type": ["Invalid enum value. Expected 'product' | 'plan' | 'instant' but received 'other'"]
    },
    "timestamp": "2023-10-27T10:30:00Z"
  }
}
```

Common error codes include: `INVALID_REQUEST`, `UNAUTHORIZED`, `NOT_FOUND`, `RESOURCE_CONFLICT`, `INVALID_REFERENCE`, `DATABASE_ERROR`, `INTERNAL_ERROR`.

## Rate Limits

API rate limits apply. Refer to the main API overview documentation or your merchant dashboard for specific limits based on your API key type (Test vs. Live). Typically:
- Live: 60 requests/minute, 10,000 requests/day
- Test: 120 requests/minute, 20,000 requests/day

## Supported Enums

*   **PaymentLinkType:** `product`, `plan`, `instant`
*   **CurrencyCode:** Primarily `XOF`. Others like `USD`, `EUR`, `GHS`, `NGN`, `KES`, `MRO` might be defined but support depends on provider integration.
*   **ProviderCode:** `ORANGE`, `WAVE`, `MTN`, `NOWPAYMENTS`, etc. (Check merchant dashboard for enabled providers).

## Implementation Notes

- For security, create and manage payment links from your server-side application. Do not expose your API key in client-side code.
- Use Test API keys for development and testing.
- When creating a link, ensure the corresponding `product_id` or `plan_id` exists if using `product` or `plan` types.
- The `url` field in the response is the customer-facing URL for the payment link.