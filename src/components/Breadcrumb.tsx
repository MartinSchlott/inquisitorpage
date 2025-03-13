import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

interface BreadcrumbProps {
  path: string;
  onNavigate: (path: string, contextPath: string) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ path }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  
  // Remove leading and trailing slashes and split into segments
  const segments = path
    .replace(/^\/+|\/+$/g, '')
    .split('/')
    .filter(segment => segment !== language)
    .filter(segment => segment !== 'index');


  // Check if we're viewing an index file
  const isIndexPath = path.endsWith('index') || path.endsWith('landing');
  const pathSegments = isIndexPath ? segments : segments.slice(0, -1);


  // Create breadcrumb items with paths
  const items = pathSegments.map((segment, index) => ({
    name: segment.charAt(0).toUpperCase() + segment.slice(1),
    path: pathSegments.slice(0, index + 1).join('/')
  }));

  // Add home as first item
  const breadcrumbItems = [
    { name: 'Home', path: 'landing' },
    ...items
  ];


  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {breadcrumbItems.map((item, index) => {
        
        return (
          <div key={item.path} className="breadcrumb-item">
            <a
              className="breadcrumb-link"
              onClick={(e) => {
                e.preventDefault();
                const path = item.path === 'landing' 
                  ? `/${language}/landing`
                  : `/${language}/${item.path}/index`;
                navigate(path);
              }}
            >
              {item.name}
            </a>
            {(index < breadcrumbItems.length - 1 || !isIndexPath) && (
              <span className="breadcrumb-separator">/</span>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb; 