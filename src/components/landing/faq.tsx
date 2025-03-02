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
    question: "What is Uizard.io?",
    answer:
      "Uizard.io is an AI-powered lead management and outreach automation platform designed to help freelancers and businesses streamline their lead generation and follow-up processes.",
  },
  {
    question: "How does the AI analyze new leads?",
    answer:
      "Our AI system scans various platforms and sources to identify potential leads based on your specified criteria. It then analyzes their profiles, engagement history, and other relevant data to determine the best approach for outreach.",
  },
  {
    question: "Can I integrate Uizard.io with other platforms?",
    answer:
      "Yes, Uizard.io offers integrations with popular platforms such as LinkedIn, Upwork, and various CRM systems. You can manage these integrations in the 'Platform Integrations' section of your dashboard.",
  },
  {
    question: "How does the automated follow-up system work?",
    answer:
      "The automated follow-up system uses AI to determine the optimal timing and content for follow-up messages. It takes into account factors such as the lead's engagement history, platform preferences, and your previous interactions to craft personalized follow-ups.",
  },
  {
    question: "What metrics does Uizard.io track?",
    answer:
      "Uizard.io tracks various metrics including the number of leads contacted, response rates, conversion rates, and pending follow-ups. You can view these metrics on your dashboard and get more detailed analytics in the reports section.",
  },
  {
    question: "How secure is my data on Uizard.io?",
    answer:
      "We take data security very seriously. All data is encrypted in transit and at rest. We use industry-standard security protocols and regularly perform security audits to ensure your information is protected.",
  },
  {
    question: "Can I customize the outreach messages?",
    answer:
      "While our AI generates initial message templates, you have full control to edit and customize these messages. You can also save your own templates for future use.",
  },
  {
    question: "What kind of support does Uizard.io offer?",
    answer:
      "We offer 24/7 customer support via chat and email. For our premium users, we also provide dedicated account managers and priority phone support.",
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
    <div className="max-w-3xl mx-auto py-12 px-4">
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

