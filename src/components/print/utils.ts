/**
 * Entfernt HTML-Kommentare aus dem Markdown-Text
 */
export const removeHtmlComments = (markdown: string): string => {
  // Entferne HTML-Kommentare (einschließlich DOC-META)
  return markdown.replace(/<!--[\s\S]*?-->/g, '');
};

/**
 * Bereinigt den Markdown-Text für den Druck
 */
export const prepareMarkdownForPrint = (markdown: string): string => {
  let result = markdown;
  
  // Entferne HTML-Kommentare
  result = removeHtmlComments(result);
  
  // Entferne leere Zeilen am Anfang und Ende
  result = result.trim();
  
  return result;
};