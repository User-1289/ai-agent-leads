import { Users, LayoutGrid, MessageSquare, AlertTriangle } from "lucide-react"

export default function Problems() {
  const problems = [
    {
      icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
      title: "No Portfolio, No Clients",
      description: "Hard to build credibility without experience.",
    },
    {
      icon: <LayoutGrid className="w-8 h-8 text-red-500" />,
      title: "Cold Outreach is Time-Consuming",
      description: "Manually reaching out to potential clients is exhausting and ineffective.",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-red-500" />,
      title: "Freelance Platforms Are Overcrowded",
      description: "Upwork & Fiverr are flooded with competition, driving rates down.",
    },
    {
      icon: <Users className="w-8 h-8 text-red-500" />,
      title: "Social Media is Untapped Potential",
      description: "Clients post job requests on Reddit, LinkedIn, and Twitter, but they're hard to find manually.",
    },
  ]

  return (
    <section id="problem" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <span className="inline-block px-3 py-1 bg-red-500 text-white rounded-full text-sm font-medium mb-4">FREELANCER CHALLENGES</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">The Problem</h2>
          <p className="text-xl text-gray-300">Why Freelancers Struggle to Get Clients</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <div 
              key={index} 
              className="p-8 bg-gray-800 border-l-4 border-red-500 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 mr-4">
                  {problem.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">{problem.title}</h3>
                  <p className="text-gray-300">{problem.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}