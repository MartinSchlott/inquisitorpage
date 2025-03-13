import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const CookieBanner = () => {
  const { translations, loadComponentTranslations } = useLanguage();
  const t = translations['cookie-banner'];

  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    loadComponentTranslations('cookie-banner');
  }, [loadComponentTranslations]);

  useEffect(() => {
    const hasConsent = document.cookie.split(';').some(item => 
      item.trim().startsWith('cookie_consent=')
    );
    setIsVisible(!hasConsent);
    
    if (!hasConsent) {
      document.body.classList.add('cookie-banner-visible');
    }
    
    return () => {
      document.body.classList.remove('cookie-banner-visible');
    };
  }, []);

  const handleAccept = () => {
    setIsFading(true);

    // Set cookie with 14-day expiration
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 14);
    document.cookie = `cookie_consent=true;path=/;expires=${expirationDate.toUTCString()}`;
    
    // Wait for animation to complete
    setTimeout(() => {
      setIsVisible(false);
      document.body.classList.remove('cookie-banner-visible');
    }, 300); // Match animation duration
  };

  if (!isVisible || !t) return null;

  // Format the main content with legal references
  const mainContent = t.content.main.replace(
    '{euPrivacy}',
    `<strong>${t.content.legal.euPrivacy}</strong>`
  ).replace(
    '{gdpr}',
    `<strong>${t.content.legal.gdpr}</strong>`
  ).replace(
    '{eughDecision}',
    `<strong>${t.content.legal.eughDecision}</strong>`
  );

  return (
    <>
      <div className={`cookie-overlay ${isFading ? 'fade-out' : ''}`} />
      <div className={`cookie-banner ${isFading ? 'fade-out' : ''}`}>
        <div className="cookie-content">
          <p dangerouslySetInnerHTML={{ __html: mainContent }} />
          <p>{t.content.additional}</p>
        </div>
        <div className="cookie-button-container">
          <button onClick={handleAccept} className="cookie-button">
            {t.button}
          </button>
        </div>
      </div>
    </>
  );
};

export default CookieBanner;