import { ArrowDown, Upload, Link, Search, MessageSquare, Settings, Calendar } from "lucide-react"

const steps = [
  {
    icon: Upload,
    title: "Upload Your Profile",
    description: "Provide your skills, services, portfolio, CV, and scheduling link (Calendly/Cal.com).",
  },
  {
    icon: Link,
    title: "Connect Accounts",
    description: "Link your social media (X, Reddit) and freelancer accounts.",
  },
  {
    icon: Search,
    title: "AI Client Discovery",
    description: "We find potential clients and present them in a convenient table format.",
  },
  {
    icon: MessageSquare,
    title: "Outreach",
    description: "Bulk DM potential clients using our tool or reach out independently.",
  },
  {
    icon: Settings,
    title: "Automated Follow-ups",
    description: "Our tool tracks responses and can auto-respond based on your settings.",
  },
  {
    icon: Calendar,
    title: "Meeting Scheduling",
    description: "We can automatically schedule meetings with interested clients using your provided calendar link.",
  },
]

export default function HowItWorks() {
  return (
    <div id="howitworks" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">How It Works</h2>
        </div>

        <div className="mt-20">
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200"
              aria-hidden="true"
            ></div>

            {/* Steps */}
            <div className="relative z-10 flex flex-col items-center">
              {steps.map((step, index) => (
                <div key={index} className="relative mb-5 last:mb-0 w-full max-w-md text-center">
                  <div className="flex flex-col items-center">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center z-10 mb-4">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>

                    {/* Line to next step */}
                    {index < steps.length - 1 && (
                      <div className="mt-4">
                        <ArrowDown className="w-8 h-8 text-purple-600" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

