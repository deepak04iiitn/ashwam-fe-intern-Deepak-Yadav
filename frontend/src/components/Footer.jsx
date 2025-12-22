import React from 'react'
import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>for your wellness journey</span>
          </div>

          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Support</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">About</a>
          </div>

        </div>

        <div className="text-center sm:text-left mt-4 text-xs text-gray-400">
          © 2025 NutriLog. Your health data stays private.
        </div>

      </div>
      
    </footer>
  )
}