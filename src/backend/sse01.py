from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from openai import OpenAI
import asyncio
import json
from fastapi.middleware.cors import CORSMiddleware

import queue
from typing import List
client = OpenAI(api_key="sk-0acc566b41e14448afb929a59e5fbdc0", base_url="https://api.deepseek.com")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# from dotenv import load_dotenv
# import os

# load_dotenv()

# DATABASE_URL = os.getenv("DATABASE_URL")
# SECRET_KEY = os.getenv("SECRET_KEY")
messages: List[dict] = [{"role": "system", "content": "请你扮演一个角色，名叫阿浩今年4岁了喜欢算法"}]

@app.post("/chat")
async def chat(request: Request):
    body = await request.json()
    user_input = body.get("message")
    
    messages.append({"role": "user", "content": user_input})

    return {"status": "Message received"}

@app.get("/chat-stream")
async def chat_stream():
    response = client.chat.completions.create(model="deepseek-chat", messages=messages, stream=True)

    async def event_stream():
        answer = ''
        for chunk in response:
            token = chunk.choices[0].delta.content
            if token is not None:
                answer += token
                yield f"data: {json.dumps({'content': token})}\n\n"
        messages.append({"role": "assistant", "content": answer})

    return StreamingResponse(event_stream(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

