"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, CheckCircle, X, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import axios from "axios"
import Swal from "sweetalert2"

interface Message {
  id: string
  type: "bot" | "user"
  text: string
}

interface CompactFeedbackBotProps {
  onComplete?: (answers: any) => void
  botName?: string
  welcomeMessage?: string
  completionMessage?: string
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  open?: boolean
}

const questions = [
  "What would you like a tool like this to do for you?",
  "What are the problems for you now in finding a freelance job?",
  "Is there any feature you would like to add that could help you?",
]

export default function CompactFeedbackBot({
  onComplete,
  botName = "FeedbackBot",
  welcomeMessage = "Hi there! I'd like to ask you a few quick questions to get your feedback.",
  completionMessage = "Thank you for your feedback! Your responses have been recorded.",
  position = "bottom-right",
  open = false
}: CompactFeedbackBotProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  useEffect(() => {
    setIsExpanded(open)
  }, [open])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1)
  const [answers, setAnswers] = useState<{ question: string; answer: string }[]>([])
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Position classes based on the position prop
  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  }

  // Initialize chat when expanded for the first time
  useEffect(() => {
    console.log(isExpanded, messages.length, currentQuestionIndex)
    if (isExpanded && messages.length === 0 && currentQuestionIndex === -1) {
      setCurrentQuestionIndex(0)
    }
  }, [isExpanded, messages.length, currentQuestionIndex])

  // Add new question to chat
  useEffect(() => {
    if (isExpanded && currentQuestionIndex >= 0 && currentQuestionIndex < questions.length) {
      setIsTyping(true)

      const timer = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `question-${currentQuestionIndex}`,
            type: "bot",
            text: questions[currentQuestionIndex],
          },
        ])
        setIsTyping(false)
        inputRef.current?.focus()

        // Increment unread count if not expanded
        if (!isExpanded) {
          setUnreadCount((prev) => prev + 1)
        }
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [currentQuestionIndex, questions, isExpanded])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isExpanded) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isExpanded])

  // Handle completion
  useEffect(() => {
    if (isComplete) {
      sendFeedback()
      onComplete?.(answers)
    }
  }, [isComplete, answers, onComplete])

  // Reset unread count when expanded
  useEffect(() => {
    if (isExpanded) {
      setUnreadCount(0)
    }
  }, [isExpanded])

  async function sendFeedback(){
    console.log(answers)
    const res = await axios.post('/api/mvp/feedback', {
      answers
    })
    if(res.status !== 200){
      Swal.fire({
        title: 'Error',
        text: 'Failed to send feedback',
        icon: 'error'
      })
      console.error(res.data)
    } else {
      Swal.fire({
        title: 'Success',
        text: 'Thank you for your feedback!',
        icon: 'success'
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    // Add user's answer to messages
    setMessages((prev) => [...prev, { id: `answer-${currentQuestionIndex}`, type: "user", text: inputValue }])

    // Store answer
    setAnswers((prev) => [
      ...prev,
      { question: questions[currentQuestionIndex], answer: inputValue }
    ])

    setInputValue("")

    // Check if we've reached the end of questions
    if (currentQuestionIndex >= questions.length - 1) {
      // Show completion message after a delay
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: "completion", type: "bot", text: completionMessage }])
        setIsComplete(true)
      }, 500)
    } else {
      // Move to next question
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1)
      }, 500)
    }
  }

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev)
  }

  const resetBot = () => {
    setIsExpanded(false)
    setCurrentQuestionIndex(-1)
    setAnswers([])
    setInputValue("")
    setMessages([])
    setIsComplete(false)
    setIsTyping(false)
    setUnreadCount(0)
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* Compact Button */}
      {!isExpanded && (
        <button
          onClick={toggleExpanded}
          className="bg-purple-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-purple-700 transition-all"
        >
          <MessageSquare className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Expanded Chat Interface */}
      {isExpanded && (
        <div className="w-80 sm:w-96 bg-white rounded-lg shadow-xl overflow-hidden border animate-scaleIn">
          {/* Header */}
          <div className="bg-purple-600 text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <h3 className="font-medium">{botName}</h3>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={resetBot} className="p-1 hover:bg-purple-700 rounded-full" title="Reset conversation">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>
              <button onClick={toggleExpanded} className="p-1 hover:bg-purple-700 rounded-full" title="Minimize">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat area */}
          <div className="h-80 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("mb-4 max-w-[80%] animate-fadeIn", message.type === "bot" ? "mr-auto" : "ml-auto")}
              >
                <div
                  className={cn(
                    "p-3 rounded-lg",
                    message.type === "bot" ? "bg-white border border-gray-200" : "bg-purple-600 text-white",
                  )}
                >
                  <div className="flex items-start gap-2">
                    {message.type === "bot" ? (
                      <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                    ) : (
                      <User className="h-4 w-4 mt-1 flex-shrink-0" />
                    )}
                    <p>{message.text}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Bot typing indicator */}
            {isTyping && (
              <div className="mb-4 max-w-[80%] mr-auto animate-fadeIn">
                <div className="p-3 rounded-lg bg-white border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 flex-shrink-0" />
                    <div className="flex gap-1">
                      <span
                        className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Completion indicator */}
            {isComplete && (
              <div className="flex justify-center items-center my-4 text-green-600 animate-fadeIn">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Feedback complete</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <form onSubmit={handleSubmit} className="p-3 border-t">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isComplete ? "Feedback complete" : "Type your answer..."}
                disabled={isComplete || isTyping}
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isComplete || isTyping || !inputValue.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
