// app/page.tsx

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import HowItWorks from '@/components/sections/HowItWorks'
import Testimonials from '@/components/sections/Testimonials'
import CTASection from '@/components/sections/CTASection'

export default function Home() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                <HeroSection />
                <FeaturesSection />
                <HowItWorks />
                <Testimonials />
                <CTASection />
            </main>
            <Footer />
        </>
    )
}