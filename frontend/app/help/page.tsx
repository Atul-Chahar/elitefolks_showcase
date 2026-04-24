'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, Mail, MessageCircle, Shield, ArrowLeft } from 'lucide-react';

const HelpCenterPage = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
        { role: 'ai', text: 'Hi! I\'m EliteBot. How can I help you today?' }
    ]);

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const input = form.elements.namedItem('chatInput') as HTMLInputElement;
        if (!input.value.trim()) return;

        const userText = input.value;
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        input.value = '';

        // Mock bot response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'ai', text: 'Thanks for reaching out! A human agent will be with you shortly. In the meantime, feel free to browse our FAQ above.' }]);
        }, 1000);
    };

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 bg-[#0D0D0D]">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                        <HelpCircle className="text-orange-500" size={24} />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-manrope font-bold text-white">Help Center</h1>
                </div>

                <p className="text-zinc-400 text-xl mb-12 leading-relaxed">
                    How can we help you today? Search our FAQs or reach out to our support team.
                </p>

                <div className="space-y-6 mb-16">
                    <div className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                        <h3 className="text-lg font-bold text-white mb-2">My voice isn't being recognized. What should I do?</h3>
                        <p className="text-zinc-500">Ensure you've granted microphone permissions in your browser. Check your system settings to make sure the correct input device is selected.</p>
                    </div>
                    <div className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                        <h3 className="text-lg font-bold text-white mb-2">Can I use EliteFolks offline?</h3>
                        <p className="text-zinc-500">Currently, EliteFolks requires an active internet connection to process voice data and access our AI models.</p>
                    </div>
                    <div className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                        <h3 className="text-lg font-bold text-white mb-2">How do I reset my progress?</h3>
                        <p className="text-zinc-500">Go to Settings &gt; Profile and locate the "Danger Zone". Please note that this action is permanent.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5 text-center group hover:bg-zinc-900/50 transition-all">
                        <Mail className="text-orange-500 mx-auto mb-4 group-hover:scale-110 transition-transform" size={32} />
                        <h4 className="text-white font-bold mb-2">Email Support</h4>
                        <p className="text-zinc-500 text-xs mb-4">Response within 24h</p>
                        <a href="mailto:support@elitefolks.com" className="text-orange-500 text-sm hover:underline font-medium">support@elitefolks.com</a>
                    </div>
                    <div className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5 text-center group hover:bg-zinc-900/50 transition-all border-orange-500/20">
                        <MessageCircle className="text-orange-500 mx-auto mb-4 group-hover:scale-110 transition-transform" size={32} />
                        <h4 className="text-white font-bold mb-2">Live Chat</h4>
                        <p className="text-zinc-500 text-xs mb-4">Available 9am - 5pm EST</p>
                        <button
                            onClick={() => setIsChatOpen(true)}
                            className="text-orange-500 text-sm hover:underline font-bold"
                        >
                            Start Chat
                        </button>
                    </div>
                    <div className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5 text-center group hover:bg-zinc-900/50 transition-all">
                        <Shield className="text-orange-500 mx-auto mb-4 group-hover:scale-110 transition-transform" size={32} />
                        <h4 className="text-white font-bold mb-2">Status</h4>
                        <p className="text-zinc-500 text-xs mb-4">All systems operational</p>
                        <button className="text-orange-500 text-sm hover:underline font-medium">View Status</button>
                    </div>
                </div>

                <div className="mt-20 pt-10 border-t border-white/5">
                    <Link
                        href="/"
                        className="text-orange-500 hover:underline flex items-center gap-2 font-medium"
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                </div>
            </div>

            {/* Mock Chat Modal */}
            {isChatOpen && (
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-zinc-900 w-full max-w-lg rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col h-[500px] animate-in slide-in-from-bottom-4 duration-300">
                        <div className="bg-zinc-800 p-4 flex justify-between items-center border-b border-zinc-700">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                                <h3 className="text-white font-bold font-manrope">EliteFolks Live Support</h3>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                                {/* Using 'X' or Lucide Icon for Close */}
                                <ArrowLeft size={16} className="rotate-180" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm font-sans shadow-sm ${msg.role === 'user'
                                        ? 'bg-orange-500 text-white rounded-tr-none'
                                        : 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-zinc-700'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSendMessage} className="p-4 bg-zinc-900 border-t border-zinc-800 flex gap-3">
                            <input
                                autoComplete="off"
                                name="chatInput"
                                type="text"
                                placeholder="Type your message..."
                                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-all"
                            />
                            <button type="submit" className="bg-orange-500 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-orange-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20">
                                <ArrowLeft size={16} className="rotate-180" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HelpCenterPage;
