# Razorpay Test Keys Configuration

## Your Test Keys

Use these test keys in your `.env` file:

```env
# Razorpay Configuration (Test Mode)
RAZORPAY_KEY_ID=rzp_test_RtBwWY3jRSpHEP
RAZORPAY_KEY_SECRET=sLWu2NBAezk6zE1sh4lFJ68j

# Frontend Razorpay Key (same as Key ID above)
VITE_RAZORPAY_KEY_ID=rzp_test_RtBwWY3jRSpHEP

# Backend API URL
VITE_API_URL=http://localhost:3001

# Backend Server Port
PORT=3001
```

## Quick Setup

1. Create a `.env` file in the root directory
2. Copy the keys above into your `.env` file
3. Run `npm install` to install dependencies
4. Start the backend: `npm run dev:server`
5. Start the frontend: `npm run dev` (in another terminal)

Or run both together: `npm run dev:all`

## Test Payment Details

Use these test card details:
- **Card Number:** `4111 1111 1111 1111`
- **CVV:** Any 3 digits (e.g., `123`)
- **Expiry:** Any future date (e.g., `12/25`)
- **Name:** Any name

## Payment Flow

1. User completes booking → Payment page
2. Clicks "Pay Now" → Razorpay checkout opens
3. Completes payment → Payment verified
4. Redirects to Payment Success page with confirmation
5. Booking saved to localStorage

## Verification

After successful payment, you'll see:
- ✅ Payment Successful message
- Booking ID
- Payment ID and Order ID
- All booking details
- Amount paid

