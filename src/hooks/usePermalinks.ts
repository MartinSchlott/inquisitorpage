import { useEffect, useState } from 'react';

interface PermalinksMap {
  idToPath: Map<string, string>;
  pathToId: Map<string, string>;
}

export const usePermalinks = (lang: string): PermalinksMap | null => {
  const [permalinks, setPermalinks] = useState<PermalinksMap | null>(null);

  useEffect(() => {
    const loadPermalinks = async () => {
      try {
        const response = await fetch(`/content/${lang}/permalinks.txt`);
        if (!response.ok) {
          console.error('Permalinks konnten nicht geladen werden');
          return;
        }
        
        const text = await response.text();
        
        const idToPath = new Map<string, string>();
        const pathToId = new Map<string, string>();
        
        text.split('\n')
          .filter(line => line.trim())
          .forEach(line => {
            const [id, path] = line.trim().split(' ');
            idToPath.set(id, path);
            pathToId.set(path, id);
          });

        setPermalinks({ idToPath, pathToId });
      } catch (err) {
        console.error('Fehler beim Laden der Permalinks:', err);
        setPermalinks(null);
      }
    };

    loadPermalinks();
  }, [lang]);

  return permalinks;
};