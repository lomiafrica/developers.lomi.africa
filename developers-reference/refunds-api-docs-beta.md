# Refunds API Documentation

The Refunds API allows merchants to retrieve details about refunds processed for their transactions.

## Base URL

https://api.lomi.africa/v1

## Authentication

All API requests require authentication using an API key. Provide your API key in the request header:


## Endpoints

### Get Refund Details

Retrieves details for a specific refund associated with the authenticated merchant.

**Endpoint:** `GET /refunds/{id}`

**Path Parameters:**

| Parameter | Type         | Required | Description                         |
|-----------|--------------|----------|-------------------------------------|
| id        | string (UUID)| Yes      | The unique identifier for the refund. |

**Example Request:**

```bash
curl -X GET "https://api.lomi.africa/v1/refunds/a1b2c3d4-e5f6-7890-1234-567890abcdef" \
  -H "X-API-Key: your_api_key"
```

**Example Successful Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "refund_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "transaction_id": "f0e9d8c7-b6a5-4321-fedc-ba9876543210",
    "amount": 5000.00,
    "refunded_amount": 5000.00,
    "fee_amount": 150.00,
    "reason": "Customer requested refund",
    "status": "completed", // e.g., pending, completed, failed
    "metadata": {
      "processed_by": "admin@example.com"
    },
    "created_at": "2025-04-05T10:30:00.123Z",
    "updated_at": "2025-04-05T10:35:15.456Z"
  },
  "environment": "live" // or "test"
}
```

**Response Body Fields:**

| Field             | Type           | Description                                                     |
|-------------------|----------------|-----------------------------------------------------------------|
| refund_id         | string (UUID)  | Unique identifier for the refund.                               |
| transaction_id    | string (UUID)  | ID of the original transaction being refunded.                   |
| amount            | number         | Original transaction amount (may differ from refunded amount). |
| refunded_amount   | number         | The actual amount refunded to the customer.                     |
| fee_amount        | number         | Fees associated with the original transaction.                  |
| reason            | string / null  | Reason provided for the refund.                                 |
| status            | string         | Current status of the refund (e.g., 'pending', 'completed', 'failed'). |
| metadata          | object / null  | Merchant-defined key-value pairs associated with the refund.    |
| created_at        | string (ISO8601)| Timestamp when the refund record was created.                  |
| updated_at        | string (ISO8601)| Timestamp when the refund record was last updated.             |

**Possible Error Responses:**

| Status Code | Error Code        | Message                                                  | Description                                                                 |
|-------------|-------------------|----------------------------------------------------------|-----------------------------------------------------------------------------|
| 400         | INVALID_REQUEST   | Invalid Refund ID in URL                                 | The provided refund ID does not conform to the UUID format.                 |
| 401         | UNAUTHORIZED      | Authentication failed / API key is missing / Invalid API key | The request lacks valid authentication credentials.                         |
| 404         | NOT_FOUND         | Refund not found or does not belong to this merchant       | No refund exists with the given ID for the authenticated merchant.          |
| 500         | DATABASE_ERROR    | Database operation failed                                | An error occurred while querying the database. Check details for more info. |
| 500         | INTERNAL_ERROR    | An unexpected internal server error occurred           | A generic server-side error occurred.                                       |

## Error Handling

Error responses follow a standardized format:

```json
{
  "error": {
    "status": <HTTP_STATUS_CODE>,
    "code": "<ERROR_CODE>",
    "message": "<Human-readable error message>",
    "details": <Optional structured error details or null>,
    "timestamp": "<ISO8601 timestamp>"
  }
}
```

## Rate Limits

Refer to the main API documentation for current rate limits.