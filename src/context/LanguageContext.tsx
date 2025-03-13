import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HeaderTranslations } from '../types/translations/header';
import { FooterTranslations } from '../types/translations/footer';
import { ActionMenuTranslations } from '../types/translations/action-menu';
import { CookieBannerTranslations } from '../types/translations/cookie-banner';
import { NotFoundTranslations } from '../types/translations/not-found';
import { DocumentMetadataTranslations } from '../types/translations/document-metadata';
import { ShareDialogTranslations } from '../types/translations/share-dialog';
import { LandingTranslations } from '../types/translations/landing';
import { ArticleListTranslations } from '../types/translations/article-list';

interface Translations {
  header?: HeaderTranslations;
  footer?: FooterTranslations;
  'action-menu'?: ActionMenuTranslations;
  'cookie-banner'?: CookieBannerTranslations;
  'not-found'?: NotFoundTranslations;
  'document-metadata'?: DocumentMetadataTranslations;
  'share-dialog'?: ShareDialogTranslations;
  landing?: LandingTranslations;
  'article-list'?: ArticleListTranslations;
}

interface Language {
  short: string;
  name: string;
  ogimage?: string;
}

interface Languages {
  [key: string]: Language;
}

interface LanguageContextType {
  language: string;
  translations: Translations;
  setLanguage: (lang: string) => void;
  loadComponentTranslations: (component: string) => Promise<void>;
  availableLanguages: Languages;
  isLanguageSelectionVisible: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = async (fallback = 'en'): Promise<string> => {
  const savedLanguage = localStorage.getItem('language');
  
  try {
    const response = await fetch('/content/common/languages.json');
    const languages: Languages = await response.json();

    if (savedLanguage && languages[savedLanguage]) {
      return savedLanguage;
    }

    const browserLang = navigator.language.split('-')[0];
    if (languages[browserLang]) {
      return browserLang;
    }

    if (languages[fallback]) {
      return fallback;
    }
    
    return Object.keys(languages)[0];
  } catch (error) {
    console.error('Error loading languages:', error);
    return 'de';
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [language, setLanguageState] = useState('de');
  const [translations, setTranslations] = useState<Translations>({});
  const [availableLanguages, setAvailableLanguages] = useState<Languages>({});
  const [isLanguageSelectionVisible, setIsLanguageSelectionVisible] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const response = await fetch('/content/common/languages.json');
        const languages: Languages = await response.json();
        setAvailableLanguages(languages);
        setIsLanguageSelectionVisible(Object.keys(languages).length > 1);
        
        const initialLang = await getInitialLanguage();
        setLanguageState(initialLang);
      } catch (error) {
        console.error('Error initializing languages:', error);
      }
    };
    
    init();
  }, []);

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);

    // URL-Pfad aktualisieren
    const pathParts = location.pathname.split('/');
    if (pathParts.length > 1) {
      pathParts[1] = lang;
      navigate(pathParts.join('/'));
    } else {
      navigate(`/${lang}/index`);
    }
  }, [navigate, location]);

  const loadComponentTranslations = useCallback(async (component: string) => {
    try {
      const response = await fetch(`/content/${language}/translations/components/${component}.json`);
      if (!response.ok) throw new Error(`Failed to load ${component} translations`);
      const componentTranslations = await response.json();
      
      setTranslations(prev => ({
        ...prev,
        [component]: componentTranslations
      }));
    } catch (error) {
      console.error(`Error loading translations for ${component}:`, error);
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      translations, 
      setLanguage,
      loadComponentTranslations,
      availableLanguages,
      isLanguageSelectionVisible
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};