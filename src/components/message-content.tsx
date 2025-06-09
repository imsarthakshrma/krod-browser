"use client"

import { useMemo, useState } from "react"
import { Highlight, themes } from 'prism-react-renderer'
import { InlineMath, BlockMath } from 'react-katex'
import { ExternalLink, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import 'katex/dist/katex.min.css'

interface MessageContentProps {
  content: string
  className?: string
  isRiikResponse?: boolean
  sources?: Source[]
}

interface Source {
  id: string
  title: string
  url: string
  domain?: string
  snippet?: string
  favicon?: string
}

interface ContentPart {
  type: 'text' | 'code' | 'block-math' | 'inline-math'
  content: string
  language?: string
}

export function MessageContent({ content, className, isRiikResponse = false, sources = [] }: MessageContentProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [expandedSources, setExpandedSources] = useState(false)

  const parsedContent = useMemo(() => {
    const parts: ContentPart[] = []
    let remainingContent = content

    // Parse in order: code blocks -> block math -> inline math -> text
    while (remainingContent.length > 0) {
      // Check for code blocks first
      const codeMatch = remainingContent.match(/```(\w+)?\n([\s\S]*?)```/)
      
      // Check for block math ($$...$$)
      const blockMathMatch = remainingContent.match(/\$\$([\s\S]*?)\$\$/)
      
      // Check for inline math ($...$)
      const inlineMathMatch = remainingContent.match(/\$([^$\n]+?)\$/)

      // Find the earliest match
      const matches = [
        { type: 'code', match: codeMatch, priority: 0 },
        { type: 'block-math', match: blockMathMatch, priority: 1 },
        { type: 'inline-math', match: inlineMathMatch, priority: 2 }
      ].filter(m => m.match !== null)
        .sort((a, b) => {
          const indexA = a.match!.index || Infinity
          const indexB = b.match!.index || Infinity
          if (indexA !== indexB) return indexA - indexB
          return a.priority - b.priority
        })

      if (matches.length === 0) {
        // No more special content, add remaining as text
        if (remainingContent.trim()) {
          parts.push({ type: 'text', content: remainingContent })
        }
        break
      }

      const earliestMatch = matches[0]
      const match = earliestMatch.match!
      const matchIndex = match.index || 0

      // Add text before the match
      if (matchIndex > 0) {
        const textBefore = remainingContent.slice(0, matchIndex)
        if (textBefore.trim()) {
          parts.push({ type: 'text', content: textBefore })
        }
      }

      // Add the matched content
      if (earliestMatch.type === 'code') {
        parts.push({
          type: 'code',
          content: match[2].trim(),
          language: match[1] || 'text'
        })
      } else if (earliestMatch.type === 'block-math') {
        parts.push({
          type: 'block-math',
          content: match[1].trim()
        })
      } else if (earliestMatch.type === 'inline-math') {
        parts.push({
          type: 'inline-math',
          content: match[1].trim()
        })
      }

      // Update remaining content
      remainingContent = remainingContent.slice(matchIndex + match[0].length)
    }

    return parts
  }, [content])

  const formatTextContent = (text: string) => {
    // Process citations first [1], [2], etc.
    let processedText = text.replace(/\[(\d+)\]/g, (match, num) => {
      const sourceIndex = parseInt(num) - 1
      if (sources[sourceIndex]) {
        return `<sup class="inline-citation" data-source="${sourceIndex}">[${num}]</sup>`
      }
      return match
    })

    // Process other formatting
    processedText = processedText
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono break-all">$1</code>',
      )

    // Convert line breaks to paragraphs
    const paragraphs = processedText.split("\n\n").filter((p) => p.trim())
    return paragraphs
      .map((p) => `<p class="mb-3 last:mb-0 leading-relaxed">${p.replace(/\n/g, "<br>")}</p>`)
      .join("")
  }

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(id)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const handleCitationClick = (sourceIndex: number) => {
    // Scroll to source or show source details
    const sourceElement = document.querySelector(`[data-source-id="${sources[sourceIndex]?.id}"]`)
    if (sourceElement) {
      sourceElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

  return (
    <div className={`message-content w-full max-w-none ${isRiikResponse ? "riik-text" : ""} ${className || ""}`}>
      <div className="space-y-4">
        {parsedContent.map((part, index) => {
          if (part.type === 'code') {
            const codeId = `code-${index}`
            const isCopied = copiedCode === codeId
            
            return (
              <div key={index} className="code-block relative group">
                <div className="flex items-center justify-between bg-gray-800 px-3 sm:px-4 py-2 rounded-t-lg">
                  <span className="text-xs text-gray-400 font-medium truncate">{part.language}</span>
                  <button
                    onClick={() => copyToClipboard(part.content, codeId)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 flex-shrink-0"
                  >
                    {isCopied ? (
                      <>
                        <Check size={12} />
                        <span className="hidden sm:inline">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span className="hidden sm:inline">Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <Highlight theme={themes.vsDark} code={part.content} language={part.language!}>
                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
                      <pre 
                        className={`${className} p-3 sm:p-4 rounded-b-lg text-sm leading-relaxed min-w-0`} 
                        style={style}
                      >
                        {tokens.map((line, i) => (
                          <div key={i} {...getLineProps({ line, key: i })} className="break-all">
                            {line.map((token, key) => (
                              <span key={key} {...getTokenProps({ token, key })} />
                            ))}
                          </div>
                        ))}
                      </pre>
                    )}
                  </Highlight>
                </div>
              </div>
            )
          } else if (part.type === 'block-math') {
            return (
              <div key={index} className="my-4 text-center overflow-x-auto">
                <div className="inline-block min-w-0">
                  <BlockMath math={part.content} />
                </div>
              </div>
            )
          } else if (part.type === 'inline-math') {
            return (
              <span key={index} className="inline-block">
                <InlineMath math={part.content} />
              </span>
            )
          } else {
            return (
              <div
                key={index}
                className="prose prose-gray dark:prose-invert max-w-none break-words"
                dangerouslySetInnerHTML={{ __html: formatTextContent(part.content) }}
                onClick={(e) => {
                  const target = e.target as HTMLElement
                  if (target.classList.contains('inline-citation')) {
                    const sourceIndex = parseInt(target.dataset.source || '0')
                    handleCitationClick(sourceIndex)
                  }
                }}
              />
            )
          }
        })}

        {/* Source Cards */}
        {sources.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sources ({sources.length})
              </h4>
              {sources.length > 3 && (
                <button
                  onClick={() => setExpandedSources(!expandedSources)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  {expandedSources ? (
                    <>
                      Show less <ChevronUp size={12} />
                    </>
                  ) : (
                    <>
                      Show all <ChevronDown size={12} />
                    </>
                  )}
                </button>
              )}
            </div>
            
            <div className="grid gap-2 sm:gap-3">
              {sources.slice(0, expandedSources ? sources.length : 3).map((source, index) => (
                <div
                  key={source.id}
                  data-source-id={source.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      {index + 1}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">
                          {source.title}
                        </h5>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {source.favicon && (
                            <img 
                              src={source.favicon} 
                              alt="" 
                              className="w-3 h-3 rounded-sm"
                              onError={(e) => { e.currentTarget.style.display = 'none' }}
                            />
                          )}
                          <span className="truncate">{source.domain || new URL(source.url).hostname}</span>
                        </div>
                        {source.snippet && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                            {source.snippet}
                          </p>
                        )}
                      </div>
                      
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Open source"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .inline-citation {
          @apply text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 cursor-pointer transition-colors text-xs font-medium;
        }
        
        .inline-citation:hover {
          @apply underline;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @media (max-width: 640px) {
          .code-block pre {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  )
}