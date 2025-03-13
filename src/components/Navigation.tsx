import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

interface NavigationItem {
  id: string;
  title: string;
  path: string;
}

interface MainNavItem {
  id: string;
  title: string;
  items: NavigationItem[];
}

interface NavigatorData {
  version: string;
  language: string;
  mainNav: MainNavItem[];
}

const Navigation: React.FC = () => {
  const { language } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navData, setNavData] = useState<NavigatorData | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNavigator = async () => {
      try {
        const response = await fetch(`/content/${language}/translations/navigator.json`);
        if (!response.ok) return;
        const data = await response.json();
        setNavData(data);
      } catch (error) {
        console.error('Error loading navigation:', error);
      }
    };

    fetchNavigator();
  }, [language]); // Neu laden wenn sich die Sprache ändert

  // Rest des Codes bleibt gleich...
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleCategoryClick = (categoryId: string, event: React.MouseEvent) => {
    event.preventDefault();
    setActiveDropdown(activeDropdown === categoryId ? null : categoryId);
  };

  const handleMouseEnter = (categoryId: string) => {
    setActiveDropdown(categoryId);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent, categoryId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveDropdown(activeDropdown === categoryId ? null : categoryId);
    } else if (event.key === 'Escape') {
      setActiveDropdown(null);
    }
  };

  if (!navData) return null;

  return (
    <nav className="main-navigation" role="navigation">
      <button
        className="mobile-menu-button"
        onClick={() => setIsMenuOpen(true)}
        aria-label="Open menu"
        aria-expanded={isMenuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className="nav-content">
        <div className="desktop-menu" role="menubar">
          {navData.mainNav.map(category => (
            <div
              key={category.id}
              className={`nav-category ${activeDropdown === category.id ? 'active' : ''}`}
              onMouseEnter={() => handleMouseEnter(category.id)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="nav-category-title"
                onClick={(e) => handleCategoryClick(category.id, e)}
                onKeyDown={(e) => handleKeyDown(e, category.id)}
                aria-expanded={activeDropdown === category.id}
                aria-haspopup="true"
                role="menuitem"
              >
                {category.title}
              </button>

              {activeDropdown === category.id && (
                <div 
                  className="nav-dropdown"
                  role="menu"
                  aria-label={`${category.title} submenu`}
                >
                  {category.items.map(item => (
                    <Link
                      key={item.id}
                      to={item.path}
                      className="nav-dropdown-item"
                      role="menuitem"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="nav-border"></div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <>
          <div className={`mobile-menu-backdrop ${isMenuOpen ? 'active' : ''}`} />
          <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`} ref={menuRef}>
            <button
              className="close-menu-button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Menu schließen"
            >
              ×
            </button>
            
            <div className="mobile-menu-content">
              {navData.mainNav.map(category => (
                <div key={category.id} className="mobile-category">
                  <div className="mobile-category-title">
                    <Link
                      to={category.items[0].path}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.title}
                    </Link>
                  </div>
                  <div className="mobile-category-items">
                    {category.items.slice(1).map(item => (
                      <Link
                        key={item.id}
                        to={item.path}
                        className="mobile-menu-item"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navigation;