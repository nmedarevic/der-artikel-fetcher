import { DOMParser } from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';
import { extractHeader, fetchWord } from './lib.ts';

export const transformDocument = (html: string): any => new DOMParser().parseFromString(html, 'text/html');

const main = async () => {
  const wordArg = Deno.args[0];

  try {
    const [doc] = await fetchWord(wordArg);
  
    const [article, word] = extractHeader(transformDocument(doc))
  
    console.log([`Article: ${article}`, `Word: ${word}`,`${article} ${word}`].join("\n"));
    
  } catch (error) {
    console.error("Error happened!", error);
  }
}

main();