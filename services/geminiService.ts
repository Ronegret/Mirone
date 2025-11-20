
import { GoogleGenAI, Modality } from "@google/genai";
import { ClothingOption } from "../types";

const API_KEY = process.env.API_KEY || '';

// Initialize the client
const ai = new GoogleGenAI({ apiKey: API_KEY });

const UNIVERSAL_ADJUSTMENT_PROMPT = `
  Aplicar opciones de mejora técnica: 
  - Suavizar piel ligeramente manteniendo textura realista.
  - Corrección de ojos rojos y brillo en la mirada.
  - Ajuste de sonrisa y expresión natural.
  - Perfilar rostro de forma natural.
  - Control perfecto de tonalidades (brillo, contraste, saturación, temperatura).
  - Borrador mágico para eliminar imperfecciones o distracciones del fondo.
  
  CRÍTICO:
  - MANTENER LA IDENTIDAD DE LA PERSONA EXACTA.
  - SI TIENE PENDIENTES, ARETES, COLLARES O GAFAS, MANTENERLOS.
`;

export const generateProfilePicture = async (
  referenceImages: string[],
  basePrompt: string,
  attirePrompt: string
): Promise<string> => {
  
  if (referenceImages.length === 0) {
    throw new Error("No reference images provided");
  }

  try {
    // Create image parts for all uploaded photos
    const imageParts = referenceImages.map(img => ({
      inlineData: {
        data: img.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, ''),
        mimeType: 'image/png', 
      },
    }));

    const fullPrompt = `
      ACTÚA COMO UN FOTÓGRAFO PROFESIONAL Y EDITOR DE IA.
      
      Analiza estas imágenes de referencia.
      Genera un RETRATO NUEVO basado en esta descripción de ESTILO:
      "${basePrompt}"
      
      VESTIMENTA REQUERIDA:
      "${attirePrompt}"
      
      INSTRUCCIONES GLOBALES:
      ${UNIVERSAL_ADJUSTMENT_PROMPT}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          ...imageParts,
          { text: fullPrompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData && part.inlineData.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

export const magicEditImage = async (
  currentImage: string,
  instruction: string
): Promise<string> => {
  const cleanBase64 = currentImage.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/png',
            },
          },
          {
            text: `Edita esta imagen siguiendo esta instrucción: "${instruction}". CRÍTICO: Mantén los pendientes/aretes y rasgos de la persona intactos. ${UNIVERSAL_ADJUSTMENT_PROMPT}`,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData && part.inlineData.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image generated from edit");
  } catch (error) {
    console.error("Gemini Edit Error:", error);
    throw error;
  }
};

export const getEditSuggestions = async (image: string): Promise<string[]> => {
  const cleanBase64 = image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { data: cleanBase64, mimeType: 'image/png' } },
          { text: "Analiza esta imagen. Genera un array JSON plano de 4 sugerencias breves en ESPAÑOL para mejorarla (ej: 'Corregir iluminación', 'Resaltar ojos', 'Suavizar piel', 'Fondo neutro'). Devuelve SOLO el JSON." }
        ]
      }
    });

    const text = response.text?.replace(/```json/g, '').replace(/```/g, '').trim();
    if (text) {
      return JSON.parse(text);
    }
    return ["Mejorar iluminación", "Resaltar detalles", "Aumentar contraste", "Fondo desenfocado"];
  } catch (e) {
    console.error("Error fetching suggestions", e);
    return ["Mejorar iluminación", "Resaltar detalles", "Aumentar contraste", "Fondo desenfocado"];
  }
};
