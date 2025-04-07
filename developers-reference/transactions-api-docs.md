# Transactions API Documentation

The Transactions API allows merchants to retrieve information about their payment transactions.

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

### List Transactions

Retrieves a list of transactions for the authenticated merchant, with optional filtering and pagination.

**Endpoint:** `GET /transactions`

**Query Parameters:**

| Parameter   | Type              | Required | Description                                                                 |
|-------------|-------------------|----------|-----------------------------------------------------------------------------|
| status      | string (enum[])   | No       | Filter by transaction status (comma-separated: pending,completed,failed,refunded,expired) |
| provider    | string (enum)     | No       | Filter by payment provider code (e.g., ORANGE, WAVE)                        |
| from_date   | string (ISO 8601) | No       | Filter transactions created on or after this date (YYYY-MM-DDTHH:mm:ssZ)      |
| to_date     | string (ISO 8601) | No       | Filter transactions created on or before this date (YYYY-MM-DDTHH:mm:ssZ)       |
| limit       | number            | No       | Maximum number of transactions to return (default: 20, max: 100)            |
| page        | number            | No       | Page number for pagination (default: 1)                                     |

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "transaction_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "merchant_id": "904d003c-3736-41d4-90a5-9de74d404fd7",
      "organization_id": "0979ec77-9fb1-4c9a-8c55-d7fb6c182c9c",
      "customer_id": "c47ac10b-58cc-4372-a567-0e02b2c3d480",
      "gross_amount": 5000,
      "fee_amount": 125,
      "net_amount": 4875,
      "fee_reference": "STANDARD_FEE",
      "currency_code": "XOF",
      "payment_method_code": "MOBILE_MONEY",
      "provider_code": "WAVE",
      "provider_transaction_id": "prov_trx_12345",
      "transaction_type": "payment",
      "product_id": null,
      "subscription_id": null,
      "status": "completed",
      "description": "Payment for Order #5678",
      "created_at": "2025-04-05T10:30:00.000Z",
      "updated_at": "2025-04-05T10:30:05.000Z",
      "metadata": { "source": "api" }
    }
    // Additional transaction objects...
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20
    // "total": 5 // Note: Total count requires RPC modification
  },
  "environment": "test"
}
```

**Possible Error Responses:**

| Status Code | Error Code        | Description                                                 |
|-------------|-------------------|-------------------------------------------------------------|
| 400         | INVALID_REQUEST   | Invalid pagination or filter parameters                     |
| 401         | UNAUTHORIZED      | Authentication failed: Merchant ID not found in request.    |
| 500         | DATABASE_ERROR    | Database operation failed while listing transactions        |
| 500         | INTERNAL_ERROR    | An unexpected internal server error occurred                |

---

### Get Transaction by ID

Retrieves details of a specific transaction belonging to the authenticated merchant.

**Endpoint:** `GET /transactions/{transaction_id}`

**Path Parameters:**

| Parameter       | Type         | Required | Description                     |
|-----------------|--------------|----------|---------------------------------|
| transaction_id  | string (UUID)| Yes      | ID of the transaction to retrieve |

**Example Response:**

```json
{
  "success": true,
  "data": {
    "transaction_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "merchant_id": "904d003c-3736-41d4-90a5-9de74d404fd7",
    "organization_id": "0979ec77-9fb1-4c9a-8c55-d7fb6c182c9c",
    "customer_id": "c47ac10b-58cc-4372-a567-0e02b2c3d480",
    "gross_amount": 5000,
    "fee_amount": 125,
    "net_amount": 4875,
    "fee_reference": "STANDARD_FEE",
    "currency_code": "XOF",
    "payment_method_code": "MOBILE_MONEY",
    "provider_code": "WAVE",
    "provider_transaction_id": "prov_trx_12345",
    "transaction_type": "payment",
    "product_id": null,
    "subscription_id": null,
    "status": "completed",
    "description": "Payment for Order #5678",
    "created_at": "2025-04-05T10:30:00.000Z",
    "updated_at": "2025-04-05T10:30:05.000Z",
    "metadata": { "source": "api" }
  },
  "environment": "test"
}
```

**Possible Error Responses:**

| Status Code | Error Code        | Description                                                  |
|-------------|-------------------|--------------------------------------------------------------|
| 400         | INVALID_REQUEST   | Invalid Transaction ID in URL format (must be UUID)          |
| 401         | UNAUTHORIZED      | Authentication failed: Merchant ID not found in request.     |
| 404         | NOT_FOUND         | Transaction not found or does not belong to this merchant    |
| 500         | DATABASE_ERROR    | Database operation failed while fetching the transaction     |
| 500         | INTERNAL_ERROR    | An unexpected internal server error occurred                 |

## Error Handling

Error responses follow a consistent format:

```json
{
  "error": {
    "status": 4xx or 5xx,
    "code": "ERROR_CODE",
    "message": "Error message description",
    "details": { /* Optional structured details */ },
    "timestamp": "ISO 8601 timestamp"
  }
}
```

## Rate Limits

- Live API keys: 60 requests per minute, 10,000 requests per day
- Test API keys: 120 requests per minute, 20,000 requests per day 