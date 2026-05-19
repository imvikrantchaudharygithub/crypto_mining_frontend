import { fetchApi } from '@/lib/apiClient'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import StatsMarquee from '@/components/StatsMarquee'
import StatsGrid from '@/components/StatsGrid'
import WhyUs from '@/components/WhyUs'
import HowItWorks from '@/components/HowItWorks'
import Team from '@/components/Team'
import SoftwarePartners from '@/components/SoftwarePartners'
import FAQ from '@/components/FAQ'
import FooterCTA from '@/components/FooterCTA'

export default async function Page() {
  const data = await fetchApi<{ success: boolean; homePage: any; navLinks: any[]; team: any[]; softwarePartners: any[] }>(
    '/home-pagedata'
  ).catch(() => null)

  const hp = data?.homePage ?? {}

  return (
    <main>
      <Navbar navLinks={data?.navLinks ?? []} />
      <Hero hero={hp.hero ?? null} />
      <StatsMarquee data={hp.statsMarquee ?? null} />
      <StatsGrid data={hp.statsGrid ?? null} />
      <SoftwarePartners data={hp.softwarePartnersSection ?? null} partners={data?.softwarePartners ?? []} />
      <WhyUs data={hp.whyUs ?? null} />
      <HowItWorks data={hp.howItWorks ?? null} />
      <Team data={hp.teamSection ?? null} members={data?.team ?? []} />
      <FAQ data={hp.faqs ?? null} />
      <FooterCTA data={hp.footerCta ?? null} />
    </main>
  )
}
