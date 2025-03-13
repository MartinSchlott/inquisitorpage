// Gemeinsames Interface für alle Metadaten-Ressourcen
export interface MetadataResources {
  aiModels: AIModels;
  tagsAndCategories: TagsAndCategories | null;
}

export interface AIModel {
  displayname: string;
  model: string;
}

export interface AIModels {
  [key: string]: AIModel;
}

export interface TagOrCategory {
  name: string;
  description: string;
}

export interface TagsAndCategories {
  tags: {
    [key: string]: TagOrCategory;
  };
  categories: {
    [key: string]: TagOrCategory;
  };
}

// Type Guard für Metadata Resources
export const isCompleteMetadataResources = (
  resources: Partial<MetadataResources>
): resources is MetadataResources => {
  return Boolean(
    resources.aiModels && 
    resources.tagsAndCategories
  );
};