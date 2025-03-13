import React from 'react';
import type { DocumentMetadataTranslations } from '../../types/translations/document-metadata';

// Print-spezifische Styles für das Cover
const coverStyles = `
  @media print {
    .print-cover {
      min-height: fit-content;
      padding: 2rem;
      margin: 0;
      page-break-after: always;  
    }

    .print-cover__header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .print-cover__title {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .print-cover__subtitle {
      font-size: 1rem;
      color: #666;
      margin-bottom: 2rem;
    }

    .print-cover__divider {
      width: 10%;
      border-bottom: 1px solid #333;
      margin: 0 auto 4rem;
    }

    .print-cover__main {
      margin: 4rem 0;
      text-align: center;
    }

    .print-cover__document-title {
      font-size: 1.75rem;
      margin-bottom: 3rem;
      color: #333;
      font-weight: bold;
    }

    .print-cover__meta {
      margin: 2rem 0;
    }

    .print-cover__meta-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      color: #666;
      margin-bottom: 0.25rem;
    }

    .print-cover__meta-value {
      font-size: 1rem;
      color: #333;
    }

    .print-cover__ai {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin: 2rem 0;
    }

    .print-cover__ai-block {
      text-align: center;
    }

    .print-cover__ai-model {
      font-family: monospace;
      font-size: 0.75rem;
      border: 1px solid #666;
      padding: 0.25rem 0.5rem;
      border-radius: 0.75rem;
      color: #333;
      margin: 0.25rem 0;
      display: inline-block;
    }

    .print-cover__meta-footer {
      margin-top: 4rem;
      text-align: center;
      font-size: 0.875rem;
      color: #666;
    }

    .print-cover__meta-footer > * {
      margin: 0.5rem 0;
    }
  }
`;

interface AIModel {
  displayname: string;
  model: string;
}

interface AIModels {
  [key: string]: AIModel;
}

interface CoverPageProps {
  title: string;
  metadata: {
    inquisitor?: string;
    date?: string;
    licence?: string;
    ai?: string[];
    validator?: string[];
  };
  translations: DocumentMetadataTranslations;
  headerTranslations: {
    title: string;
    subtitle: string;
  };
  aiModels: AIModels;
}

const CoverPage: React.FC<CoverPageProps> = ({
  title,
  metadata,
  translations: t,
  headerTranslations,
  aiModels
}) => {
  const getModelDisplayName = (modelId: string): string => {
    return aiModels[modelId]?.displayname || modelId;
  };

  return (
    <>
      <style>{coverStyles}</style>
      
      <div className="print-cover">
        <header className="print-cover__header">
          <h1 className="print-cover__title">{headerTranslations.title}</h1>
          <p className="print-cover__subtitle">{headerTranslations.subtitle}</p>
          <div className="print-cover__divider" />
        </header>

        <main className="print-cover__main">
          <h2 className="print-cover__document-title">{title}</h2>

          {metadata.inquisitor && (
            <div className="print-cover__meta">
              <div className="print-cover__meta-label">{t.labels.inquisitor}</div>
              <div className="print-cover__meta-value">{metadata.inquisitor}</div>
            </div>
          )}

          <div className="print-cover__ai">
            {metadata.ai && metadata.ai.length > 0 && (
              <div className="print-cover__ai-block">
                <div className="print-cover__meta-label">{t.labels.ai.used}</div>
                {metadata.ai.map((model: string) => (
                  <div key={model} className="print-cover__ai-model">
                    {getModelDisplayName(model)}
                  </div>
                ))}
              </div>
            )}

            {metadata.validator && metadata.validator.length > 0 && (
              <div className="print-cover__ai-block">
                <div className="print-cover__meta-label">{t.labels.ai.validation}</div>
                {metadata.validator.map((model: string) => (
                  <div key={model} className="print-cover__ai-model">
                    {getModelDisplayName(model)}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="print-cover__meta-footer">
            <div>{metadata.licence}</div>
            <div>{metadata.date}</div>
            <div>https://KI-Inquisitor.com</div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CoverPage;