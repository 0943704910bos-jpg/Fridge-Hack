
import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect?: (recipe: Recipe) => void;
}

const BulletPointIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 9.5H7"/><path d="M21 4.5H7"/><path d="M21 14.5H7"/><path d="M21 19.5H7"/><path d="M4 6.5l-2-2 2-2"/><path d="M4 11.5l-2-2 2-2"/><path d="M4 16.5l-2-2 2-2"/><path d="M4 21.5l-2-2 2-2"/>
    </svg>
);

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden border border-slate-200/50 transform hover:-translate-y-1 flex flex-col md:flex-row h-full">
      {recipe.imageUrl && (
        <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
          <img 
            src={recipe.imageUrl} 
            alt={recipe.recipeName} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-6 md:p-8 flex-grow flex flex-col">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">{recipe.recipeName}</h3>
        <p className="text-slate-600 mb-6 line-clamp-2">{recipe.description}</p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-700 mb-2">วัตถุดิบหลัก</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              {recipe.ingredients.slice(0, 3).map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                   <span className="truncate">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-100 flex justify-end">
            {onSelect && (
                <button 
                    onClick={() => onSelect(recipe)}
                    className="bg-emerald-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-md shadow-emerald-500/20"
                >
                    <span>👨‍🍳</span> เริ่มทำอาหาร
                </button>
            )}
        </div>
      </div>
    </div>
  );
};
