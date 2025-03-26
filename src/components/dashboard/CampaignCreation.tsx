"use client"


import { useEffect, useState, } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User } from "firebase/auth"
import Swal from "sweetalert2"
import axios from "axios"
import CompactFeedbackBot from "../analytics/FeedbackBot"
const services: string[] = [
  "Social Media Marketing",
  "Email Campaigns",
  "SEO Optimization",
]

const skills: string[] = [
  "Copywriting",
  "Graphic Design",
  "Data Analysis",
]

export default function CampaignCreator() {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [skills, setSkills] = useState<string[]>([])
  const [services, setServices] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }


  const toggleSkill = (skillId: string) => {
    setSelectedSkills((prev) => (prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]))
  }

  useEffect(()=>{
    onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUser(user)
      }
    })
  }, [])
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/api/user/freelance-data/retrieve?uid=${user?.uid}`)
      if (response.ok) {
        const data = await response.json()
        setSkills(data.skills)
        setServices(data.services)
        console.log(data)
      }
    }
    if (user) {
      fetchUser()
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      let skillQuery = selectedSkills.join("+")
      let serviceQuery = selectedServices.join("+")
      console.log(skillQuery, serviceQuery)

      const res = await axios.get('/api/reddit/pick-leads', {
        params: {
          campaign_name: formData.name,
          campaign_description: formData.description, 
          skills: skillQuery,
          services: serviceQuery
        }
      })
      
      if(res.status !== 200) {
        throw new Error(`Failed to fetch leads: ${res.data.error}`)
      }
        Swal.fire({
          title: 'Success',
          text: 'Leads fetched successfully',
          icon: 'success'
        }).then(() => {
          //get the user to give feedback by displaying the feedback bot component inside swal
        })

    } catch (error:any) {
      setIsLoading(false)
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error'
      })
    }
  } 

  return (
    <div className="min-w-screen bg-gray-50 py-12">
      <div className="mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white/50 backdrop-blur-sm border border-purple-100 rounded-lg p-6 shadow-sm"
        >
          {/* Campaign Name */}
          <div className="mb-6">
            <label htmlFor="campaign-name" className="block text-sm font-medium text-gray-900 mb-2">
              Campaign Name
            </label>
            <Input
              id="campaign-name"
              placeholder="Enter campaign name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="bg-white"
            />
          </div>

          {/* Campaign Description */}
          <div className="mb-6">
            <label htmlFor="campaign-description" className="block text-sm font-medium text-gray-900 mb-2">
              Campaign Description
            </label>
            <Textarea
              id="campaign-description"
              placeholder="Describe your campaign"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="bg-white min-h-[100px]"
            />
          </div>

          {/* Select Services */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">Select Services</label>
            <div className="flex flex-wrap gap-2">
              {services.map((service) => (
                <button
                  disabled={isLoading}
                  key={service}
                  type="button"
                  onClick={() => toggleService(service)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    "border border-purple-200 hover:border-purple-300",
                    selectedServices.includes(service)
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-white text-gray-700 hover:bg-gray-50",
                  )}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>

          {/* Relevant Skills */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-900 mb-2">Relevant Skills</label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    "border border-purple-200 hover:border-purple-300",
                    selectedSkills.includes(skill)
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-white text-gray-700 hover:bg-gray-50",
                  )}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button disabled={isLoading} type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Let's Get You Some Clients
          </Button>
        </form>
      </div>
    </div>
  )
}

