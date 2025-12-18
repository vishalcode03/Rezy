# Razorpay Payment Gateway Integration

This project has been integrated with Razorpay payment gateway for secure payment processing.

## Setup Instructions

### 1. Get Razorpay Test Keys

1. Sign up or log in to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to **Settings** → **API Keys**
3. Generate test API keys (Key ID and Key Secret)
4. Copy both keys

### 2. Configure Environment Variables

Create a `.env` file in the root directory (or update existing one) with the following variables:

```env
# Razorpay Configuration (Test Mode)
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# Frontend Razorpay Key (same as above, but with VITE_ prefix)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here

# Backend API URL
VITE_API_URL=http://localhost:3001

# Backend Server Port
PORT=3001

# Existing Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### 3. Install Dependencies

```bash
npm install
```

This will install:
- `razorpay` - Razorpay Node.js SDK
- `express` - Backend server framework
- `cors` - CORS middleware
- `dotenv` - Environment variable management
- `concurrently` - Run frontend and backend together

### 4. Run the Application

#### Option 1: Run Frontend and Backend Separately

**Terminal 1 - Backend Server:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

#### Option 2: Run Both Together
```bash
npm run dev:all
```

The backend server will run on `http://localhost:3001` and the frontend on `http://localhost:8080`.

## How It Works

### Payment Flow

1. **User clicks "Pay Now"** on the Payment page
2. **Frontend creates order** - Calls `/api/create-order` endpoint
3. **Backend creates Razorpay order** - Returns order ID and amount
4. **Razorpay checkout opens** - User completes payment
5. **Payment verification** - Frontend calls `/api/verify-payment` with payment details
6. **Backend verifies signature** - Ensures payment is authentic
7. **Success page** - User is redirected to `/payment-success` with booking confirmation

### API Endpoints

#### POST `/api/create-order`
Creates a Razorpay order.

**Request Body:**
```json
{
  "amount": 100,
  "currency": "INR",
  "receipt": "receipt_1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "order_xxxxx",
  "amount": 10000,
  "currency": "INR"
}
```

#### POST `/api/verify-payment`
Verifies the payment signature.

**Request Body:**
```json
{
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "signature_xxxxx"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "orderId": "order_xxxxx",
  "paymentId": "pay_xxxxx"
}
```

## Test Mode

The integration uses Razorpay test mode. Use these test card details:

- **Card Number:** `4111 1111 1111 1111`
- **CVV:** Any 3 digits (e.g., `123`)
- **Expiry:** Any future date (e.g., `12/25`)
- **Name:** Any name

For UPI, use test UPI IDs like:
- `success@razorpay`
- `failure@razorpay`

## Production Setup

When moving to production:

1. Switch to **Live Mode** in Razorpay Dashboard
2. Generate **Live API Keys**
3. Update `.env` with live keys
4. Update `VITE_API_URL` to your production backend URL
5. Ensure backend server is deployed and accessible

## File Structure

```
├── server/
│   └── index.js          # Express backend with Razorpay APIs
├── src/
│   ├── pages/
│   │   ├── Payment.tsx    # Payment page with Razorpay checkout
│   │   └── PaymentSuccess.tsx  # Success page after payment
│   └── App.tsx            # Routes configuration
└── .env                   # Environment variables
```

## Troubleshooting

### Payment gateway not loading
- Check if Razorpay script is loading in browser console
- Verify `VITE_RAZORPAY_KEY_ID` is set correctly

### Order creation fails
- Verify backend server is running on port 3001
- Check `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env`
- Check backend server logs for errors

### Payment verification fails
- Ensure backend has correct `RAZORPAY_KEY_SECRET`
- Check that payment details are being sent correctly from frontend

### CORS errors
- Backend has CORS enabled for all origins (development)
- For production, configure CORS to allow only your frontend domain

## Security Notes

- Never expose `RAZORPAY_KEY_SECRET` in frontend code
- Always verify payment signature on backend
- Use HTTPS in production
- Store sensitive keys in environment variables only

