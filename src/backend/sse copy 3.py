from fastapi import FastAPI, WebSocket, Depends
from fastapi.responses import HTMLResponse
from openai import AsyncOpenAI
import os
from dotenv import load_dotenv
import uvicorn
from typing import List
from sqlalchemy import Column, Integer, String, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.future import select

load_dotenv()

app = FastAPI()
client = AsyncOpenAI(api_key=os.getenv("api_key"), base_url=os.getenv("base_url"))

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_async_engine(DATABASE_URL, future=True, echo=True)
async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

Base = declarative_base()

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String(10))
    content = Column(Text)

async def save_message(db: AsyncSession, role: str, content: str):
    message = Message(role=role, content=content)
    db.add(message)
    await db.commit()
    await db.refresh(message)
    return message

allmessages: List[dict] = [
    {"role": "system", "content": "你是一个记录用户即时状态和任务等内容的助手，可以更好地组织和分析用户的想法和感受，发现隐藏的模式和见解。这可以帮助用户减轻烦恼，找到解决问题的方法，并更好地管理用户的时间和任务。 特别重要一点就是要以亲切温柔可爱的语气与用户交流，就像是他们的很好的朋友一样，最后的输出结果也要分点分类整理，并且要包含用户输入的关键词。"},
]

async def get_ai_response(message: str):
    response = await client.chat.completions.create(
        model="deepseek-chat",
        messages=allmessages,
        stream=True,
    )
    all_content = ""
    async for chunk in response:
        content = chunk.choices[0].delta.content
        if content:
            all_content += content
            yield all_content

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    async with async_session() as session:
        while True:
            message = await websocket.receive_text()
            allmessages.append({"role": "user", "content": message})
            await save_message(session, "user", message)  # Save user message to the database
            async for text in get_ai_response(message):
                await websocket.send_text(text)
            #     await save_message(session, "assistant", allmessages)  # Save assistant response to the database

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")
