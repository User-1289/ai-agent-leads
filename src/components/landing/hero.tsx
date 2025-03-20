'use client'
import Image from 'next/image'
import Link from 'next/link'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content';
 
const MySwal = withReactContent(Swal);  

export default function Hero() {

  function handleClick() {
    window.location.href = '/signup'
  }
  return (
    <section className="relative ">
      <div
        className="absolute inset-0 bg-cover bg-center bg-gradient-to-r from-blue-700 to-purple-400"
        style={{
          //backgroundImage: `url('https://assets.api.uizard.io/api/cdn/stream/55e1a74d-ce12-420a-a81c-35ae7cbf47e6.png')`,
          opacity: 0.4, // Adjust opacity level (0.1 - 1)
          scale:1
        }}
      ></div>

      {/* Overlay for text content */}
      <div className="relative container mx-auto px-4 h-screen flex items-center justify-center text-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 tracking-wide">
            Automate Your Freelance Client Acquisition with AI with <span className="text-blue-500">Frank</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            AI-powered outreach to secure high-quality leads across freelance platforms.
          </p>
          <button
            onClick={handleClick}
            className="inline-flex h-11 items-center justify-center rounded-md bg-[#6C5CE7] px-8 text-base font-medium text-white hover:bg-[#6C5CE7]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#6C5CE7]"
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  )
}