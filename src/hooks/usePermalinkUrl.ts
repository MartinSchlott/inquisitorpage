import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePermalinks } from './usePermalinks';

export const usePermalinkUrl = () => {
  const location = useLocation();
  // Extract current language from URL
  const urlLang = location.pathname.split('/')[1];
  // Use URL language for permalinks
  const permalinks = usePermalinks(urlLang);

  useEffect(() => {
    
    if (!permalinks || location.pathname.includes('/perma/')) {
      return;
    }

    // Normalisiere den Pfad
    const normalizedPath = location.pathname.replace(new RegExp(`^/${urlLang}`), '');
        
    const permalinkId = permalinks.pathToId.get(normalizedPath);

    if (permalinkId) {
      const newUrl = `/${urlLang}/perma/${permalinkId}${location.search}${location.hash}`;
      window.history.replaceState(null, '', newUrl);
    }
  }, [location, permalinks, urlLang]);
};