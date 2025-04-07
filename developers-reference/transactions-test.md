# Testing Transactions API Endpoints

This document contains curl commands to test the endpoints defined in the TransactionsClient and transactions.controller.

## 1. List Transactions

### List all transactions (default limit 20)

```bash
curl -X GET "https://api.lomi.africa/v1/transactions" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### List transactions with pagination (limit 5, page 2)

```bash
curl -X GET "https://api.lomi.africa/v1/transactions?limit=5&page=2" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Test pagination validation (invalid limit)

```bash
curl -X GET "https://api.lomi.africa/v1/transactions?limit=200&page=1" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Test pagination validation (invalid page)

```bash
curl -X GET "https://api.lomi.africa/v1/transactions?limit=10&page=0" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Filter transactions by status (completed)

```bash
curl -X GET "https://api.lomi.africa/v1/transactions?status=completed" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Filter transactions by multiple statuses (completed, refunded)

```bash
curl -X GET "https://api.lomi.africa/v1/transactions?status=refunded" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Filter transactions by provider (WAVE)

```bash
curl -X GET "https://api.lomi.africa/v1/transactions?provider=WAVE" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Filter transactions by date range

```bash
# Replace with actual dates in ISO 8601 format
FROM_DATE="2025-04-01T00:00:00Z"
TO_DATE="2025-04-30T23:59:59Z"

curl -X GET "https://api.lomi.africa/v1/transactions?from_date=${FROM_DATE}&to_date=${TO_DATE}" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Combined filtering and pagination

```bash
curl -X GET "https://api.lomi.africa/v1/transactions?status=completed&provider=ORANGE&limit=10&page=1" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

## 2. Get Transaction by ID

### Get details for a specific transaction

```bash
# Replace YOUR_TRANSACTION_ID with an actual valid ID from your account
curl -X GET "https://api.lomi.africa/v1/transactions/04d65e57-a107-417d-8fd7-0145ab67bce7" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Test error handling with invalid transaction ID format

```bash
curl -X GET "https://api.lomi.africa/v1/transactions/invalid-uuid-format" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Test error handling with non-existent transaction ID

```bash
# Use a valid UUID format but one that doesn't exist or belong to the API key's merchant
curl -X GET "https://api.lomi.africa/v1/transactions/00000000-0000-0000-0000-000000000000" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

## 3. Error Handling Tests

### Test with invalid API key

```bash
curl -X GET "https://api.lomi.africa/v1/transactions" \
  -H "X-API-Key: invalid_api_key"
```

### Test with missing Authorization header

```bash
curl -X GET "https://api.lomi.africa/v1/transactions"
```

## Usage Instructions

1. Open a terminal window.
2. Copy and paste the desired curl command.
3. For the "Get Transaction by ID" command, replace `YOUR_TRANSACTION_ID` with an actual transaction ID from your account.
4. Run the command to test the endpoint.
5. Review the response for success or error information. 