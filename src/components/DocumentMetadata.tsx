import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMetadataResources } from '../hooks/useMetadataResources';
import { getModelDisplayName, getTagName, getCategoryName } from '../utils/metadata-helpers';
import { isCompleteMetadataResources } from '../types/metadata-resources';
import type { DocumentMetadataTranslations } from '../types/translations/document-metadata';
import type { DocMeta } from '../types/document-metadata';
import '../styles/document-metadata.css';

interface DocumentMetadataProps {
  metadata: DocMeta;
}

const EXCLUDED_CATEGORIES = ['navdoc', 'meta'] as const;

const MetadataBlock: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <div className="metadata-block">
    <div className="metadata-content">
      <div className="metadata-label">{label}</div>
      <div className="metadata-value">{children}</div>
    </div>
  </div>
);

export const DocumentMetadata: React.FC<DocumentMetadataProps> = ({ metadata }) => {
  const { translations, loadComponentTranslations } = useLanguage();
  const { resources, loading, error } = useMetadataResources();
  
  // Type Guard für Translations
  const t = translations['document-metadata'] as DocumentMetadataTranslations | undefined;

  React.useEffect(() => {
    loadComponentTranslations('document-metadata');
  }, [loadComponentTranslations]);

  // Frühe Exits für verschiedene States
  if (!metadata?.category || EXCLUDED_CATEGORIES.includes(metadata.category as any)) {
    return null;
  }

  if (loading) {
    return <div className="metadata-loading">Loading metadata...</div>;
  }

  if (error) {
    console.error('Metadata loading error:', error);
    return <div className="metadata-error">Failed to load metadata</div>;
  }

  if (!t || !isCompleteMetadataResources(resources)) {
    return null;
  }

  const { aiModels, tagsAndCategories } = resources;

  return (
    <div className="metadata-container">
      <div className="metadata-grid">
        {metadata.inquisitor && (
          <MetadataBlock label={t.labels.inquisitor}>
            {metadata.inquisitor}
          </MetadataBlock>
        )}
        
        {metadata.date && (
          <MetadataBlock label={t.labels.date}>
            {metadata.date}
          </MetadataBlock>
        )}

        {metadata.category && (
          <MetadataBlock label={t.labels.category}>
            {getCategoryName(metadata.category, tagsAndCategories)}
          </MetadataBlock>
        )}

        {metadata.tags && metadata.tags.length > 0 && (
          <MetadataBlock label={t.labels.tags}>
            <div className="metadata-tags">
              {metadata.tags.map(tag => (
                <span key={tag} className="metadata-tag">
                  {getTagName(tag, tagsAndCategories)}
                </span>
              ))}
            </div>
          </MetadataBlock>
        )}

        {metadata.ai && metadata.ai.length > 0 && (
          <MetadataBlock label={t.labels.ai.used}>
            <div className="metadata-models">
              {metadata.ai.map(model => (
                <span key={model} className="metadata-model">
                  {getModelDisplayName(model, aiModels)}
                </span>
              ))}
            </div>
          </MetadataBlock>
        )}

        {metadata.validator && metadata.validator.length > 0 && (
          <MetadataBlock label={t.labels.ai.validation}>
            <div className="metadata-models">
              {metadata.validator.map(model => (
                <span key={model} className="metadata-model">
                  {getModelDisplayName(model, aiModels)}
                </span>
              ))}
            </div>
          </MetadataBlock>
        )}

        {metadata.docsource && (
          <MetadataBlock label={t.labels.translation.original}>
            <a 
              href={`/${metadata.docsource.split('/')[0]}/perma/${metadata.docsource.split('/')[1]}`}
              className="metadata-link"
            >
              {t.labels.translation.viewOriginal}
            </a>
          </MetadataBlock>
        )}

        {metadata.translatorai && (
          <MetadataBlock label={t.labels.translation.translatedBy}>
            <div className="metadata-models">
              {(Array.isArray(metadata.translatorai) ? metadata.translatorai : [metadata.translatorai]).map(model => (
                <span key={model} className="metadata-model">
                  {getModelDisplayName(model, aiModels)}
                </span>
              ))}
            </div>
          </MetadataBlock>
        )}

        {metadata.licence && (
          <MetadataBlock label={t.labels.licence}>
            {metadata.licence}
          </MetadataBlock>
        )}
      </div>
    </div>
  );
};

export default DocumentMetadata;