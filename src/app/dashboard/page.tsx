"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Settings, MessageSquare, Users, Share2, Bot, Mail, ArrowUpRight, Clock } from "lucide-react"

export default function Dashboard() {
  const [selectedNav, setSelectedNav] = useState("dashboard")
  const [leads, setLeads] = useState<any>([])
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "leads", label: "Leads Manager", icon: Users },
    { id: "outreach", label: "Outreach Automation", icon: Share2 },
    { id: "integrations", label: "Platform Integrations", icon: MessageSquare },
    { id: "chatbot", label: "AI Assistant Chatbot", icon: Bot },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  useEffect(()=>{
    const fetchLeads = async () => {
      const response = await fetch("/api/leads/retrieve?uid=2MEjasGczqUdmDuKnpCtAycpqlm1")
      const data = await response.json()
      setLeads(data)
    }
    fetchLeads()
  }, [])
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Welcome Banner */}
          <div className="bg-purple-600 text-white p-6 rounded-lg mb-6">
            <h1 className="text-2xl font-bold mb-1">Welcome Back, Alex!</h1>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <Button className="">Start New Campaign</Button>
            <Button variant="outline">Send Follow-Ups</Button>
            <Button variant="outline">Check Reports</Button>
          </div>


          {/* Lead Activity Feed */}
          <div className="bg-white rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">All Leads</h2>
              <div className="flex gap-4">
                <Input placeholder="Search leads..." className="w-64" />
                <Select defaultValue="contacted">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600">
                  <th className="pb-4">Lead Name</th>
                  <th className="pb-4">Platform</th>
                  <th className="pb-4">Date Posted</th>
                  <th className="pb-4">Go to post</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {leads.map(lead => (
                  <tr key={lead.post_author} className="border-t">
                    <td className="py-4">{lead.post_author}</td>
                    <td>{lead.platform}</td>
                    <td>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        <Clock size={16} className="inline-block mr-1" />
                        {new Date(lead.post_created_utc).toLocaleDateString('en-GB')}
                      </span>
                    </td>
                    <td><a href={lead.post_url} target="_blank" rel="noreferrer"><ArrowUpRight size={16} /></a></td>
                  </tr>
                ))}
                {/*<tr className="border-t">
                  <td className="py-4">John Doe</td>
                  <td>LinkedIn</td>
                  <td>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">2023-10-12</span>
                  </td>
                  <td><a href="#">Go</a></td>
                </tr>
                <tr className="border-t">
                  <td className="py-4">Jane Smith</td>
                  <td>Upwork</td>
                  <td>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Pending</span>
                  </td>
                  <td>2023-10-10</td>
                </tr>*/}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

