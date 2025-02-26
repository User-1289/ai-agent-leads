"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface Skill {
  name: string
  level: "Beginner" | "Intermediate" | "Expert"
}

interface SkillsExperienceProps {
  data: {
    skills: Skill[]
  }
  updateData: (data: Partial<{ skills: Skill[] }>) => void
  onNext: () => void
  onBack: () => void
}

const SUGGESTED_SKILLS = [
  "React",
  "Node.js",
  "Python",
  "JavaScript",
  "TypeScript",
  "UI/UX Design",
  "Content Writing",
  "Digital Marketing",
  "SEO",
  "Data Analysis",
  "Project Management",
]

export default function SkillsExperience({ data, updateData, onNext, onBack }: SkillsExperienceProps) {
  const [currentSkill, setCurrentSkill] = useState("")
  const [currentLevel, setCurrentLevel] = useState<Skill["level"]>("Intermediate")
  const [suggestions, setSuggestions] = useState<string[]>([])

  const handleSkillInput = (value: string) => {
    setCurrentSkill(value)
    if (value.length > 0) {
      setSuggestions(SUGGESTED_SKILLS.filter((skill) => skill.toLowerCase().includes(value.toLowerCase())))
    } else {
      setSuggestions([])
    }
  }

  const addSkill = () => {
    if (currentSkill && !data.skills.find((s) => s.name === currentSkill)) {
      updateData({
        skills: [...data.skills, { name: currentSkill, level: currentLevel }],
      })
      setCurrentSkill("")
      setSuggestions([])
    }
  }

  const removeSkill = (skillName: string) => {
    updateData({
      skills: data.skills.filter((s) => s.name !== skillName),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (data.skills.length > 0) {
      onNext()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Add Your Skills</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Type a skill..."
                value={currentSkill}
                onChange={(e) => handleSkillInput(e.target.value)}
              />
              {suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                      onClick={() => {
                        setCurrentSkill(suggestion)
                        setSuggestions([])
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Select value={currentLevel} onValueChange={(value: Skill["level"]) => setCurrentLevel(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>
            <Button type="button" onClick={addSkill}>
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Your Skills</Label>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <Badge key={skill.name} variant="secondary" className="px-3 py-1 text-sm">
                {skill.name} • {skill.level}
                <button type="button" onClick={() => removeSkill(skill.name)} className="ml-2 hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={data.skills.length === 0}>
          Continue
        </Button>
      </div>
    </form>
  )
}

