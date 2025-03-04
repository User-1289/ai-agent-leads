"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// Define the structure for FAQ items
type FAQItem = {
  question: string
  answer: string
}

// Sample FAQ data
const faqData: FAQItem[] = [
  {
    question: "What makes this different from Fiverr or Upwork?",
    answer:
      "Unlike individual job platforms, we actively find and pitch clients for you across multiple channels, increasing your chances of getting work.",
  },
  {
    question: "Can I customize the AI-generated pitches?",
    answer:
      "Yes! You can edit or approve each message before its sent, ensuring full control over outreach.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Our freemium plan lets you apply to 10 jobs per week, while premium tiers unlock unlimited outreach and advanced CRM features.",
  },
  {
    question: "How does the automated follow-up system work?",
    answer:
      "The automated follow-up system uses AI to determine the optimal timing and content for follow-up messages. It takes into account factors such as the lead's engagement history, platform preferences, and your previous interactions to craft personalized follow-ups.",
  },
  {
    question: "What metrics does we use to track?",
    answer:
      "Various metrics including the number of leads contacted, response rates, conversion rates, and pending follow-ups. You can view these metrics on your dashboard and get more detailed analytics in the reports section.",
  },
]

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter FAQ items based on search term
  const filteredFAQs = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="max-w-3xl mx-auto py-12 px-4" id="faq">
      <h1 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h1>

      {/* Search input */}
      <div className="relative mb-8">
        <Input
          type="text"
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>

      {/* FAQ Accordion */}
      <Accordion type="single" collapsible className="w-full">
        {filteredFAQs.map((item, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
            <AccordionContent>
              <p className="text-gray-600">{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* No results message */}
      {filteredFAQs.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No matching questions found. Please try a different search term.
        </p>
      )}
    </div>
  )
}

