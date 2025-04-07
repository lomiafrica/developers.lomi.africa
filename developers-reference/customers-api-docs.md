# Customers API Documentation

The Customers API allows merchants to create and manage customer profiles. Customers can be associated with checkout sessions, subscriptions, and other resources.

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

### Create a Customer

Creates a new customer profile.

**Endpoint:** `POST /customers`

**Request Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | Customer's full name |
| email | string | No | Customer's email address |
| phone_number | string | No | Customer's phone number |
| whatsapp_number | string | No | Customer's WhatsApp number |
| country | string | No | Customer's country |
| city | string | No | Customer's city |
| address | string | No | Customer's address |
| postal_code | string | No | Customer's postal code |
| is_business | boolean | No | Whether the customer is a business (default: false) |
| metadata | object | No | Additional metadata for the customer |

**Example Request:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone_number": "+221771234567",
  "country": "Senegal",
  "city": "Dakar",
  "is_business": false
}
```

**Example Response:**

```json
{
  "data": {
    "customer_id": "b78de3c9-7f76-4f43-9c5d-19d9f5c7c985",
    "merchant_id": "904d003c-3736-41d4-90a5-9de74d404fd7",
    "organization_id": "0979ec77-9fb1-4c9a-8c55-d7fb6c182c9c",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone_number": "+221771234567",
    "whatsapp_number": null,
    "country": "Senegal",
    "city": "Dakar",
    "address": null,
    "postal_code": null,
    "is_business": false,
    "metadata": null,
    "created_at": "2025-04-04T14:21:49.955Z",
    "updated_at": "2025-04-04T14:21:49.955Z"
  }
}
```

**Possible Error Responses:**

| Status Code | Error | Description |
|-------------|-------|-------------|
| 400 | Invalid request body | Request validation failed with details about the invalid fields |
| 401 | Merchant ID or Organization ID not found | Authentication failed or API key is invalid |
| 500 | Failed to create customer | Internal server error with details |

### Get a Customer

Retrieves details of a specific customer.

**Endpoint:** `GET /customers/{id}`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | ID of the customer to retrieve |

**Example Response:**

```json
{
  "data": {
    "customer_id": "b78de3c9-7f76-4f43-9c5d-19d9f5c7c985",
    "merchant_id": "904d003c-3736-41d4-90a5-9de74d404fd7",
    "organization_id": "0979ec77-9fb1-4c9a-8c55-d7fb6c182c9c",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone_number": "+221771234567",
    "whatsapp_number": null,
    "country": "Senegal",
    "city": "Dakar",
    "address": null,
    "postal_code": null,
    "is_business": false,
    "metadata": null,
    "created_at": "2025-04-04T14:21:49.955Z",
    "updated_at": "2025-04-04T14:21:49.955Z"
  }
}
```

**Possible Error Responses:**

| Status Code | Error | Description |
|-------------|-------|-------------|
| 401 | Merchant ID not found | Authentication failed or API key is invalid |
| 404 | Customer not found | No customer found with the provided ID |
| 500 | Failed to retrieve customer | Internal server error with details |

### Update a Customer

Updates details of a specific customer.

**Endpoint:** `PATCH /customers/{id}`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | ID of the customer to update |

**Request Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | No | Customer's full name |
| email | string | No | Customer's email address |
| phone_number | string | No | Customer's phone number |
| whatsapp_number | string | No | Customer's WhatsApp number |
| country | string | No | Customer's country |
| city | string | No | Customer's city |
| address | string | No | Customer's address |
| postal_code | string | No | Customer's postal code |
| is_business | boolean | No | Whether the customer is a business |
| metadata | object | No | Additional metadata for the customer |

**Example Request:**

```json
{
  "phone_number": "+221779876543",
  "address": "123 Main St"
}
```

**Example Response:**

```json
{
  "data": {
    "customer_id": "b78de3c9-7f76-4f43-9c5d-19d9f5c7c985",
    "merchant_id": "904d003c-3736-41d4-90a5-9de74d404fd7",
    "organization_id": "0979ec77-9fb1-4c9a-8c55-d7fb6c182c9c",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone_number": "+221779876543",
    "whatsapp_number": null,
    "country": "Senegal",
    "city": "Dakar",
    "address": "123 Main St",
    "postal_code": null,
    "is_business": false,
    "metadata": null,
    "created_at": "2025-04-04T14:21:49.955Z",
    "updated_at": "2025-04-04T15:30:22.123Z"
  }
}
```

**Possible Error Responses:**

| Status Code | Error | Description |
|-------------|-------|-------------|
| 400 | Invalid request body | Request validation failed with details about the invalid fields |
| 401 | Merchant ID not found | Authentication failed or API key is invalid |
| 404 | Customer not found | No customer found with the provided ID |
| 500 | Failed to update customer | Internal server error with details |

### List Customers

Lists all customers for a merchant with optional filtering.

**Endpoint:** `GET /customers`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| limit | number | No | Number of customers to return (default: 20) |
| page | number | No | Page number for pagination (default: 1) |
| email | string | No | Filter by customer email |
| phone_number | string | No | Filter by customer phone number |

> **Note:** By default, this endpoint only returns customers who have at least one completed or refunded transaction. Newly created customers without transactions will not appear in results.

**Example Response:**

```json
{
  "data": [
    {
      "customer_id": "b78de3c9-7f76-4f43-9c5d-19d9f5c7c985",
      "merchant_id": "904d003c-3736-41d4-90a5-9de74d404fd7",
      "organization_id": "0979ec77-9fb1-4c9a-8c55-d7fb6c182c9c",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone_number": "+221779876543",
      "whatsapp_number": null,
      "country": "Senegal",
      "city": "Dakar",
      "address": "123 Main St",
      "postal_code": null,
      "is_business": false,
      "metadata": null,
      "created_at": "2025-04-04T14:21:49.955Z",
      "updated_at": "2025-04-04T15:30:22.123Z"
    },
    // Additional customers...
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
| 401 | Merchant ID not found | Authentication failed or API key is invalid |
| 500 | Failed to list customers | Internal server error with details |

### Delete a Customer

Deletes a specific customer.

**Endpoint:** `DELETE /customers/{id}`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | ID of the customer to delete |

**Example Response:**

```json
{
  "data": {
    "customer_id": "b78de3c9-7f76-4f43-9c5d-19d9f5c7c985",
    "deleted": true
  }
}
```

**Possible Error Responses:**

| Status Code | Error | Description |
|-------------|-------|-------------|
| 401 | Merchant ID not found | Authentication failed or API key is invalid |
| 404 | Customer not found | No customer found with the provided ID |
| 500 | Failed to delete customer | Internal server error with details |

## Error Handling

Error responses follow a consistent format:

```json
{
  "error": {
    "message": "Error message description",
    "details": "Additional details or structured error data"
  }
}
```

> **Note for curl users:** When making API requests with curl, avoid line breaks with backslashes (`\`) in command arguments as they can cause parsing issues. Keep your header on the same line as the command or use proper quoting.

## Rate Limits

- Live API keys: 60 requests per minute, 10,000 requests per day
- Test API keys: 120 requests per minute, 20,000 requests per day

## Webhooks

Changes to customer resources can trigger webhook events if configured. Configure webhooks in your merchant dashboard. 