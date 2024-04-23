import { AzureEmbedding } from "../lib/Embedding";
import { ChromaClient, DefaultEmbeddingFunction } from "chromadb";

const client = new ChromaClient();
const embedding = new AzureEmbedding();

const chromaCollection = await client.getOrCreateCollection({
  name: "profanity_collection",
  embeddingFunction: new AzureEmbedding()
});

export { chromaCollection };
