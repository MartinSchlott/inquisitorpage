import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({ 
  isOpen, 
  onClose, 
  url,
  title 
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { translations, loadComponentTranslations } = useLanguage();
  const t = translations['share-dialog'];

  useEffect(() => {
    loadComponentTranslations('share-dialog');
  }, [loadComponentTranslations]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    }
  }, [isOpen]);

  const handleShare = (platform: 'x' | 'linkedin' | 'copy') => {
    switch (platform) {
      case 'x':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        handleClose();
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        handleClose();
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        handleClose();
        break;
    }
  };

  const handleClose = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.dataset.closing = 'true';
    
    setTimeout(() => {
      dialog.close();
      delete dialog.dataset.closing;
      onClose();
    }, 200); // Reduced from 300ms to 200ms for faster animation
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };

  if (!t) return null;

  return (
    <dialog
      ref={dialogRef}
      className="share-dialog"
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (e.target === dialogRef.current) handleClose();
      }}
    >
      <div className="share-dialog__content">
        <h2 className="share-dialog__title">{t.title}</h2>
        <div className="share-dialog__buttons">
          <button 
            className="share-dialog__button" 
            onClick={() => handleShare('x')}
          >
            {t.x}
          </button>
          <button 
            className="share-dialog__button"
            onClick={() => handleShare('linkedin')}
          >
            {t.linkedin}
          </button>
          <button 
            className="share-dialog__button"
            onClick={() => handleShare('copy')}
          >
            {t.copy}
          </button>
        </div>
      </div>
    </dialog>
  );
};