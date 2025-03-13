import { HelmetProvider } from 'react-helmet-async';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { useLanguage } from './context/LanguageContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Content from './components/Content';
import NotFound from './components/NotFound';
import Landing from './components/Landing';
import ArticleList from './components/ArticleList';
import { LanguageRedirect } from './components/LanguageRedirect';
import { PermalinkRedirect } from './components/PermalinkRedirect';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import { useLanguageFromUrl } from './hooks/useLanguageFromUrl';
import { usePermalinkUrl } from './hooks/usePermalinkUrl';
import './styles/main.css';
import { useEffect } from 'react';

// Hilfsfunktion um die initiale Sprache zu ermitteln
const getInitialRedirectLanguage = (): string => {
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage) return savedLanguage;

  const browserLang = navigator.language.split('-')[0];
  if (['de', 'en'].includes(browserLang)) return browserLang;

  return 'en';
};

function AppContent() {
  const { translations, loadComponentTranslations } = useLanguage();
  useLanguageFromUrl();
  usePermalinkUrl();

  useEffect(() => {
    loadComponentTranslations('header');
  }, [loadComponentTranslations]);

  useEffect(() => {
    if (translations.header?.title) {
      document.title = translations.header.title;
    }
  }, [translations.header?.title]);

  return (
    <div className="app-wrapper">
      <Header />
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to={`/${getInitialRedirectLanguage()}/landing`} replace />} />
          <Route path="/:lang/landing" element={<Landing />} />
          <Route path="/:lang/articles" element={<ArticleList />} />
          <Route path="/:lang/perma/:id" element={<PermalinkRedirect />} />
          <Route path="/:lang/*" element={<Content />} />
          <Route path="404" element={<LanguageRedirect />} />
          <Route path=":lang/404" element={<NotFound />} />
          <Route path="*" element={<LanguageRedirect />} />
        </Routes>
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;