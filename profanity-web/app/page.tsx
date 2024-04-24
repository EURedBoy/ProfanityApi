"use client";
import { ChromaClient } from "chromadb";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";

import positivePoint from "./img/positive.jpeg";
import negativePoint from "./img/negative.png";

export default function Home() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState<{ text: string; image: StaticImageData }>();

  const checkProfanity = async (e: any) => {
    setText("");

    const result = await fetch("/api/profanity", {
      method: "POST",
      body: JSON.stringify({
        message: text,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((res) => res.json());

    setResponse(
      result.isSwear
        ? { text: "E' una parolaccia", image: negativePoint }
        : { text: "Non è una parolaccia", image: positivePoint }
    );
  };

  return (
    <main className="flex min-h-screen flex-col mt-20 items-center p-24">
      <h1 className="font-semibold font-roboto text-7xl p-3 bg-gradient-to-r from-blue-600 to-blue-900 text-transparent bg-clip-text">
        Profanity Api
      </h1>
      <div className="input-wrapper mt-3 w-6/12 flex ">
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={text}
          onChange={(e) => {
            setText(e.currentTarget.value);
          }}
          placeholder="Inserisci una frase"
        ></input>
        <button
          className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 ms-3 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={checkProfanity}
        >
          Invia
        </button>
      </div>
      <div className=" w-6/12 bg-gray-600/60 mt-3 rounded-md h-20 flex justify-evenly items-center">
        <p className="font-roboto">{response?.text}</p>
        {response && (
          <Image src={response?.image!} height={70} alt="response image"></Image>
        )}
      </div>
    </main>
  );
}
