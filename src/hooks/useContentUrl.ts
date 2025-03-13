import { useLocation } from 'react-router-dom';
import { usePermalinks } from './usePermalinks';

export const useContentUrl = () => {
  const location = useLocation();
  const urlLang = location.pathname.split('/')[1];
  const permalinks = usePermalinks(urlLang);

  const getContentUrl = () => {
    if (!permalinks) return null;

    // Wenn es ein Permalink ist
    if (location.pathname.includes('/perma/')) {
      const permalinkId = location.pathname.split('/perma/')[1];
      const originalPath = permalinks.idToPath.get(permalinkId);
      if (originalPath) {
        return `${window.location.origin}/content/${urlLang}${originalPath}.md`;
      }
    }

    // Normale URL
    const normalizedPath = location.pathname.replace(new RegExp(`^/${urlLang}`), '');
    return `${window.location.origin}/content/${urlLang}${normalizedPath}.md`;
  };

  const getMarkdownContent = async () => {
    const contentUrl = getContentUrl();
    if (!contentUrl) return null;
    
    try {
      const response = await fetch(contentUrl);
      if (!response.ok) return null;
      return await response.text();
    } catch (error) {
      console.error('Error fetching markdown:', error);
      return null;
    }
  };

  return { getContentUrl, getMarkdownContent };
};