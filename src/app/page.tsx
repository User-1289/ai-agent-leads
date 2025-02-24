import Navbar from "@/components/landing/navbar"
import Hero from "@/components/landing/hero"
import Features from "@/components/landing/features"
import Testimonials from "@/components/landing/testimonials"
import Cta from "@/components/landing/cta"
import Footer from "@/components/landing/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}

