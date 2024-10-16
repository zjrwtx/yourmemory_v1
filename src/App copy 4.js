import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import './App.css';

const WS_URL = "ws://localhost:8000/ws";

function App() {
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
            localStorage.setItem('response', newResponse);  // 保存到 localStorage
        };
        setWs(websocket);
        return () => websocket.close();
    }, []);

    const handleKeyUp = (e) => {
        if (e.key === "Enter" && question.trim()) {
            setResponse('');
            setLoading(true);
            if (ws) {
                ws.send(question);
            }
        }
    };

    useEffect(() => {
        const savedResponse = localStorage.getItem('response');
        if (savedResponse) {
            setResponse(savedResponse);
        }
    }, []);

    return (
        <div className="container">
            <header className="header">Your memory你的记忆 💭</header>
            <header className="header">像好朋友一样记录且记住你一生的记忆</header>
            <input
                className="input"
                placeholder="分享你的记忆给我吧"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyUp={handleKeyUp}
                disabled={loading}
            />
            {loading && (
                <>
                    <div className="skeleton"></div>
                    <div className="skeleton"></div>
                    <div className="skeleton"></div>
                </>
            )}
            {response && (
                <div className="chat">
                    <div className="user-message">
                        <span className="user-label">用户:</span> {question}
                    </div>
                    <div
                        className="response"
                        dangerouslySetInnerHTML={{ __html: response }}
                    />
                </div>
            )}
        </div>
    );
}

export default App;
