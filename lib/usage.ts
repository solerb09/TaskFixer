import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface UsageCheck {
  canUse: boolean
  reason?: string
  usage?: {
    pdfCount: number
    wordCount: number
    filesCount: number
  }
  limits?: {
    maxPdfs: number
    maxWords: number
    maxFiles: number | null  // null means no limit
  }
}

export async function checkUsageLimit(userId: string): Promise<UsageCheck> {
  // Get user profile and usage
  const { data: profile } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  const { data: usage } = await supabaseAdmin
    .from('usage_tracking')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!profile || !usage) {
    return {
      canUse: false,
      reason: 'User profile or usage data not found',
    }
  }

  // Paid users have unlimited access
  if (profile.subscription_tier === 'educator' || profile.subscription_tier === 'school') {
    // Check if subscription is active
    if (profile.subscription_status !== 'active') {
      return {
        canUse: false,
        reason: 'Your subscription is not active. Please update your payment method.',
        usage: {
          pdfCount: usage.pdf_redesigns_count,
          wordCount: usage.word_count_used,
          filesCount: usage.files_uploaded,
        },
      }
    }

    // Check if subscription has expired (handles canceled subscriptions)
    if (profile.subscription_ends_at) {
      const now = new Date()
      const endsAt = new Date(profile.subscription_ends_at)

      if (now > endsAt) {
        return {
          canUse: false,
          reason: 'Your subscription has expired. Please renew to continue using TaskFixerAI.',
          usage: {
            pdfCount: usage.pdf_redesigns_count,
            wordCount: usage.word_count_used,
            filesCount: usage.files_uploaded,
          },
        }
      }
    }

    return {
      canUse: true,
      usage: {
        pdfCount: usage.pdf_redesigns_count,
        wordCount: usage.word_count_used,
        filesCount: usage.files_uploaded,
      },
    }
  }

  // Free trial users have limits
  const MAX_FREE_PDFS = parseInt(process.env.NEXT_PUBLIC_FREE_TRIAL_LIMIT || '1')
  const MAX_FREE_WORDS = 800

  // Check word count limit first (primary blocking mechanism - blocks chat after 800 words)
  if (usage.word_count_used >= MAX_FREE_WORDS) {
    return {
      canUse: false,
      reason: `You've used ${usage.word_count_used} of your ${MAX_FREE_WORDS} free trial words. Upgrade for unlimited access.`,
      usage: {
        pdfCount: usage.pdf_redesigns_count,
        wordCount: usage.word_count_used,
        filesCount: usage.files_uploaded,
      },
      limits: {
        maxPdfs: MAX_FREE_PDFS,
        maxWords: MAX_FREE_WORDS,
        maxFiles: null, // No file limit
      },
    }
  }

  // Check PDF redesign limit (only checked when user downloads a PDF)
  if (usage.pdf_redesigns_count >= MAX_FREE_PDFS) {
    return {
      canUse: false,
      reason: `You've downloaded your free trial PDF. Upgrade for unlimited redesigns.`,
      usage: {
        pdfCount: usage.pdf_redesigns_count,
        wordCount: usage.word_count_used,
        filesCount: usage.files_uploaded,
      },
      limits: {
        maxPdfs: MAX_FREE_PDFS,
        maxWords: MAX_FREE_WORDS,
        maxFiles: null, // No file limit
      },
    }
  }

  // Note: File uploads are tracked but do NOT block access
  // Users can upload as many files as needed within their word/PDF limits

  return {
    canUse: true,
    usage: {
      pdfCount: usage.pdf_redesigns_count,
      wordCount: usage.word_count_used,
      filesCount: usage.files_uploaded,
    },
    limits: {
      maxPdfs: MAX_FREE_PDFS,
      maxWords: MAX_FREE_WORDS,
      maxFiles: null, // No file limit
    },
  }
}

export async function incrementPdfCount(userId: string): Promise<void> {
  const { error } = await supabaseAdmin.rpc('increment_pdf_count', {
    p_user_id: userId,
  })

  if (error) {
    console.error('Error incrementing PDF count:', error)
    throw error
  }
}

export async function incrementFileCount(userId: string, count: number = 1): Promise<void> {
  const { error } = await supabaseAdmin.rpc('increment_file_count', {
    p_user_id: userId,
    p_count: count,
  })

  if (error) {
    console.error('Error incrementing file count:', error)
    throw error
  }
}

export async function addWordCount(userId: string, words: number): Promise<void> {
  const { error } = await supabaseAdmin.rpc('add_word_count', {
    p_user_id: userId,
    p_words: words,
  })

  if (error) {
    console.error('Error adding word count:', error)
    throw error
  }
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).length
}

export function getFeatureAccess(subscriptionTier: string) {
  return {
    hasReflection: true, // All tiers have reflection
    hasDifferentiation: subscriptionTier === 'educator' || subscriptionTier === 'school',
    hasUnlimitedRedesigns: subscriptionTier === 'educator' || subscriptionTier === 'school',
    hasEmailSupport: subscriptionTier === 'educator' || subscriptionTier === 'school',
    hasPrioritySupport: subscriptionTier === 'school',
  }
}
