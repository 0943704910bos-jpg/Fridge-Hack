
import React, { useState } from 'react';
import { Recipe } from '../types';
import { ChefHatIcon } from './icons/ChefHatIcon';
import { generateRecipeVideo } from '../services/geminiService';

interface CookingViewProps {
  recipe: Recipe;
  onBack: () => void;
}

// The window.aistudio property is pre-configured in the environment with the AIStudio type.
// We remove the local declaration to avoid conflicting with the global definition.

export const CookingView: React.FC<CookingViewProps> = ({ recipe, onBack }) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [videoUrl, setVideoUrl] = useState<string | null>(recipe.videoUrl || null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");

  const toggleIngredient = (index: number) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(index)) newChecked.delete(index);
    else newChecked.add(index);
    setCheckedIngredients(newChecked);
  };

  const handleGenerateVideo = async () => {
    try {
      // @ts-ignore: aistudio is globally defined in the runtime environment
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        // @ts-ignore: aistudio is globally defined in the runtime environment
        await window.aistudio.openSelectKey();
        // Proceed after opening dialog (as per instructions for race condition)
      }

      setIsVideoLoading(true);
      const url = await generateRecipeVideo(recipe.videoPrompt, (msg) => setLoadingMsg(msg));
      setVideoUrl(url);
    } catch (error: any) {
      if (error.message?.includes("Requested entity was not found")) {
        alert("กรุณาเลือก API Key ที่เปิดใช้งาน Billing แล้วอีกครั้ง");
        // @ts-ignore: aistudio is globally defined in the runtime environment
        await window.aistudio.openSelectKey();
      } else {
        alert("ไม่สามารถสร้างวิดีโอได้ในขณะนี้");
      }
    } finally {
      setIsVideoLoading(false);
    }
  };

  const calculateProgress = () => {
    if (recipe.ingredients.length === 0) return 0;
    return Math.round((checkedIngredients.size / recipe.ingredients.length) * 100);
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium transition-colors bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/80 shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        กลับไปหน้าค้นหา
      </button>

      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/60">
        <div className="relative h-64 md:h-96">
            <img 
              src={recipe.imageUrl || 'https://images.unsplash.com/photo-1495195129352-aed325a55b65?q=80&w=1000'} 
              className="w-full h-full object-cover" 
              alt={recipe.recipeName}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end">
                <div className="p-8 md:p-12 text-white">
                    <h1 className="text-3xl md:text-5xl font-bold mb-2 leading-tight">{recipe.recipeName}</h1>
                    <p className="text-emerald-100 text-lg max-w-2xl font-light opacity-90">{recipe.description}</p>
                </div>
            </div>
        </div>

        <div className="p-6 md:p-10">
            <div className="grid md:grid-cols-12 gap-10">
                <div className="md:col-span-4 space-y-6">
                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 sticky top-6">
                        <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                            <span>🛒</span> วัตถุดิบ
                        </h2>
                        <div className="mb-4">
                            <div className="flex justify-between text-xs font-medium text-emerald-600 mb-1">
                                <span>เตรียมของไปแล้ว</span>
                                <span>{calculateProgress()}%</span>
                            </div>
                            <div className="w-full bg-emerald-200 rounded-full h-2">
                                <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${calculateProgress()}%` }}></div>
                            </div>
                        </div>
                        <ul className="space-y-2">
                            {recipe.ingredients.map((item, index) => {
                                const isChecked = checkedIngredients.has(index);
                                return (
                                    <li key={index} onClick={() => toggleIngredient(index)} className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${isChecked ? 'bg-emerald-100/50 opacity-60' : 'bg-white shadow-sm'}`}>
                                        <div className={`mt-1 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${isChecked ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-300'}`}>
                                            {isChecked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                        <span className={`text-sm ${isChecked ? 'line-through text-slate-400' : 'text-slate-700'}`}>{item}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                <div className="md:col-span-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <span>👨‍🍳</span> วิธีทำทีละขั้นตอนแบบละเอียด
                    </h2>
                    <div className="space-y-6">
                        {recipe.instructions.map((step, index) => (
                            <div key={index} className="flex gap-4 group">
                                <div className="flex-shrink-0 flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold shadow-md group-hover:bg-emerald-600 transition-colors">
                                        {index + 1}
                                    </div>
                                    {index !== recipe.instructions.length - 1 && <div className="w-0.5 h-full bg-slate-200 my-2"></div>}
                                </div>
                                <div className="pb-6 pt-1 flex-grow">
                                    <p className="text-lg text-slate-700 leading-relaxed bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                                        {step}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
