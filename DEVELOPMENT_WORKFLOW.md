# Development Workflow Guide

## Overview
This guide outlines the proper development workflow to safely test changes before deploying to production.

## Branch Strategy

### Main Branches
- `main` - Production branch (always deployable)
- `develop` - Development branch (integration branch for features)
- `feature/*` - Feature branches (individual features/fixes)

### Workflow
```bash
# 1. Create a new feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/disable-web-search

# 2. Make your changes and test locally
npm run dev

# 3. Commit your changes
git add .
git commit -m "feat: disable web search and add off-topic handling"

# 4. Push to remote
git push origin feature/disable-web-search

# 5. Create Pull Request: feature/disable-web-search → develop

# 6. After testing on develop, merge to main
# Create Pull Request: develop → main
```

## Environment Setup

### Local Development (.env.local)
Create `.env.local` for development with test credentials:

```bash
# Supabase (Development)
NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-dev-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-dev-service-key

# OpenAI (Development Assistant)
OPENAI_API_KEY=sk-your-dev-or-prod-key
OPENAI_ASSISTANT_ID=asst_DEV_assistant_id_here  # Create separate dev assistant

# Stripe (TEST MODE - use test keys)
STRIPE_SECRET_KEY=sk_test_...  # Test secret key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Test publishable key
STRIPE_WEBHOOK_SECRET=whsec_test_...  # Test webhook secret
NEXT_PUBLIC_STRIPE_EDUCATOR_MONTHLY_PRICE_ID=price_test_...  # Test price ID

# App URL (Local)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production (.env)
Keep `.env` for production credentials (never commit):

```bash
# Supabase (Production)
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-prod-service-key

# OpenAI (Production Assistant)
OPENAI_API_KEY=sk-your-prod-key
OPENAI_ASSISTANT_ID=asst_mkpGj1V9ZJ1KoivSWgmRZYNJ  # Production assistant

# Stripe (LIVE MODE - use live keys)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...
NEXT_PUBLIC_STRIPE_EDUCATOR_MONTHLY_PRICE_ID=price_live_...

# App URL (Production)
NEXT_PUBLIC_APP_URL=https://taskfixerai.com
```

## Environment Priority in Next.js

Next.js loads environment variables in this order (later overrides earlier):
1. `.env` - All environments
2. `.env.local` - Local overrides (ignored by git)
3. `.env.development` - Development only
4. `.env.development.local` - Local development overrides
5. `.env.production` - Production only

**Best Practice**: Use `.env.local` for local development overrides

## Testing Workflow

### Step 1: Local Testing
```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Make changes to code

# 3. Ensure .env.local has test credentials

# 4. Run locally
npm run dev

# 5. Test thoroughly:
#    - Happy path scenarios
#    - Edge cases (off-topic questions, timeouts, etc.)
#    - Error handling
#    - Stripe test mode payments
```

### Step 2: Commit Changes
```bash
# Check what changed
git status
git diff

# Stage changes
git add app/api/chat/route.ts
git add app/components/ChatInterface.tsx

# Commit with meaningful message
git commit -m "feat: add timeout protection and improve error handling

- Add 60s backend timeout to prevent hanging
- Add 65s frontend timeout with AbortController
- Improve error messages for off-topic questions
- Clear timeouts on success/error"

# Push to remote
git push origin feature/your-feature-name
```

### Step 3: Pull Request
```bash
# Create PR on GitHub:
# feature/your-feature-name → develop

# PR Checklist:
# ☐ Tested locally with .env.local
# ☐ No console errors
# ☐ All features work as expected
# ☐ Code is clean and commented
# ☐ No sensitive data in code
```

### Step 4: Deploy to Production
```bash
# After testing on develop:
# Create PR: develop → main

# Deploy checklist:
# ☐ Update production OpenAI Assistant instructions
# ☐ Verify .env has production credentials
# ☐ Test on production domain
# ☐ Monitor logs for errors
```

## Stripe Testing

### Test Mode vs Live Mode

**Test Mode** (Local Development):
- Use `sk_test_...` and `pk_test_...` keys
- Use test card: `4242 4242 4242 4242`
- No real money charged
- Test webhooks with Stripe CLI

**Live Mode** (Production):
- Use `sk_live_...` and `pk_live_...` keys
- Real payments processed
- Real webhooks from Stripe

### Stripe CLI for Local Testing
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Use the webhook secret from CLI output in .env.local
```

## OpenAI Assistant Setup

### Create Development Assistant

1. Go to https://platform.openai.com/assistants
2. Click "Create Assistant"
3. Name it "TaskFixerAI (DEV)"
4. Use same instructions as production
5. Copy the Assistant ID to `.env.local` as `OPENAI_ASSISTANT_ID`

### Benefits of Separate Dev Assistant
- ✅ Test instruction changes without affecting production
- ✅ Debug tool behavior safely
- ✅ Experiment with different models
- ✅ Monitor token usage separately

## Supabase Setup (Optional)

### Development Database

**Option 1**: Use same production database (simpler)
- Careful with data changes
- Use test user accounts

**Option 2**: Create separate dev project (safer)
- Go to https://supabase.com
- Create new project "TaskFixerAI Dev"
- Copy schema from production
- Use dev credentials in `.env.local`

## Common Commands

```bash
# Start development server
npm run dev

# Build for production (test build locally)
npm run build
npm start

# Check TypeScript errors
npm run type-check

# Format code
npm run format

# Run tests (if configured)
npm test
```

## Troubleshooting

### "Environment variable not found"
- Check `.env.local` exists
- Restart dev server after changing env vars
- Use `NEXT_PUBLIC_` prefix for client-side vars

### "Changes not reflecting"
- Clear `.next` folder: `rm -rf .next`
- Restart dev server
- Check if you're editing the right file

### "Stripe webhook not working locally"
- Use Stripe CLI to forward webhooks
- Check webhook secret in `.env.local`
- Verify endpoint URL is correct

## Security Checklist

- ☐ Never commit `.env` or `.env.local` files
- ☐ Never commit API keys in code
- ☐ Use test Stripe keys for development
- ☐ Rotate keys if accidentally exposed
- ☐ Use environment variables for all secrets
- ☐ Review code before pushing to remove sensitive data

## Deployment Checklist

Before deploying to production:

- ☐ All tests pass locally
- ☐ No TypeScript errors
- ☐ Build succeeds: `npm run build`
- ☐ `.env` has production credentials
- ☐ Production OpenAI Assistant is configured
- ☐ Stripe live mode keys are set
- ☐ Webhooks are configured in Stripe dashboard
- ☐ Database migrations applied (if any)
- ☐ Backup production database
- ☐ Monitor logs after deployment

## Git Commit Message Convention

```bash
# Format: <type>: <description>

# Types:
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation changes
style:    # Formatting, missing semicolons, etc
refactor: # Code refactoring
test:     # Adding tests
chore:    # Maintenance tasks

# Examples:
git commit -m "feat: add timeout protection to chat API"
git commit -m "fix: resolve chatbot freezing on off-topic questions"
git commit -m "docs: update development workflow guide"
git commit -m "refactor: improve error handling in ChatInterface"
```

## Need Help?

- OpenAI Platform: https://platform.openai.com
- Stripe Dashboard: https://dashboard.stripe.com
- Supabase Dashboard: https://supabase.com/dashboard
- Next.js Docs: https://nextjs.org/docs
