# Webhook Signature Verification

Lomi uses signature verification to secure webhook deliveries. This allows you to verify that the webhook events you receive from Lomi are genuine and not from an unauthorized source.

## How It Works

When Lomi sends a webhook event to your endpoint, it includes a signature in the `X-Lomi-Signature` HTTP header. This signature is generated using HMAC with SHA-256 hash algorithm and your webhook secret.

## Verifying Signatures

To verify that a webhook was sent by Lomi, you should:

1. Get the signature from the `X-Lomi-Signature` request header
2. Get the webhook secret provided to you when you created the webhook
3. Generate a signature using the webhook request body and your secret
4. Compare the generated signature with the one in the header

## Implementation Examples

### Node.js

```javascript
const crypto = require('crypto');
const express = require('express');
const app = express();

// Use JSON middleware
app.use(express.json({
  verify: (req, res, buf) => {
    // Store the raw request body for signature verification
    req.rawBody = buf;
  }
}));

app.post('/webhooks', (req, res) => {
  // Get the signature from the header
  const signature = req.headers['x-lomi-signature'];
  
  // Your webhook secret (store securely, preferably in environment variables)
  const webhookSecret = 'whsec_your_webhook_secret';
  
  // Verify the signature
  const isValid = verifySignature(req.rawBody, signature, webhookSecret);
  
  if (!isValid) {
    console.error('Invalid webhook signature');
    return res.status(400).send('Invalid signature');
  }
  
  // Process the webhook event
  const event = req.body;
  console.log(`Received webhook: ${event.event_type}`);
  
  // Handle the event based on its type
  switch (event.event_type) {
    case 'PAYMENT_SUCCEEDED':
      // Handle payment success
      break;
    case 'SUBSCRIPTION_CREATED':
      // Handle subscription creation
      break;
    // Handle other event types
    default:
      console.log(`Unhandled event type: ${event.event_type}`);
  }
  
  // Acknowledge receipt of the webhook
  res.status(200).send({ status: 'success' });
});

function verifySignature(payload, signature, secret) {
  if (!payload || !signature || !secret) {
    return false;
  }
  
  try {
    // Create HMAC hasher with your secret
    const hmac = crypto.createHmac('sha256', secret);
    
    // Update with payload (must be a Buffer or string)
    const payloadString = payload.toString();
    hmac.update(payloadString);
    
    // Get digest as hex
    const digest = hmac.digest('hex');
    
    // Compare the calculated signature with the provided one
    return crypto.timingSafeEqual(
      Buffer.from(digest),
      Buffer.from(signature)
    );
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

app.listen(3000, () => {
  console.log('Webhook receiver listening on port 3000');
});
```

### PHP

```php
<?php
// Get the raw request body
$payload = file_get_contents('php://input');

// Get the signature from the request header
$signature = $_SERVER['HTTP_X_LOMI_SIGNATURE'] ?? '';

// Your webhook secret (store securely)
$webhookSecret = 'whsec_your_webhook_secret';

// Verify signature
if (!verifySignature($payload, $signature, $webhookSecret)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid signature']);
    exit;
}

// Process the webhook
$event = json_decode($payload, true);
echo json_encode(['status' => 'success']);

function verifySignature($payload, $signature, $secret) {
    if (empty($payload) || empty($signature) || empty($secret)) {
        return false;
    }
    
    // Calculate the expected signature
    $calculatedSignature = hash_hmac('sha256', $payload, $secret);
    
    // Compare signatures using a constant-time comparison function
    return hash_equals($calculatedSignature, $signature);
}
?>
```

### Python

```python
import hmac
import hashlib
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhooks', methods=['POST'])
def webhook_receiver():
    # Get the signature from the header
    signature = request.headers.get('X-Lomi-Signature')
    
    # Your webhook secret (store securely)
    webhook_secret = 'whsec_your_webhook_secret'
    
    # Verify the signature
    payload = request.data
    if not verify_signature(payload, signature, webhook_secret):
        return jsonify({'error': 'Invalid signature'}), 400
    
    # Process the webhook event
    event = request.json
    print(f"Received webhook: {event.get('event_type')}")
    
    return jsonify({'status': 'success'})

def verify_signature(payload, signature, secret):
    if not payload or not signature or not secret:
        return False
    
    # Calculate expected signature
    expected_signature = hmac.new(
        key=secret.encode('utf-8'),
        msg=payload,
        digestmod=hashlib.sha256
    ).hexdigest()
    
    # Compare signatures (use hmac.compare_digest for constant-time comparison)
    return hmac.compare_digest(expected_signature, signature)

if __name__ == '__main__':
    app.run(port=3000)
```

## Best Practices

1. **Store your webhook secret securely** - Never hardcode it in your application or commit it to your version control system.
2. **Use environment variables** - Store your webhook secret in environment variables or a secure secret management service.
3. **Use constant-time comparison** - Always use language-specific functions for constant-time string comparison (like `crypto.timingSafeEqual()` in Node.js, `hash_equals()` in PHP, or `hmac.compare_digest()` in Python) to prevent timing attacks.
4. **Respond quickly** - Webhook deliveries expect a quick response. Process events asynchronously if they require significant processing time.
5. **Implement idempotency** - Design your webhook handlers to be idempotent, as the same webhook might be delivered multiple times in rare cases.

## Webhook Logs and Debugging

If you're having trouble with webhooks, you can view webhook delivery logs in your Lomi dashboard. These logs show detailed information about webhook deliveries, including:

- Delivery time
- Response status code
- Response body
- Request duration

This information can help you troubleshoot issues with your webhook endpoint.

## Webhook Retry Policy

Lomi automatically retries failed webhook deliveries with an exponential backoff strategy:

- Initial retry after 5 minutes
- Second retry after 15 minutes
- Third retry after 60 minutes
- Fourth retry after 180 minutes
- Fifth retry after 360 minutes

After 5 failed attempts, the webhook will no longer be retried automatically. 