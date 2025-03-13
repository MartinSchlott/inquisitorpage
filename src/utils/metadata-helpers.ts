import type { AIModels, TagsAndCategories } from '../types/metadata-resources';

export const getModelDisplayName = (modelKey: string, aiModels: AIModels): string => {
  const model = aiModels[modelKey];
  if (!model) {
    console.warn(`Unknown AI model: ${modelKey}`);
    return modelKey;
  }
  return model.displayname;
};

export const getTagName = (
  tag: string, 
  tagsAndCategories: TagsAndCategories | null
): string => {
  if (!tagsAndCategories?.tags[tag]) {
    console.warn(`Unknown tag: ${tag}`);
    return tag;
  }
  return tagsAndCategories.tags[tag].name;
};

export const getCategoryName = (
  category: string, 
  tagsAndCategories: TagsAndCategories | null
): string => {
  if (!tagsAndCategories?.categories[category]) {
    console.warn(`Unknown category: ${category}`);
    return category;
  }
  return tagsAndCategories.categories[category].name;
};