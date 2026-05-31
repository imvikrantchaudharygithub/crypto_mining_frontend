import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Track Your Service Ticket',
  description: 'Look up the status of your service ticket with Crypto Mining India.',
  // Utility page — keep it accessible but de-emphasized for search
  robots: { index: false, follow: true },
}

export default function TrackTicketLayout({ children }: { children: React.ReactNode }) {
  return children
}
