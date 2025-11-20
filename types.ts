
export enum AppStep {
  UPLOAD = 'UPLOAD',
  STYLE_SELECT = 'STYLE_SELECT',
  GENERATING = 'GENERATING',
  EDITOR = 'EDITOR'
}

export type UploadedImages = string[];

export type ClothingOption = 'casual' | 'formal';

export interface ImageStyle {
  id: string;
  name: string;
  basePrompt: string;
  casualAttire: string;
  formalAttire: string;
  description: string;
  icon: string;
  gradient: string;
}

export interface EditorSettings {
  brightness: number;
  contrast: number;
  saturate: number;
  sepia: number;
  grayscale: number;
  blur: number;
  hue: number;
}

export const DEFAULT_EDITOR_SETTINGS: EditorSettings = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  sepia: 0,
  grayscale: 0,
  blur: 0,
  hue: 0,
};

export const STYLES_DATA: ImageStyle[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn Pro',
    basePrompt: 'Generar un retrato profesional para LinkedIn. Iluminación suave estilo estudio, fondo neutro (gris, blanco o azul claro). Expresión segura y amigable. Alta nitidez. Retoque ligero y natural. Piel limpia sin exagerar. Foto con estética corporativa actual, perfecta para perfiles laborales.',
    casualAttire: 'vestimenta casual elegante (camisa o polera sobria)',
    formalAttire: 'vestimenta formal: camisa + blazer o ropa ejecutiva moderna',
    description: 'Corporativo, limpio y profesional.',
    icon: 'briefcase',
    gradient: 'from-blue-900 to-slate-900'
  },
  {
    id: 'instagram',
    name: 'Instagram Modern',
    basePrompt: 'Retrato moderno para Instagram. Colores vibrantes, luz suave y estética estética lifestyle. Fondo difuminado con tonos cálidos o pastel. Expresión relajada o divertida. Retoque suave y piel luminosa. Estética atractiva, juvenil y lista para redes sociales.',
    casualAttire: 'vestimenta casual moderna (streetwear, minimalista o moda actual)',
    formalAttire: 'vestimenta formal elegante pero moderna',
    description: 'Lifestyle, vibrante y juvenil.',
    icon: 'heart',
    gradient: 'from-fuchsia-600 to-orange-600'
  },
  {
    id: 'magazine',
    name: 'Revista Editorial',
    basePrompt: 'Transformar la imagen en un estilo revista profesional editorial. Iluminación fashion marcada, contraste alto, colores intensos. Fondos suaves tipo editorial. Piel con retoque profesional de alta calidad. Composición elegante. Estética inspirada en revistas como GQ, Vogue, Forbes.',
    casualAttire: 'vestimenta casual elegante de diseñador',
    formalAttire: 'look formal premium (blazer, traje, outfit elegante)',
    description: 'Fashion, alto contraste y lujo.',
    icon: 'layout',
    gradient: 'from-purple-900 to-pink-900'
  },
  {
    id: 'studio',
    name: 'Estudio Clásico',
    basePrompt: 'Retrato limpio de estudio fotográfico clásico. Fondo blanco o gris claro. Iluminación de 3 puntos, sombras suaves, enfoque nítido. Piel natural con corrección ligera. Expresión neutra o amigable. Resultado sobrio, claro y profesional.',
    casualAttire: 'vestimenta casual ordenado',
    formalAttire: 'vestimenta formal clásica',
    description: 'Fondo limpio, iluminación perfecta.',
    icon: 'camera',
    gradient: 'from-zinc-200 to-zinc-400'
  },
  {
    id: 'dark_modern',
    name: 'Moderno Oscuro',
    basePrompt: 'Retrato moderno oscuro con estética cinematográfica. Sombras profundas, contrastes marcados, tonos fríos o grisáceos. Iluminación lateral dramática. Fondo oscuro con textura suave. Expresión seria o elegante. Estilo artístico, elegante y de impacto visual alto.',
    casualAttire: 'vestimenta casual oscura',
    formalAttire: 'vestimenta formal estilo traje oscuro',
    description: 'Cinematográfico, elegante y serio.',
    icon: 'moon',
    gradient: 'from-black to-zinc-800'
  },
  {
    id: 'light_modern',
    name: 'Moderno Claro',
    basePrompt: 'Foto moderna clara y luminosa. Iluminación natural brillante, tonos suaves, estética clean. Fondos blancos, beige o pastel. Piel suave y luminosa sin exceso de retoque. Expresión tranquila. Estilo moderno, pulido y perfecto para redes sociales o branding personal.',
    casualAttire: 'vestimenta casual clara (blanco, beige, colores suaves)',
    formalAttire: 'vestimenta formal minimalista',
    description: 'Luminoso, suave y minimalista.',
    icon: 'sun',
    gradient: 'from-sky-100 to-indigo-100'
  }
];
