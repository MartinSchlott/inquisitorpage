import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';

interface MetaTagsProps {
  docMeta?: {
    displaytitle?: string;
    summary?: string;
    ogimage?: string;
  };
  path: string;
}

export const MetaTags: React.FC<MetaTagsProps> = ({ docMeta, path }) => {
  const { language, availableLanguages, translations } = useLanguage();
  
  // Get the current language configuration
  const languageConfig = availableLanguages[language];
  
  // Resolve image path with fallbacks
  const resolveImagePath = () => {
    if (docMeta?.ogimage) {
      return new URL(docMeta.ogimage, window.location.origin).toString();
    }
    
    if (languageConfig?.ogimage) {
      return new URL(languageConfig.ogimage, window.location.origin).toString();
    }
    
    return null;
  };

  const title = docMeta?.displaytitle || translations.header?.title || 'AI Inquisitor';
  const description = docMeta?.summary || '';
  const image = resolveImagePath();
  const url = new URL(path, window.location.origin).toString();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      {description && <meta name="description" content={description} />}

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:type" content="article" />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter Card Type */}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};