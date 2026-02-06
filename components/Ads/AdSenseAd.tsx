// components/Ads/AdSenseAd.tsx
'use client'

import { useEffect } from 'react'

const AdSenseAd = ({ slotId, format = 'auto' }: { slotId: string; format?: string }) => {
  useEffect(() => {
    try {
      ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  return (
    <div className="my-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="YOUR_AD_CLIENT_ID" // Replace with your ID
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}

export default AdSenseAd