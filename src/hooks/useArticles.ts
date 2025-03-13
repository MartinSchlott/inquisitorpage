import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Article } from '../types/document-metadata';

export interface UseArticlesOptions {
  limit?: number;
  offset?: number;
  category?: string;
  tags?: string[];
  tagOperator?: 'and' | 'or';
}

export interface UseArticlesReturn {
  articles: Article[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

interface ArticlesResponse {
  articles: Article[];
}

export const useArticles = (options: UseArticlesOptions = {}): UseArticlesReturn => {
  const { language } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Reset state when language changes
  useEffect(() => {
    setArticles([]);
    setLoading(true);
    setError(null);
    setHasMore(true);
  }, [language]);

  const fetchArticles = useCallback(async (append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/content/${language}/articles.json`);
      if (!response.ok) throw new Error('Failed to load articles');
      
      const data: ArticlesResponse = await response.json();
      let filteredArticles = data.articles;

      // Apply filters
      if (options.category) {
        filteredArticles = filteredArticles.filter(article => 
          article.category === options.category
        );
      }

      if (options.tags && options.tags.length > 0) {
        filteredArticles = filteredArticles.filter(article => 
          article.tags?.some(tag => 
            options.tagOperator === 'and'
              ? options.tags?.every(selectedTag => article.tags?.includes(selectedTag))
              : options.tags?.includes(tag)
          )
        );
      }

      // Apply pagination
      const start = options.offset || 0;
      const end = options.limit ? start + options.limit : undefined;
      const paginatedArticles = filteredArticles.slice(start, end);

      setArticles(prev => append ? [...prev, ...paginatedArticles] : paginatedArticles);
      setHasMore(end ? end < filteredArticles.length : false);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [language, options.category, options.limit, options.offset, options.tags, options.tagOperator]);

  // Initial load
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await fetchArticles(true);
    }
  }, [fetchArticles, loading, hasMore]);

  return {
    articles,
    loading,
    error,
    hasMore,
    loadMore
  };
};