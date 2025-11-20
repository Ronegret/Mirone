
import React, { useState, useEffect } from 'react';
import { EditorSettings, DEFAULT_EDITOR_SETTINGS, STYLES_DATA, ImageStyle, ClothingOption } from '../types';
import { 
  Sliders, Wand2, Download, RotateCcw, Sun, Moon, Contrast, Eye, Zap, RefreshCw, 
  User, Undo2, Redo2, Send, Sparkles, Palette, Droplet, Layers,
  Briefcase, Camera, Layout, Heart, Shirt
} from 'lucide-react';
import { magicEditImage, getEditSuggestions } from '../services/geminiService';

interface EditorProps {
  originalImage: string;
  onReset: () => void;
  onSwitchStyle: (style: ImageStyle) => void;
  clothing: ClothingOption;
}

const Editor: React.FC<EditorProps> = ({ originalImage, onReset, onSwitchStyle, clothing }) => {
  const [history, setHistory] = useState<string[]>([originalImage]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentImage = history[historyIndex];
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_EDITOR_SETTINGS);
  const [activeTab, setActiveTab] = useState<'ai' | 'adjust'>('ai');
  
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const handleSettingChange = (key: keyof EditorSettings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const addToHistory = (newImage: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newImage);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) setHistoryIndex(prev => prev - 1);
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) setHistoryIndex(prev => prev + 1);
  };

  const handleMagicFix = async (instruction: string) => {
    setIsProcessingAI(true);
    setAiError(null);
    try {
      const newImage = await magicEditImage(currentImage, instruction);
      addToHistory(newImage);
      setCustomPrompt(''); 
    } catch (error) {
      setAiError("Error en la solicitud. Inténtalo de nuevo.");
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleGetSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
        const suggs = await getEditSuggestions(currentImage);
        setSuggestions(suggs);
    } catch (e) {
        setSuggestions(["Mejorar iluminación", "Retoque profesional"]);
    } finally {
        setLoadingSuggestions(false);
    }
  };

  const filterString = `
    brightness(${settings.brightness}%) 
    contrast(${settings.contrast}%) 
    saturate(${settings.saturate}%) 
    sepia(${settings.sepia}%) 
    grayscale(${settings.grayscale}%) 
    hue-rotate(${settings.hue}deg)
    blur(${settings.blur}px)
  `;

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = currentImage;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.filter = filterString;
        ctx.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.download = 'mirone_edit.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    };
  };

  const getIcon = (iconName: string) => {
    const props = { className: "w-4 h-4" };
    switch (iconName) {
      case 'briefcase': return <Briefcase {...props} />;
      case 'layout': return <Layout {...props} />;
      case 'camera': return <Camera {...props} />;
      case 'heart': return <Heart {...props} />;
      case 'sun': return <Sun {...props} />;
      case 'moon': return <Moon {...props} />;
      default: return <User {...props} />;
    }
  };

  return (
    <div className="w-full flex flex-col items-center pb-20">
      {/* Main Layout: Stack on Mobile, Row on Desktop */}
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6 lg:gap-8 h-auto lg:h-[80vh] animate-in fade-in duration-700 mb-8">
        
        {/* Image Preview Area */}
        <div className="flex-1 bg-zinc-900/30 border border-white/10 rounded-3xl flex flex-col relative overflow-hidden group shadow-2xl backdrop-blur-md h-[50vh] lg:h-auto order-1 lg:order-1">
          
          {/* Top Toolbar (Floating) */}
          <div className="absolute top-4 lg:top-6 left-0 right-0 z-20 flex justify-between px-4 lg:px-6 pointer-events-none">
              <div className="pointer-events-auto bg-black/60 backdrop-blur px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                 {clothing === 'formal' ? <Briefcase className="w-3 h-3 text-indigo-400" /> : <Shirt className="w-3 h-3 text-indigo-400" />}
                 <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider">{clothing}</span>
              </div>

              <div className="flex gap-1 bg-black/80 p-1.5 rounded-full backdrop-blur border border-white/10 pointer-events-auto shadow-xl">
                  <button 
                      onClick={handleUndo} 
                      disabled={historyIndex === 0 || isProcessingAI}
                      className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full disabled:opacity-30 transition-colors"
                  >
                      <Undo2 size={16} />
                  </button>
                  <div className="w-px bg-white/10 my-1"></div>
                  <button 
                      onClick={handleRedo} 
                      disabled={historyIndex === history.length - 1 || isProcessingAI}
                      className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full disabled:opacity-30 transition-colors"
                  >
                      <Redo2 size={16} />
                  </button>
              </div>
          </div>

          {/* Canvas Content */}
          <div className="flex-1 flex items-center justify-center p-4 lg:p-10 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
              <div className="relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-lg overflow-hidden w-full h-full flex items-center justify-center">
                  <img 
                      src={currentImage} 
                      alt="Edited" 
                      className="max-w-full max-h-full object-contain"
                      style={{ filter: filterString }}
                  />
                  {isProcessingAI && (
                      <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 backdrop-blur-[2px]">
                          <div className="flex flex-col items-center text-indigo-500">
                              <div className="w-12 h-12 border-2 border-indigo-900 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                              <span className="font-mono text-xs tracking-widest uppercase animate-pulse">Refinando Detalles</span>
                          </div>
                      </div>
                  )}
              </div>
          </div>
          
          {/* Bottom Actions (Desktop: Inside image, Mobile: Below image usually, but keeping inside for now for compactness) */}
          <div className="absolute bottom-4 lg:bottom-6 w-full flex justify-center pointer-events-none">
            <div className="flex gap-3 pointer-events-auto">
                  <button onClick={() => setSettings(DEFAULT_EDITOR_SETTINGS)} className="p-3 bg-black/50 hover:bg-red-900/80 border border-white/10 hover:border-red-500/50 rounded-full text-white transition-colors backdrop-blur-md shadow-lg">
                      <RotateCcw size={18} />
                  </button>
                  
                  <button onClick={handleDownload} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-full text-white text-xs lg:text-sm font-bold tracking-widest uppercase transition-all shadow-[0_0_30px_-5px_rgba(99,102,241,0.5)] hover:scale-105">
                      <Download size={16} /> <span className="hidden sm:inline">Descargar</span>
                  </button>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="w-full lg:w-[400px] bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl p-0 flex flex-col h-[500px] lg:h-full overflow-hidden order-2 lg:order-2">
          <div className="p-4 lg:p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h2 className="text-sm lg:text-lg font-light tracking-[0.2em] text-white uppercase">Estudio</h2>
              <button onClick={onReset} className="text-[10px] font-bold text-indigo-400 hover:text-white uppercase tracking-wider border-b border-transparent hover:border-white transition-all">
                  Nueva Sesión
              </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/5">
              <button 
                  onClick={() => setActiveTab('ai')}
                  className={`flex-1 py-3 lg:py-4 text-[10px] lg:text-xs font-bold tracking-widest uppercase flex items-center justify-center transition-all ${activeTab === 'ai' ? 'text-indigo-400 bg-indigo-500/10 border-b-2 border-indigo-500' : 'text-zinc-500 hover:text-white'}`}
              >
                  <Sparkles className="w-3 h-3 mr-2" /> AI Magic
              </button>
              <button 
                  onClick={() => setActiveTab('adjust')}
                  className={`flex-1 py-3 lg:py-4 text-[10px] lg:text-xs font-bold tracking-widest uppercase flex items-center justify-center transition-all ${activeTab === 'adjust' ? 'text-indigo-400 bg-indigo-500/10 border-b-2 border-indigo-500' : 'text-zinc-500 hover:text-white'}`}
              >
                  <Sliders className="w-3 h-3 mr-2" /> Ajustes
              </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar">
              {activeTab === 'adjust' ? (
              <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  {[
                      { icon: Sun, label: "Brillo", key: 'brightness', max: 200 },
                      { icon: Contrast, label: "Contraste", key: 'contrast', max: 200 },
                      { icon: Zap, label: "Saturación", key: 'saturate', max: 200 },
                      { icon: Palette, label: "Tono", key: 'hue', max: 360 },
                      { icon: Moon, label: "Sepia", key: 'sepia', max: 100 },
                      { icon: Droplet, label: "Blur", key: 'blur', max: 10, step: 0.5 },
                  ].map((item) => (
                      <div key={item.label} className="space-y-2 lg:space-y-3 group">
                          <div className="flex justify-between text-xs font-medium text-zinc-400 group-hover:text-indigo-300 transition-colors uppercase tracking-wider">
                              <span className="flex items-center"><item.icon className="w-3 h-3 mr-2" /> {item.label}</span>
                              <span className="font-mono text-indigo-400">{settings[item.key as keyof EditorSettings]}</span>
                          </div>
                          <input 
                              type="range" 
                              min="0" 
                              max={item.max} 
                              step={item.step || 1}
                              value={settings[item.key as keyof EditorSettings]} 
                              onChange={(e) => handleSettingChange(item.key as keyof EditorSettings, Number(e.target.value))}
                              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 touch-action-manipulation"
                          />
                      </div>
                  ))}
              </div>
              ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300 flex flex-col h-full">
                  
                  {aiError && (
                  <div className="bg-red-900/20 border border-red-500/30 text-red-300 text-xs p-3 mb-2 font-mono rounded">
                      > ERROR: {aiError}
                  </div>
                  )}

                  {/* Custom Prompt */}
                  <div className="relative group">
                      <label className="block text-[10px] font-bold text-zinc-500 mb-2 tracking-widest uppercase">Comando Manual</label>
                      <textarea
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          placeholder="Escribe tu instrucción... (Ej: Eliminar fondo)"
                          className="w-full bg-black/30 border border-white/10 group-hover:border-indigo-500/50 rounded-lg p-3 text-sm text-zinc-300 placeholder-zinc-600 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none h-24 lg:h-32 transition-colors"
                          disabled={isProcessingAI}
                      />
                      <button 
                          onClick={() => handleMagicFix(customPrompt)}
                          disabled={!customPrompt.trim() || isProcessingAI}
                          className="absolute bottom-3 right-3 p-2 bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-0 transition-all duration-300 shadow-lg rounded-md"
                      >
                          {isProcessingAI ? <RefreshCw className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
                      </button>
                  </div>
                  
                  {/* Suggestions */}
                  <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                          <label className="block text-[10px] font-bold text-zinc-500 tracking-widest uppercase">
                              Análisis IA
                          </label>
                          <button 
                              onClick={handleGetSuggestions}
                              disabled={loadingSuggestions}
                              className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center uppercase font-bold tracking-wider"
                          >
                              <Layers className={`w-3 h-3 mr-1 ${loadingSuggestions ? 'animate-spin' : ''}`} />
                              {suggestions.length > 0 ? 'Re-scan' : 'Escanear'}
                          </button>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2">
                          {loadingSuggestions && (
                              <div className="h-1 w-full bg-zinc-900 overflow-hidden rounded">
                                  <div className="h-full bg-indigo-500 animate-progress"></div>
                              </div>
                          )}
                          {!loadingSuggestions && suggestions.length === 0 && (
                              <div onClick={handleGetSuggestions} className="cursor-pointer border border-dashed border-white/10 hover:border-indigo-500/50 p-4 text-center rounded-lg">
                                  <span className="text-xs text-zinc-500">Iniciar escaneo de sugerencias...</span>
                              </div>
                          )}
                          {suggestions.map((sugg, idx) => (
                              <button
                                  key={idx}
                                  onClick={() => handleMagicFix(sugg)}
                                  disabled={isProcessingAI}
                                  className="text-left px-4 py-3 bg-zinc-900/50 hover:bg-indigo-900/20 border-l-2 border-transparent hover:border-indigo-500 text-xs text-zinc-400 hover:text-indigo-100 transition-all rounded-r-lg touch-action-manipulation"
                              >
                                  {sugg}
                              </button>
                          ))}
                      </div>
                  </div>
              </div>
              )}
          </div>
        </div>
      </div>

      {/* Bottom Slider for Styles */}
      <div className="w-full max-w-7xl animate-in slide-in-from-bottom-10 duration-1000 px-0 lg:px-4 mb-8 order-3">
         <div className="flex items-center gap-2 mb-4 px-4 lg:px-0">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">Cambiar Estilo ({clothing})</h3>
         </div>
         
         <div className="overflow-x-auto pb-4 custom-scrollbar px-4 lg:px-0">
            <div className="flex gap-3 lg:gap-4 w-max">
               <button
                  onClick={() => onSwitchStyle(STYLES_DATA.find(s => s.id === STYLES_DATA[0].id) || STYLES_DATA[0])} 
                  className="group w-28 h-36 lg:w-32 lg:h-40 flex-shrink-0 rounded-xl border-2 border-dashed border-indigo-500/30 hover:border-indigo-500 flex flex-col items-center justify-center transition-all"
               >
                  <RefreshCw className="w-6 h-6 lg:w-8 lg:h-8 text-indigo-500 mb-2 group-hover:rotate-180 transition-transform duration-700" />
                  <span className="text-[9px] lg:text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Reintentar</span>
               </button>

               {STYLES_DATA.map((style) => (
                 <button
                    key={style.id}
                    onClick={() => onSwitchStyle(style)}
                    className="group relative w-28 h-36 lg:w-32 lg:h-40 flex-shrink-0 rounded-xl overflow-hidden border border-white/10 hover:border-indigo-500 transition-all duration-300"
                 >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-60 group-hover:opacity-90 transition-opacity`}></div>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-2 lg:p-3 bg-gradient-to-t from-black/90 to-transparent flex flex-col items-center">
                        <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-black/50 border border-white/20 flex items-center justify-center mb-2 text-white group-hover:scale-110 transition-transform">
                           {getIcon(style.icon)}
                        </div>
                        <span className="text-[9px] lg:text-[10px] font-bold text-white uppercase tracking-wider text-center leading-tight">{style.name}</span>
                    </div>
                 </button>
               ))}
            </div>
         </div>
      </div>

    </div>
  );
};

export default Editor;
