# Bloo

Bloo is a RAG app with chat feature (supporting image upload) to answer recycling questions, using knowledge from NEA items and web search (Tavily). Function is similar to ChatGPT where user can upload image and the app answers the user's question based on database information, online website(s), and fall back to ChatGPT should it be unable to answer user's question.

## Chat Feature
Chat demo


https://github.com/user-attachments/assets/f3d87ced-1d0b-4172-af45-b8ea5a6a3058






## Chat architecture
![chat-architecture](https://github.com/user-attachments/assets/cd0a8ea0-1615-46e8-b6c3-07a177f8076a)


## Technologies
- React + Next: Full stack javascript framework
- Langgraph: Model RAG workflow that involve cycles e.g. checking if retrieved docs are relevant.
- FastAPI: Backend API endpoints
- Cloud firestore: Storage of recyclable item data
- Typesense: Support hybrid search (FTS + vector search) on cloud firestore database
- Google Cloud Run: Serverless deployment of backend API
- OpenAI: Embedding models + Chat models

<a href="https://mightymagnus.notion.site/Bloo-API-Documentation-d9fd5834240346b9acc5274b0112e8d5" target="_blank">Further documentation in Notion</a>


