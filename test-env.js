// Run this to check which environment is loaded
console.log('🔍 Environment Check:');
console.log('STRIPE_SECRET_KEY starts with:', process.env.STRIPE_SECRET_KEY?.substring(0, 15));
console.log('ASSISTANT_ID:', process.env.OPENAI_ASSISTANT_ID);
console.log('APP_URL:', process.env.NEXT_PUBLIC_APP_URL);

if (process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')) {
  console.log('✅ Using TEST mode (development)');
} else if (process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_')) {
  console.log('⚠️  Using LIVE mode (production)');
} else {
  console.log('❌ No Stripe key found');
}
