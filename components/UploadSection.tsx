
import React from 'react';
import { X, Camera, Rocket, Sparkles, Zap } from 'lucide-react';
import { UploadedImages } from '../types';

interface UploadSectionProps {
  images: UploadedImages;
  setImages: React.Dispatch<React.SetStateAction<UploadedImages>>;
  onNext: () => void;
}

const MAX_IMAGES = 10;

const UploadSection: React.FC<UploadSectionProps> = ({ images, setImages, onNext }) => {
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const totalFiles = Math.min(files.length, MAX_IMAGES - images.length);

      for (let i = 0; i < totalFiles; i++) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const triggerUpload = () => {
    document.getElementById('multi-upload')?.click();
  };

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden rounded-3xl my-4">
      
      <style>
        {`
          @keyframes float-space {
            0% { transform: translate(0px, 0px) rotate(0deg); }
            50% { transform: translate(20px, -20px) rotate(5deg); }
            100% { transform: translate(0px, 0px) rotate(0deg); }
          }
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
          }
          @keyframes camera-flash {
            0% { opacity: 0; transform: scale(1); }
            10% { opacity: 1; transform: scale(1.5); }
            100% { opacity: 0; transform: scale(2); }
          }
          .animate-float-space { animation: float-space 10s ease-in-out infinite; }
          .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
          .group:hover .animate-flash-trigger { animation: camera-flash 0.6s ease-out forwards; }
        `}
      </style>

      {/* Background FX - Deep Space Theme */}
      <div className="absolute inset-0 bg-[#050508]">
        {/* Nebula Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-900/30 rounded-full blur-[120px] animate-float-space pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px] animate-float-space pointer-events-none mix-blend-screen" style={{ animationDelay: '-5s' }}></div>
        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Stars */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full blur-[1px] animate-twinkle"></div>
        <div className="absolute top-40 right-40 w-1.5 h-1.5 bg-blue-200 rounded-full blur-[1px] animate-twinkle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-purple-200 rounded-full blur-[1px] animate-twinkle" style={{ animationDelay: '2s' }}></div>
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/90 pointer-events-none"></div>
      </div>
      
      <div className="max-w-6xl w-full z-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4">
        
        <div className="text-center mb-12 max-w-4xl relative">
          {/* Fun Badge */}
          <div className="inline-flex items-center justify-center px-6 py-2 border border-indigo-500/30 bg-indigo-950/30 backdrop-blur-md rounded-full mb-8 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:scale-105 transition-transform cursor-default">
            <Rocket className="w-4 h-4 text-indigo-400 mr-2 animate-bounce" />
            <span className="text-indigo-200 text-xs font-bold tracking-widest uppercase">🚀 Despegamos en 3, 2, 1...</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-6 tracking-tighter leading-none drop-shadow-2xl">
            Tu Imagen.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">Evolucionada.</span>
          </h1>
          
          <p className="text-indigo-200/70 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto tracking-wide">
            Olvídate de las fotos aburridas. Sube tus selfies y déjanos llevar tu perfil a otra dimensión.
          </p>
        </div>

        {/* Grid Area */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 mb-12">
          
          {/* Camera Upload Button - Fun & Animated */}
          {images.length < MAX_IMAGES && (
            <div 
              onClick={triggerUpload}
              className="aspect-[3/4] relative overflow-hidden rounded-3xl border-2 border-dashed border-indigo-500/30 hover:border-indigo-400 bg-indigo-950/20 cursor-pointer transition-all duration-300 group flex flex-col items-center justify-center backdrop-blur-sm hover:shadow-[0_0_50px_-10px_rgba(99,102,241,0.4)] hover:-translate-y-2"
            >
               {/* The Flash Effect */}
               <div className="absolute inset-0 bg-white pointer-events-none opacity-0 animate-flash-trigger z-20 mix-blend-overlay"></div>

               {/* Animated Icon Container */}
               <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 shadow-lg group-hover:shadow-indigo-500/50 flex items-center justify-center mb-4 relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                 <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
                 <Camera className="w-10 h-10 text-white" />
                 {/* Lens Reflection */}
                 <div className="absolute top-4 right-4 w-4 h-4 bg-white/30 rounded-full blur-[2px]"></div>
               </div>
               
               <div className="text-center z-10 px-2">
                 <span className="block text-sm font-black text-indigo-200 group-hover:text-white uppercase tracking-wider mb-1 transition-colors">
                    ¡Sube tus Fotos!
                 </span>
                 <span className="block text-[10px] text-indigo-400/80 font-bold">
                   (CLICK AQUÍ)
                 </span>
               </div>
            </div>
          )}

          {/* Existing Images - Stylish Cards */}
          {images.map((src, idx) => (
            <div key={idx} className="relative group aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl transition-all duration-500 hover:border-purple-500/50 hover:shadow-purple-900/40 hover:rotate-1 hover:scale-105">
              <img src={src} alt={`Ref ${idx}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              <button 
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:rotate-90"
              >
                <X size={14} />
              </button>
              
              <div className="absolute bottom-3 left-0 right-0 text-center">
                  <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2 py-1 rounded-full text-white border border-white/10">
                    FOTO #{idx + 1}
                  </span>
              </div>
            </div>
          ))}
        </div>

        <input
          type="file"
          multiple
          accept="image/*"
          id="multi-upload"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Action Button - Loud & Proud */}
        <div className="flex justify-center pb-8">
          <button
            onClick={onNext}
            disabled={images.length === 0}
            className={`
              group relative px-10 py-6 overflow-hidden rounded-2xl transition-all duration-500
              ${images.length > 0 
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:scale-110 shadow-[0_0_40px_rgba(124,58,237,0.5)]' 
                : 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800'
              }
            `}
          >
            {images.length > 0 && (
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50 animate-pulse"></div>
            )}
            <span className={`relative flex items-center text-lg md:text-xl font-black tracking-widest uppercase ${images.length > 0 ? 'text-white' : ''}`}>
              {images.length > 0 ? <Sparkles className="w-6 h-6 mr-3 animate-spin-slow" /> : <Zap className="w-6 h-6 mr-3" />}
              {images.length > 0 ? "¡Hacer Magia Ahora!" : "Sube fotos para empezar"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
