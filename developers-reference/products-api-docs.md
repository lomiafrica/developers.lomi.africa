# Products API Documentation

The Products API allows merchants to manage their products, including creation, retrieval, updates, and deletion.

## Base URL

```
https://api.lomi.africa/v1
```

## Authentication

All API requests require authentication using an API key associated with a merchant. Provide your API key in the request header:

```
X-API-Key: your_api_key
```
The merchant ID and organization ID are automatically inferred from the API key via middleware.

## Endpoints

### Create Product

Creates a new product for the authenticated merchant.

**Endpoint:** `POST /products`

**Request Body:**

```json
{
  "name": "Premium Widget",
  "description": "An optional description of the widget.",
  "price": 19.99,
  "currency_code": "XOF",
  "is_active": true,
  "image_url": "https://example.com/image.jpg",
  "display_on_storefront": true,
  "fee_type_ids": ["uuid-for-fee-1", "uuid-for-fee-2"]
}
```

| Field                 | Type      | Required | Description |
|-----------------------|-----------|----------|-------------|
| `name`                | string    | Yes      | Name of the product. |
| `description`         | string    | No       | Optional description. |
| `price`               | number    | Yes      | Price of the product (must be positive). |
| `currency_code`       | string    | Yes      | Currency code (e.g., "XOF", "USD"). See `CurrencyCode` enum. |
| `is_active`           | boolean   | No       | Whether the product is active (defaults to true). |
| `image_url`           | string    | No       | URL for the product image (must be a valid URL). |
| `display_on_storefront`| boolean   | No       | Whether to display on the storefront (defaults to true). |
| `fee_type_ids`        | string[]  | No       | Array of UUIDs for associated organization fees. |

**Success Response (201 Created):**

Returns the details of the newly created product.

```json
{
  "data": {
    "product_id": "uuid-generated-for-product",
    "merchant_id": "uuid-of-authenticated-merchant",
    "organization_id": "uuid-of-merchants-org",
    "name": "Premium Widget",
    "description": "An optional description of the widget.",
    "price": 19.99,
    "currency_code": "XOF",
    "image_url": "https://example.com/image.jpg",
    "is_active": true,
    "display_on_storefront": true,
    "created_at": "2023-10-27T10:00:00Z",
    "updated_at": "2023-10-27T10:00:00Z"
  }
}
```

**Possible Error Responses:**

| Status Code | Error Code        | Description |
|-------------|-------------------|-------------|
| 400         | INVALID_REQUEST   | Invalid request body data (check details). |
| 401         | UNAUTHORIZED      | Authentication failed or API key invalid. |
| 500         | DATABASE_ERROR    | Failed to create or retrieve the product in the database. |
| 500         | INTERNAL_ERROR    | Internal server error. |

---

### List Products

Retrieves a list of products for the authenticated merchant, with pagination.

**Endpoint:** `GET /products`

**Query Parameters:**

| Parameter  | Type    | Required | Default | Description |
|------------|---------|----------|---------|-------------|
| `limit`    | integer | No       | 20      | Maximum number of products to return. |
| `offset`   | integer | No       | 0       | Number of products to skip for pagination. |
| `is_active`| boolean | No       | (all)   | Filter products by active status (`true` or `false`). |

**Success Response (200 OK):**

Returns a list of products and pagination metadata.

```json
{
  "data": [
    {
      "product_id": "uuid-product-1",
      "merchant_id": "uuid-merchant",
      "organization_id": "uuid-org",
      "name": "Product One",
      "description": null,
      "price": 10.00,
      "currency_code": "XOF",
      "image_url": null,
      "is_active": true,
      "display_on_storefront": true,
      "created_at": "2023-10-26T10:00:00Z",
      "updated_at": "2023-10-26T10:00:00Z"
    },
    // ... more products
  ],
  "meta": {
    "total_count": 55, // Total number of products matching the filter
    "limit": 20,
    "offset": 0
  }
}
```

**Possible Error Responses:**

| Status Code | Error Code        | Description |
|-------------|-------------------|-------------|
| 400         | INVALID_REQUEST   | Invalid `limit` or `offset` parameters. |
| 401         | UNAUTHORIZED      | Authentication failed or API key invalid. |
| 500         | DATABASE_ERROR    | Failed to retrieve products from the database. |
| 500         | INTERNAL_ERROR    | Internal server error. |

---

### Get Product Details

Retrieves details for a specific product belonging to the authenticated merchant.

**Endpoint:** `GET /products/{id}`

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `id`      | string | Yes      | The unique identifier (UUID) of the product. |

