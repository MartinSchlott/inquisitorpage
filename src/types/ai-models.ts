export interface AIModel {
  displayname: string;  
  model: string;
}

export interface AIModels {
  [key: string]: AIModel;
}