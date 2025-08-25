"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  Send, 
  Paperclip, 
  Phone, 
  Video, 
  MoreVertical, 
  Check, 
  CheckCheck,
  Bot,
  User,
  Plus,
  Loader2
} from "lucide-react"

// Types
interface Message {
  id: string
  sender: "user" | "bot"
  content: string
  time: string
  status: "sent" | "delivered" | "read"
  timestamp: number
}

interface ChatSession {
  id: string
  name: string
  specialty: string
  avatar: string
  lastMessage: string
  time: string
  messages: Message[]
  unread: number
  online: boolean
}

const MedicalChatbotPage = () => {
  const [selectedChat, setSelectedChat] = useState<number>(0)
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "session-1",
      name: "AI Medical Assistant",
      specialty: "AI Health Advisor",
      avatar: "/ai-doctor.png",
      lastMessage: "Hello! How can I help you with your health concerns today?",
      time: "now",
      unread: 0,
      online: true,
      messages: [
        {
          id: "1",
          sender: "bot",
          content: "Hello! I'm your AI medical assistant. I can help you understand symptoms and provide general health guidance. Please remember that I'm not a replacement for professional medical advice. How can I help you today?",
          time: "now",
          status: "read",
          timestamp: Date.now() - 1000
        }
      ]
    }
  ])
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // API Configuration
  const API_BASE_URL = "http://localhost:5002"

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatSessions])

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const createNewChatSession = () => {
    const newSessionId = `session-${Date.now()}`
    const newSession: ChatSession = {
      id: newSessionId,
      name: `AI Medical Chat ${chatSessions.length + 1}`,
      specialty: "AI Health Advisor",
      avatar: "/ai-doctor.png",
      lastMessage: "Start a new conversation...",
      time: "now",
      unread: 0,
      online: true,
      messages: [
        {
          id: "initial",
          sender: "bot",
          content: "Hello! I'm your AI medical assistant. How can I help you with your health concerns today?",
          time: "now",
          status: "read",
          timestamp: Date.now()
        }
      ]
    }

    setChatSessions(prev => [newSession, ...prev])
    setSelectedChat(0)
  }

  const sendMessageToAPI = async (message: string): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/medical-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: message,
          age: 30,
          sex: "unknown",
          session_id: chatSessions[selectedChat]?.id || "default"
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.response || "I apologize, but I couldn't process your request right now."
    } catch (error) {
      console.error('API Error:', error)
      return "I'm having trouble connecting right now. Please check that the medical chatbot API is running on port 5002, or try again later."
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return

    const currentTime = Date.now()
    const userMessage: Message = {
      id: `user-${currentTime}`,
      sender: "user",
      content: newMessage.trim(),
      time: formatTime(currentTime),
      status: "sent",
      timestamp: currentTime
    }

    // Add user message immediately
    setChatSessions(prev => {
      const updated = [...prev]
      updated[selectedChat] = {
        ...updated[selectedChat],
        messages: [...updated[selectedChat].messages, userMessage],
        lastMessage: newMessage.trim(),
        time: "now"
      }
      return updated
    })

    const messageToSend = newMessage
    setNewMessage("")
    setIsLoading(true)

    // Get bot response
    try {
      const botResponse = await sendMessageToAPI(messageToSend)
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        content: botResponse,
        time: formatTime(Date.now()),
        status: "read",
        timestamp: Date.now()
      }

      setChatSessions(prev => {
        const updated = [...prev]
        updated[selectedChat] = {
          ...updated[selectedChat],
          messages: [...updated[selectedChat].messages, botMessage],
          lastMessage: botResponse.substring(0, 50) + (botResponse.length > 50 ? "..." : ""),
          time: "now"
        }
        return updated
      })

      // Mark user message as read
      setChatSessions(prev => {
        const updated = [...prev]
        const messages = [...updated[selectedChat].messages]
        const userMsgIndex = messages.findIndex(m => m.id === userMessage.id)
        if (userMsgIndex !== -1) {
          messages[userMsgIndex] = { ...messages[userMsgIndex], status: "read" }
          updated[selectedChat] = { ...updated[selectedChat], messages }
        }
        return updated
      })

    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground" />
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-primary-foreground" />
      default:
        return null
    }
  }

  const currentSession = chatSessions[selectedChat]

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-120px)] bg-background rounded-lg shadow-sm border border-border">
        {/* Conversations List - Matching original design */}
        <div className="w-1/3 border-r border-border bg-muted/50">
          <div className="p-4 border-b border-border bg-background">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-foreground">Medical Chats</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={createNewChatSession}
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </div>

          <div className="overflow-y-auto h-full">
            {chatSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 border-b border-border cursor-pointer hover:bg-background transition-colors ${
                  selectedChat === index ? "bg-background border-l-4 border-l-primary" : ""
                }`}
                onClick={() => setSelectedChat(index)}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={session.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Bot className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    {session.online && (
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-background rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground truncate">{session.name}</h3>
                      <span className="text-xs text-muted-foreground">{session.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{session.specialty}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">{session.lastMessage}</p>
                      {session.unread > 0 && (
                        <Badge variant="default" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                          {session.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Area - Matching original design */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header - Exact same as original */}
          <div className="p-4 border-b border-border bg-background flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentSession?.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                {currentSession?.online && (
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full"></div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-foreground">{currentSession?.name}</h3>
                <p className="text-sm text-muted-foreground">{currentSession?.specialty}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" disabled>
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" disabled>
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages - Matching original styling */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
            {currentSession?.messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <div
                    className={`flex items-center justify-end mt-1 space-x-1 ${
                      message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    <span className="text-xs">{message.time}</span>
                    {message.sender === "user" && getStatusIcon(message.status)}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-muted text-foreground px-4 py-2 rounded-lg max-w-xs lg:max-w-md">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span className="text-sm">Analyzing your symptoms...</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input - Exact same as original */}
          <div className="p-4 border-t border-border bg-background">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                ref={inputRef}
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!newMessage.trim() || isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MedicalChatbotPage