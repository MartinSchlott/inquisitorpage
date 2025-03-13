import { useEffect, useState } from 'react';
import { ActionMenu } from './ActionMenu';
import { MetaTags } from './MetaTags';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { loadMarkdownFile, MarkdownContent } from '../utils/markdownLoader';
import '../styles/main.css';
import DocumentMetadata from './DocumentMetadata';
import Breadcrumb from './Breadcrumb';
import { useLanguage } from '../context/LanguageContext';

const Content = () => {
  const [content, setContent] = useState<MarkdownContent | null>(null);
  const [currentDir, setCurrentDir] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const loadNewContent = async (path: string, contextPath: string) => {
    try {
      // Handle relative paths based on current context
      let fullPath: string;
      if (path.startsWith('./')) {
        fullPath = `${contextPath}/${path.slice(2)}`;
      } else if (path.startsWith('../')) {
        const upOneLevel = contextPath.split('/').slice(0, -1).join('/');
        fullPath = `${upOneLevel}/${path.slice(3)}`;
      } else {
        fullPath = path.startsWith(`${language}/`) ? path : `${language}/${path}`;
      }

      // Ensure .md extension is present but not duplicated
      const mdPath = fullPath.endsWith('.md') ? fullPath : `${fullPath}.md`;

      // Prüfe erst ob die Datei existiert
      const exists = await fetch(`/content/${mdPath}`, { method: 'HEAD' });
      
      if (!exists.ok) {
        navigate('/404');
        return;
      }

      const newContent = await loadMarkdownFile(mdPath);
      setContent(newContent);

      // Update current directory context
      const newDir = fullPath.split('/').slice(0, -1).join('/');
      setCurrentDir(newDir);

      // Update URL without page reload and without .md extension
      const urlPath = fullPath.replace(/\.md$/, '');
      navigate(`/${urlPath}`);
    } catch (error) {
      navigate('/404');
    }
  };

  useEffect(() => {
    const loadContent = async () => {
      try {
        // Get the current path from location
        const path = location.pathname.slice(1);
        
        // Ensure .md extension is present but not duplicated
        const mdPath = path.endsWith('.md') ? path : `${path}.md`;

        // Prüfe erst ob die Datei existiert
        const exists = await fetch(`/content/${mdPath}`, { method: 'HEAD' });

        if (!exists.ok) {
          navigate('/404');
          return;
        }

        const initialContent = await loadMarkdownFile(mdPath);
        setContent(initialContent);

        // Set initial directory context
        const dir = path.split('/').slice(0, -1).join('/');
        setCurrentDir(dir);
      } catch (error) {
        navigate('/404');
      }
    };

    loadContent();
  }, [location.pathname, navigate]);

  if (!content) {
    return <main>Loading...</main>;
  }

  // Remove HTML comments from the content
  const cleanContent = content.content.replace(/<!--[\s\S]*?-->/g, '');

  return (
    <main>
      <MetaTags 
        docMeta={content.metadata} 
        path={location.pathname} 
      />
      <ActionMenu metadata={content.metadata} />
      <Breadcrumb 
        path={location.pathname}
        onNavigate={loadNewContent}
      />
      <ReactMarkdown
        components={{
          a: ({ href, children }) => {
            // Handle internal links
            if (href?.startsWith('./') || href?.startsWith('../')) {
              return (
                <a onClick={(e) => {
                  e.preventDefault();
                  loadNewContent(href, currentDir);
                }}>
                  {children}
                </a>
              );
            }
            // External links
            return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
          }
        }}
      >
        {cleanContent}
      </ReactMarkdown>
      {content.metadata && <DocumentMetadata metadata={content.metadata} />}
    </main>
  );
};

export default Content;