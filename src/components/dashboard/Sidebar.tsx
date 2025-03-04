"use client"

import React, {useState} from 'react'
import { BarChart3, Settings, MessageSquare, Users, Share2, Bot, Mail, ArrowUpRight, Clock } from "lucide-react"

export default function Sidebar() {
      const [selectedNav, setSelectedNav] = useState("dashboard")
      const navItems = [
        { id: "dashboard", label: "Dashboard", icon: BarChart3 },
        { id: "leads", label: "Leads Manager", icon: Users },
        { id: "outreach", label: "Outreach Automation", icon: Share2 },
        { id: "integrations", label: "Platform Integrations", icon: MessageSquare },
        { id: "settings", label: "Settings", icon: Settings },
      ]
  return (
    <aside className="w-64 bg-white border-r">
    <div className="p-4">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-6 h-6 bg-purple-600 rounded-sm flex items-center justify-center">
          <span className="text-white text-sm font-bold">U</span>
        </div>
        <span className="font-bold text-lg">LeadSurge</span>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setSelectedNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                selectedNav === item.id ? "text-purple-600 bg-purple-50" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          )
        })}
      </nav>
    </div>
  </aside>
    )
}
