import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkUsageLimit, incrementPdfCount } from "@/lib/usage";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized. Please log in." }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check usage limits (specifically PDF limit)
    const usageCheck = await checkUsageLimit(user.id);

    // For paid users, always allow
    const { data: profile } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    const isPaid = profile?.subscription_tier === 'educator' || profile?.subscription_tier === 'school';

    if (!isPaid && usageCheck.usage && usageCheck.usage.pdfCount >= 1) {
      // Free trial user has already downloaded their 1 PDF
      return new Response(
        JSON.stringify({
          error: "You've already downloaded your free trial PDF. Upgrade for unlimited redesigns.",
          usage: usageCheck.usage,
          limits: usageCheck.limits,
          upgradeRequired: true,
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Increment PDF count
    await incrementPdfCount(user.id);

    // Return success
    return new Response(
      JSON.stringify({
        success: true,
        message: "PDF download tracked successfully"
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error("PDF download tracking error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to track PDF download" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
