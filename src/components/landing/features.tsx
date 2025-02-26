import { Users, LayoutGrid, MessageSquare } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-[#6C5CE7]" />,
      title: "Automated Client Outreach",
      description: "Streamline your client interactions with AI-driven automation",
    },
    {
      icon: <LayoutGrid className="w-8 h-8 text-[#6C5CE7]" />,
      title: "Multi-Platform Lead Generation",
      description: "Capture leads from various platforms effortlessly",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-[#6C5CE7]" />,
      title: "AI-Powered Personalized Messaging",
      description: "Deliver tailored messages to engage potential clients",
    },
  ]

  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6C5CE7]/10 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

