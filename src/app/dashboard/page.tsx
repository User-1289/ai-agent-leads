"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Settings, MessageSquare, Users, Share2, Bot, Mail, ArrowUpRight, Clock, Menu, X } from "lucide-react"
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CampaignCreator from "@/components/dashboard/CampaignCreation"
export default function Dashboard() {
  const MySwal = withReactContent(Swal);  
  const [selectedNav, setSelectedNav] = useState("dashboard")
  const [leads, setLeads] = useState<any>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "campaign-creation", label: "Create Campaign", icon: BarChart3 },
    { id: "leads", label: "Leads Manager", icon: Users },
    { id: "outreach", label: "Outreach Automation", icon: Share2 },
    { id: "integrations", label: "Platform Integrations", icon: MessageSquare },
    { id: "chatbot", label: "AI Assistant Chatbot", icon: Bot },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch("/api/leads/retrieve?uid=2MEjasGczqUdmDuKnpCtAycpqlm1")
        const data = await response.json()
        console.log(data)
        setLeads(data.potential_leads)
      } catch (error) {
        console.error("Error fetching leads:", error)
        setLeads([])
      }
    }
    fetchLeads()
  }, [])
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }
    
    // Set initial state
    handleResize()
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function checkFuncs() {
    if(selectedNav==="campaign-creation"){
      MySwal.fire({
        html: <CampaignCreator />,
        showConfirmButton: false,
        showCancelButton: false,
        background: '#f0f0f0',
        width: '600px',
        padding: '0',
        customClass: {
          popup: 'rounded-lg shadow-xl',
        }
      });
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 relative">
      {/* Mobile Sidebar Toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-purple-600 text-white shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                       md:translate-x-0 transition-transform duration-300 ease-in-out
                       fixed md:static left-0 top-0 bottom-0 
                       w-64 md:w-1/5 lg:w-1/6 z-30
                       bg-white border-r flex flex-col shadow-lg md:shadow-none`}>
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-purple-600">LeadSurge</h2>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    className={`w-full flex items-center space-x-3 p-2 rounded-md transition-colors
                              ${selectedNav === item.id 
                                ? 'bg-purple-100 text-purple-700 font-medium' 
                                : 'text-gray-600 hover:bg-gray-100'}`}
                    onClick={() => {
                      setSelectedNav(item.id)
                      if (window.innerWidth < 768) {
                        setSidebarOpen(false)
                      };
                      checkFuncs()
                    }}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
              <span className="text-purple-700 font-semibold">A</span>
            </div>
            <div>
              <p className="font-medium text-sm">Alex Smith</p>
              <p className="text-xs text-gray-500">Free Plan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full">
        <div className="p-4 sm:p-6 md:p-8">
          {/* Welcome Banner */}
          <div className="bg-purple-600 text-white p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold mb-1">Welcome Back, Alex!</h1>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
            <Button className="w-full">Start New Campaign</Button>
            <Button variant="outline" className="w-full">Send Follow-Ups</Button>
            <Button variant="outline" className="w-full">Check Reports</Button>
          </div>

          {/* Lead Activity Feed */}
          <div className="bg-white rounded-lg p-4 sm:p-6 mb-8 overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-lg font-semibold">All Leads</h2>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Input placeholder="Search leads..." className="w-full sm:w-64" />
                <Select defaultValue="contacted">
                  <SelectTrigger className="w-full sm:w-[180px]">
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
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-600">
                    <th className="pb-4 px-4 sm:pl-0">Lead Name</th>
                    <th className="pb-4 px-4">Platform</th>
                    <th className="pb-4 px-4">Date Posted</th>
                    <th className="pb-4 px-4 sm:pr-0">Go to post</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {leads && leads.length > 0 ? (
                    leads.map((lead: any, index: number) => (
                      <tr key={index} className="border-t">
                        <td className="py-4 px-4 sm:pl-0 truncate max-w-[150px]">{lead.post_author}</td>
                        <td className="py-4 px-4">{lead.platform}</td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs whitespace-nowrap">
                            <Clock size={14} className="inline-block mr-1" />
                            {new Date(lead.post_created_utc).toLocaleDateString('en-GB')}
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:pr-0">
                          <a 
                            href={lead.post_url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-2 hover:bg-gray-100 inline-flex rounded-full"
                          >
                            <ArrowUpRight size={16} />
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-500">
                        No leads found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}