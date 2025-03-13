export interface DocMeta {
  displaytitle?: string;
  category?: string;
  date?: string;
  summary?: string;
  tags?: string[];
  index?: string;
  inquisitor?: string;
  ai?: string[];
  validator?: string[];
  doclang?: string;
  licence?: string;
  uihints?: string[];
  cuid2?: string;
  docsource?: string;
  translatorai?: string[];
}

export interface Article extends DocMeta {
  displaytitle: string;  // required
  category: string;      // required
  date: string;         // required
  path: string;         // additional field
} 