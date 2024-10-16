import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const eventSourceRef = useRef(null);

  const setupEventSource = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource('http://localhost:8000/chat-stream');

    eventSource.onmessage = function(event) {
      const data = JSON.parse(event.data);
      setMessages(prevMessages => [...prevMessages, data.content]);
    };

    eventSource.onerror = function(event) {
      console.error('EventSource failed:', event);
      eventSource.close();
    };

    eventSourceRef.current = eventSource;
  };

  useEffect(() => {
    setupEventSource();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const sendMessage = async () => {
    await fetch('http://localhost:8000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: input }),
    });

    setInput('');
    setupEventSource(); // Reconnect to the SSE stream after sending a message
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chat with OpenAI</h1>
        <div>
          <input 
            type="text" 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            placeholder="Type your message" 
          />
          <button onClick={sendMessage}>Send</button>
        </div>
        <div>
          {messages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
