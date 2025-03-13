import '@fontsource/montserrat/700.css';
import '@fontsource/roboto/400.css';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useEffect } from 'react';
import type { Theme } from '../types/theme';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { 
    translations, 
    loadComponentTranslations, 
    language,
    setLanguage,
    availableLanguages,
    isLanguageSelectionVisible 
  } = useLanguage();
  const t = translations.header;

  useEffect(() => {
    loadComponentTranslations('header');
  }, [loadComponentTranslations]);
  
  const themeOptions: Theme[] = ['light', 'dark', 'auto'];

  if (!t) return null; // Wait for translations to load
  
  return (
    <header>
      <div className="header__content">
        <div className="header__title">
          <Link to={`/${language}/landing`}>
            <h1>{t.title}</h1>
          </Link>
          <p className="text-secondary">{t.subtitle}</p>
        </div>
        <div className="header__controls">
          <div className="theme-toggle" role="radiogroup" aria-label={t.theme.label}>
            {themeOptions.map((option) => (
              <button
                key={option}
                role="radio"
                aria-checked={theme === option}
                onClick={() => setTheme(option)}
                className={`theme-toggle__button ${theme === option ? 'theme-toggle__button--active' : ''}`}
              >
                {t.theme.options[option]}
              </button>
            ))}
          </div>
          
          {isLanguageSelectionVisible && (
            <div className="language-toggle" role="radiogroup" aria-label={t.language?.label || 'Select language'}>
              {Object.entries(availableLanguages).map(([code, langInfo]) => (
                <button
                  key={code}
                  role="radio"
                  aria-checked={language === code}
                  onClick={() => setLanguage(code)}
                  className={`language-toggle__button ${language === code ? 'language-toggle__button--active' : ''}`}
                >
                  {langInfo.short}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;