
import React, { useState } from 'react';
import { getRecipesFromIngredients, generateRecipeImage } from './services/geminiService';
import { Recipe } from './types';
import { IngredientInput } from './components/IngredientInput';
import { RecipeCard } from './components/RecipeCard';
import { ChefHatIcon } from './components/icons/ChefHatIcon';
import { CookingView } from './components/CookingView';
import { LandingPage } from './components/LandingPage';

const App: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const handleSubmit = async () => {
    if (ingredients.length === 0) {
      setError('กรุณาเพิ่มวัตถุดิบอย่างน้อย 1 อย่าง');
      return;
    }
    setIsLoading(true);
    setError(null);
    setRecipes([]);

    try {
      const result = await getRecipesFromIngredients(ingredients);
      setRecipes(result);
      
      // Lazily generate images for the recipes
      result.forEach(async (recipe, idx) => {
          try {
            const imageUrl = await generateRecipeImage(recipe.imagePrompt);
            setRecipes(prev => prev.map((r, i) => i === idx ? { ...r, imageUrl } : r));
          } catch (e) {
            console.error("Image generation failed for recipe", idx);
          }
      });

    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดที่ไม่คาดคิด');
    } finally {
      setIsLoading(false);
    }
  };

  const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
        <div className="w-16 h-16 border-4 border-t-emerald-600 border-emerald-200/30 rounded-full animate-spin"></div>
        <p className="text-emerald-800 font-medium bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm">เชฟ AI กำลังเขียนเมนูพิเศษให้คุณ...</p>
    </div>
  );

  if (!isStarted) {
    return <LandingPage onStart={() => setIsStarted(true)} />;
  }

  return (
    <div className="min-h-screen relative text-slate-800 overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[2px] opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=2070')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/85 to-emerald-50/80"></div>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        {selectedRecipe ? (
            <CookingView recipe={selectedRecipe} onBack={() => { setSelectedRecipe(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        ) : (
            <>
                <header className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center justify-center gap-4 mb-4 bg-white/40 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-white/50">
                        <ChefHatIcon className="w-12 h-12 text-emerald-600 filter drop-shadow-sm"/>
                        <h1 className="text-3xl md:text-5xl font-bold text-slate-800 tracking-tight">Fridge Hack</h1>
                    </div>
                    <p className="text-xl text-slate-700 font-medium max-w-2xl mx-auto leading-relaxed">
                        เว็บไซต์แนะนำเมนูอาหารจากของที่เหลือใช้
                    </p>
                </header>

                <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/60 mb-12 animate-in zoom-in-95 duration-500">
                    <div className="flex flex-col gap-6">
                        <label className="text-xl font-bold text-slate-700">🛒 ใส่วัตถุดิบของคุณที่นี่:</label>
                        <IngredientInput ingredients={ingredients} setIngredients={setIngredients} />
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 disabled:opacity-50 transform hover:-translate-y-0.5"
                        >
                            {isLoading ? "กำลังประมวลผล..." : "✨ สร้างเมนูแนะนำพร้อมรูปภาพ"}
                        </button>
                    </div>
                </div>
                
                <div className="mt-12">
                    {isLoading && <LoadingSpinner />}
                    {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center border border-red-100 max-w-md mx-auto">{error}</div>}
                    
                    {!isLoading && recipes.length > 0 && (
                        <div className="grid gap-8 max-w-5xl mx-auto">
                            {recipes.map((recipe, index) => (
                                <RecipeCard 
                                    key={index}
                                    recipe={recipe} 
                                    onSelect={(r) => { setSelectedRecipe(r); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </>
        )}
      </main>
      
      <footer className="relative z-10 text-center py-6 text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} Fridge Hack • ขับเคลื่อนโดย Gemini & Veo</p>
      </footer>
    </div>
  );
};

export default App;
