import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="pt-32 pb-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Automate Your Freelance Client Acquisition with AI
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          AI-powered outreach to secure high-quality leads across freelance platforms.
        </p>
        <Link
          href="/signup"
          className="inline-flex h-11 items-center justify-center rounded-md bg-[#6C5CE7] px-8 text-base font-medium text-white hover:bg-[#6C5CE7]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#6C5CE7]"
        >
          Get Started for Free
        </Link>
      </div>
    </section>
  )
}
