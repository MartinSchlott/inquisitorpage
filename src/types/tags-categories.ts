export interface TagsAndCategories {
  tags: {
    [key: string]: {
      name: string;
      description: string;
    };
  };
  categories: {
    [key: string]: {
      name: string;
      description: string;
    };
  };
}