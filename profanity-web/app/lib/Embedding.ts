import { IEmbeddingFunction } from "chromadb";
import { AzureResponse, AzureData } from "../structure/api/AzureStructure";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HttpsProxyAgent } from "https-proxy-agent";
import fetch from "node-fetch";


const semanticSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 25,
  separators: [" "],
  chunkOverlap: 8,
});

const agent = new HttpsProxyAgent("http://proxy:3128");

const { AZURE_PATH, API_KEY, USE_PROXY } = process.env;

export class AzureEmbedding implements IEmbeddingFunction {
  async generate(texts: string[]) {
    let embeddings: number[][] = [];

    const result = await fetch(AZURE_PATH!, { 
      agent: USE_PROXY ? agent : undefined,
      method: "POST",
      body: JSON.stringify({
        input: texts,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "api-key": API_KEY!,
      },
    })
      .then((response) => response.json())
      .then((json: AzureResponse) => json.data);

    result?.map((element: AzureData) => embeddings.push(element.embedding));
    return embeddings;
  }
}

//Took from https://github.com/joschan21/profanity.dev/blob/c2c164b3f1714be50830a158993e0e95a37236f9/vector-api/src/index.ts#L136
export function splitTextIntoWords(text: string): string[] {
  return text.split(' ');
}

//Took from https://github.com/joschan21/profanity.dev/blob/c2c164b3f1714be50830a158993e0e95a37236f9/vector-api/src/index.ts#L140
export async function splitTextIntoSemantics(text: string): Promise<string[]> {
  if (text.split(/\s/).length === 1) return []; // no semantics for single words
  const documents = await semanticSplitter.createDocuments([text]);
  const chunks = documents.map((chunk) => chunk.pageContent);
  return chunks;
}