import Navbar from "@/components/landing/navbar"
import Hero from "@/components/landing/hero"
import Features from "@/components/landing/features"
import Testimonials from "@/components/landing/testimonials"
import Cta from "@/components/landing/cta"
import Footer from "@/components/landing/footer"
import Problems from "@/components/landing/problems"
import Solution from "@/components/landing/solutions"
import FAQ from "@/components/landing/faq"
import HowItWorks from "@/components/landing/working"
import ProductDemo from "@/components/landing/product-demo"
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <ProductDemo />
        <Problems />
        <Solution />
        <Features />
        <HowItWorks />
        <FAQ />
        {/*<Testimonials />*/}
        {/*<Cta />*/}
      </main>
      <Footer />
    </div>
  )
}

