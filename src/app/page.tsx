"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Plus, User, Settings, Moon, Sun, ChevronDown, ArrowUp, Lightbulb, Sidebar, MessageSquare} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MessageContent } from "../components/message-content"
import { cn } from "@/lib/utils"

type AIState = "idle" | "thinking" | "reflecting" | "searching" | "waiting"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  aiState?: AIState
  reflectionTime?: number
  thoughtContent?: string
}

type Chat = {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}

const mockChats: Chat[] = [
  {
    id: "1",
    title: "AI-Powered Generation",
    lastMessage: "Explain quantum superposition...",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "2",
    title: "Machine Learning with",
    lastMessage: "What are the ethical implications...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "3",
    title: "Chemical equations f",
    lastMessage: "Analyze the latest climate data...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
]

const suggestionTopics = [
  "Literature & Research Review",
  "Analysis and Interpretation",
  "Methodology & Approach",
  "Research Planning",
]

const recentChats = [
  {
    id: "1",
    title: "AI-Powered Generation",
  },
  {
    id: "2",
    title: "Machine Learning with",
  },
  {
    id: "3",
    title: "Chemical equations function",
  },
]

export default function RIIKInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [aiState, setAIState] = useState<AIState>("idle")
  const [darkMode, setDarkMode] = useState(false)
  const [hasStartedChat, setHasStartedChat] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [reflectionTime, setReflectionTime] = useState(0)
  const [isMobileView, setIsMobileView] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Check for mobile view on mount and window resize
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true)
      }
    }
    
    // Initial check
    checkMobileView()
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobileView)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobileView)
  }, [])

  const toggleMobileSidebar = () => {
    if (isMobileView) {
      setShowMobileSidebar(!showMobileSidebar)
    } else {
      setSidebarCollapsed(!sidebarCollapsed)
    }
  }

  const handleSendMessage = async (messageText?: string) => {
    const messageContent = messageText || input.trim()
    if (!messageContent) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setHasStartedChat(true)

    // Simulate AI processing states with realistic timing
    setAIState("thinking")

    setTimeout(() => {
      setAIState("searching")
      setTimeout(() => {
        setAIState("reflecting")
        setReflectionTime(0)

        // Simulate reflection time counting
        const reflectionInterval = setInterval(() => {
          setReflectionTime((prev) => prev + 1)
        }, 1000)

        setTimeout(() => {
          clearInterval(reflectionInterval)
          const finalReflectionTime = Math.floor(Math.random() * 12) + 3 // 3-15 seconds

          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: `I understand you're asking about "${messageContent}". Let me provide a comprehensive analysis.

**Mathematical Example:**
Euler's formula is $e^{ix} = \\cos(x) + i\\sin(x)$, which is one of the most beautiful equations in mathematics.

For a more complex example, consider the Gaussian integral:

$$\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$

**Research Findings:**
According to recent studies, this topic has significant implications[^1]. The research shows that understanding these concepts can lead to breakthroughs in multiple fields.

<source title="Journal of Advanced Mathematics" url="https://example.com/math-journal" date="2024-05-15">
Research by Smith et al. (2024) demonstrates that these mathematical principles can be applied to quantum computing, potentially increasing computational efficiency by up to 30%.
</source>

**Code Example:**
\`\`\`javascript
function analyzeQuery(input) {
  // Process the input with deep reasoning
  const analysis = processWithDeepReasoning(input);
  
  // Apply mathematical transformations
  const result = analysis.map(item => ({
    ...item,
    confidence: Math.exp(-item.uncertainty)
  }));
  
  return result;
}
\`\`\`

**Key Points:**
- The system maintains context across conversations
- Mathematical expressions are rendered beautifully
- Code blocks have proper syntax highlighting
- *Emphasis* and **strong emphasis** work correctly
- Source citations provide evidence-based responses[^2]

<source title="AI Quarterly Review" url="https://example.com/ai-review" date="2024-06-01">
The latest issue highlights how modern AI systems can effectively combine mathematical notation, code examples, and research citations to provide comprehensive responses to complex queries.
</source>

This demonstrates Krod AI's capability to handle complex mathematical notation, code, formatted text, and research citations seamlessly.

[^1]: Smith, J., & Johnson, A. (2024). Mathematical Principles in AI Systems. Journal of Advanced Mathematics, 42(3), 187-201.
[^2]: Chen, L. (2024). Evidence-Based AI Responses. AI Quarterly Review, 15(2), 78-92.`,
            timestamp: new Date(),
            aiState: "reflecting",
            reflectionTime: finalReflectionTime,
            thoughtContent: `The user is asking about "${messageContent}". I need to provide a comprehensive response that demonstrates:

1. **Mathematical rendering capabilities** - Show both inline and block math
2. **Code syntax highlighting** - Demonstrate JavaScript with proper formatting
3. **Text formatting** - Use bold, italic, and other formatting options
4. **Structured response** - Organize information clearly
5. **Source citations** - Include research references with proper citations
6. **Source cards** - Display source information in card format

I should include:
- Euler's formula as an inline math example: $e^{ix} = \\cos(x) + i\\sin(x)$
- A Gaussian integral as a block math example: $$\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$
- A JavaScript function with proper syntax highlighting
- Various text formatting examples
- Clear structure with headers and bullet points
- Source cards with relevant research information
- Numbered citations in academic format

This will showcase the full capabilities of the interface while providing a meaningful response to the user's query.`,
          }
          setMessages((prev) => [...prev, aiMessage])
          setAIState("idle")
          setReflectionTime(0)
        }, 4000)
      }, 1200)
    }, 800)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleNewChat = () => {
    setMessages([])
    setHasStartedChat(false)
    setActiveChat(null)
    setAIState("idle")
  }

  const getAIStateIndicator = (message?: Message) => {
    const currentState = message?.aiState || aiState
    const time = message?.reflectionTime || reflectionTime

    switch (currentState) {
      case "thinking":
        return (
          <div className="flex items-center gap-2 text-sm text-slate-500 py-2">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse delay-100"></div>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse delay-200"></div>
            </div>
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">Thinking...</span>
          </div>
        )
      case "searching":
        return (
          <div className="flex items-center gap-2 text-sm py-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Searching web...</span>
          </div>
        )
      case "reflecting":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm py-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
              <span className="text-purple-600 dark:text-purple-400 font-small">
                {message?.reflectionTime ? `Thought for ${message.reflectionTime} seconds` : `Reflecting... ${time}s`}
              </span>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const getCurrentChatTitle = () => {
    if (activeChat) {
      return mockChats.find((c) => c.id === activeChat)?.title || "Chat"
    }
    return "New Chat"
  }

  return (
    <div className={cn("h-screen flex flex-col md:flex-row", darkMode && "dark")}>
      {/* Mobile Sidebar Overlay */}
      {isMobileView && showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "sidebar-bg transition-all duration-300 ease-in-out flex flex-col z-30",
          isMobileView 
            ? cn("fixed top-0 bottom-0 left-0 h-full", 
                showMobileSidebar ? "translate-x-0" : "-translate-x-full",
                "w-64")
            : cn("flex-shrink-0", sidebarCollapsed ? "w-16" : "w-64")
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4">
          {(!sidebarCollapsed || (isMobileView && showMobileSidebar)) && (
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-xl text-foreground riik-text">Krod AI</h2>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileSidebar}
            className="w-8 h-8 p-0 text-foreground hover:text-foreground hover:bg-violet-100 dark:hover:bg-violet-800"
          >
            <Sidebar className="w-6 h-6" />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-2">
          <Button
            onClick={() => {
              setMessages([])
              setHasStartedChat(false)
              setActiveChat(null)
            }}
            className={cn(
              "w-full justify-start gap-2 bg-violet-700 dark:bg-violet-800 hover:bg-violet-300 dark:hover:bg-violet-700 text-neutral-200 dark:text-violet-200 border border-violet-200 dark:border-violet-700",
              sidebarCollapsed && "justify-center px-0"
            )}
          >
            <Plus className="w-4 h-4" />
            {(!sidebarCollapsed || (isMobileView && showMobileSidebar)) && <span>New Chat</span>}
          </Button>
        </div>

        {/* Recent Chats */}
        <div className="flex-1 overflow-y-auto py-2">
          {(!sidebarCollapsed || (isMobileView && showMobileSidebar)) && (
            <div className="px-2 mb-2">
              <h3 className="text-xs font-medium text-neutral-500 dark:text-neutral-400 px-2">Recent Conversations</h3>
            </div>
          )}
          <div className="space-y-1 px-2">
            {recentChats.map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                onClick={() => setActiveChat(chat.id)}
                className={cn(
                  "w-full justify-start gap-1.5 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 hover:text-neutral-900 dark:hover:bg-neutral-700 dark:hover:text-neutral-100 font-medium font-Inter",
                  activeChat === chat.id && "bg-neutral-300 dark:bg-neutral-700",
                  sidebarCollapsed && "justify-center px-0"
                )}
              >
                {/* <MessageSquare className="w-4 h-4 text-slate-500" /> */}
                {(!sidebarCollapsed || (isMobileView && showMobileSidebar)) && (
                  <span className="truncate">{chat.title}</span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-2 mt-auto border-t dark:border-neutral-800 border-neutral-100">
          {sidebarCollapsed && !isMobileView ? (
            <div className="flex flex-col items-center space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className="w-8 h-8 p-0 text-neutral-500 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 text-neutral-500 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-neutral-300"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className="text-neutral-500 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-neutral-300"
              >
                {darkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                {(!sidebarCollapsed || (isMobileView && showMobileSidebar)) && (
                  <span>Theme</span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-neutral-500 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-neutral-300"
              >
                <Settings className="w-4 h-4 mr-2" />
                {(!sidebarCollapsed || (isMobileView && showMobileSidebar)) && (
                  <span>Settings</span>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 main-content-bg">
        {/* Top Bar */}
        <header className="h-16 flex items-center justify-between dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-900 px-4 md:px-6">
          {isMobileView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileSidebar}
              className="mr-2 w-8 h-8 p-0 text-neutral-500 hover:text-foreground"
            >
              <Sidebar className="w-5 h-5" />
            </Button>
          )}
          <div className="flex items-center gap-4">
            <h1 className="font-medium text-lg text-foreground truncate">{getCurrentChatTitle()}</h1>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <Button size="sm" className="bg-violet-800 hover:bg-violet-700 text-white shadow-sm rounded-lg px-3 md:px-4 h-8 text-xs md:text-sm">
              Get Pro
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-10 h-10 p-0 text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback className="bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
              >
                <DropdownMenuItem className="text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-neutral-200 dark:bg-neutral-700" />
                <DropdownMenuItem className="text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {!hasStartedChat ? (
            /* Initial Landing State */
            <div className="flex-1 flex items-center justify-center p-4 md:p-8">
              <div className="max-w-2xl w-full space-y-6 md:space-y-8 text-center">
                {/* Header */}
                <div className="space-y-4 md:space-y-6">
                  <h1 className="text-2xl md:text-4xl font-semibold tracking-tight text-foreground riik-text">
                    What Can I help You With?
                  </h1>
                </div>

                {/* Large Input Box */}
                <div className="relative">
                  <div className="relative bg-white dark:bg-neutral-600 rounded-xl md:rounded-3xl shadow-lg border border-neutral-200 dark:border-neutral-700">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Ask Krod anything..."
                      className="w-full h-12 md:h-16 text-sm md:text-base pl-4 md:pl-6 pr-12 md:pr-16 rounded-xl md:rounded-3xl border-0 bg-transparent focus:ring-0 focus:outline-none text-foreground placeholder:text-neutral-400 text-sm placeholder:dark:text-neutral-200"
                    />
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={!input.trim()}
                      size="sm"
                      className="absolute right-2 md:right-3 top-2 md:top-3 h-8 md:h-10 w-8 md:w-10 p-0 bg-neutral-400 hover:bg-neutral-500 dark:bg-neutral-800 dark:hover:bg-neutral-500 text-white rounded-full shadow-sm"
                    >
                      <ArrowUp className="w-3 md:w-4 h-3 md:h-4" />
                    </Button>
                  </div>
                </div>

                {/* Suggestion Pills */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-4 md:mt-8">
                  {suggestionTopics.map((topic, index) => (
                    <button key={index} onClick={() => handleSuggestionClick(topic)} className="suggestion-pill text-xs md:text-sm py-1.5 md:py-2 px-3 md:px-4">
                      {topic}
                    </button>
                  ))}
                </div>

                {/* Disclaimer */}
                <div className="mt-8 md:mt-12">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    AI can make mistakes. Please double-check responses.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Chat State */
            <>
              <ScrollArea className="flex-1 p-3 md:p-6 overflow-y-auto">
                <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
                  {messages.map((message, index) => (
                    <div key={message.id} className="space-y-4">
                      {/* Main Message */}
                      <div className={cn("flex gap-4", message.role === "user" ? "justify-end" : "justify-start")}>
                        {message.role === "assistant" 
                        // && (
                        //   <Avatar className="w-8 h-8 flex-shrink-0">
                        //     <AvatarFallback className="bg-indigo-600 text-white">
                        //       {/* <span className="font-medium text-xs">K</span> */}
                        //     </AvatarFallback>
                        //   </Avatar>
                        // )}
}

                        <div className={cn("max-w-2xl", message.role === "user" ? "ml-12" : "mr-12")}>
                          {/* Thought Content (for assistant messages) */}
                          {message.role === "assistant" && message.thoughtContent && (
                            <div className="mb-4">
                              <Collapsible>
                                <CollapsibleTrigger className="flex items-center gap-2 text-sm py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded px-2 -mx-2 transition-colors">
                                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                  <span className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium">
                                    <Lightbulb className="w-4 h-4" />
                                    Thought for {message.reflectionTime} seconds
                                  </span>
                                  <ChevronDown className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-2">
                                  <div className="thought-message">
                                    <MessageContent
                                      content={message.thoughtContent}
                                      className="text-purple-800 dark:text-purple-200"
                                    />
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            </div>
                          )}

                          {/* Message Content */}
                          <div className={cn(message.role === "user" ? "user-message" : "assistant-message", message.role === "assistant" ? "text-base md:text-lg" : "text-sm md:text-base")}>
                            <MessageContent content={message.content} isRiikResponse={message.role === "assistant"} />
                          </div>
                        </div>

                        {message.role === "user" && (
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              <User className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Current AI State */}
                  {aiState !== "idle" && (
                    <div className="flex gap-4">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-indigo-600 text-white">
                          <span className="font-bold text-xs">R</span>
                        </AvatarFallback>
                      </Avatar>
                      {getAIStateIndicator()}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Fixed Input */}
              <div className="bg-background dark:bg-background border-a border-neutral-200 dark:border-neutral-700 p-0.5 md:p-2 sticky bottom-0 left-0 right-0">
                <div className="max-w-4xl mx-auto relative">
                  <div className="relative bg-neutral-100 dark:bg-neutral-800 rounded-xl md:rounded-2xl shadow-sm border border-neutral-300 dark:border-neutral-700">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Continue the conversation..."
                      disabled={aiState !== "idle"}
                      className="w-full h-12 md:h-20 pl-4 md:pl-4 pr-16 md:pr-13 rounded-xl md:rounded-2xl border-0 !bg-transparent focus:ring-0 focus:outline-none text-foreground placeholder:text-neutral-400 text-sm align-text-top pt-2 md:pt-2"
                    />
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={!input.trim() || aiState !== "idle"}
                      size="sm"
                      className="absolute right-1.5 md:right-2 top-1.5 md:top-2 h-7 md:h-12 w-7 md:w-12 p-0 bg-neutral-400 hover:bg-neutral-500 dark:bg-neutral-600 dark:hover:bg-neutral-500 text-white rounded-full"
                    >
                      <ArrowUp className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