**Success Response (200 OK):**

Returns the details of the specified product.

```json
{
  "data": {
    "product_id": "uuid-product-1",
    "merchant_id": "uuid-merchant",
    "organization_id": "uuid-org",
    "name": "Product One",
    "description": null,
    "price": 10.00,
    "currency_code": "XOF",
    "image_url": null,
    "is_active": true,
    "display_on_storefront": true,
    "created_at": "2023-10-26T10:00:00Z",
    "updated_at": "2023-10-26T10:00:00Z"
  }
}
```

**Possible Error Responses:**

| Status Code | Error Code        | Description |
|-------------|-------------------|-------------|
| 400         | MISSING_PARAMETER | Product ID missing from the URL path. |
| 401         | UNAUTHORIZED      | Authentication failed or API key invalid. |
| 404         | PRODUCT_NOT_FOUND | Product not found or does not belong to the merchant. |
| 500         | DATABASE_ERROR    | Failed to retrieve the product from the database. |
| 500         | INTERNAL_ERROR    | Internal server error. |

---

### Update Product

Updates the active status of a specific product belonging to the authenticated merchant.

**Important Note:** Core product details (name, description, price, currency, fees, etc.) are fixed after creation to ensure historical accuracy. To change these details, please create a new product.

**Endpoint:** `PATCH /products/{id}`

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `id`      | string | Yes      | The unique identifier (UUID) of the product to update. |

**Request Body:**

```json
{
  "is_active": false
}
```

| Field      | Type    | Required | Description |
|------------|---------|----------|-------------|
| `is_active`| boolean | Yes      | Whether the product is active. |

**Success Response (200 OK):**

Returns the full details of the updated product.

```json
{
  "data": {
    "product_id": "uuid-product-1",
    "merchant_id": "uuid-merchant",
    "organization_id": "uuid-org",
    "name": "Premium Widget",
    "description": "A description of the widget.",
    "price": 19.99,
    "currency_code": "XOF",
    "image_url": "https://example.com/image.jpg",
    "is_active": false,
    "display_on_storefront": true,
    "created_at": "2023-10-26T10:00:00Z",
    "updated_at": "2023-10-27T11:00:00Z" // Note updated timestamp
  }
}
```

**Possible Error Responses:**

| Status Code | Error Code        | Description |
|-------------|-------------------|-------------|
| 400         | MISSING_PARAMETER | Product ID missing from the URL path. |
| 400         | INVALID_REQUEST   | Invalid request body data (e.g., missing required is_active field or attempting to update immutable fields). |
| 401         | UNAUTHORIZED      | Authentication failed or API key invalid. |
| 404         | PRODUCT_NOT_FOUND | Product not found or does not belong to the merchant. |
| 500         | DATABASE_ERROR    | Failed to update or retrieve the product in the database. |
| 500         | INTERNAL_ERROR    | Internal server error. |

---

### Delete Product

Deletes a specific product belonging to the authenticated merchant.

**Endpoint:** `DELETE /products/{id}`

**Path Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `id`      | string | Yes      | The unique identifier (UUID) of the product to delete. |

**Success Response (204 No Content):**

The response body is empty on successful deletion.

**Possible Error Responses:**

| Status Code | Error Code        | Description |
|-------------|-------------------|-------------|
| 400         | MISSING_PARAMETER | Product ID missing from the URL path. |
| 401         | UNAUTHORIZED      | Authentication failed or API key invalid / user doesn't own product. |
| 404         | PRODUCT_NOT_FOUND | Product not found or does not belong to the merchant. |
| 500         | DATABASE_ERROR    | Failed to delete the product from the database. |
| 500         | INTERNAL_ERROR    | Internal server error. |

## Error Handling

Error responses follow the standardized format:

```json
{
  "error": {
    "status": 404,                      // HTTP status code
    "code": "PRODUCT_NOT_FOUND",      // Standardized error code
    "message": "Product not found",   // Human-readable message
    "details": "Additional context or validation errors (optional)",
    "timestamp": "2023-10-27T12:00:00Z" // ISO 8601 timestamp
  }
}
```

## Data Types

- **UUID:** A string representing a Universally Unique Identifier (e.g., "904d003c-3736-41d4-90a5-9de74d404fd7").
- **CurrencyCode:** String enum based on ISO 4217 codes (e.g., "XOF", "USD", "EUR").
- **Timestamps:** ISO 8601 format string (e.g., "2023-10-27T10:00:00Z"). 