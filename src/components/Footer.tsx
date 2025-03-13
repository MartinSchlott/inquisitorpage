import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { translations, loadComponentTranslations, language } = useLanguage();
  const t = translations.footer;

  useEffect(() => {
    loadComponentTranslations('footer');
  }, [loadComponentTranslations]);

  if (!t) return null; // Wait for translations

  return (
    <footer className="footer">
      <div className="social-links">
        <a
          href="https://x.com/AI_Inquisitor"
          className="hover:text-gray-900"
          target="_blank"
          rel="noopener noreferrer"
          title={t.social.x.title}
          aria-label={t.social.x.ariaLabel}
        >
          X
        </a>
        <span>/</span>
        <a
          href="https://www.linkedin.com/in/martin-schlott/"
          className="hover:text-gray-900"
          target="_blank"
          rel="noopener noreferrer"
          title={t.social.linkedin.title}
          aria-label={t.social.linkedin.ariaLabel}
        >
          LinkedIn
        </a>
      </div>
      <Link to={`/${language}/.imprint`} className="content-link" replace>
        {t.links.imprint}
      </Link>
    </footer>
  );
};

export default Footer;