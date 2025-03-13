import React from 'react';
import ReactMarkdown from 'react-markdown';
import { prepareMarkdownForPrint } from './utils';

// Print-spezifische Styles für den Content
const contentStyles = `
  @media print {
    .print-content {
      padding: 0 2rem;
    }

    /* Markdown Styles */
    .print-content h1 {
      font-size: 1.5rem;
      margin: 0 0 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #999;
    }

    .print-content h2 {
      font-size: 1.25rem;
      margin: 1.5rem 0 1rem;
    }

    .print-content h3 {
      font-size: 1.1rem;
      margin: 1.25rem 0 1rem;
    }

    .print-content p {
      margin: 1rem 0;
      text-align: justify;
    }

    .print-content ul,
    .print-content ol {
      margin: 1rem 0;
      padding-left: 2rem;
    }

    .print-content li {
      margin: 0.5rem 0;
    }

    .print-content blockquote {
      margin: 1rem 0;
      padding-left: 1rem;
      border-left: 3px solid #666;
      font-style: italic;
    }

    .print-content code {
      font-family: monospace;
      border: 1px solid #ddd;
      padding: 0.2rem 0.4rem;
      border-radius: 0.25rem;
    }

    .print-content pre {
      margin: 1rem 0;
    }

    .print-content pre code {
      display: block;
      padding: 1rem;
      overflow-x: auto;
      white-space: pre-wrap;
      border: 1px solid #ddd;
    }

    /* Links show URL after text in print */
    .print-content a::after {
      content: " (" attr(href) ")";
      font-size: 0.9em;
    }
  }
`;

interface ContentPageProps {
  content: string;
}

const ContentPage: React.FC<ContentPageProps> = ({ content }) => {
  return (
    <>
      <style>{contentStyles}</style>
      <ReactMarkdown className="print-content">
        {prepareMarkdownForPrint(content)}
      </ReactMarkdown>
    </>
  );
};

export default ContentPage;