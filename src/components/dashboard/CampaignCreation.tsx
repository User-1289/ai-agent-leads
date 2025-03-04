"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface Service {
  id: string
  name: string
}

interface Skill {
  id: string
  name: string
}

const services: Service[] = [
  { id: "social-media", name: "Social Media Marketing" },
  { id: "email", name: "Email Campaigns" },
  { id: "seo", name: "SEO Optimization" },
]

const skills: Skill[] = [
  { id: "copywriting", name: "Copywriting" },
  { id: "graphic-design", name: "Graphic Design" },
  { id: "data-analysis", name: "Data Analysis" },
]

export default function CampaignCreator() {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log({
      ...formData,
      services: selectedServices,
      skills: selectedSkills,
    })
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
                  key={service.id}
                  type="button"
                  onClick={() => toggleService(service.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    "border border-purple-200 hover:border-purple-300",
                    selectedServices.includes(service.id)
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-white text-gray-700 hover:bg-gray-50",
                  )}
                >
                  {service.name}
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
                  key={skill.id}
                  type="button"
                  onClick={() => toggleSkill(skill.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    "border border-purple-200 hover:border-purple-300",
                    selectedSkills.includes(skill.id)
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-white text-gray-700 hover:bg-gray-50",
                  )}
                >
                  {skill.name}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Let's Get You Some Clients
          </Button>
        </form>
      </div>
    </div>
  )
}

