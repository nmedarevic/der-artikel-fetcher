export interface PromiseFulfilledResult<T> {
  status: "fulfilled";
  value: T;
}

export interface PromiseRejectedResult {
  status: "rejected";
  reason: any;
}

export type PromiseSettledResult<T> = PromiseFulfilledResult<T> | PromiseRejectedResult;

export const articles = ["der", "die", "das"];

export const urlScheme = (article: string, word: string) => `https://der-artikel.de/${article}/${word}.html`

export const headerAccessor = ".masthead";
export const wordAccessor = ".mb-1";
export const articleAccessor = `${wordAccessor} > span`;

export const createAllUrls = (word: string) => articles.map((article: string) => urlScheme(article, word));

export const createAllRequests = (urls: string[]) => urls.map((url: string) => fetch(url));

export const transformBody = async (response: Response) => response.text();

export const onlySuccessfulRequests = (result: PromiseSettledResult<Response>) => result.status === "fulfilled" && result.value.status === 200;

export const mapResponseValues = (result: PromiseSettledResult<Response>) => {
  const res = <PromiseFulfilledResult<Response>>result;
  
  return res.value;
}

export const fetchWord = async (word: string) => {
  const results = await Promise.allSettled(createAllRequests(createAllUrls(word)));
  const onlySuccessful: Response[] = results
    .filter(onlySuccessfulRequests)
    .map(mapResponseValues);
  const transformedResults: string[] = await Promise.all(onlySuccessful.map((res: Response) => transformBody(res)));
  
  return transformedResults;
}

export const extractHeader = (doc: any): [string, string] => {
  const header = doc.querySelector(headerAccessor);

  const word = header.querySelector(wordAccessor).textContent?.trim();
  const article = header.querySelector(articleAccessor).textContent;
  
  const parsedWord = word.replace(article, "").trim()

  return [article, parsedWord];
}