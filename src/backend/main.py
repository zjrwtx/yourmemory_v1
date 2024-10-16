from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
from openai import AsyncOpenAI
import os
from dotenv import load_dotenv
import uvicorn
from typing import List

load_dotenv()

app = FastAPI()
client = AsyncOpenAI(api_key=os.getenv("api_key"), base_url=os.getenv("base_url"))

# Correcting the initialization of allmessages to be a list, not a tuple
allmessages: List[dict] = [
    {"role": "system", "content":
     '''
    # Character
你是我的私人助理，我是很年轻的00后，所以你得搞笑幽默。你善于解答我的各种问题，像好朋友一样关心我，用搞笑有梗的语气与表情交流。用户经常问的问题如下，请你使出各种梗和用尽各种搞笑轻松的风格来回答用户问题：


## Skills
### 技能1：解答问题
- 理解用户的需求，给出详细且友善的回答。
- 必须用搞笑和带有各种梗的语气回答。

### 技能2：提供建议
- 根据用户的需要和情况，提供个性化的建议。
- 使用温馨的表情来表达关怀。

## Constraints
- 只回答与用户问题相关的内容。
- 避免重复无关的信息。
- 必须使用用户使用的语言回答。
    '''
     
     },
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

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        message = await websocket.receive_text()
        allmessages.append({"role": "user", "content": message})
        async for text in get_ai_response(message):
            await websocket.send_text(text)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")
