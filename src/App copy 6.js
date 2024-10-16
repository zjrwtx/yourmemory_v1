import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { Send, Loader2, User, Bot, Trash2 } from 'lucide-react';

const WS_URL = "ws://localhost:8000/ws";

export default function App() {
    const [response, setResponse] = useState("");
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const websocket = new WebSocket(WS_URL);
        websocket.onmessage = (event) => {
            setLoading(false);
            const newResponse = marked(event.data);
            setResponse(newResponse);
            localStorage.setItem('response', newResponse);
        };
        setWs(websocket);
        return () => websocket.close();
    }, []);

    const handleSend = () => {
        if (question.trim()) {
            setResponse('');
            setLoading(true);
            if (ws) {
                ws.send(question);
            }
        }
    };

    const handleClear = () => {
        setResponse('');
        setQuestion('');
        localStorage.removeItem('response');
    };

    useEffect(() => {
        const savedResponse = localStorage.getItem('response');
        if (savedResponse) {
            setResponse(savedResponse);
        }
    }, []);

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <header className="bg-blue-600 text-white p-4 shadow-md">
                <h1 className="text-xl font-bold">Your memory 你的记忆 💭</h1>
                <p className="text-sm">像好朋友一样记录且记住你一生的记忆</p>
            </header>

            <main className="flex-grow overflow-auto p-4">
                {response && (
                    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                        <div className="flex items-center mb-2">
                            <User className="w-6 h-6 text-blue-600 mr-2" />
                            <span className="font-semibold">用户:</span>
                        </div>
                        <p className="ml-8">{question}</p>
                        <div className="flex items-center mt-4 mb-2">
                            <Bot className="w-6 h-6 text-green-600 mr-2" />
                            <span className="font-semibold">AI助手:</span>
                        </div>
                        <div
                            className="ml-8 prose"
                            dangerouslySetInnerHTML={{ __html: response }}
                        />
                    </div>
                )}
                {loading && (
                    <div className="flex justify-center items-center">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                )}
            </main>

            <footer className="bg-white p-4 shadow-lg">
                <div className="flex items-center">
                    <input
                        className="flex-grow px-4 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="分享你的记忆给我吧"
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                        disabled={loading}
                    />
                    <button
                        className="bg-blue-600 text-white p-2 rounded-r-full disabled:opacity-50"
                        onClick={handleSend}
                        disabled={loading || !question.trim()}
                    >
                        <Send className="w-6 h-6" />
                    </button>
                    <button
                        className="ml-2 bg-red-500 text-white p-2 rounded-full"
                        onClick={handleClear}
                    >
                        <Trash2 className="w-6 h-6" />
                    </button>
                </div>
            </footer>
        </div>
    );
}