'use client'

import dynamic from 'next/dynamic'

// ProcessSection uses GSAP + ScrollTrigger which must not run on the server.
// This client wrapper is the correct place to use dynamic() with ssr: false in Next.js 16.
export const ProcessSectionDynamic = dynamic(
  () => import('./process-section').then((m) => m.ProcessSection),
  { ssr: false }
)
