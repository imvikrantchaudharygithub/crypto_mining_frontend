import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptominingindia.com'

export const metadata: Metadata = {
  title: 'Raise a Service Request — Miner Repair & Support',
  description:
    'Submit a service request for ASIC miner repair, RMA, or troubleshooting. Pan-India on-site service, hashboard repair, PSU replacement, firmware fixes.',
  keywords: [
    'antminer repair india', 'asic miner repair', 'hashboard repair india',
    'miner rma india', 'crypto mining support india',
  ],
  alternates: { canonical: `${SITE_URL}/service-request` },
  openGraph: {
    url: `${SITE_URL}/service-request`,
    title: 'Miner Service & Repair — Crypto Mining India',
    description: 'Pan-India on-site service, RMA, and troubleshooting for your ASIC miners.',
  },
}

export default function ServiceRequestLayout({ children }: { children: React.ReactNode }) {
  return children
}
