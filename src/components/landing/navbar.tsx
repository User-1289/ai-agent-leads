'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/placeholder.svg" alt="Uizard.io" width={24} height={24} className="w-6 h-6" />
          <span className="font-semibold text-lg">LeadSurge</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</Link>
          <Link href="#problem" className="text-sm text-gray-600 hover:text-gray-900">What are we solving</Link>
          <Link href="#solution" className="text-sm text-gray-600 hover:text-gray-900">Our Solution</Link>
          <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900">Features</Link>
          <Link href="#howitworks" className="text-sm text-gray-600 hover:text-gray-900">How It Works</Link>
          <Link href="#faq" className="text-sm text-gray-600 hover:text-gray-900">FAQ</Link>
          <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</Link>
          <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">Contact</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="inline-flex h-9 items-center justify-center rounded-md bg-[#6C5CE7] px-4 text-sm font-medium text-white hover:bg-[#6C5CE7]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#6C5CE7]"
          >
            Log In
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-md hover:bg-gray-100" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg animate-in slide-in-from-top">
          <div className="container mx-auto px-4 py-4 flex flex-col">
            <Link 
              href="/dashboard" 
              className="py-3 px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="#problem" 
              className="py-3 px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              What are we solving
            </Link>
            <Link 
              href="#solution" 
              className="py-3 px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Our Solution
            </Link>
            <Link 
              href="#features" 
              className="py-3 px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="#howitworks" 
              className="py-3 px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              href="#faq" 
              className="py-3 px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link 
              href="/pricing" 
              className="py-3 px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/about" 
              className="py-3 px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}