import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { usePermalinks } from '../hooks/usePermalinks';

export const PermalinkRedirect: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Wir vertrauen nur noch auf die URL
  const { id } = useParams<{ id: string }>();
  const urlLang = location.pathname.split('/')[1];
  const permalinks = usePermalinks(urlLang);

  useEffect(() => {
    if (!permalinks || !id) return;

    const path = permalinks.idToPath.get(id);
    if (path) {
      // URL als Permalink behalten
      window.history.replaceState(null, '', location.pathname);
      // Zum regulären Pfad navigieren
      navigate(`/${urlLang}${path}`, { replace: false });
    } else {
      navigate(`/${urlLang}/404`, { replace: true });
    }
  }, [permalinks, id, urlLang, navigate, location.pathname]);

  return <div>Weiterleitung...</div>;
};