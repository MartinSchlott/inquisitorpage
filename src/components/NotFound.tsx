import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useEffect } from 'react';
import Button from './Button';

const NotFound = () => {
  const navigate = useNavigate();
  const { translations, loadComponentTranslations, language } = useLanguage();
  const t = translations['not-found'];

  useEffect(() => {
    loadComponentTranslations('not-found');
  }, [loadComponentTranslations]);

  // Fallback texts until translations are loaded
  const text = {
    title: t?.title ?? '404 - Page Not Found',
    message: t?.message ?? 'The requested page could not be found.',
    homeLink: t?.homeLink ?? 'Back to Homepage'
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/${language}/landing`);
  };

  return (
    <div className="not-found">
      <h1>{text.title}</h1>
      <p>{text.message}</p>
      <Button onClick={handleClick}>
        {text.homeLink}
      </Button>
    </div>
  );
};

export default NotFound;