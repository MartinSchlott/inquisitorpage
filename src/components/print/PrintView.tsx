import React, { useEffect } from 'react';
import CoverPage from './CoverPage';
import ContentPage from './ContentPage';
import type { DocumentMetadataTranslations } from '../../types/translations/document-metadata';

// Print-spezifische Styles
const printStyles = `
  @media print {
    /* Grundlegende Print-Styles */
    @page {
      margin: 2cm;
      size: A4;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.5;
      color: #000;
    }

    /* Cover page break only */
    .print-container {
      page-break-after: avoid;
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

interface PrintViewProps {
  documentTitle: string;
  content?: string;
  metadata: any;
  translations: DocumentMetadataTranslations;
  headerTranslations: any;
  aiModels: AIModels;
  onMount?: () => void;
}

const PrintView: React.FC<PrintViewProps> = ({
  documentTitle,
  content = "",
  metadata,
  translations,
  headerTranslations,
  aiModels,
  onMount
}) => {
  useEffect(() => {
    onMount?.();
  }, []); // Called once when mounted

  return (
    <>
      {/* Inject print styles */}
      <style>{printStyles}</style>

      {/* Print container */}
      <div className="print-container">
        {/* Cover Page */}
        <CoverPage
          title={documentTitle}
          metadata={metadata}
          translations={translations}
          headerTranslations={headerTranslations}
          aiModels={aiModels}
        />

        {/* Content Pages */}
        {content && <ContentPage content={content} />}
      </div>
    </>
  );
};

export default PrintView;