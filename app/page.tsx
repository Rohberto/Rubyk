export const revalidate = 0

import Navbar          from '@/components/Navbar'
import Hero            from '@/components/Hero'
import SectorMarquee   from '@/components/SectorMarquee'
import Services        from '@/components/Services'
import CaseStudies     from '@/components/CaseStudies'
import Testimonials    from '@/components/Testimonials'
import SubstackSection from '@/components/SubstackSection'
import About           from '@/components/About'
import CTA             from '@/components/CTA'
import Footer          from '@/components/Footer'
import GuideBanner from '@/components/GuideBanner'

export default function Home() {

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SectorMarquee />
        <Services />
        <CaseStudies />
        <Testimonials />
        <GuideBanner />
        <SubstackSection />
        <About />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
