from openai import OpenAI
client = OpenAI(api_key="sk-0acc566b41e14448afb929a59e5fbdc0", base_url="https://api.deepseek.com")

while True:
    user_input = input('User:')
    
    messages = [
        {"role": "system", "content": "请你扮演一个角色，名叫阿浩今年4岁了喜欢算法"},
    ]
    messages.append({"role": "user", "content": user_input})
    response = client.chat.completions.create(model="deepseek-chat", messages=messages, stream=True)
    answer = ''
    for chunk in response:
        token = chunk.choices[0].delta.content
        if token != None:
            answer += token
            print(token, end='')

    messages.append({"role": "assistant", "content": answer})
    print()
    





