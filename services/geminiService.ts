
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from '../types';

export const getRecipesFromIngredients = async (ingredients: string[]): Promise<Recipe[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  const prompt = `จากวัตถุดิบต่อไปนี้ ช่วยสร้างสรรค์สูตรอาหาร 3 เมนูที่ไม่ซ้ำใคร วัตถุดิบ: ${ingredients.join(', ')}. 
  สำหรับแต่ละเมนู ให้ระบุวิธีทำทีละขั้นตอนแบบละเอียด (Detailed step-by-step instructions), imagePrompt (ภาษาอังกฤษ) สำหรับวาดรูปอาหารที่จัดจานสวยงาม และ videoPrompt (ภาษาอังกฤษ) สำหรับทำวิดีโอขั้นตอนการทำสั้นๆ`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  recipeName: { type: Type.STRING },
                  description: { type: Type.STRING },
                  ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                  instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  imagePrompt: { type: Type.STRING, description: "Prompt for generating a food photo" },
                  videoPrompt: { type: Type.STRING, description: "Prompt for generating a cooking video" }
                },
                required: ["recipeName", "description", "ingredients", "instructions", "imagePrompt", "videoPrompt"]
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || '{"recipes":[]}');
    return data.recipes as Recipe[];
  } catch (error) {
    console.error("Error generating recipes:", error);
    throw new Error("ไม่สามารถสร้างสูตรอาหารได้ โปรดลองอีกครั้ง");
  }
};

export const generateRecipeImage = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  try {
    // Corrected contents to use a direct string prompt as per the recommended API usage for text-to-image/text-to-content
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: `A high-quality, professional food photography of ${prompt}, studio lighting, appetizing, cinematic.`,
    });

    // Iterate through candidates and parts to find the generated image data
    for (const candidate of response.candidates || []) {
      for (const part of candidate.content.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("Image data not found");
  } catch (error) {
    console.error("Image generation error:", error);
    return "https://images.unsplash.com/photo-1495195129352-aed325a55b65?q=80&w=1000&auto=format&fit=crop"; // fallback
  }
};

export const generateRecipeVideo = async (prompt: string, onProgress?: (msg: string) => void): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  onProgress?.("กำลังเตรียมห้องครัวเสมือนจริง...");
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `Cinematic close-up of cooking ${prompt}, steam rising, vibrant colors, 4k.`,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  const messages = [
    "เชฟกำลังจัดเตรียมวัตถุดิบ...",
    "กำลังตั้งกระทะและอุ่นเครื่อง...",
    "กลิ่นหอมเริ่มโชยออกมาแล้ว...",
    "อีกนิดเดียว เมนูของคุณจะพร้อมแสดงผล..."
  ];
  let msgIndex = 0;

  while (!operation.done) {
    onProgress?.(messages[msgIndex % messages.length]);
    msgIndex++;
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed");
  
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
