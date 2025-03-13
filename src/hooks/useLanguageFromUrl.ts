import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const useLanguageFromUrl = () => {
  const location = useLocation();
  const { setLanguage } = useLanguage();
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (!initialLoadDone.current) {
      // Extract language from the first part of the path
      const pathLang = location.pathname.split('/')[1];
      if (pathLang) {
        setLanguage(pathLang);
      }
      initialLoadDone.current = true;
    }
  }, [location.pathname, setLanguage]);
};