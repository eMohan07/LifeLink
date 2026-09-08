import React, { useState } from 'react';
import { Bot, Send, Sparkles, X, MessageSquare, Loader2 } from 'lucide-react';
import { aiApi } from '../../api/aiApi';

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I am LifeLink AI. Ask me about blood group availability, donor response trends, or emergency inventory advice.',
    },
  ]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userText = prompt;
    setPrompt('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await aiApi.generateInsight(userText);
      if (res.data && res.data.success) {
        const insight = res.data.data;
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: insight.summary,
            recommendations: insight.recommendations,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'I am currently synthesizing network telemetry. ' + (err.response?.data?.message || 'Please try again in a moment.'),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white px-4 py-3 rounded-full shadow-2xl shadow-rose-600/40 transform hover:scale-105 transition-all duration-300 border border-white/20"
        >
          <Sparkles className="w-5 h-5 animate-spin-slow" />
          <span className="font-bold text-sm">Ask LifeLink AI</span>
        </button>
      )}

      {/* Chat Drawer Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 glass-panel bg-[#151c2e] border border-slate-200/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[480px] animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-900/80 to-slate-900 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-none">LifeLink Intelligence Officer</h4>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-ping"></span> Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-rose-600 text-white rounded-br-none'
                      : 'bg-lightbg/90 text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.recommendations && (
                    <ul className="mt-2 pt-2 border-t border-slate-200 space-y-1 text-[11px] text-emerald-300">
                      {msg.recommendations.map((rec, i) => (
                        <li key={i}>• {rec}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-lightbg text-slate-500 p-3 rounded-2xl border border-slate-200 flex items-center space-x-2 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                  <span>Synthesizing LLM insight...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-[#0f172a] border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask AI about donor supply or requests..."
              className="flex-1 bg-lightbg text-white text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white p-2.5 rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChatWidget;
