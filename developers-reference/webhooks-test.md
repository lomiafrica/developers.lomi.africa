# Testing Webhooks API Endpoints

This document contains curl commands to test all the endpoints defined in `webhook.controller.ts`.

## Setup

Replace the following values in your requests if needed:
- `API_KEY`: Your API key (e.g., `lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee`)
- `API_BASE_URL`: Your API base URL (default: `https://api.lomi.africa/v1`)
- `WEBHOOK_ID`: The ID of a webhook created during testing (replace after creation)
- `LOG_ID`: The ID of a webhook delivery log retrieved during testing (replace after retrieval)

## Authentication Errors

### Test with invalid API key

```bash
curl -X GET "https://api.lomi.africa/v1/webhooks" \
  -H "X-API-Key: invalid_api_key"
```

### Test with missing API key (will likely depend on gateway/middleware setup)

```bash
# This might result in a different error (e.g., 403 Forbidden from gateway)
curl -X GET "https://api.lomi.africa/v1/webhooks"
```

## 1. Create a Webhook

### Create a valid webhook

```bash
curl -X POST "https://api.lomi.africa/v1/webhooks" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "url": "https://example.com/webhook-test-receiver-1",
    "authorized_events": ["PAYMENT_SUCCEEDED", "SUBSCRIPTION_RENEWED"],
    "description": "Test webhook for payments"
  }'
```
**Note:** Record the `id` (WEBHOOK_ID) and `secret` from the response for subsequent tests.

### Test error: Create with duplicate URL

```bash
# Assuming the previous command succeeded
curl -X POST "https://api.lomi.africa/v1/webhooks" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "url": "https://example.com/webhook-test-receiver-1",
    "authorized_events": ["PAYMENT_FAILED"],
    "description": "Attempt to create duplicate URL"
  }'
```

### Test error: Create with invalid payload (missing URL)

```bash
curl -X POST "https://api.lomi.africa/v1/webhooks" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "authorized_events": ["PAYMENT_SUCCEEDED"]
  }'
```

### Test error: Create with invalid event type

```bash
curl -X POST "https://api.lomi.africa/v1/webhooks" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "url": "https://example.com/webhook-test-receiver-invalid-event",
    "authorized_events": ["INVALID_EVENT_TYPE"]
  }'
```

## 2. List Webhooks

```bash
curl -X GET "https://api.lomi.africa/v1/webhooks" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```
**Note:** Verify that the webhook `secret` is **not** included in the response.

## 3. Get a Webhook by ID

```bash
# Replace WEBHOOK_ID with an ID obtained from the create or list step
curl -X GET "https://api.lomi.africa/v1/webhooks/WEBHOOK_ID" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```
**Note:** Verify that the webhook `secret` is **not** included in the response.

### Test error: Get webhook with invalid ID format

```bash
curl -X GET "https://api.lomi.africa/v1/webhooks/invalid-webhook-id-format" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Test error: Get webhook with non-existent ID

```bash
# Use a valid UUID format but one that doesn't exist
curl -X GET "https://api.lomi.africa/v1/webhooks/00000000-0000-0000-0000-000000000000" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

## 4. Update a Webhook

### Update webhook URL and events

```bash
# Replace WEBHOOK_ID with an ID obtained from the create or list step
curl -X PATCH "https://api.lomi.africa/v1/webhooks/WEBHOOK_ID" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "url": "https://example.com/webhook-test-receiver-updated",
    "authorized_events": ["PAYMENT_FAILED"],
    "description": "Updated test webhook",
    "is_active": false
  }'
```

### Test error: Update with duplicate URL (to another existing webhook)

```bash
# First, create a second webhook
# curl -X POST ... -d '{ "url": "https://example.com/webhook-test-receiver-2", ... }'
# Then, try to update the first webhook (WEBHOOK_ID) to use the second one's URL
# Replace WEBHOOK_ID with the ID of the first webhook
curl -X PATCH "https://api.lomi.africa/v1/webhooks/WEBHOOK_ID" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "url": "https://example.com/webhook-test-receiver-2"
  }'
```

### Test error: Update non-existent webhook

```bash
curl -X PATCH "https://api.lomi.africa/v1/webhooks/00000000-0000-0000-0000-000000000000" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "is_active": true
  }'
```

## 5. Test a Webhook

```bash
# Replace WEBHOOK_ID with an ID obtained from the create or list step
curl -X POST "https://api.lomi.africa/v1/webhooks/1b73c9e4-6ccd-4217-800e-aaf315f804da/test" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Test error: Test non-existent webhook

```bash
curl -X POST "https://api.lomi.africa/v1/webhooks/00000000-0000-0000-0000-000000000000/test" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

## 6. Get Webhook Delivery Logs

### Get logs for a specific webhook

```bash
# Replace WEBHOOK_ID with an ID obtained from the create or list step
curl -X GET "https://api.lomi.africa/v1/webhooks/414cbe60-a01d-46cb-893c-89fcff912a0d/logs" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Get logs with pagination

```bash
# Replace WEBHOOK_ID with an ID obtained from the create or list step
curl -X GET "https://api.lomi.africa/v1/webhooks/WEBHOOK_ID/logs?limit=5&offset=5" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Get logs filtered by success status

```bash
# Replace WEBHOOK_ID with an ID obtained from the create or list step
curl -X GET "https://api.lomi.africa/v1/webhooks/414cbe60-a01d-46cb-893c-89fcff912a0d/logs?success=true" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Get logs filtered by failure status

```bash
# Replace WEBHOOK_ID with an ID obtained from the create or list step
curl -X GET "https://api.lomi.africa/v1/webhooks/414cbe60-a01d-46cb-893c-89fcff912a0d/logs?failed=true" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Test error: Get logs for non-existent webhook

```bash
curl -X GET "https://api.lomi.africa/v1/webhooks/00000000-0000-0000-0000-000000000000/logs" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

## 7. Retry Webhook Delivery

**Note:** This requires identifying a specific failed delivery `LOG_ID` from the `GET /logs` endpoint first.

### Retry a specific failed delivery

```bash
# Replace WEBHOOK_ID and LOG_ID with actual IDs from previous steps
curl -X POST "https://api.lomi.africa/v1/webhooks/414cbe60-a01d-46cb-893c-89fcff912a0d/logs/LOG_ID/retry" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```