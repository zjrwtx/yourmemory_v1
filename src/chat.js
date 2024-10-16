import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { Send, Loader2, User, Bot, Trash2, Home, MessageCircle, Settings } from 'lucide-react';
import TodoApp from './todo';
import PomodoroTimer from './timetime';
import { motion, AnimatePresence } from 'framer-motion'; // 新增
const WS_URL = "ws://localhost:8000/ws";

export default function Chatapp() {
    const [response, setResponse] = useState("");
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [ws, setWs] = useState(null);
    const [activeTab, setActiveTab] = useState('chat');

    const quickMessages = [
        "我的精神状态",
        "比较重要的任务",
        "怎么更快完成我的任务呢",
        "好无聊 有什么活动建议不",
        "猜猜我今天的mbit",
        "帮我想一些发疯的朋友圈文案",
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

            // 从 localStorage 中获取 todo 数据
            const todos = JSON.parse(localStorage.getItem('todos')) || {};
            const todosString = JSON.stringify(todos);

            // 拼接 question 和 todos 数据
            const message = `${question}\n\nTodos:\n${todosString}`;

            if (ws) {
                ws.send(message);
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
        <div className="flex flex-col h-screen bg-gradient-to-b from-amber-50 to-amber-100">
            <header className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 shadow-lg">
                <h1 className="text-2xl font-bold">Your memory 你的记忆 💭</h1>
                <p className="text-sm mt-2 opacity-80">像好朋友一样记录且记住你一生的记忆||(还在开发中)</p>
            </header>

            <main className="flex-grow overflow-auto p-6 pb-24">
                <AnimatePresence>
                    {activeTab === 'chat' && (
                        <>
                            {response && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white rounded-2xl shadow-xl p-6 mb-6 transition-all duration-300 ease-in-out hover:shadow-2xl"
                                >
                                    <div className="flex items-center mb-4">
                                        <div className="bg-amber-500 rounded-full p-2 mr-3">
                                            <span className="text-white font-semibold">☺️</span>
                                        </div>
                                        <p className="font-medium text-gray-800">{question}</p>
                                    </div>
                                    <div className="flex items-center mt-6 mb-4">
                                        <div className="bg-blue-500 rounded-full p-2 mr-3">
                                            <span className="text-white font-semibold">🪄</span>
                                        </div>
                                        <span className="font-medium text-gray-800">Memory同学:</span>
                                    </div>
                                    <div
                                        className="ml-11 prose prose-amber"
                                        dangerouslySetInnerHTML={{ __html: response }}
                                    />
                                </motion.div>
                            )}
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex justify-center items-center"
                                >
                                    <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
                                </motion.div>
                            )}
                        </>
                    )}
                    {activeTab === 'home' && <TodoApp />}
                    {activeTab === 'settings' && <PomodoroTimer />}
                </AnimatePresence>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-white p-6 shadow-lg backdrop-blur-md bg-opacity-80">
                {activeTab === 'chat' && (
                    <>
                        <div className="flex items-center mb-4">
                            <input
                                className="flex-grow px-6 py-3 rounded-full border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                                placeholder="分享你的记忆给我吧"
                                value={question}
                                onChange={e => setQuestion(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleSend()}
                                disabled={loading}
                            />
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                className="ml-4 bg-amber-500 text-white p-3 rounded-full disabled:opacity-50 transition-colors duration-300 hover:bg-amber-600"
                                onClick={handleSend}
                                disabled={loading || !question.trim()}
                            >
                                <Send className="w-6 h-6" />
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                className="ml-4 bg-red-500 text-white p-3 rounded-full transition-colors duration-300 hover:bg-red-600"
                                onClick={handleClear}
                            >
                                <Trash2 className="w-6 h-6" />
                            </motion.button>
                        </div>
                        <div className="flex justify-start space-x-3 mb-4 overflow-x-auto pb-2">
                            {quickMessages.map((message, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-amber-200 text-amber-800 px-4 py-2 rounded-full text-sm whitespace-nowrap shadow-md hover:bg-amber-300 transition-colors duration-300"
                                    onClick={() => handleQuickMessage(message)}
                                >
                                    {message}
                                </motion.button>
                            ))}
                        </div>
                    </>
                )}
                <nav className="flex justify-around">
                    {['home', 'chat', 'settings'].map((tab) => (
                        <motion.button
                            key={tab}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-3 rounded-full ${activeTab === tab ? 'bg-amber-200' : ''} transition-colors duration-300`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'home' && <Home className="w-6 h-6 text-amber-800" />}
                            {tab === 'chat' && <MessageCircle className="w-6 h-6 text-amber-800" />}
                            {tab === 'settings' && <Settings className="w-6 h-6 text-amber-800" />}
                        </motion.button>
                    ))}
                </nav>
            </footer>
        </div>
    );
}