import React, { useState, useRef, useEffect } from 'react';

import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { useLanguage } from '../context/LanguageContext';
import { Metadata } from '../utils/markdownLoader';
import { ShareDialog } from './ShareDialog';
import { useContentUrl } from '../hooks/useContentUrl';
// import PDFExport from './pdf/PDFExport'; // Replaced with PrintView

interface ActionMenuProps {
  metadata?: Metadata;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ metadata }) => {
  const { translations, loadComponentTranslations } = useLanguage();
  const t = translations['action-menu'];
  const { getContentUrl, getMarkdownContent } = useContentUrl();

  useEffect(() => {
    loadComponentTranslations('action-menu');
    loadComponentTranslations('document-metadata');
    loadComponentTranslations('header');
  }, [loadComponentTranslations]);

  useEffect(() => {
    if (!metadata) return;

    const fetchContent = async () => {
      await getMarkdownContent();
    };

    fetchContent();
  }, [metadata, getMarkdownContent]);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isAboveFooter, setIsAboveFooter] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setIsExpanded(false));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAboveFooter(entry.isIntersecting);
      },
      {
        threshold: [0, 0.5, 1.0],
        rootMargin: '0px 0px 100px 0px'
      }
    );

    const footerElement = document.querySelector('footer');
    if (footerElement) {
      observer.observe(footerElement);
    }

    return () => observer.disconnect();
  }, []);

  const isExportAllowed = metadata?.uihints?.includes('export');

  const [copyPulse, setCopyPulse] = useState(false);
  const [markdownPulse, setMarkdownPulse] = useState(false);

  const handleCopyLink = () => {
    const contentUrl = getContentUrl();
    if (contentUrl) {
      navigator.clipboard.writeText(contentUrl);
      setCopyPulse(true);
      setTimeout(() => setCopyPulse(false), 500);
    }
  };

  const handleMarkdownCopy = async () => {
    if (!isExportAllowed) return;

    const content = await getMarkdownContent();
    if (content) {
      navigator.clipboard.writeText(content);
      setMarkdownPulse(true);
      setTimeout(() => setMarkdownPulse(false), 500);
    }
  };

  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const handleShare = () => {
    setIsShareDialogOpen(true);
  };


  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isHovering) {
      setIsExpanded(true);
    } else {
      const timer = setTimeout(() => setIsExpanded(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isHovering]);

  if (!t || !translations['document-metadata'] || !translations['header']) return null;

  return (
    <div
      ref={menuRef}
      className={`action-menu ${isAboveFooter ? 'action-menu--above-footer' : ''}`}
      role="navigation"
      aria-label={t.aria.menu}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="action-menu__inner">
        <button
          className="action-menu__trigger"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls="action-menu-items"
        >
          <span className="action-menu__trigger-text">{t.aria.trigger}</span>
        </button>

        <div
          id="action-menu-items"
          className={`action-menu__expansion ${isExpanded ? 'action-menu__expansion--visible' : ''}`}
        >
          <div className="action-menu__mask" />
          <div className="action-menu__line" />

          <button
            className="action-menu__item"
            onClick={handleShare}
            style={{ '--item-index': 0 } as React.CSSProperties}
          >
            {t.actions.share.label}
          </button>

          <button
            className={`action-menu__item ${copyPulse ? 'action-menu__item--pulse' : ''}`}
            onClick={handleCopyLink}
            style={{ '--item-index': 1 } as React.CSSProperties}
          >
            {t.actions.copyLink.label}
          </button>

          <button
            className={`action-menu__item ${!isExportAllowed ? 'action-menu__item--disabled' : ''} ${markdownPulse ? 'action-menu__item--pulse' : ''}`}
            onClick={handleMarkdownCopy}
            style={{ '--item-index': 3 } as React.CSSProperties}
          >
            {t.actions.copyMarkdown.label}
          </button>
        </div>
      </div>
      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        url={window.location.href}
        title={document.title}
      />
    </div>
  );
};