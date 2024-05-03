//import { embedding } from "@/app/database/chromaEmbedding";
import { chromaCollection } from "@/app/database/chromaEmbedding";
import {
  splitTextIntoSemantics,
  splitTextIntoWords,
} from "@/app/lib/Embedding";
import { NextResponse } from "next/server";

const WHITELISTED = ["nero", "black"];

export async function GET(request: Request) {
  return new Response(JSON.stringify({ text: "ciao" }));
}

export async function POST(request: Request) {
  const body = await request.json();
  let { message } = body as { message: string };

  if (!message) return error("Empty text");

  //Filter message using whitelisted word
  message = message
    .toLowerCase()
    .split(" ")
    .filter((word: string) => !WHITELISTED.includes(word))
    .join(" ");

  const flagSet = new Set<{ distance: number; document: string }>();

  await Promise.all([
    splitTextIntoSemantics(message).then(async (chunks) => {
      if (!chunks || chunks.length == 0) return;

      const result = await chromaCollection.query({
        nResults: 1,
        queryTexts: chunks,
      });

      for (let [index, chunkDistance] of result!.distances?.entries()!) {
        flagSet.add({
          distance: chunkDistance[0],
          document: result.documents[index][0]!,
        });
      }
    }),
    (async () => {
      const result = await chromaCollection.query({
        nResults: 1,
        queryTexts: splitTextIntoWords(message),
      });

      if (!result.distances) return;
      for (let [index, wordDistance] of result!.distances?.entries()!) {
        flagSet.add({
          distance: wordDistance[0],
          document: result.documents[index][0]!,
        });
      }
    })(),
  ]);

  // const result = await chromaCollection.query({
  //   nResults: 1,
  //   queryTexts: message,
  // });

  const flagSorted = Array.from(flagSet).sort(
    (a, b) => a.distance - b.distance
  );

  if (!flagSorted || flagSorted.length == 0)
    return error("No flag, contact an administrator");

  let swear: boolean = flagSorted[0] && flagSorted[0].distance < 0.247;

  return NextResponse.json({
    message: message,
    distance: flagSorted[0].distance,
    isSwear: swear,
  });
}

const error = (message: string): NextResponse => {
  return NextResponse.json({ error: message });
};
