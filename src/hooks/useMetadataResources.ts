import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import type { MetadataResources, AIModels, TagsAndCategories } from '../types/metadata-resources';

interface MetadataResourcesState {
  resources: Partial<MetadataResources>;
  loading: boolean;
  error: Error | null;
}

const INITIAL_STATE: MetadataResourcesState = {
  resources: {},
  loading: true,
  error: null
};

export const useMetadataResources = () => {
  const { language } = useLanguage();
  const [state, setState] = useState<MetadataResourcesState>(INITIAL_STATE);

  useEffect(() => {
    const loadResources = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        // Parallele Anfragen für bessere Performance
        const [aiModelsResponse, tagsResponse] = await Promise.all([
          fetch('/content/common/ai_models.json'),
          fetch(`/content/${language}/translations/tagsandcategories.json`)
        ]);

        // Error Handling für einzelne Requests
        if (!aiModelsResponse.ok) {
          throw new Error(`Failed to load AI models: ${aiModelsResponse.statusText}`);
        }
        if (!tagsResponse.ok) {
          throw new Error(`Failed to load tags and categories: ${tagsResponse.statusText}`);
        }

        const [aiModels, tagsAndCategories] = await Promise.all([
          aiModelsResponse.json() as Promise<AIModels>,
          tagsResponse.json() as Promise<TagsAndCategories>
        ]);

        setState({
          resources: {
            aiModels,
            tagsAndCategories
          },
          loading: false,
          error: null
        });
      } catch (err) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err : new Error('Failed to load metadata resources')
        }));
      }
    };

    loadResources();
  }, [language]);

  return state;
};