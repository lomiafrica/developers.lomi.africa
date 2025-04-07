# Testing Providers API Endpoints

This document contains curl commands to test all the endpoints defined in the ProvidersClient and providers.controller.

## Setup

Replace the following values in your requests if needed:
- `API_KEY`: Your API key (lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee)
- `API_BASE_URL`: Your API base URL (default: https://api.lomi.africa/v1)

## 1. List Providers

### Retrieve all available payment providers

```bash
curl -X GET "https://api.lomi.africa/v1/providers" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

Expected successful response:

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
    // Additional providers as configured in your system
  ]
}
```

## 2. Error Handling Tests

### Test with invalid API key

```bash
curl -X GET "https://api.lomi.africa/v1/providers" \
  -H "X-API-Key: invalid_api_key"
```

Expected error response:

```json
{
  "error": {
    "message": "Invalid API key",
    "details": "The provided API key is invalid or does not exist"
  }
}
```

### Test with missing API key header

```bash
curl -X GET "https://api.lomi.africa/v1/providers"
```

Expected error response:

```json
{
  "error": {
    "message": "Missing API key",
    "details": "API key is required for authentication"
  }
}
```

## Usage Instructions

1. Open a terminal window.
2. Copy and paste the desired curl command.
3. Replace any placeholder values as needed.
4. Run the command to test the endpoint.
5. Review the response for success or error information.

## Integration Examples

### Using the providers list in your application

The providers list can be used to dynamically build payment method selection interfaces. Here's an example of how to fetch providers and display only connected ones to users:

```javascript
// Example using fetch API
fetch('https://api.lomi.africa/v1/providers', {
  headers: {
    'X-API-Key': 'your_api_key'
  }
})
.then(response => response.json())
.then(data => {
  // Filter only connected providers
  const connectedProviders = data.data.filter(provider => provider.is_connected);
  
  // Use provider data to build UI
  const selectElement = document.getElementById('payment-method-select');
  
  connectedProviders.forEach(provider => {
    const option = document.createElement('option');
    option.value = provider.code;
    option.textContent = provider.name;
    selectElement.appendChild(option);
  });
})
.catch(error => console.error('Error fetching providers:', error));
```

**Note**: Only providers that are connected to your merchant account (`is_connected: true`) should be offered as payment options to your customers. 