import type React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface BasicInfoProps {
  data: {
    fullName: string
    professionalTitle: string
  }
  updateData: (data: any) => void
  onNext: () => void
}

export default function BasicInfo({ data, updateData, onNext }: BasicInfoProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            value={data.fullName}
            onChange={(e) => updateData({ fullName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="professionalTitle">Professional Title</Label>
          <Input
            id="professionalTitle"
            placeholder="Full Stack Developer"
            value={data.professionalTitle}
            onChange={(e) => updateData({ professionalTitle: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Continue</Button>
      </div>
    </form>
  )
}

