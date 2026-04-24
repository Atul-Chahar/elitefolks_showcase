import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us - EliteFolks',
    description: 'Get in touch with the EliteFolks team for support, business inquiries, or technical assistance.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-3xl mx-auto font-sans text-zinc-300">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-12">
                <ArrowLeft size={16} /> Back to Home
            </Link>
            
            <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-bebas)] tracking-wider text-white mb-6">
                CONTACT <span className="text-orange-500">US</span>
            </h1>
            
            <p className="text-lg leading-relaxed mb-12 text-zinc-400">
                Have a question, found a bug, or want to discuss a partnership? We are here to help. Reach out to the EliteFolks engineering and support team through any of the channels below.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-orange-500/30 transition-colors group">
                    <Mail className="text-orange-500 mb-6 group-hover:scale-110 transition-transform" size={32} />
                    <h3 className="text-xl font-bold text-white mb-2">Email Support</h3>
                    <p className="text-zinc-500 mb-6 text-sm">For account issues, billing, and general support inquiries.</p>
                    <a href="mailto:support@elitefolks.com" className="text-orange-400 hover:text-orange-300 font-bold tracking-wider uppercase text-sm">support@elitefolks.com</a>
                </div>

                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-orange-500/30 transition-colors group">
                    <MessageSquare className="text-orange-500 mb-6 group-hover:scale-110 transition-transform" size={32} />
                    <h3 className="text-xl font-bold text-white mb-2">Community Discord</h3>
                    <p className="text-zinc-500 mb-6 text-sm">Join our community of elite developers to chat in real-time.</p>
                    <a href="#" className="inline-block px-4 py-2 rounded-lg bg-orange-600/10 text-orange-500 font-bold border border-orange-500/20 hover:bg-orange-600/20 transition-colors">Join Server</a>
                </div>
            </div>
            
            <div className="mt-16 p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center">
                <h3 className="text-xl font-bold text-white mb-4">Enterprise Inquiries</h3>
                <p className="text-zinc-400 mb-6 max-w-xl mx-auto">Looking to train your team or integrate our voice-coding engine into your curriculum? Connect directly with our business operations team.</p>
                <a href="mailto:business@elitefolks.com" className="text-orange-500 hover:text-orange-400 font-bold">business@elitefolks.com</a>
            </div>
        </div>
    );
}
