
import React from 'react';
import { ChefHatIcon } from './icons/ChefHatIcon';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const handleStart = () => {
    onStart();
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background with zoom animation */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070')" }}
        ></div>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-xl p-10 md:p-16 rounded-[3rem] border border-white/20 shadow-2xl animate-in zoom-in-95 fade-in duration-1000">
          <div className="bg-emerald-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/40">
            <ChefHatIcon className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Fridge <span className="text-emerald-400">Hack</span>
          </h1>
          
          <p className="text-emerald-50/80 text-lg md:text-xl mb-10 leading-relaxed font-light">
            เว็บไซต์แนะนำเมนูอาหารจากของที่เหลือใช้
          </p>

          <div className="space-y-4">
            <button 
              onClick={handleStart}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-5 px-8 rounded-2xl text-xl shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <span>🚀</span> เข้าสู่ห้องครัว AI
            </button>
          </div>
        </div>

        <div className="mt-12 text-white/60 text-sm animate-pulse">
            เลื่อนลงเพื่อดูเพิ่มเติม
        </div>
      </div>

      <style>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 30s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
