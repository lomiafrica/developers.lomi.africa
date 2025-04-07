# Providers API Documentation

The Providers API allows merchants to retrieve information about available payment providers. This information can be used to determine which payment methods to offer to customers.

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

### List Payment Providers

Retrieves a list of all available payment providers with their connection status for the authenticated merchant.

**Endpoint:** `GET /providers`

**Query Parameters:** None

**Example Response:**

```json
{
  "data": [
    {
      "code": "ORANGE",
      "name": "Orange Money",
      "description": "Pay with Orange Money mobile wallet",
      "payment_methods": ["mobile_money"],
      "is_connected": true
    },
    {
      "code": "WAVE",
      "name": "Wave",
      "description": "Pay with Wave mobile wallet",
      "payment_methods": ["mobile_money"],
      "is_connected": false
    },
    {
      "code": "NOWPAYMENTS",
      "name": "NOWPayments",
      "description": "Pay with cryptocurrency",
      "payment_methods": ["crypto"],
      "is_connected": false
    }
    // Additional providers...
  ]
}
```

**Response Properties:**

| Property | Type | Description |
|----------|------|-------------|
| code | string | Unique identifier for the payment provider |
| name | string | Display name of the payment provider |
| description | string | Brief description of the payment provider |
| payment_methods | array | List of payment method types supported by this provider |
| is_connected | boolean | Whether this provider is connected to your merchant account |

**Possible Error Responses:**

| Status Code | Error | Description |
|-------------|-------|-------------|
| 401 | Authentication required | Missing or invalid API key |
| 500 | Failed to retrieve payment providers | Internal server error with details |

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

## Rate Limits

- Live API keys: 60 requests per minute, 10,000 requests per day
- Test API keys: 120 requests per minute, 20,000 requests per day

## Implementation Notes

- Use the providers list to dynamically build payment method selection interfaces
- The list of available providers may change over time as new integrations are added
- Provider availability may also depend on merchant configuration and supported regions
- Use the provider code (e.g., "ORANGE", "WAVE") when specifying allowed providers in checkout sessions
- Only connected providers (`is_connected: true`) can be used for processing payments 