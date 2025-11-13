import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageContentProps {
  content: string;
}

export default function MessageContent({ content }: MessageContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Headers
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mt-6 mb-4 text-foreground">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold mt-5 mb-3 text-foreground">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-base font-semibold mt-3 mb-2 text-text-primary">{children}</h4>
        ),

        // Paragraphs
        p: ({ children }) => (
          <p className="mb-4 leading-relaxed text-foreground">{children}</p>
        ),

        // Lists
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-4 space-y-2 text-foreground">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2 text-foreground">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="ml-4 text-foreground">{children}</li>
        ),

        // Tables - Enhanced for rubric display
        table: ({ children }) => (
          <div className="overflow-x-auto mb-6 rounded-lg border-2 border-purple-500/30 shadow-lg shadow-purple-500/10">
            <table className="min-w-full divide-y divide-border-default table-fixed">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-secondary-bg">{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody className="bg-primary-bg divide-y divide-border-default">{children}</tbody>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-secondary-bg transition-colors">{children}</tr>
        ),
        th: ({ children }) => (
          <th className="px-6 py-4 text-left text-sm font-bold text-brand-purple uppercase tracking-wide border-r border-border-default last:border-r-0">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-6 py-4 text-sm text-foreground border-r border-border-default/50 last:border-r-0 leading-relaxed">
            {children}
          </td>
        ),

        // Code
        code: ({ inline, children }: any) => {
          if (inline) {
            return (
              <code className="bg-secondary-bg text-brand-purple px-1.5 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            );
          }
          return (
            <pre className="bg-secondary-bg border border-border-default rounded-lg p-4 mb-4 overflow-x-auto">
              <code className="text-sm text-foreground font-mono">{children}</code>
            </pre>
          );
        },

        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-purple-500 pl-4 py-2 mb-4 italic text-text-secondary bg-secondary-bg rounded-r">
            {children}
          </blockquote>
        ),

        // Horizontal rules
        hr: () => (
          <hr className="my-6 border-t border-border-default" />
        ),

        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-cyan hover:text-brand-cyan-light underline transition-colors"
          >
            {children}
          </a>
        ),

        // Strong/Bold
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">{children}</strong>
        ),

        // Emphasis/Italic
        em: ({ children }) => (
          <em className="italic text-text-primary">{children}</em>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
