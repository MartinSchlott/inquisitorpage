import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useArticles } from '../hooks/useArticles';
import { useMetadataResources } from '../hooks/useMetadataResources';
import { getCategoryName } from '../utils/metadata-helpers';
import Button from './Button';

const Landing: React.FC = () => {
  const { language, loadComponentTranslations, translations } = useLanguage();
  const navigate = useNavigate();
  const t = translations.landing;
  const { resources } = useMetadataResources();
  const { articles } = useArticles({ limit: 3 });
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState<number>(0);
  const [isQuoteFading, setIsQuoteFading] = useState<boolean>(false);

  useEffect(() => {
    loadComponentTranslations('landing');
  }, [loadComponentTranslations]);

  const selectNewQuote = useCallback(() => {
    if (!t?.quotes) return;
    
    const newIndex = (() => {
      const random = Math.floor(Math.random() * (t.quotes.length - 1));
      return random >= currentQuoteIndex ? random + 1 : random;
    })();
    setIsQuoteFading(true);
    setTimeout(() => {
      setCurrentQuoteIndex(newIndex);
      setIsQuoteFading(false);
    }, 1000);
  }, [currentQuoteIndex, t?.quotes?.length]);

  useEffect(() => {
    if (!t?.quotes) return;
    const timer = setInterval(selectNewQuote, 30000);
    return () => clearInterval(timer);
  }, [selectNewQuote, t?.quotes]);

  if (!t) return null;

  return (
    <div className="landing-container">
      <div className="landing-quote-section">
        <div className="landing-divider" />
        <div className={`landing-quote ${isQuoteFading ? 'landing-quote-fading' : ''}`}>
          <blockquote>
            <p>"{t.quotes[currentQuoteIndex].text}"</p>
            <footer>— <cite>{t.quotes[currentQuoteIndex].author}</cite></footer>
          </blockquote>
        </div>
        <div className="landing-divider" />
      </div>

      <div className="landing-article-section">
        <h2 className="landing-section-title">{t.sections.latest}</h2>
        <div className="landing-article-list">
          {articles.map((article, index) => (
            <Link key={index} to={article.path} className="landing-article-item">
              <span className="landing-bullet">▪</span>
              <div className="landing-article-content">
                <div className="landing-article-title">{article.displaytitle}</div>
                <div className="landing-article-meta">
                  [{getCategoryName(article.category, resources.tagsAndCategories || null)}] - {article.date}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="landing-button-container">
        <Button onClick={() => navigate(`/${language}/articles`)}>
          {t.buttons.articles}
        </Button>
        <Button onClick={() => navigate(`/${language}/inquisitor/pitchdoc`)}>
          {t.buttons.about}
        </Button>
      </div>
    </div>
  );
};

export default Landing;