import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative pt-32 pb-16">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://assets.api.uizard.io/api/cdn/stream/55e1a74d-ce12-420a-a81c-35ae7cbf47e6.png')`,
          opacity: 0.4, // Adjust opacity level (0.1 - 1)
          scale:1
        }}
      ></div>

      {/* Overlay for text content */}
      <div className="relative container mx-auto px-4 h-screen flex items-center justify-center text-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Automate Your Freelance Client Acquisition with AI
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            AI-powered outreach to secure high-quality leads across freelance platforms.
          </p>
          <Link
            href="/signup"
            className="inline-flex h-11 items-center justify-center rounded-md bg-[#6C5CE7] px-8 text-base font-medium text-white hover:bg-[#6C5CE7]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#6C5CE7]"
          >
            Get Started for Free
          </Link>
        </div>
      </div>
    </section>
  )
}