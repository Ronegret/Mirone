
import React, { useState } from 'react';
import { AppStep, UploadedImages, ImageStyle, ClothingOption } from './types';
import UploadSection from './components/UploadSection';
import StyleSelector from './components/StyleSelector';
import Editor from './components/Editor';
import { generateProfilePicture } from './services/geminiService';
import { Loader2, AlertCircle, Aperture } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.UPLOAD);
  const [images, setImages] = useState<UploadedImages>([]); 
  const [clothing, setClothing] = useState<ClothingOption>('casual');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStyleSelect = async (style: ImageStyle, selectedClothing?: ClothingOption) => {
    setStep(AppStep.GENERATING);
    setError(null);
    
    // Update clothing state if passed (from selector) or keep existing (from editor)
    const activeClothing = selectedClothing || clothing;
    if (selectedClothing) setClothing(selectedClothing);

    try {
      if (images.length === 0) throw new Error("Debes subir al menos una foto");
      
      const attirePrompt = activeClothing === 'formal' ? style.formalAttire : style.casualAttire;
      const result = await generateProfilePicture(images, style.basePrompt, attirePrompt);
      
      setGeneratedImage(result);
      setStep(AppStep.EDITOR);
    } catch (err) {
      console.error(err);
      setError("Hubo un error generando tu imagen. La IA puede estar saturada o la imagen es muy compleja.");
      setStep(AppStep.STYLE_SELECT);
    }
  };

  const handleReset = () => {
    setStep(AppStep.UPLOAD);
    setImages([]);
    setGeneratedImage(null);
    setError(null);
    setClothing('casual');
  };

  return (
    <div className="min-h-screen bg-[#050508] text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      
      {/* Global Ambient Background - Space Theme */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px] animate-pulse mix-blend-screen"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[900px] h-[900px] bg-indigo-900/10 rounded-full blur-[120px] mix-blend-screen"></div>
         <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px]"></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      </div>

      {/* Header */}
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-center relative">
          
          <div className="flex flex-col items-center justify-center group cursor-default">
            <div className="flex items-center gap-3">
              <Aperture className="w-6 h-6 text-indigo-500 transition-transform group-hover:rotate-90 duration-700" />
              <span className="font-light text-2xl tracking-[0.3em] text-white uppercase">Mirone</span>
            </div>
            <div className="w-8 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 mt-2 group-hover:w-24 transition-all duration-500 rounded-full"></div>
          </div>

          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex items-center text-[10px] text-indigo-300/50 font-bold tracking-widest uppercase">
             <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
             System Online
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center w-full pt-8 pb-20 px-4 relative z-10">
        
        {step === AppStep.UPLOAD && (
          <UploadSection 
            images={images} 
            setImages={setImages} 
            onNext={() => setStep(AppStep.STYLE_SELECT)} 
          />
        )}

        {step === AppStep.STYLE_SELECT && (
          <div className="w-full flex flex-col items-center">
            {error && (
              <div className="max-w-2xl w-full mb-8 bg-red-900/20 border border-red-500/30 text-red-200 p-4 rounded-xl flex items-center animate-in fade-in slide-in-from-top-4 backdrop-blur-sm">
                <AlertCircle className="w-5 h-5 mr-3 shrink-0 text-red-400" />
                {error}
              </div>
            )}
            <StyleSelector 
              onSelectStyle={handleStyleSelect} 
              onBack={() => setStep(AppStep.UPLOAD)} 
            />
          </div>
        )}

        {step === AppStep.GENERATING && (
          <div className="text-center animate-in fade-in duration-700 flex flex-col items-center justify-center h-[60vh]">
            <div className="relative w-48 h-48 mb-12">
               <div className="absolute inset-0 border-2 border-indigo-900/30 rounded-full"></div>
               <div className="absolute inset-0 border-2 border-transparent border-t-indigo-500 rounded-full animate-spin duration-[2s]"></div>
               <div className="absolute inset-4 border-2 border-transparent border-l-purple-500/50 rounded-full animate-spin duration-[3s] direction-reverse"></div>
               <div className="absolute inset-0 flex items-center justify-center flex-col">
                 <span className="text-indigo-400 font-light tracking-widest text-sm animate-pulse mb-1">AI PROCESSING</span>
                 <span className="text-[10px] text-indigo-600 font-bold tracking-wider">{clothing === 'formal' ? 'FORMAL MODE' : 'CASUAL MODE'}</span>
               </div>
            </div>
            <h2 className="text-4xl font-thin text-white mb-4 tracking-tight">Construyendo Realidad</h2>
            <p className="text-indigo-200/50 max-w-md mx-auto font-light text-lg">
              La inteligencia artificial está re-imaginando tu perfil con estética {clothing === 'formal' ? 'formal' : 'casual'}.
            </p>
          </div>
        )}

        {step === AppStep.EDITOR && generatedImage && (
          <Editor 
            originalImage={generatedImage} 
            onReset={handleReset}
            onSwitchStyle={(style) => handleStyleSelect(style)}
            clothing={clothing}
          />
        )}

      </main>
    </div>
  );
};

export default App;
