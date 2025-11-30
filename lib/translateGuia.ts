import { translateBatch } from './translate';

function extractTextsFromRichText(node: any, texts: string[]): void {
  if (!node) return;
  if (node.type === 'text' && node.text) {
    texts.push(String(node.text));
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

function rebuildRichText(node: any, translatedTexts: string[], index: { current: number }): any {
  if (!node) return node;
  if (node.type === 'text' && node.text) {
    const translated = translatedTexts[index.current++];
    return { ...node, text: translated !== undefined ? translated : node.text };
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
  
  try {
    const textsToTranslate: string[] = [];
    const textMap: { path: string; startIndex: number; count: number }[] = [];
    
    // 1. Título
    if (guia.title) {
      textMap.push({ path: 'title', startIndex: textsToTranslate.length, count: 1 });
      textsToTranslate.push(String(guia.title));
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
            textsToTranslate.push(String(block.titulo));
          }
          if (block.mensaje) {
            textMap.push({ path: `layout.${i}.mensaje`, startIndex: textsToTranslate.length, count: 1 });
            textsToTranslate.push(String(block.mensaje));
          }
        }
        
        if (block.blockType === 'tablaConversion' && block.productos) {
          for (let j = 0; j < block.productos.length; j++) {
            const prod = block.productos[j];
            if (prod.nombre) {
              textMap.push({ path: `layout.${i}.productos.${j}.nombre`, startIndex: textsToTranslate.length, count: 1 });
              textsToTranslate.push(String(prod.nombre));
            }
            if (prod.descripcionCorta) {
              textMap.push({ path: `layout.${i}.productos.${j}.descripcionCorta`, startIndex: textsToTranslate.length, count: 1 });
              textsToTranslate.push(String(prod.descripcionCorta));
            }
            if (prod.textoCTA) {
              textMap.push({ path: `layout.${i}.productos.${j}.textoCTA`, startIndex: textsToTranslate.length, count: 1 });
              textsToTranslate.push(String(prod.textoCTA));
            }
            if (prod.etiquetaDestacado) {
              textMap.push({ path: `layout.${i}.productos.${j}.etiquetaDestacado`, startIndex: textsToTranslate.length, count: 1 });
              textsToTranslate.push(String(prod.etiquetaDestacado));
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
          if (block.titulo) {
            textMap.push({ path: `layout.${i}.titulo`, startIndex: textsToTranslate.length, count: 1 });
            textsToTranslate.push(String(block.titulo));
          }
          for (let j = 0; j < block.preguntas.length; j++) {
            if (block.preguntas[j].pregunta) {
              textMap.push({ path: `layout.${i}.preguntas.${j}.pregunta`, startIndex: textsToTranslate.length, count: 1 });
              textsToTranslate.push(String(block.preguntas[j].pregunta));
            }
            if (block.preguntas[j].respuesta) {
              const respTexts: string[] = [];
              extractTextsFromRichText(block.preguntas[j].respuesta, respTexts);
              if (respTexts.length > 0) {
                textMap.push({ path: `layout.${i}.preguntas.${j}.respuesta`, startIndex: textsToTranslate.length, count: respTexts.length });
                textsToTranslate.push(...respTexts);
              }
            }
          }
        }
        
        if (block.blockType === 'botonCTA') {
          if (block.texto) {
            textMap.push({ path: `layout.${i}.texto`, startIndex: textsToTranslate.length, count: 1 });
            textsToTranslate.push(String(block.texto));
          }
        }
      }
    }
    
    if (textsToTranslate.length === 0) return guia;
    
    console.log(`🌐 Translating ${textsToTranslate.length} texts to ${targetLang}`);
    const translated = await translateBatch(textsToTranslate, targetLang);
    
    if (!translated || translated.length === 0) {
      console.log('⚠️ Translation returned empty, using original');
      return guia;
    }
    
    const result = JSON.parse(JSON.stringify(guia));
    
    for (const mapping of textMap) {
      const parts = mapping.path.split('.');
      let target = result;
      
      for (let i = 0; i < parts.length - 1; i++) {
        if (target[parts[i]] === undefined) break;
        target = target[parts[i]];
      }
      
      const lastKey = parts[parts.length - 1];
      
      if (target && target[lastKey] !== undefined) {
        if (lastKey === 'richText' || lastKey === 'respuesta') {
          const richTextTexts = translated.slice(mapping.startIndex, mapping.startIndex + mapping.count);
          target[lastKey] = rebuildRichText(target[lastKey], richTextTexts, { current: 0 });
        } else {
          const translatedText = translated[mapping.startIndex];
          if (translatedText !== undefined) {
            target[lastKey] = translatedText;
          }
        }
      }
    }
    
    return result;
  } catch (error) {
    console.error('❌ Translation error:', error);
    return guia;
  }
}
