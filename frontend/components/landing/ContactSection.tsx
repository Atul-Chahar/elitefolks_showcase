'use client';

import React, { useState } from 'react';

const ContactSection: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        interest: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        try {
            const { databases } = await import('../../lib/appwrite');
            const { ID } = await import('appwrite');
            const DB = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'elitefolks-db';

            await databases.createDocument(DB, 'feedback', ID.unique(), {
                user_id: 'anonymous',
                type: 'contact',
                content: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    interest: formData.interest,
                    message: formData.message
                }),
                status: 'new',
            });

            setStatus('success');
            setFormData({ name: '', email: '', interest: '', message: '' });
        } catch (error: any) {
            console.error('Error submitting form:', error);
            setStatus('error');
            setErrorMessage(error.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <section id="contact" className="w-full px-6 md:px-12 mb-32 relative z-20 mt-32 border-t border-border/10 pt-24 bg-zinc-950/20">
            <div className="grid lg:grid-cols-12 gap-16 items-start w-full">
                {/* CTA Text Side */}
                <div className="lg:col-span-5 pt-4">
                    <h2 className="text-5xl md:text-6xl font-medium text-white tracking-tighter font-sans mb-6 leading-[1.1]">
                        Stay in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">loop.</span>
                    </h2>
                    <p className="text-lg text-zinc-400 font-sans leading-relaxed max-w-md">
                        Subscribe to get notified about early access to new projects, platform features, and highly anticipated developer updates from EliteFolks.
                    </p>
                </div>

                {/* Form Side */}
                <div className="lg:col-span-7">
                    <form className="space-y-12" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="group relative">
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="peer w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-transparent focus:border-orange-500 focus:outline-none transition-colors font-sans text-lg"
                                    placeholder="Name"
                                />
                                <label htmlFor="name" className="absolute left-0 -top-5 text-xs text-zinc-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-400 peer-placeholder-shown:top-3 peer-focus:-top-5 peer-focus:text-[10px] peer-focus:text-orange-500 font-sans uppercase tracking-wider font-medium">Name</label>
                            </div>
                            <div className="group relative">
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="peer w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-transparent focus:border-orange-500 focus:outline-none transition-colors font-sans text-lg"
                                    placeholder="Email"
                                />
                                <label htmlFor="email" className="absolute left-0 -top-5 text-xs text-zinc-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-400 peer-placeholder-shown:top-3 peer-focus:-top-5 peer-focus:text-[10px] peer-focus:text-orange-500 font-sans uppercase tracking-wider font-medium">Email</label>
                            </div>
                        </div>

                        <div className="group relative">
                            <input
                                type="text"
                                id="interest"
                                value={formData.interest}
                                onChange={handleChange}
                                className="peer w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-transparent focus:border-orange-500 focus:outline-none transition-colors font-sans text-lg"
                                placeholder="Primary Interest"
                            />
                            <label htmlFor="interest" className="absolute left-0 -top-5 text-xs text-zinc-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-400 peer-placeholder-shown:top-3 peer-focus:-top-5 peer-focus:text-[10px] peer-focus:text-orange-500 font-sans uppercase tracking-wider font-medium">Primary Interest (e.g. Learning, Productivity)</label>
                        </div>

                        <div className="group relative">
                            <textarea
                                id="message"
                                rows={1}
                                value={formData.message}
                                onChange={handleChange}
                                className="peer w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-transparent focus:border-orange-500 focus:outline-none transition-colors font-sans text-lg resize-none"
                                placeholder="Anything else?"
                            ></textarea>
                            <label htmlFor="message" className="absolute left-0 -top-5 text-xs text-zinc-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-400 peer-placeholder-shown:top-3 peer-focus:-top-5 peer-focus:text-[10px] peer-focus:text-orange-500 font-sans uppercase tracking-wider font-medium">Any questions?</label>
                        </div>

                        {status === 'success' && (
                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <p className="text-green-400 text-sm font-sans flex items-center gap-2">
                                    <i className="fas fa-check-circle"></i> Thanks! We've received your message and will be in touch soon.
                                </p>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-red-400 text-sm font-sans flex items-center gap-2">
                                    <i className="fas fa-exclamation-circle"></i> {errorMessage}
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end pt-8">
                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold tracking-widest uppercase text-xs hover:bg-zinc-200 transition-all duration-300 font-manrope disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === 'submitting' ? 'Sending...' : 'Get Updates'}
                                {status !== 'submitting' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className="transform group-hover:translate-x-1 transition-transform"><path fill="currentColor" d="M13.25 12.75V18a.75.75 0 0 0 1.28.53l6-6a.75.75 0 0 0 0-1.06l-6-6a.75.75 0 0 0-1.28.53z"></path></svg>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
