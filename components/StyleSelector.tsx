
import React, { useState } from 'react';
import { ImageStyle, STYLES_DATA, ClothingOption } from '../types';
import { 
  Briefcase, Camera, Sun, Moon, Layout, Heart,
  Shirt
} from 'lucide-react';

interface StyleSelectorProps {
  onSelectStyle: (style: ImageStyle, clothing: ClothingOption) => void;
  onBack: () => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ onSelectStyle, onBack }) => {
  const [clothing, setClothing] = useState<ClothingOption>('casual');
  
  const getIcon = (iconName: string) => {
    const props = { className: "w-6 h-6" };
    switch (iconName) {
      case 'briefcase': return <Briefcase {...props} />;
      case 'layout': return <Layout {...props} />;
      case 'camera': return <Camera {...props} />;
      case 'heart': return <Heart {...props} />;
      case 'sun': return <Sun {...props} />;
      case 'moon': return <Moon {...props} />;
      default: return <Camera {...props} />;
    }
  };

  return (
    <div className="max-w-7xl w-full animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center px-6">
      
      <div className="text-center mb-10 max-w-3xl">
         <div className="inline-flex items-center justify-center px-4 py-1.5 border border-indigo-500/30 rounded-full mb-6 bg-indigo-950/30 backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-3 animate-pulse"></span>
          <span className="text-indigo-300 text-xs font-medium tracking-widest uppercase">Fase 02 — Configuración</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-light text-white mb-6 tracking-tight">Define tu Estilo</h1>
        <p className="text-indigo-200/60 text-lg font-light max-w-2xl mx-auto">
          Selecciona el ambiente visual y tu preferencia de vestuario. La IA adaptará tu imagen al contexto elegido.
        </p>
      </div>

      {/* Clothing Toggle */}
      <div className="flex items-center gap-6 mb-16 bg-zinc-900/50 p-2 rounded-full border border-zinc-800 backdrop-blur-md">
        <button
          onClick={() => setClothing('casual')}
          className={`flex items-center px-6 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
            clothing === 'casual' 
              ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Shirt className="w-4 h-4 mr-2" /> Casual
        </button>
        <button
          onClick={() => setClothing('formal')}
          className={`flex items-center px-6 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
            clothing === 'formal' 
              ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Briefcase className="w-4 h-4 mr-2" /> Formal
        </button>
      </div>

      {/* Centered Grid - 6 Specific Styles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 w-full max-w-5xl">
        {STYLES_DATA.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelectStyle(style, clothing)}
            className="group relative flex flex-col h-80 overflow-hidden rounded-3xl bg-zinc-900/40 border border-white/10 hover:border-indigo-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.3)]"
          >
            {/* Visual Header */}
            <div className={`h-48 w-full bg-gradient-to-br ${style.gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                
                {/* Floating Icon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    {getIcon(style.icon)}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-2 group-hover:text-indigo-400 transition-colors">{style.name}</h3>
                <p className="text-xs text-zinc-400 font-medium leading-relaxed text-center px-4">
                    {style.description}
                </p>
            </div>
            
            {/* Selection Indicator */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </button>
        ))}
      </div>

      <div className="flex justify-center mb-10">
        <button
          onClick={onBack}
          className="text-xs font-bold tracking-[0.2em] text-zinc-500 hover:text-white uppercase transition-colors border-b border-transparent hover:border-white pb-1"
        >
          Volver Atrás
        </button>
      </div>
    </div>
  );
};

export default StyleSelector;
