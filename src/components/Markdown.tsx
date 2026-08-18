import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import './Markdown.css'

function slugify(children: ReactNode): string {
  const text = Array.isArray(children) ? children.join('') : String(children ?? '')
  return text.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '')
}

type CodeProps = ComponentPropsWithoutRef<'code'>

export function Markdown({ source }: { source: string }) {
  return (
    <div className="md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 id={slugify(children)}>{children}</h1>,
          h2: ({ children }) => <h2 id={slugify(children)}>{children}</h2>,
          h3: ({ children }) => <h3 id={slugify(children)}>{children}</h3>,
          code({ className, children, ...props }: CodeProps) {
            const match = /language-(\w+)/.exec(className || '')
            if (!match) {
              return <code className={className} {...props}>{children}</code>
            }
            return (
              <SyntaxHighlighter language={match[1]} style={oneDark} PreTag="div">
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            )
          },
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  )
}
