import type React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

const SERVICE_AREAS = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Graphic Design",
  "3D Modeling",
  "Video Editing",
  "Product Showcase Videos",
  "Content Writing",
  "Digital Marketing",
  "SEO",
  "Social Media Management",
  "Data Analysis",
  "Project Management",
  "Business Consulting",
]

interface ServiceAreasProps {
  data: {
    serviceAreas: string[]
  }
  updateData: (data: Partial<{ serviceAreas: string[] }>) => void
  onNext: () => void
  onBack: () => void
}

export default function ServiceAreas({ data, updateData, onNext, onBack }: ServiceAreasProps) {
  const toggleService = (service: string) => {
    const updated = data.serviceAreas.includes(service)
      ? data.serviceAreas.filter((s) => s !== service)
      : [...data.serviceAreas, service]
    updateData({ serviceAreas: updated })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (data.serviceAreas.length > 0) {
      onNext()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>What services do you want to provide?</Label>
          <p className="text-sm text-gray-600">Select all that apply</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {SERVICE_AREAS.map((service) => (
              <button
                key={service}
                type="button"
                onClick={() => toggleService(service)}
                className={`p-3 text-sm rounded-lg border transition-colors text-left ${
                  data.serviceAreas.includes(service)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "hover:bg-gray-50 border-gray-200"
                }`}
              >
                {service}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Selected Services</Label>
          <div className="flex flex-wrap gap-2">
            {data.serviceAreas.map((service) => (
              <Badge key={service} variant="secondary" className="px-3 py-1 text-sm">
                {service}
                <button type="button" onClick={() => toggleService(service)} className="ml-2 hover:text-destructive">
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
        <Button type="submit" disabled={data.serviceAreas.length === 0}>
          Continue
        </Button>
      </div>
    </form>
  )
}

