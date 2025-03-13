import { useState } from 'react';

export function usePDFExport() {
  const [isLoading, setIsLoading] = useState(false);

  const startExport = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement PDF export logic
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    startExport
  };
}