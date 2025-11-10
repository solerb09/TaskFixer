# Quick Start: Development Setup

Follow these steps to set up your local development environment with test credentials.

## Step 1: Get Stripe Test Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Click "Developers" → "API keys"
3. Toggle to **TEST MODE** (top right should say "Test mode")
4. Copy these keys:
   - **Secret key**: `sk_test_...`
   - **Publishable key**: `pk_test_...`

## Step 2: Create Test Products in Stripe

1. Go to https://dashboard.stripe.com/test/products
2. Create a new product: "TaskFixerAI Educator Plan (Monthly)"
   - Price: $29.99/month
   - Copy the Price ID: `price_test_...`
3. Create another product: "TaskFixerAI Educator Plan (Annual)"
   - Price: $299.99/year
   - Copy the Price ID: `price_test_...`

## Step 3: Update .env.local

Open `.env.local` and replace the placeholders:

```bash
# Replace these:
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_TEST_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_TEST_KEY
NEXT_PUBLIC_STRIPE_EDUCATOR_MONTHLY_PRICE_ID=price_test_YOUR_MONTHLY_PRICE
NEXT_PUBLIC_STRIPE_EDUCATOR_ANNUAL_PRICE_ID=price_test_YOUR_ANNUAL_PRICE
```

## Step 4: Set Up Stripe CLI (for webhooks)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server (keep this running in a separate terminal)
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy the webhook secret (whsec_...) and add to .env.local
```

## Step 5: Create Development OpenAI Assistant

1. Go to https://platform.openai.com/assistants
2. Click "Create Assistant"
3. Configure:
   - **Name**: TaskFixerAI (DEV)
   - **Model**: gpt-4o
   - **Instructions**: Copy from your production assistant
   - **Tools**: Enable "File Search" (but NOT "Web Search" for now)
4. Copy the Assistant ID: `asst_...`
5. Update `.env.local`:
   ```bash
   OPENAI_ASSISTANT_ID=asst_YOUR_DEV_ASSISTANT_ID
   ```

## Step 6: Start Development Server

```bash
# Install dependencies (if not done)
npm install

# Start dev server
npm run dev

# Server should start at http://localhost:3000
```

## Step 7: Test with Test Card

Use Stripe test card for payments:
- **Card**: 4242 4242 4242 4242
- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **ZIP**: Any 5 digits

## Step 8: Create Development Branch

```bash
# Create develop branch
git checkout -b develop
git push origin develop

# Create feature branch for web search changes
git checkout -b feature/disable-web-search

# Now you can make changes safely!
```

## Verify Setup

Test these scenarios:
- ✅ Can create account and log in
- ✅ Can send messages to chatbot
- ✅ Can upload files
- ✅ Can subscribe with test card (charges should appear in Stripe test dashboard)
- ✅ Off-topic questions timeout gracefully (after 60 seconds)

## Development Workflow

```bash
# 1. Make changes in feature branch
git checkout feature/your-feature

# 2. Test locally with .env.local (test keys)
npm run dev

# 3. Commit changes
git add .
git commit -m "feat: your feature description"

# 4. Push to remote
git push origin feature/your-feature

# 5. Create PR: feature/your-feature → develop

# 6. After testing, merge develop → main for production
```

## Common Issues

### "Environment variable not found"
- **Solution**: Restart dev server after changing `.env.local`

### "Stripe webhook failed"
- **Solution**: Make sure Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### "OpenAI Assistant not found"
- **Solution**: Verify `OPENAI_ASSISTANT_ID` in `.env.local` matches your dev assistant

### "Changes not showing up"
- **Solution**: Clear Next.js cache: `rm -rf .next` then restart

## Next Steps

1. ✅ Set up all credentials in `.env.local`
2. ✅ Create development OpenAI Assistant
3. ✅ Test locally with test Stripe keys
4. ✅ Create feature branch for changes
5. ✅ Make changes and test
6. ✅ Push to develop branch
7. ✅ Deploy to production only after thorough testing

## Resources

- Stripe Test Cards: https://stripe.com/docs/testing
- Stripe CLI: https://stripe.com/docs/stripe-cli
- OpenAI Assistants: https://platform.openai.com/assistants
- Next.js Env Vars: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
