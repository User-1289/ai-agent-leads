import { Users, LayoutGrid, Mail, BarChart, MessageCircle, CalendarCheck } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <LayoutGrid className="w-8 h-8 text-[#6C5CE7]" />,
      title: "Multi-Platform Lead Generation",
      description: "AI scours job postings on Upwork, Fiverr, Reddit, LinkedIn, and niche job boards.",
    },
    {
      icon: <Mail className="w-8 h-8 text-[#6C5CE7]" />,
      title: "Bulk Apply with AI-Personalized Pitches",
      description: "Deliver tailored messages to engage potential clients",
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-[#6C5CE7]" />,
      title: "Automated Follow-Ups",
      description: "Set it once, and AI nurtures leads over time with smart responses",
    },
    {
      icon: <BarChart className="w-8 h-8 text-[#6C5CE7]" />,
      title: "Real-Time Analytics & CRM",
      description: "Track sent applications, responses, and conversion rates in a simple dashboard.",
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-[#6C5CE7]" />,
      title: "AI Social Media Engagement",
      description: "AI replies to freelance job requests on Reddit, LinkedIn, and Twitter so you never miss an opportunity.",
    },
    {
      icon: <CalendarCheck className="w-8 h-8 text-[#6C5CE7]" />,
      title: "Meeting & Proposal Scheduling",
      description: "AI can schedule discovery calls and pre-fill contracts for serious leads.",
    },
  ];

  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Features</h2>
        <div className="grid md:grid-cols-2 gap-8 center">
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

