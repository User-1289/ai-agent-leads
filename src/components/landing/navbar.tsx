import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/placeholder.svg" alt="Uizard.io" width={24} height={24} className="w-6 h-6" />
          <span className="font-semibold text-lg">Uizard.io</span>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</Link>
          <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Home</Link>
          <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Features</Link>
          <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Pricing</Link>
          <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Testimonials</Link>
          <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact</Link>
        </div>

        <Link
          href="#"
          className="inline-flex h-9 items-center justify-center rounded-md bg-[#6C5CE7] px-4 text-sm font-medium text-white hover:bg-[#6C5CE7]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#6C5CE7]"
        >
          Sign In / Register
        </Link>
      </div>
    </nav>
  )
}
