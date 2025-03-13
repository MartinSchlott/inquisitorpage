import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Helper to extract language from path or default to 'de'
const getLanguageFromPath = (path: string): string => {
  const parts = path.split('/').filter(Boolean);
  // Check if the first part looks like a language code
  if (parts.length > 0 && /^[a-z]{2}$/.test(parts[0])) {
    return parts[0];
  }
  return 'de';
};

export const LanguageRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const currentPath = window.location.pathname;
    const language = getLanguageFromPath(currentPath);
    navigate(`/${language}/404`, { replace: true });
  }, [navigate]);

  return null;
};