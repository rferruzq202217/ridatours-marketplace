import { translateBatch } from './translate';

// Extraer todos los textos de un nodo rich text
function extractTextsFromRichText(node: any, texts: string[]): void {
  if (!node) return;
  
  if (node.type === 'text' && node.text) {
    texts.push(node.text);
  }
  
  if (node.children) {
    for (const child of node.children) {
      extractTextsFromRichText(child, texts);
    }
  }
  
  if (node.root?.children) {
    for (const child of node.root.children) {
      extractTextsFromRichText(child, texts);
    }
  }
}

// Reconstruir rich text con textos traducidos
function rebuildRichText(node: any, translatedTexts: string[], index: { current: number }): any {
  if (!node) return node;
  
  if (node.type === 'text' && node.text) {
    return { ...node, text: translatedTexts[index.current++] || node.text };
  }
  
  const result = { ...node };
  
  if (node.children) {
    result.children = node.children.map((child: any) => 
      rebuildRichText(child, translatedTexts, index)
    );
  }
  
  if (node.root?.children) {
    result.root = {
      ...node.root,
      children: node.root.children.map((child: any) => 
        rebuildRichText(child, translatedTexts, index)
      )
    };
  }
  
  return result;
}

export async function translateGuiaFull(guia: any, targetLang: string): Promise<any> {
  if (targetLang === 'es' || !guia) return guia;
  
  const textsToTranslate: string[] = [];
  const textMap: { path: string; startIndex: number; count: number }[] = [];
  
  // 1. Título
  if (guia.title) {
    textMap.push({ path: 'title', startIndex: textsToTranslate.length, count: 1 });
    textsToTranslate.push(String(guia.title || ""));
  }
  
  // 2. Hero intro
  if (guia.hero?.richText) {
    const heroTexts: string[] = [];
    extractTextsFromRichText(guia.hero.richText, heroTexts);
    if (heroTexts.length > 0) {
      textMap.push({ path: 'hero.richText', startIndex: textsToTranslate.length, count: heroTexts.length });
      textsToTranslate.push(...heroTexts);
    }
  }
  
  // 3. Layout blocks
  if (guia.layout) {
    for (let i = 0; i < guia.layout.length; i++) {
      const block = guia.layout[i];
      
      if (block.blockType === 'alertaConfianza') {
        if (block.titulo) {
          textMap.push({ path: `layout.${i}.titulo`, startIndex: textsToTranslate.length, count: 1 });
          textsToTranslate.push(String(block.titulo || ""));
        }
        if (block.mensaje) {
          textMap.push({ path: `layout.${i}.mensaje`, startIndex: textsToTranslate.length, count: 1 });
          textsToTranslate.push(String(block.mensaje || ""));
        }
      }
      
      if (block.blockType === 'tablaConversion' && block.opciones) {
        for (let j = 0; j < block.opciones.length; j++) {
          const opcion = block.opciones[j];
          if (opcion.titulo) {
            textMap.push({ path: `layout.${i}.opciones.${j}.titulo`, startIndex: textsToTranslate.length, count: 1 });
            textsToTranslate.push(String(opcion.titulo || ""));
          }
          if (opcion.descripcion) {
            textMap.push({ path: `layout.${i}.opciones.${j}.descripcion`, startIndex: textsToTranslate.length, count: 1 });
            textsToTranslate.push(String(opcion.descripcion || ""));
          }
          if (opcion.cta) {
            textMap.push({ path: `layout.${i}.opciones.${j}.cta`, startIndex: textsToTranslate.length, count: 1 });
            textsToTranslate.push(String(opcion.cta || ""));
          }
        }
      }
      
      if (block.blockType === 'content' && block.columns) {
        for (let j = 0; j < block.columns.length; j++) {
          if (block.columns[j].richText) {
            const contentTexts: string[] = [];
            extractTextsFromRichText(block.columns[j].richText, contentTexts);
            if (contentTexts.length > 0) {
              textMap.push({ path: `layout.${i}.columns.${j}.richText`, startIndex: textsToTranslate.length, count: contentTexts.length });
              textsToTranslate.push(...contentTexts);
            }
          }
        }
      }
      
      if (block.blockType === 'faq' && block.preguntas) {
        for (let j = 0; j < block.preguntas.length; j++) {
          if (block.preguntas[j].pregunta) {
            textMap.push({ path: `layout.${i}.preguntas.${j}.pregunta`, startIndex: textsToTranslate.length, count: 1 });
            textsToTranslate.push(String(block.preguntas[j].pregunta || ""));
          }
          if (block.preguntas[j].respuesta) {
            textMap.push({ path: `layout.${i}.preguntas.${j}.respuesta`, startIndex: textsToTranslate.length, count: 1 });
            textsToTranslate.push(String(block.preguntas[j].respuesta || ""));
          }
        }
      }
      
      if (block.blockType === 'botonCTA') {
        if (block.texto) {
          textMap.push({ path: `layout.${i}.texto`, startIndex: textsToTranslate.length, count: 1 });
          textsToTranslate.push(String(block.texto || ""));
        }
      }
    }
  }
  
  // Traducir todo en batch
  if (textsToTranslate.length === 0) return guia;
  
  console.log(`🌐 Translating ${textsToTranslate.length} texts to ${targetLang}`);
  const translated = await translateBatch(textsToTranslate, targetLang);
  
  // Reconstruir guía con traducciones
  const result = JSON.parse(JSON.stringify(guia));
  
  for (const mapping of textMap) {
    const parts = mapping.path.split('.');
    let target = result;
    
    for (let i = 0; i < parts.length - 1; i++) {
      target = target[parts[i]];
    }
    
    const lastKey = parts[parts.length - 1];
    
    if (lastKey === 'richText') {
      // Rebuild rich text
      const richTextTexts = translated.slice(mapping.startIndex, mapping.startIndex + mapping.count);
      target[lastKey] = rebuildRichText(target[lastKey], richTextTexts, { current: 0 });
    } else {
      target[lastKey] = translated[mapping.startIndex] || target[lastKey];
    }
  }
  
  return result;
}
