import type React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

const PLATFORMS = [
  {
    name: "Reddit",
    icon: "💼",
  },
]

interface PlatformsProps {
  data: {
    platforms: string[]
  }
  updateData: (data: Partial<{ platforms: string[] }>) => void
  onBack: () => void
  onComplete: () => void
}

export default function Platforms({ data, updateData, onBack, onComplete }: PlatformsProps) {
  const togglePlatform = (platform: string) => {
    const updated = data.platforms.includes(platform)
      ? data.platforms.filter((p) => p !== platform)
      : [...data.platforms, platform]
    updateData({ platforms: updated })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (data.platforms.length > 0) {
      onComplete()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Which platforms do you use?</Label>
          <p className="text-sm text-gray-600">Select all platforms where you want to find work</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {PLATFORMS.map(({ name, icon }) => (
              <button
                key={name}
                type="button"
                onClick={() => togglePlatform(name)}
                className={`p-4 rounded-lg border transition-colors flex items-center gap-2 ${
                  data.platforms.includes(name)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "hover:bg-gray-50 border-gray-200"
                }`}
              >
                <span className="text-xl">{icon}</span>
                <span>{name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Selected Platforms</Label>
          <div className="flex flex-wrap gap-2">
            {data.platforms.map((platform) => (
              <Badge key={platform} variant="secondary" className="px-3 py-1 text-sm">
                {platform}
                <button type="button" onClick={() => togglePlatform(platform)} className="ml-2 hover:text-destructive">
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
        <Button type="submit" disabled={data.platforms.length === 0}>
          Complete Setup
        </Button>
      </div>
    </form>
  )
}

