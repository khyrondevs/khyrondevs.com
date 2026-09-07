'use client'

import dynamic from 'next/dynamic'

// We now use Framer Motion which is fully SSR compatible.
// But we still export the dynamic wrapper to keep the file structure intact for the parent.
export const ProcessSectionDynamic = dynamic(
  () => import('./process-section').then((m) => m.ProcessSection),
  { ssr: true }
)
