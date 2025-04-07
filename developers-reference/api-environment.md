# API Environments

lomi. provides two separate environments for API integration:

1. **Live Environment** - For production use with real transactions
2. **Test Environment** - For development and testing without affecting real data

## API Keys

API keys are environment-specific. You'll need separate keys for test and live environments:

- Test keys start with `lomi_sk_test_`
- Live keys start with `lomi_sk_live_`

## Test Environment

The test environment allows you to develop and test your integration without processing real transactions or affecting live data.

### Features

- Full API functionality identical to the live environment
- Simulated payments, subscriptions, and webhooks
- Higher rate limits for aggressive testing
- Test environment flag in all responses to differentiate from live data

### Base URL

The test environment uses a different base URL:

```
https://sandbox.api.lomi.africa/v1
```

### Response Flags

All responses in the test environment include environment indicators:

```json
{
  "data": {
    "id": "cus_123456789",
    "name": "Test Customer",
    "environment": "test",
    "test": true
  }
}
```

The `environment` field indicates the current environment (`test` or `live`), and the `test` flag is only present in the test environment.

## Live Environment

The live environment processes real transactions and affects real data.

### Base URL

The live environment uses the following base URL:

```
https://api.lomi.africa/v1
```

### Response Format

Live environment responses include an environment indicator but no test flag:

```json
{
  "data": {
    "id": "cus_123456789",
    "name": "Real Customer",
    "environment": "live"
  }
}
```

## Rate Limits

Rate limits differ between environments:

| Environment | Requests per minute | Requests per day |
|-------------|--------------------:|----------------:|
| Test        | 120                 | 20,000          |
| Live        | 60                  | 10,000          |

## Webhooks

Webhooks work identically in both environments, but with different data:

- Test environment webhooks contain simulated data with the test flag
- Live environment webhooks contain real transaction data
- Both environments use the same signature verification mechanism

## Best Practices

1. **Always use test keys for development** - Never use live keys for testing or development work
2. **Check the environment flags** - Verify the `environment` field and `test` flag in responses
3. **Use environment-specific webhooks** - Configure separate webhook endpoints for test and live environments
4. **Test thoroughly before going live** - Complete the entire payment flow in the test environment before switching to live
5. **Handle test data properly** - Ensure your application treats test data appropriately (e.g., clearly marking test data in your UI)

## Switching Environments

To switch environments, simply use the appropriate API key and base URL in your requests. You don't need to change any API endpoints or parameters. 