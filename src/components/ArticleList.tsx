import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useArticles } from '../hooks/useArticles';
import { useMetadataResources } from '../hooks/useMetadataResources';
import { getCategoryName, getTagName } from '../utils/metadata-helpers';

const ArticleList: React.FC = () => {
  const { loadComponentTranslations, translations } = useLanguage();
  const { resources } = useMetadataResources();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { articles, loading, error } = useArticles({
    category: selectedCategory,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    tagOperator: 'and'
  });

  // Load translations
  React.useEffect(() => {
    loadComponentTranslations('article-list');
  }, [loadComponentTranslations]);

  const t = translations['article-list'];
  if (!t) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  if (error) {
    return (
      <div className="article-list-error">
        {t.errorLoading}
        <button onClick={() => window.location.reload()} className="article-list-retry-button">
          {t.retry}
        </button>
      </div>
    );
  }

  return (
    <div className="article-list-container">
      {/* Active Filters */}
      {(selectedCategory || selectedTags.length > 0) && (
        <div className="article-list-active-filters">
          <div className="article-list-category-filter">
            {selectedCategory && (
              <span 
                className="article-list-category article-list-filter"
                onClick={() => setSelectedCategory(undefined)}
              >
                [{getCategoryName(selectedCategory, resources.tagsAndCategories || null)}]
              </span>
            )}
          </div>
          {selectedTags.length > 0 && (
            <div className="article-list-tag-filters">
              {selectedTags.map(tag => (
                <span 
                  key={tag}
                  className="article-list-tag metadata-tag"
                  onClick={() => toggleTag(tag)}
                >
                  {getTagName(tag, resources.tagsAndCategories || null)}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Articles Grid */}
      <div className="article-list-grid">
        {articles.map((article) => (
          <article key={article.path} className="article-list-article">
            <Link to={article.path} className="article-list-article-link">
              <h2 className="article-list-title">{article.displaytitle}</h2>
              <div className="article-list-meta">
                <span className="article-list-category" 
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedCategory(article.category);
                      }}>
                  [{getCategoryName(article.category, resources.tagsAndCategories || null)}]
                </span>
                <span className="article-list-date">{article.date}</span>
              </div>
              {article.summary && (
                <p className="article-list-summary">{article.summary}</p>
              )}
              {article.tags && (
                <div className="article-list-tags">
                  {article.tags.map(tag => (
                    <span 
                      key={tag}
                      className={`article-list-tag metadata-tag ${selectedTags.includes(tag) ? 'article-list-selected-tag' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleTag(tag);
                      }}
                    >
                      {getTagName(tag, resources.tagsAndCategories || null)}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          </article>
        ))}
      </div>

      {/* Loading State */}
      {loading && <div className="article-list-loading">{t.loading}</div>}
      
      {!loading && articles.length === 0 && (
        <div className="article-list-no-results">
          {selectedCategory || selectedTags.length > 0 
            ? t.noArticlesFiltered 
            : t.noArticles}
        </div>
      )}
    </div>
  );
};

export default ArticleList;