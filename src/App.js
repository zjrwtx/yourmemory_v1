import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { Send, Loader2, User, Bot, Trash2,Timer, Home, MessageCircle, Settings, Calendar, Bell, Search } from 'lucide-react';
import TodoApp from './todo';
import PomodoroTimer from './timetime';
import Chatapp from './chat';
import TheCalendar from './calendar';

export default function App() {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <div className="flex flex-col h-screen bg-amber-50">
            <main className="flex-grow overflow-auto p-4 pb-20">
                {activeTab === 'chat' && (
                    <Chatapp />
                )}
                {activeTab === 'home' && (
                    <TodoApp />
                )}
                {activeTab === 'Timer' && (
                    <PomodoroTimer />
                )}
n
                {activeTab === 'notifications' && (
                    
                
                <PomodoroTimer />
                )}
                  {activeTab === 'calendar' && (

                    <TheCalendar />
                )}

            
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
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
                        className={`p-2 rounded-full ${activeTab === 'calendar' ? 'bg-amber-200' : ''} transition-colors duration-300`}
                        onClick={() => setActiveTab('calendar')}
                    >
                        <Calendar className="w-6 h-6 text-amber-800" />
                    </button>
                    <button
                        className={`p-2 rounded-full ${activeTab === 'notifications' ? 'bg-amber-200' : ''} transition-colors duration-300`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <Timer className="w-6 h-6 text-amber-800" />
                    </button>
                
                 
                </nav>
            </footer>
        </div>
    );
}