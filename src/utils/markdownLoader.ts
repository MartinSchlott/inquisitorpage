export interface Metadata {
  displaytitle?: string;
  summary?: string;
  tags?: string[];
  category?: string;
  date?: string;
  inquisitor?: string;
  ai?: string[];
  cuid2?: string;
  uihints?: string[];
  validator?: string[];
  doclang?: string;
  licence?: string;
  index?: string;
  ogimage?: string;
  [key: string]: string | string[] | undefined;
}

export interface MarkdownContent {
  title: string;
  content: string;
  id: string;
  metadata?: Metadata;
}

function parseMetadata(content: string): { metadata: Metadata | undefined; cleanContent: string } {
  const metaRegex = /<!--\s*DOC-META([\s\S]*?)-->/;
  const match = content.match(metaRegex);

  if (!match) {
    return { metadata: undefined, cleanContent: content };
  }

  try {
    const metaText = match[1].trim();
    
    const lines = metaText.split('\n');
    const metadata: Metadata = {};
    let currentArrayKey: keyof Metadata | null = null;
    let currentArrayValues: string[] = [];

    lines.forEach(line => {
      const trimmedLine = line.trim();

      // Wenn die Zeile mit - beginnt, ist es ein Array-Element
      if (trimmedLine.startsWith('- ') && currentArrayKey) {
        const value = trimmedLine.slice(2).trim();
        currentArrayValues.push(value);
        return;
      }

      // Wenn wir hier ankommen und einen currentArrayKey haben, 
      // speichern wir die gesammelten Werte
      if (currentArrayKey && currentArrayValues.length > 0) {
        metadata[currentArrayKey] = currentArrayValues;
        currentArrayValues = [];
      }

      // Prüfe ob es eine neue Key:Value Zeile ist
      const colonIndex = trimmedLine.indexOf(':');
      if (colonIndex === -1) return;

      const key = trimmedLine.slice(0, colonIndex).trim();
      let value = trimmedLine.slice(colonIndex + 1).trim();
      

      // Setze den currentArrayKey wenn es ein Array-Feld ist
      const arrayKeys = ['tags', 'ai', 'uihints', 'validator'];
      if (arrayKeys.includes(key)) {
        currentArrayKey = key as keyof Metadata;
        currentArrayValues = [];
        return;
      }

      currentArrayKey = null;

      // Normale String-Werte verarbeiten
      if (value) {
        const keyTyped = key as keyof Metadata;
        if (value.startsWith("'") || value.startsWith('"')) {
          value = value.slice(1, -1);
        }
        if (!arrayKeys.includes(key)) {
          metadata[keyTyped] = value;
        }
      }
    });

    // Am Ende nochmal prüfen ob noch Array-Werte zu speichern sind
    if (currentArrayKey && currentArrayValues.length > 0) {
      metadata[currentArrayKey] = currentArrayValues;
    }

    const cleanContent = content.replace(metaRegex, '').trim();
    return { metadata, cleanContent };
  } catch (error) {
    console.error('Error parsing metadata:', error);
    return { metadata: undefined, cleanContent: content };
  }
}

export async function loadMarkdownFile(filename: string): Promise<MarkdownContent> {
  try {
    const response = await fetch(`/content/${filename}`);
    const text = await response.text();
    
    const { metadata, cleanContent } = parseMetadata(text);
    
    // Extract title from first heading
    const titleMatch = cleanContent.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : filename.replace('.md', '');
    
    // Generate ID from filename
    const id = filename.replace('.md', '').toLowerCase();
    
    return {
      title,
      content: cleanContent,
      id,
      metadata
    };
  } catch (error) {
    console.error(`Error loading markdown file ${filename}:`, error);
    throw error;
  }
}

export async function loadIndexContent(): Promise<MarkdownContent> {
  return await loadMarkdownFile('de/index.md');
}

export async function getAllMarkdownFiles(): Promise<MarkdownContent[]> {
  try {
    const files = ['de/index.md'];
    const contents = await Promise.all(files.map(loadMarkdownFile));
    return contents;
  } catch (error) {
    console.error('Error loading markdown files:', error);
    throw error;
  }
}