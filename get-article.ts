import { extractHeader, fetchWord } from "./lib";

export default (transformDocument: (string) => any) => async (wordInput: string): Promise<[string, string]> => {
  const [doc] = await fetchWord(wordInput);

  return extractHeader(transformDocument(doc))
}