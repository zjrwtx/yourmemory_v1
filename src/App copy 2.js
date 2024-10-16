import React, { useState } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setResponse(''); // Clear previous response

    const eventSource = new EventSource('http://localhost:5000/api/chat', {  // Ensure the port matches the backend
      withCredentials: false,  // No need for credentials if not needed
    });

    eventSource.onmessage = (event) => {
      setResponse((prevResponse) => prevResponse + event.data);
    };

    eventSource.onerror = (err) => {
      console.error('EventSource failed:', err);
      eventSource.close();
    };

    fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    }).catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chat with OpenAI</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here"
          />
          <button type="submit">Send</button>
        </form>
        <div className="response">
          <h2>Response:</h2>
          <p>{response}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
