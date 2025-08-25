"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Search, Plus, Phone, Video, Paperclip, MoreVertical } from "lucide-react"

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(1)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const conversations = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      role: "Healthcare Partner",
      lastMessage: "The vaccination drive was successful. We reached 450 people.",
      timestamp: "2 hours ago",
      unread: 2,
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
    },
    {
      id: 2,
      name: "City Health Department",
      role: "Government Partner",
      lastMessage: "Please submit the quarterly report by Friday.",
      timestamp: "1 day ago",
      unread: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
    },
    {
      id: 3,
      name: "Volunteer Team Alpha",
      role: "Volunteer Group",
      lastMessage: "Ready for tomorrow's community outreach!",
      timestamp: "2 days ago",
      unread: 5,
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
    },
    {
      id: 4,
      name: "Local Hospital Network",
      role: "Healthcare Partner",
      lastMessage: "We can provide additional medical supplies.",
      timestamp: "3 days ago",
      unread: 1,
      avatar: "/placeholder.svg?height=40&width=40",
      status: "away",
    },
  ]

  const messages = [
    {
      id: 1,
      senderId: 1,
      senderName: "Dr. Priya Sharma",
      content: "Good morning! I wanted to update you on yesterday's vaccination drive.",
      timestamp: "10:30 AM",
      type: "received",
    },
    {
      id: 2,
      senderId: "me",
      senderName: "You",
      content: "That's great! How did it go?",
      timestamp: "10:32 AM",
      type: "sent",
    },
    {
      id: 3,
      senderId: 1,
      senderName: "Dr. Priya Sharma",
      content: "The vaccination drive was successful. We reached 450 people. The community response was overwhelming!",
      timestamp: "10:35 AM",
      type: "received",
    },
    {
      id: 4,
      senderId: "me",
      senderName: "You",
      content: "Excellent work! That's above our target of 400. The team did an amazing job.",
      timestamp: "10:37 AM",
      type: "sent",
    },
    {
      id: 5,
      senderId: 1,
      senderName: "Dr. Priya Sharma",
      content: "Thank you! Should we plan the next drive for next month?",
      timestamp: "10:40 AM",
      type: "received",
    },
  ]

  const currentConversation = conversations.find((conv) => conv.id === selectedConversation)
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage("")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex bg-background rounded-lg border">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Messages</h2>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedConversation === conversation.id ? "bg-muted" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {conversation.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(conversation.status)}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm truncate">{conversation.name}</p>
                        <p className="text-xs text-muted-foreground">{conversation.role}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                        {conversation.unread > 0 && (
                          <Badge className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-1">{conversation.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={currentConversation.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {currentConversation.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(currentConversation.status)}`}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{currentConversation.name}</h3>
                    <p className="text-sm text-muted-foreground">{currentConversation.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "sent" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === "sent" ? "bg-blue-600 text-white" : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.type === "sent" ? "text-blue-100" : "text-muted-foreground"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-end gap-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-[40px] max-h-32 resize-none"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                  </div>
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
