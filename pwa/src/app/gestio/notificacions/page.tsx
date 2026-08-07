"use client";

import { useState } from "react";
import { Send, Bot, User, Phone } from "lucide-react";

// Mock data
const MOCK_MESSAGES: any[] = [];

export default function NotificacionsPage() {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      sender: "engineer",
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "pwa"
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
    
    // Simulate bot response / system update
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "Missatge enviat al client via Telegram.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "system"
      }]);
    }, 1000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col h-[calc(100vh-64px)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Notificacions de Client</h1>
        <p className="text-neutral-500 mt-1">Historial de comunicacions automàtiques i xat directe via Telegram</p>
      </div>

      <div className="flex-1 bg-white border border-neutral-200 rounded-lg flex flex-col overflow-hidden shadow-sm">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'engineer' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] rounded-lg p-3 ${
                msg.sender === 'engineer' ? 'bg-primary text-primary-foreground rounded-br-none' : 
                msg.sender === 'bot' ? 'bg-white border border-neutral-200 text-neutral-600 rounded-bl-none italic' :
                'bg-blue-100 text-blue-900 rounded-bl-none'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {msg.sender === 'bot' && <Bot size={14} />}
                  {msg.sender === 'client' && <Phone size={14} />}
                  {msg.sender === 'engineer' && <User size={14} />}
                  <span className="text-xs font-semibold opacity-75">
                    {msg.sender === 'bot' ? 'Sistema / Bot' : msg.sender === 'client' ? 'Client (Telegram)' : 'Tu'}
                  </span>
                  <span className="text-xs opacity-50 ml-auto">{msg.time}</span>
                </div>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white border-t border-neutral-200">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escriu un missatge al client..."
              className="flex-1 px-4 py-2 border border-neutral-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-xs text-neutral-400 mt-2 ml-2">El missatge s'enviarà directament al Telegram del client.</p>
        </div>
      </div>
    </div>
  );
}
