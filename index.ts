import { DOMParser } from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';

interface PromiseFulfilledResult<T> {
  status: "fulfilled";
  value: T;
}

interface PromiseRejectedResult {
  status: "rejected";
  reason: any;
}

type PromiseSettledResult<T> = PromiseFulfilledResult<T> | PromiseRejectedResult;

const articles = ["der", "die", "das"];

const urlScheme = (article: string, word: string) => `https://der-artikel.de/${article}/${word}.html`

const headerAccessor = ".masthead";
const wordAccessor = ".mb-1";
const articleAccessor = `${wordAccessor} > span`;

const transformDocument = (html: string): any => new DOMParser().parseFromString(html, 'text/html');

const createAllUrls = (word: string) => articles.map((article: string) => urlScheme(article, word));

const createAllRequests = (urls: string[]) => urls.map((url: string) => fetch(url));

const transformBody = async (response: Response) => response.text();

const onlySuccessfulRequests = (result: PromiseSettledResult<Response>) => result.status === "fulfilled" && result.value.status === 200;

const mapResponseValues = (result: PromiseSettledResult<Response>) => {
  const res = <PromiseFulfilledResult<Response>>result;
  
  return res.value;
}

const fetchWord = async (word: string) => {
  const results = await Promise.allSettled(createAllRequests(createAllUrls(word)));
  const onlySuccessful: Response[] = results
    .filter(onlySuccessfulRequests)
    .map(mapResponseValues);
  const transformedResults: string[] = await Promise.all(onlySuccessful.map((res: Response) => transformBody(res)));
  
  return transformedResults;
}

const extractHeader = (doc: any): [string, string] => {
  const header = doc.querySelector(headerAccessor);

  const word = header.querySelector(wordAccessor).textContent?.trim();
  const article = header.querySelector(articleAccessor).textContent;
  
  const parsedWord = word.replace(article, "").trim()

  return [article, parsedWord];
  
}

const wordArg = Deno.args[0];

try {
  const [doc] = await fetchWord(wordArg);

  const [article, word] = extractHeader(transformDocument(doc))

  console.log([`Article: ${article}`, `Word: ${word}`,`${article} ${word}`].join("\n"));
  
} catch (error) {
  console.error("Error happened!", error);
}