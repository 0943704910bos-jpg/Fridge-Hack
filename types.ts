
export interface Recipe {
  recipeName: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  imagePrompt: string;
  videoPrompt: string;
  imageUrl?: string;
  videoUrl?: string;
}
