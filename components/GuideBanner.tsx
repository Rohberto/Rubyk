import { supabase } from '@/lib/supabase'
import { guide as fallback } from '@/data/guide'
import GuideBannerClient from './GuideBannerClient'

export const revalidate = 60

export default async function GuideBanner() {
  const { data } = await supabase
    .from('guide_config')
    .select('headline, subheadline')
    .eq('id', 1)
    .single()

    console.log(data);
  const headline    = data?.headline 
  const subheadline = data?.subheadline
console.log('[GuideBanner] Loaded config:', { headline, subheadline })
  return <GuideBannerClient headline={headline} subheadline={subheadline} />
}