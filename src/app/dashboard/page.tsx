"use client"

import { useEffect, useState } from "react"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Settings, MessageSquare, Users, Share2, Bot, Mail, ArrowUpRight, Clock, Menu, X, User } from "lucide-react"
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CampaignCreator from "@/components/dashboard/CampaignCreation"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter, useSearchParams } from "next/navigation"
import FeedbackBot from "@/components/analytics/FeedbackBot"
import { set } from "mongoose"
function DashboardContent() {
  const MySwal = withReactContent(Swal);  
  const [selectedNav, setSelectedNav] = useState("dashboard")
  const [leads, setLeads] = useState<any>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [campaigns, setCampaigns] = useState<any>([])
  const [user, setUser] = useState<any>(null)
  const [userFromDB, setUserFromDB] = useState<any>(null)
  const [alreadyIntegratedReddit, setAlreadyIntegratedReddit] = useState(false)
  const [hasFeedback, setHasFeedback] = useState(false)
  const [askForFeedback, setAskForFeedback] = useState(false)
  const [fetchedSkills, setFetchedSkills] = useState<boolean>(false)
  const [fetchedFreelanceData, setFetchedFreelanceData] = useState<any>({})
  const [currCampaignId, setCurrCampaignId] = useState<string>("")
  const url = useSearchParams()
  const router = useRouter()
  useEffect(() => {
    if (typeof window !== "undefined") {
      const alreadyIntegratedReddit = url.get("already_integrated_reddit");
      if (alreadyIntegratedReddit) {
        MySwal.fire({
          title: "Success",
          text: "You have already integrated Reddit",
          icon: "success",
        });
        router.push("/dashboard");
      }
    }
  }, [url, MySwal]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        console.log(user)
      } else {
        router.push("/login")
        setUser(null)
      }
    })
    return () => unsubscribe()
  }, [])
  useEffect(() => {
    const fetchUser = async() =>{
      try {
        const response = await axios.get(`/api/user/retrieve?uid=${user?.uid}`)
        if(response.status === 200){
          setUserFromDB(response.data)
        }
        else{
          console.log("Failed to fetch user")
        }
      } catch (error) {
        console.log("Error fetching user:", error)
      }
    }
    if(user){
      fetchUser()
    }
  }, [user])
  
  const fetchLeads = async () => {
    try {
      const response = await fetch("/api/campaigns")
      const data = await response.json()
      console.log(data)
      setCampaigns(data.campaign)
      //const response = await fetch("/api/leads/retrieve?uid=2MEjasGczqUdmDuKnpCtAycpqlm1")
      //const data = await response.json()
      //console.log(data)
      //setLeads(data.potential_leads)
    } catch (error) {
      console.log("Error fetching leads:", error)
      setLeads([])
    }
  }

  async function checkFeedback(){
    try {
      const response = await axios.get("/api/mvp/feedback-check")
      if(response.status === 200){
        const data = response.data
        console.log(data)
        setHasFeedback(data.hasFeedback)
        if (!data.hasFeedback && campaigns.length > 0) {
          setAskForFeedback(true)
        }
      }
    } catch (error) {
      console.log("Error checking feedback:", error)
    }
  }

  useEffect(() => {
    checkFeedback()
  }, [campaigns])

  async function fetchFreelancerData() {
    console.log("Fetching freelance data")
    let response = await axios.get(`/api/user/freelance-data/retrieve?uid=${user?.uid}`)
    console.log(response)
    if (response.status === 200) {
      setFetchedFreelanceData(response.data)
      setFetchedSkills(true)
      return response.data
    }
    else {
      console.log("Error fetching freelance data")
    }
  }

  useEffect(() => {
    if(!hasFeedback && campaigns && campaigns.length > 0){
      setAskForFeedback(true)
      MySwal.fire({
        title: 'We would love to hear from you!',
        text: 'Please take a moment to share your thoughts with our bot to help us improve our service.',
        icon: 'info'
      })
    }
  }, [hasFeedback, campaigns])


  useEffect(()=>{

  }, [])

  useEffect(() => {

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


  function handleCampaignCreation() {
    if(window!==null){
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
    })
    .then((result:any) => {
      fetchLeads()
      //make the feedback bot appear
      if (!hasFeedback && campaigns.length > 0) {
        setAskForFeedback(true)
      }
    })
    }
  }

  async function handleCampaignDetails(campaign_id: string) {
    try {
      const { data } = await axios.get(`/api/campaigns/retrieve?campaign_id=${campaign_id}`)
      setCurrCampaignId(campaign_id)
      console.log(data)
      setLeads(data.campaign.potential_leads)
    } catch (error) {
      console.log("Error fetching campaign details:", error)
    }
  }

  async function signOutFromFrank() {
    try {
      await signOut(auth)
      localStorage.removeItem("onboard")
      const logoutUser = await axios.get("/api/user/logout")
      if(logoutUser.status === 200){
        console.log("User logged out successfully")
        router.push("/")
      }
    } catch (error) {
      console.log("Error signing out from Frank:", error)
    }
  }

  async function checkIntegration() {
    try {
      const response = await axios.get("/api/reddit/check-auth")
      if(response.status === 200){
        const data = response.data
        console.log(data)
        if(!data.status){
          const authResponse = await axios.get("/api/reddit/auth")
          if(authResponse.status === 200){
            const authUrl = authResponse.data.redirectUrl
            window.location.href = authUrl
          }
        }
        else{
          router.push("/dashboard?already_integrated_reddit=true")
        }
      }
    } catch (error) {
      console.log("Error checking integration:", error)
    }
  }

  useEffect(() => {
    if(user){
      fetchFreelancerData()
    }
  }, [user])
  async function generatePersonalizedMsg(isGenerated:boolean, lead:any) {
    if(isGenerated){
      MySwal.fire({
        title: "Personalized Message",
        text: lead.personalized_message,
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Copy",
        cancelButtonText: "Close",
      }).then((result) => {
        if (result.isConfirmed) {
          navigator.clipboard.writeText(lead.personalized_message)
         // MySwal.fire({ title:"Copied!", text:"The message has been copied to clipboard.", icon:"success", timer: 1000, showConfirmButton: false });
        }
      })
      return
    }
    if(!isGenerated){
      //block other buttons
      MySwal.fire({
        title: "Generating Personalized Message",
        text: "Please wait while we generate your personalized message",
        icon: "info",
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          MySwal.showLoading()
        }
      })
    try {
      const response = await axios.post(`/api/create-message?campaign_id=${currCampaignId}`, {
        post:{
          post_body: lead.post_body,
          post_title: lead.post_title,
          post_author: lead.post_author,
          post_url: lead.post_url,
        },
        userData:{
          title: fetchedFreelanceData.title,
          name: fetchedFreelanceData.name,
          skills: fetchedFreelanceData.skills,
          services: fetchedFreelanceData.services
        }
      })
      if(response.status === 200){
        const data = response.data
        console.log(data)
        MySwal.fire({
          title: "Personalized Message",
          text: data.personalizedMsg,
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Copy",
          cancelButtonText: "Close",
        }).then((result) => {
          if (result.isConfirmed) {
            navigator.clipboard.writeText(data.personalizedMsg)
         //   MySwal.fire({ title:"Copied!", text:"The message has been copied to clipboard.", icon:"success", timer: 1000, showConfirmButton: false });
          }
        })
        //make the button green
        setLeads((prevLeads:any) => {
          return prevLeads.map((lead:any) => {
            if (lead.post_url === data.post_url) {
              return {
                ...lead,
                personalized_message: data.personalizedMsg,
              }
            }
            return lead
          })
        }
        )
      }
      else{
        console.log("Error generating personalized message")
      }
    } catch (error) {
      console.log("Error generating personalized message:", error)
    }
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
          <h2 className="text-xl font-bold text-purple-600">FrankLeads</h2>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            <li>
              <button
                className="w-full flex items-center space-x-3 p-2 rounded-md transition-colors"
                onClick={() => {
                }}
              >
                <BarChart3 size={20} />
                <span>Campaigns</span>
              </button>
              <ul className="pl-6 space-y-1">

                <li>
                  <button
                    className="w-full flex items-center space-x-3 p-2 rounded-md transition-colors"
                    onClick={() => {
                      handleCampaignCreation()
                    }}
                  >
                    <span className="text-purple-600">Create New Campaign</span>
                  </button>
                </li>
                
                {campaigns?.map((campaign:any) => (
                  <li key={campaign._id}>
                    <button
                      onClick={() => {
                        handleCampaignDetails(campaign.campaign_id)
                      }}
                      className="w-full flex items-center space-x-3 p-2 rounded-md transition-colors"
                    >
                      <span>{campaign.campaign_name}</span>
                    </button>
                  </li>
                ))}
                
              </ul>
              
            </li>
            <li>
            <button
            onClick={checkIntegration}
                className="w-full flex items-center space-x-3 p-2 rounded-md transition-colors"
              >
                <MessageSquare size={20} />
               <span>Integrations</span>
            </button>
            </li>
            {/*<li>
            <button
                className="w-full flex items-center space-x-3 p-2 rounded-md transition-colors"
              >
                <User size={20} />
                <Link href="/user/profile">Update Profile</Link>
              </button>
            </li>*/}
          </ul>
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
              <span className="text-purple-700 font-semibold">{user?.displayName?.charAt(0) || userFromDB?.name?.charAt(0).toUpperCase() || user?.email.split("@")[0][0].toUpperCase()}</span>
            </div>
            <div>
              <p className="font-medium text-sm">
                {(user?.displayName || userFromDB?.name || user?.email.split("@")[0])
                  ?.replace(/\b\w/g, (char:any) => char.toUpperCase())}
              </p>
              <p className="text-xs text-gray-500">{userFromDB?.plan}</p>
            </div>
            <div>
              <button onClick={() => {
              signOutFromFrank()}} className="bg-purple-600 text-white px-4 py-2 rounded-md">Logout</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full">
        <div className="p-4 sm:p-6 md:p-8">
          {/* Welcome Banner */}
          <div className="bg-purple-600 text-white p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold mb-1">
            </h1>
            Welcome Back! {" "}
            
            {(user?.displayName || userFromDB?.name || user?.email.split("@")[0])
                  ?.replace(/\b\w/g, (char:any) => char.toUpperCase())}
            </div>

          {/* Lead Activity Feed */}
          <div className="bg-white rounded-lg p-4 sm:p-6 mb-8 overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-lg font-semibold">All Leads</h2>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-600">
                    <th className="pb-4 px-4 sm:pl-0">Lead Name</th>
                    <th className="pb-4 px-4">Platform</th>
                    <th className="pb-4 px-4">Date Posted</th>
                    <th className="pb-4 px-4">Personalized Message</th>
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
                            {new Date(lead.post_created_utc).toISOString().split('T')[0]}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                        <button 
                        className={`text-white px-4 py-2 rounded-md ${lead.personalized_message ? "bg-green-600" : "bg-purple-600"}`}
                        onClick={() => generatePersonalizedMsg(lead.personalized_message ? true : false, lead)}
                          >
                          {lead.personalized_message ? "Generated" : "Generate"}
                        </button>                        
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
        <FeedbackBot botName="FeedbackAssistant" open={askForFeedback} />
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
export default function Dashboard() {
  return (
      
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardContent />
      </Suspense>
  )
}