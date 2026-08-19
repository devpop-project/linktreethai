'use client'

import ShortLinkRedirectPage from '@/app/s/[slug]/page'

export default function RRedirectPage({ params }: { params: { slug: string } }) {
  return <ShortLinkRedirectPage params={params} />
}
