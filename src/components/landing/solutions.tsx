import { Users, LayoutGrid, MessageSquare, Sparkles } from "lucide-react"

export default function Solution() {
  const solutions = [
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "AI Scans Multiple Job & Social Media Platforms",
      description: "Finds jobs on Upwork, Fiverr, LinkedIn, Reddit and More",
    },
    {
      icon: <LayoutGrid className="w-8 h-8 text-white" />,
      title: "Personalized Proposals are Sent Across Platforms",
      description: "Our AI crafts tailored pitches based on your skills and portfolio.",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-white" />,
      title: "Follows-Up & Tracks Engagement with Leads",
      description: "Never lose a lead with automated CRM tracking & reminders",
    },
  ]

  return (
    <section id="solution" className="py-20 bg-gradient-to-br from-[#6C5CE7] to-[#4834d4] text-white relative">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/10"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-white/10"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-yellow-300 mr-2" />
          <span className="text-xl font-medium text-yellow-300">THE GAME CHANGER</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">The Solution</h2>
        <h3 className="text-xl text-indigo-200 text-center mb-16 max-w-2xl mx-auto">AI Agents That Do the Work For You!</h3>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {solutions.map((solution, index) => (
            <div 
              key={index} 
              className="relative bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="absolute -top-6 left-8 inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#6C5CE7] shadow-lg shadow-indigo-900/50">
                {solution.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 pt-6">{solution.title}</h3>
              <p className="text-indigo-100">{solution.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}