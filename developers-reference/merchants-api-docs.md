# Merchants API Documentation

The Merchants API allows you to retrieve information about merchants, their monthly/annual recurring revenue, and other merchant-specific details.

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

### Get Merchant Details

Retrieves detailed information about a specific merchant.

**Endpoint:** `GET /merchants/{id}`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | The unique identifier of the merchant |

**Example Response:**

```json
{
  "data": {
    "merchant_id": "904d003c-3736-41d4-90a5-9de74d404fd7",
    "name": "Test Merchant",
    "email": "merchant@example.com",
    "phone_number": "+123456789",
    "country": "SN",
    "mrr": 50000,
    "arr": 600000,
    "merchant_lifetime_value": 1200000,
    "retry_payment_every": 3,
    "total_retries": 5,
    "metadata": {
      "industry": "e-commerce"
    },
    "created_at": "2023-01-15T10:30:00Z",
    "updated_at": "2023-02-20T14:45:00Z"
  }
}
```

**Possible Error Responses:**

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 401 | UNAUTHORIZED | Authentication failed or API key is invalid |
| 404 | MERCHANT_NOT_FOUND | No merchant found with the provided ID |
| 500 | DATABASE_ERROR | Error retrieving merchant details from database |
| 500 | INTERNAL_ERROR | Internal server error |

### Get Merchant Monthly Recurring Revenue (MRR)

Retrieves the current monthly recurring revenue for a merchant.

**Endpoint:** `GET /merchants/{id}/mrr`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | The unique identifier of the merchant |

**Example Response:**

```json
{
  "data": {
    "merchant_id": "904d003c-3736-41d4-90a5-9de74d404fd7",
    "mrr": 50000,
    "currency_code": "XOF",
    "as_of_date": "2023-04-01T00:00:00Z"
  }
}
```

**Possible Error Responses:**

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 401 | UNAUTHORIZED | Authentication failed or API key is invalid |
| 404 | MERCHANT_NOT_FOUND | No merchant found with the provided ID |
| 404 | NOT_FOUND | No MRR data found for the merchant |
| 500 | DATABASE_ERROR | Error retrieving merchant MRR from database |
| 500 | INTERNAL_ERROR | Internal server error |

### Get Merchant Annual Recurring Revenue (ARR)

Retrieves the current annual recurring revenue for a merchant.

**Endpoint:** `GET /merchants/{id}/arr`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | The unique identifier of the merchant |

**Example Response:**

```json
{
  "data": {
    "merchant_id": "904d003c-3736-41d4-90a5-9de74d404fd7",
    "arr": 600000,
    "currency_code": "XOF",
    "as_of_date": "2023-04-01T00:00:00Z"
  }
}
```

**Possible Error Responses:**

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 401 | UNAUTHORIZED | Authentication failed or API key is invalid |
| 404 | MERCHANT_NOT_FOUND | No merchant found with the provided ID |
| 404 | NOT_FOUND | No ARR data found for the merchant |
| 500 | DATABASE_ERROR | Error retrieving merchant ARR from database |
| 500 | INTERNAL_ERROR | Internal server error |

### Get Merchant Account Balance

Retrieves the current account balance for a merchant's specific currency.

**Endpoint:** `GET /merchants/{id}/balance`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | The unique identifier of the merchant |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| currency_code | string | Yes | Currency code for the balance (XOF, USD, EUR, etc.) |

**Example Response:**

```json
{
  "data": {
    "merchant_id": "904d003c-3736-41d4-90a5-9de74d404fd7",
    "currency_code": "XOF",
    "balance": 250000,
    "as_of_date": "2023-04-01T12:30:45Z"
  }
}
```

**Possible Error Responses:**

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | MISSING_PARAMETER | The currency_code query parameter is missing |
| 401 | UNAUTHORIZED | Authentication failed or API key is invalid |
| 500 | DATABASE_ERROR | Error retrieving merchant balance from database |
| 500 | INTERNAL_ERROR | Internal server error |

## Error Handling

Error responses follow a consistent format:

```json
{
  "error": {
    "status": 404,
    "code": "MERCHANT_NOT_FOUND",
    "message": "Merchant not found",
    "details": "No merchant record exists with the ID provided",
    "timestamp": "2023-04-01T12:30:45Z"
  }
}
```

## Error Codes

The API uses the following standardized error codes:

| Error Code | Description |
|------------|-------------|
| INVALID_REQUEST | The request is malformed or invalid |
| UNAUTHORIZED | Authentication is required or has failed |
| NOT_FOUND | The requested resource was not found |
| MERCHANT_NOT_FOUND | The specified merchant was not found |
| DATABASE_ERROR | An error occurred when interacting with the database |
| INTERNAL_ERROR | An internal server error occurred |
| MISSING_PARAMETER | A required parameter is missing from the request |

## Rate Limits

- Live API keys: 60 requests per minute, 10,000 requests per day
- Test API keys: 120 requests per minute, 20,000 requests per day

## Related Endpoints

- For information about connected payment providers, see the [Providers API Documentation](/api-docs/providers-api-docs.md)

## Implementation Notes

- All financial data is returned in the smallest currency unit (e.g., cents for USD, centimes for XOF)
- Dates and times are returned in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ) 