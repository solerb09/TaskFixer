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
          <h1 className="text-2xl font-bold mt-6 mb-4 text-white">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold mt-5 mb-3 text-white">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold mt-4 mb-2 text-white">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-base font-semibold mt-3 mb-2 text-gray-200">{children}</h4>
        ),

        // Paragraphs
        p: ({ children }) => (
          <p className="mb-4 leading-relaxed text-gray-100">{children}</p>
        ),

        // Lists
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-4 space-y-2 text-gray-100">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-100">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="ml-4 text-gray-100">{children}</li>
        ),

        // Tables - Enhanced for rubric display
        table: ({ children }) => (
          <div className="overflow-x-auto mb-6 rounded-lg border-2 border-purple-500/30 shadow-lg shadow-purple-500/10">
            <table className="min-w-full divide-y divide-[#404040] table-fixed">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-gradient-to-r from-[#2a2a2a] to-[#323232]">{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody className="bg-[#1a1a1a] divide-y divide-[#404040]">{children}</tbody>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-[#252525] transition-colors">{children}</tr>
        ),
        th: ({ children }) => (
          <th className="px-6 py-4 text-left text-sm font-bold text-purple-300 uppercase tracking-wide border-r border-[#404040] last:border-r-0">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-6 py-4 text-sm text-gray-100 border-r border-[#404040]/50 last:border-r-0 leading-relaxed">
            {children}
          </td>
        ),

        // Code
        code: ({ inline, children }: any) => {
          if (inline) {
            return (
              <code className="bg-[#2a2a2a] text-purple-400 px-1.5 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            );
          }
          return (
            <pre className="bg-[#1a1a1a] border border-[#404040] rounded-lg p-4 mb-4 overflow-x-auto">
              <code className="text-sm text-gray-100 font-mono">{children}</code>
            </pre>
          );
        },

        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-purple-500 pl-4 py-2 mb-4 italic text-gray-300 bg-[#1a1a1a] rounded-r">
            {children}
          </blockquote>
        ),

        // Horizontal rules
        hr: () => (
          <hr className="my-6 border-t border-[#404040]" />
        ),

        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
          >
            {children}
          </a>
        ),

        // Strong/Bold
        strong: ({ children }) => (
          <strong className="font-semibold text-white">{children}</strong>
        ),

        // Emphasis/Italic
        em: ({ children }) => (
          <em className="italic text-gray-200">{children}</em>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
