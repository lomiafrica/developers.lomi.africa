# Testing Payment Links API Endpoints

This document contains curl commands to test all the endpoints defined in `payment-links.controller.ts`.

## Setup

Replace the following values in your requests if needed:
- `API_KEY`: Your API key (e.g., `lomi_sk_test_...` or `lomi_sk_live_...`)
- `API_BASE_URL`: Your API base URL (default: `https://api.lomi.africa/v1`)
- `MERCHANT_ID`: Your Merchant ID (UUID)
- `PRODUCT_ID`: A valid Product ID (UUID) for testing product links
- `PLAN_ID`: A valid Plan ID (UUID) for testing plan links
- `LINK_ID`: The ID of a payment link created during testing (replace after creation)

## Authentication Errors

### Test with invalid API key

```bash
curl -X GET "https://api.lomi.africa/v1/payment-links" \
  -H "X-API-Key: invalid_api_key"
```

### Test with missing API key

```bash
# This should result in a 401 Unauthorized error
curl -X GET "https://api.lomi.africa/v1/payment-links"
```

## 1. Create a Payment Link

### Create a valid 'instant' link

```bash
curl -X POST "https://api.lomi.africa/v1/payment-links" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "link_type": "instant",
    "title": "API Test Instant Link",
    "price": 1000,
    "currency_code": "XOF",
    "public_description": "Instant payment via API test",
    "allowed_providers": ["WAVE", "ORANGE"],
    "success_url": "https://example.com/instant/success",
    "allow_coupon_code": false
  }'
```

### Create a valid 'product' link (replace PRODUCT_ID)

```bash
curl -X POST "https://api.lomi.africa/v1/payment-links" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "link_type": "product",
    "product_id": "7195da16-70a7-428f-bba5-2500ed96f1ca",
    "title": "API Test Product Link",
    "currency_code": "XOF",
    "public_description": "Buy product via API test",
    "allowed_providers": ["WAVE", "ORANGE"],
    "success_url": "https://example.com/product/success",
    "allow_coupon_code": true
  }'
```

### Create a valid 'plan' link (replace PLAN_ID)

```bash
curl -X POST "https://api.lomi.africa/v1/payment-links" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "link_type": "plan",
    "plan_id": "5b596486-4598-4437-b43a-0c024fd521b9",
    "title": "API Test Plan Link",
    "currency_code": "XOF",
    "public_description": "Subscribe to plan via API test",
    "allowed_providers": ["WAVE", "ORANGE"],
    "success_url": "https://example.com/plan/success",
    "allow_coupon_code": true
  }'
```

### Test error: Create with missing required fields (e.g., title)

```bash
curl -X POST "https://api.lomi.africa/v1/payment-links" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "link_type": "instant",
    "price": 1000,
    "currency_code": "XOF"
  }'
```

### Test error: Create 'instant' link without price

```bash
curl -X POST "https://api.lomi.africa/v1/payment-links" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "link_type": "instant",
    "title": "Instant link no price",
    "currency_code": "XOF"
  }'
```

### Test error: Create 'product' link without product_id

```bash
curl -X POST "https://api.lomi.africa/v1/payment-links" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "link_type": "product",
    "title": "Product link no product id",
    "currency_code": "XOF"
  }'
```

### Test error: Create with invalid link_type

```bash
curl -X POST "https://api.lomi.africa/v1/payment-links" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "link_type": "invalid_type",
    "title": "Invalid Type Test",
    "price": 500,
    "currency_code": "XOF"
  }'
```

### Test error: Create with non-existent product_id (INVALID_REFERENCE)

```bash
curl -X POST "https://api.lomi.africa/v1/payment-links" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "link_type": "product",
    "product_id": "00000000-0000-0000-0000-000000000000", # Non-existent UUID
    "title": "API Test Non-existent Product",
    "currency_code": "XOF"
  }'
```

## 2. List Payment Links

### List payment links (default pagination)

```bash
curl -X GET "https://api.lomi.africa/v1/payment-links" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### List with pagination

```bash
curl -X GET "https://api.lomi.africa/v1/payment-links?page=1&page_size=5" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### List filtered by type

```bash
curl -X GET "https://api.lomi.africa/v1/payment-links?link_type=product" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### List filtered by active status

```bash
curl -X GET "https://api.lomi.africa/v1/payment-links?is_active=true" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### List including expired

```bash
curl -X GET "https://api.lomi.africa/v1/payment-links?include_expired=true" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Test error: Invalid pagination

```bash
curl -X GET "https://api.lomi.africa/v1/payment-links?page=0&page_size=200" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

## 3. Get a Payment Link by ID

```bash
# Replace LINK_ID with an ID obtained from the create or list step
curl -X GET "https://api.lomi.africa/v1/payment-links/e7c0d911-cfc4-4e03-bb8f-64a5a710bf7b" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Test error: Get link with invalid ID format

```bash
curl -X GET "https://api.lomi.africa/v1/payment-links/invalid-link-id-format" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Test error: Get link with non-existent ID

```bash
# Use a valid UUID format but one that likely doesn't exist
curl -X GET "https://api.lomi.africa/v1/payment-links/11111111-1111-1111-1111-111111111111" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

## 4. Update a Payment Link

### Update allowed fields (e.g., activate, set expiry, change success URL)

```bash
# Replace LINK_ID with an ID obtained from the create or list step
curl -X PATCH "https://api.lomi.africa/v1/payment-links/76f0341c-6ce5-4f5a-b017-20c110c2ddd3" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "is_active": false,
    "expires_at": "2025-01-01T00:00:00Z",
    "success_url": "https://example.com/updated-success",
    "allow_coupon_code": true,
    "metadata": { "updated_via": "api_test" }
  }'
```

### Remove expiration date

```bash
# Replace LINK_ID with an ID obtained from the create or list step
curl -X PATCH "https://api.lomi.africa/v1/payment-links/LINK_ID" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "expires_at": null
  }'
```

### Test error: Update non-existent link

```bash
curl -X PATCH "https://api.lomi.africa/v1/payment-links/11111111-1111-1111-1111-111111111111" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "is_active": true
  }'
```

### Test error: Update with invalid data format (e.g., bad datetime)

```bash
# Replace LINK_ID with an ID obtained from the create or list step
curl -X PATCH "https://api.lomi.africa/v1/payment-links/LINK_ID" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee" \
  -d '{
    "expires_at": "invalid-date"
  }'
```

## 5. Delete a Payment Link

```bash
# Replace LINK_ID with an ID obtained from the create or list step
curl -X DELETE "https://api.lomi.africa/v1/payment-links/c8522de7-a822-453f-94d5-b1e7734f76c8" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Test error: Delete non-existent link

```bash
curl -X DELETE "https://api.lomi.africa/v1/payment-links/11111111-1111-1111-1111-111111111111" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

### Test error: Delete link with invalid ID format

```bash
curl -X DELETE "https://api.lomi.africa/v1/payment-links/invalid-id" \
  -H "X-API-Key: lomi_sk_5a1826c9da8e9692e6c91055cb92726ca0b9d28112f37d2f423f8690cadc9eee"
```

## Usage Instructions

1.  Replace placeholders (`YOUR_API_KEY`, `YOUR_MERCHANT_ID`, `YOUR_PRODUCT_ID`, `YOUR_PLAN_ID`, `LINK_ID`, `API_BASE_URL` if not default) with actual values.
2.  Open a terminal.
3.  Copy and paste the desired `curl` command.
4.  Run the command.
5.  Observe the HTTP status code and JSON response (or lack thereof for 204).
6.  For GET/PATCH/DELETE tests, ensure you create a link first and use its `link_id`.