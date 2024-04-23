const { ChromaClient } = require("chromadb");
const { OpenAIEmbeddingFunction } = require("chromadb");
require("dotenv").config();

const fs = require("fs/promises");

const { AZURE_PATH, API_KEY } = process.env;

class AzureEmbedding {
  async generate(texts) {
    let embeddings = [];
    const result = await fetch(AZURE_PATH, {
      method: "POST",
      body: JSON.stringify({
        input: texts,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "api-key": API_KEY,
      },
    })
      .then((response) => response.json())
      .then((json) => json.data);

    result?.map((element) => embeddings.push(element.embedding));
    return embeddings;
  }
}

(async function () {
  const client = new ChromaClient();
  const embedder = new AzureEmbedding();
  const collection = await client.getOrCreateCollection({
    name: "profanity_collection",
    embeddingFunction: embedder,
  });

    let jsonData = await fs
      .readFile("model-training/data/swear.json")
      .then((response) => JSON.parse(response));

    let ids = [];
    let metadatas = [];
    let documents = [];

    let count = 0;
    for (const [key, value] of Object.entries(jsonData)) {
      value?.map((data) => {
        ids.push(`id${count}`);
        metadatas.push({ language: key });
        documents.push(data);
        count++;
      });
    }

    await collection.add({
      ids: ids,
      metadatas: metadatas,
      documents: documents,
    });

  const data = await collection.get({
      include: ["embeddings", "documents"]
  })
  console.log(data)
  console.log("Embedding caricati correttamente sul db")
})();
