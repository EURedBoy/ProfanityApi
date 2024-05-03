# ProfanityApi

![GitHub all releases](https://img.shields.io/github/downloads/EURedBoy/ProfanityApi/total)
![GitHub](https://img.shields.io/github/license/EURedBoy/ProfanityApi)
![GitHub deployments](https://img.shields.io/github/deployments/EURedBoy/ProfanityApi/github-pages)
![GitHub repo size](https://img.shields.io/github/repo-size/EURedBoy/ProfanityApi)
![GitHub Repo stars](https://img.shields.io/github/stars/EURedBoy/ProfanityApi)

---

> [!NOTE]
> ### Environment variable:
> **AZURE_PATH**= `your azure path` <br>
> **API_KEY**= `your api key`
>  <br> 

## Overview
This project was created for fun inspired by [this project](https://github.com/joschan21/profanity.dev.git). It offers a web interface and a backend REST API for interacting with an embedding database to identify profanity within a sentence.

## How it works?
The system utilizes the API provided by [Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-services/openai/reference) to generate embeddings for common swear words, which are then uploaded to the [ChromaDB](https://www.trychroma.com/) database.<br>

Upon receiving input, the system breaks down the text into semantic sentences. These sentences are then processed through Azure OpenAI to generate embeddings. The system compares these embeddings with the values stored in the ChromaDB database. If the distance between the two 'points' is below a certain threshold, it identifies the sentence as containing profanity.