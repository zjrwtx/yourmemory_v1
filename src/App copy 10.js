import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { Send, Loader2, User, Bot, Trash2, Home, MessageCircle, Settings } from 'lucide-react';
import TodoApp from './todo';
import PomodoroTimer from './timetime';

const WS_URL = "ws://localhost:8000/ws";

export default function App() {
    const [response, setResponse] = useState("");
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [ws, setWs] = useState(null);
    const [activeTab, setActiveTab] = useState('chat');

    const quickMessages = [
        "帮我生成今天的日记",
        "今天的朋友圈",
        "今天的小红书"
    ];

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

    const handleQuickMessage = (message) => {
        setQuestion(message);
    };

    useEffect(() => {
        const savedResponse = localStorage.getItem('response');
        if (savedResponse) {
            setResponse(savedResponse);
        }
    }, []);

    return (
        <div className="flex flex-col h-screen bg-amber-50">
            <header className="bg-amber-600 text-white p-4 shadow-md">
                <h1 className="text-xl font-bold">Your memory 你的记忆 💭</h1>
                <p className="text-sm">像好朋友一样记录且记住你一生的记忆</p>
            </header>

            <main className="flex-grow overflow-auto p-4 pb-20">
                {activeTab === 'chat' && (
                    <>
                        {response && (
                            <div className="bg-white rounded-lg shadow-md p-4 mb-4 transition-all duration-300 ease-in-out transform hover:scale-102">
                                <div className="flex items-center mb-2">
                                    <span className="font-semibold">☺️:</span>
                                </div>
                                <p className="ml-8">{question}</p>
                                <div className="flex items-center mt-4 mb-2">
                                    <span className="font-semibold">🪄Memory同学:</span>
                                </div>
                                <div
                                    className="ml-8 prose"
                                    dangerouslySetInnerHTML={{ __html: response }}
                                />
                            </div>
                        )}
                        {loading && (
                            <div className="flex justify-center items-center">
                                <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                            </div>
                        )}
                    </>
                )}
                {activeTab === 'home' && (
                    <TodoApp />
                )}
                {activeTab === 'settings' && (
                    <PomodoroTimer />
                )}
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
                {activeTab === 'chat' && (
                    <>
                        <div className="flex items-center mb-4">
                            <input
                                className="flex-grow px-4 py-2 rounded-l-full border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600"
                                placeholder="分享你的记忆给我吧"
                                value={question}
                                onChange={e => setQuestion(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleSend()}
                                disabled={loading}
                            />
                            <button
                                className="bg-amber-600 text-white p-2 rounded-r-full disabled:opacity-50 transition-colors duration-300"
                                onClick={handleSend}
                                disabled={loading || !question.trim()}
                            >
                                <Send className="w-6 h-6" />
                            </button>
                            <button
                                className="ml-2 bg-red-500 text-white p-2 rounded-full transition-colors duration-300"
                                onClick={handleClear}
                            >
                                <Trash2 className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex justify-start space-x-2 mb-4 overflow-x-auto">
                            {quickMessages.map((message, index) => (
                                <button
                                    key={index}
                                    className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm whitespace-nowrap"
                                    onClick={() => handleQuickMessage(message)}
                                >
                                    {message}
                                </button>
                            ))}
                        </div>
                    </>
                )}
                <nav className="flex justify-around">
                    <button
                        className={`p-2 rounded-full ${activeTab === 'home' ? 'bg-amber-200' : ''} transition-colors duration-300`}
                        onClick={() => setActiveTab('home')}
                    >
                        <Home className="w-6 h-6 text-amber-800" />
                    </button>
                    <button
                        className={`p-2 rounded-full ${activeTab === 'chat' ? 'bg-amber-200' : ''} transition-colors duration-300`}
                        onClick={() => setActiveTab('chat')}
                    >
                        <MessageCircle className="w-6 h-6 text-amber-800" />
                    </button>
                    <button
                        className={`p-2 rounded-full ${activeTab === 'settings' ? 'bg-amber-200' : ''} transition-colors duration-300`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <Settings className="w-6 h-6 text-amber-800" />
                    </button>
                </nav>
            </footer>
        </div>
    );
}