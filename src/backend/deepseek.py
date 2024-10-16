from flask import Flask, jsonify, request, Response
from openai import OpenAI
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # Allow all origins for CORS

client = OpenAI(api_key="sk-0acc566b41e14448afb929a59e5fbdc0", base_url="https://api.deepseek.com")

def generate_response(user_message):
    completion = client.chat.completions.create(
        model="deepseek-chat",
        messages=[{"role": "user", "content": user_message}],
        stream=True
    )
    
    for chunk in completion:
        content = chunk.choices[0].delta.content or ""
        if content:
            yield f"{content}"

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400
    
    return Response(generate_response(user_message), mimetype='text/event-stream')

if __name__ == '__main__':
    app.run(debug=True)
