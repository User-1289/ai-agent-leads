import Link from "next/link"
import { Twitter, Facebook, Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="py-12 bg-white border-t">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 block">
                Home
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 block">
                Features
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 block">
                Pricing
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 block">
                Blog
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="submit"
                className="h-10 rounded-md bg-[#6C5CE7] px-4 text-sm font-medium text-white hover:bg-[#6C5CE7]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#6C5CE7]"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-8 text-sm text-gray-500">© 2023 Uizard.io. All rights reserved. Terms & Privacy</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

