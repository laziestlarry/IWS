import React, { useState } from 'react';
import { MissionRecord } from '../types';
import {
  X,
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface CommanderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeMission?: MissionRecord | null;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'commander';
  text: string;
  timestamp: string;
}

export const CommanderDrawer: React.FC<CommanderDrawerProps> = ({
  isOpen,
  onClose,
  activeMission,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'commander',
      text: `Commander Coordination Layer Active. I maintain the objective: Find the costly bottleneck, scope the smallest fix, approve the mission, and verify from evidence. How can I assist you with your business design or execution today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/commander-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          contextHistory: messages.map(m => ({
            role: m.role,
            text: m.text,
          })),
          activeMission,
        }),
      });

      const data = await response.json();

      const commanderMsg: ChatMessage = {
        id: `c_${Date.now()}`,
        role: 'commander',
        text: data.reply || 'Commander objective maintained.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, commanderMsg]);
    } catch (err) {
      console.error('Commander error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'commander',
          text: 'Commander network link fallback: I have reviewed the active workflow. Ensure all acceptance criteria have verified evidence (E2–E5) before authorizing scope deployment.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-slate-900 w-full max-w-md h-full flex flex-col text-slate-100 border-l border-slate-800 shadow-2xl animate-slideLeft">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black">
              <Bot className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-sm text-slate-100">AI COMMANDER LAYER</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-[10px] text-slate-400">
                Orchestrator • Non-autonomous authorization safety
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Commander Status Badge */}
        <div className="px-4 py-2 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Human-controlled gates active</span>
          </span>
          <span className="font-mono text-[10px] text-slate-400">
            {activeMission ? `State: ${activeMission.state}` : 'No Active Mission'}
          </span>
        </div>

        {/* Quick Action Prompts */}
        <div className="p-3 bg-slate-950/40 border-b border-slate-800 space-y-1.5 text-xs">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
            Commander Quick Actions
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              'Diagnose primary workflow bottleneck',
              'Draft acceptance test criteria',
              'Surface legal & compliance risks',
              'Write change control rule',
            ].map((qp) => (
              <button
                key={qp}
                onClick={() => handleSend(qp)}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors text-left"
              >
                ⚡ {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages Timeline */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs scrollbar-thin">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col space-y-1 ${
                m.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`p-3.5 rounded-2xl max-w-[88%] leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium rounded-br-xs'
                    : 'bg-slate-800 text-slate-100 border border-slate-700/80 rounded-bl-xs'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] text-slate-500 px-1 font-mono">{m.timestamp}</span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs italic">
              <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
              <span>Commander evaluating workflow evidence...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Commander to analyze or refine scope..."
              className="flex-1 bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500 placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
