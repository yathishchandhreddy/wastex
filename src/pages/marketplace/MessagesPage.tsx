import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: string;
}

interface Thread {
  id: string;
  contactName: string;
  organization: string;
  material: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: Message[];
}

export const MessagesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sellerParam = searchParams.get('seller');
  const buyerParam = searchParams.get('buyer');

  const initialThreads: Thread[] = [
    {
      id: 'thread-1',
      contactName: sellerParam || 'Apex Precision Blow-Molding Ltd.',
      organization: 'Primary Industrial Generator (Gujarat Hub)',
      material: 'PET Scrap Flakes (12.5 MT Lot)',
      lastMessage: 'We have dispatched the 2kg assay sample via BlueDart courier. Tracking ID: BD8941203.',
      timestamp: '10:24 AM',
      unreadCount: 1,
      messages: [
        {
          id: 'm1',
          sender: 'them',
          text: 'Hello! Thank you for inquiring about our 12.5 MT PET Scrap Flakes lot.',
          timestamp: '10:15 AM',
        },
        {
          id: 'm2',
          sender: 'me',
          text: 'Hi, can you confirm the moisture content and send a 2kg testing sample to our Coimbatore lab?',
          timestamp: '10:18 AM',
        },
        {
          id: 'm3',
          sender: 'them',
          text: 'Moisture is certified at <1.2%. We have dispatched the 2kg assay sample via BlueDart courier. Tracking ID: BD8941203.',
          timestamp: '10:24 AM',
        },
      ],
    },
    {
      id: 'thread-2',
      contactName: buyerParam || 'Southern Circular Polymers Hub',
      organization: 'Recycling Offtaker (Chennai)',
      material: 'Industrial Polyethylene Regrind',
      lastMessage: 'Can we schedule logistics pickup for this Thursday at 10 AM?',
      timestamp: 'Yesterday',
      unreadCount: 0,
      messages: [
        {
          id: 'm21',
          sender: 'them',
          text: 'Our quality team reviewed your spectroscopy report. Price of ₹32/kg is approved.',
          timestamp: 'Yesterday 2:40 PM',
        },
        {
          id: 'm22',
          sender: 'me',
          text: 'Excellent! The lot is palletized and weighed with weighbridge slips ready.',
          timestamp: 'Yesterday 3:10 PM',
        },
        {
          id: 'm23',
          sender: 'them',
          text: 'Can we schedule logistics pickup for this Thursday at 10 AM?',
          timestamp: 'Yesterday 3:45 PM',
        },
      ],
    },
    {
      id: 'thread-3',
      contactName: 'Eastern Integrated Steel Works',
      organization: 'Metallurgical Smelter (Jamshedpur)',
      material: 'GGBS Slag (150 MT)',
      lastMessage: 'ASTM C989 conformity certificate has been uploaded to the trade order.',
      timestamp: '2 days ago',
      unreadCount: 0,
      messages: [
        {
          id: 'm31',
          sender: 'them',
          text: 'ASTM C989 conformity certificate has been uploaded to the trade order.',
          timestamp: '2 days ago',
        },
      ],
    },
  ];

  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [selectedThreadId, setSelectedThreadId] = useState<string>(threads[0].id);
  const [inputText, setInputText] = useState('');

  const activeThread = threads.find((t) => t.id === selectedThreadId) || threads[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: inputText,
      timestamp: 'Just now',
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              lastMessage: inputText,
              timestamp: 'Just now',
              messages: [...t.messages, newMessage],
            }
          : t
      )
    );

    setInputText('');
  };

  return (
    <div id="messages-page" className="flex flex-col gap-4 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Messages & Inquiries</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Communicate directly with verified generators and buyers regarding specifications, samples, and logistics
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[580px]">
        {/* Left Side: Threads List */}
        <div className="border-r border-slate-200 flex flex-col">
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/70">
            <span className="text-xs font-bold text-slate-800">Direct Conversations</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {threads.map((thread) => {
              const isSelected = thread.id === activeThread.id;
              return (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`w-full p-4 text-left transition-colors flex flex-col gap-1 cursor-pointer ${
                    isSelected ? 'bg-emerald-50/70 border-l-4 border-emerald-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {thread.contactName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{thread.timestamp}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-800 truncate">
                    {thread.material}
                  </span>
                  <p className="text-xs text-slate-500 line-clamp-1">{thread.lastMessage}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Chat Conversation Box */}
        <div className="md:col-span-2 flex flex-col justify-between bg-slate-50/30">
          {/* Thread Header */}
          <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">{activeThread.contactName}</h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>{activeThread.organization}</span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold">{activeThread.material}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Verified B2B Partner</span>
              </span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-3">
            {activeThread.messages.map((m) => {
              const isMe = m.sender === 'me';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-xs font-medium ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-br-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
                </div>
              );
            })}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="p-3.5 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message, ask for assay data or sample dispatch..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
            >
              <span>Send</span>
              <span className="material-symbols-outlined text-[16px]">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
