import React, { useState } from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface IngredientInputProps {
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
}

export const IngredientInput: React.FC<IngredientInputProps> = ({ ingredients, setIngredients }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const addIngredient = (ingredient: string) => {
    const trimmed = ingredient.trim();
    if (trimmed && !ingredients.includes(trimmed.toLowerCase())) {
      setIngredients([...ingredients, trimmed]);
    }
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addIngredient(inputValue);
    }
  };

  const removeIngredient = (indexToRemove: number) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="w-full">
      <div className="bg-white border-2 border-slate-200 rounded-lg p-2 flex flex-wrap items-center gap-2 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all duration-300">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="bg-emerald-100 text-emerald-800 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-2 animate-in fade-in-0 zoom-in-95">
            <span className="capitalize">{ingredient}</span>
            <button
              onClick={() => removeIngredient(index)}
              className="text-emerald-600 hover:text-emerald-800 focus:outline-none"
              aria-label={`ลบ ${ingredient}`}
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="เพิ่มวัตถุดิบ..."
          className="flex-grow bg-transparent p-1 focus:outline-none text-slate-700"
        />
      </div>
       <p className="text-xs text-slate-500 mt-2">กด Enter หรือลูกน้ำ (,) เพื่อเพิ่มวัตถุดิบ</p>
    </div>
  );
};