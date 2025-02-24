import Link from "next/link"

export default function Cta() {
  return (
    <section className="py-16 bg-[#6C5CE7]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Try AI Outreach Now</h2>
        <p className="text-white/90 mb-8">No credit card required. Start generating leads today!</p>
        <Link
          href="#"
          className="inline-flex h-11 items-center justify-center rounded-md bg-white px-8 text-base font-medium text-[#6C5CE7] hover:bg-white/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
        >
          Try AI Outreach Now
        </Link>
      </div>
    </section>
  )
}

