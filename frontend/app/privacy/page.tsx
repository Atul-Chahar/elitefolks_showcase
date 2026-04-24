import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, FileText, Globe, LifeBuoy } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy - EliteFolks',
    description: 'Privacy Policy and data handling practices for EliteFolks.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen pt-32 pb-24 px-6 bg-[#0D0D0D]">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-orange-500 transition-colors mb-12 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
                </Link>
                
                <h1 className="text-4xl md:text-6xl font-manrope font-bold mb-8 text-white">Privacy Policy</h1>
                <p className="text-zinc-400 mb-12">**Effective Date: February 14, 2026**</p>

                <div className="space-y-16 text-zinc-300 font-sans leading-relaxed">
                    
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                                <Shield className="text-orange-500" size={20} />
                            </div>
                            <h2 className="text-2xl font-manrope font-semibold text-white">1. Introduction</h2>
                        </div>
                        <p className="mb-4">
                            EliteFolks (“we”, “our”, “us”) is committed to protecting your privacy and handling your personal data responsibly.
                        </p>
                        <p>By accessing or using EliteFolks Services, you agree to this Privacy Policy. If you do not agree, please discontinue use immediately.</p>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <Eye className="text-blue-500" size={20} />
                            </div>
                            <h2 className="text-2xl font-manrope font-semibold text-white">2. Information We Collect</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                                <h3 className="text-lg font-bold text-white mb-4">Account Information</h3>
                                <ul className="list-disc pl-5 space-y-2 text-zinc-400 text-sm">
                                    <li>Full name and Username</li>
                                    <li>Email address (encrypted)</li>
                                    <li>Profile photo & Location</li>
                                    <li>OAuth signatures (Google/GitHub)</li>
                                </ul>
                            </div>
                            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                                <h3 className="text-lg font-bold text-white mb-4">Educational & Usage Data</h3>
                                <ul className="list-disc pl-5 space-y-2 text-zinc-400 text-sm">
                                    <li>Module progress & Quiz scores</li>
                                    <li>Arena contest submissions</li>
                                    <li>Leaderboard rankings</li>
                                    <li>Certificate issuance records</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-8 bg-orange-500/5 border border-orange-500/10 p-6 rounded-2xl">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Lock size={18} className="text-orange-500" />
                                AI Interaction Data
                            </h3>
                            <p className="text-sm text-zinc-400 mb-4">
                                AI interaction logs may be stored for improving response accuracy and preventing misuse. **Users are advised not to input sensitive personal information into AI prompts.**
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-zinc-400 text-sm">
                                <li>Prompts submitted to AI Tutor</li>
                                <li>AI-generated responses & Feedback</li>
                                <li>AI usage frequency & Interaction logs</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                <FileText className="text-purple-500" size={20} />
                            </div>
                            <h2 className="text-2xl font-manrope font-semibold text-white">3. How We Use Information</h2>
                        </div>
                        <p className="mb-4">We process personal data for the following purposes:</p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 list-disc pl-5 text-zinc-400">
                            <li>Managing accounts & learning modules</li>
                            <li>Enabling AI Tutor responses</li>
                            <li>Improving platform features</li>
                            <li>Analyzing performance trends</li>
                            <li>Security & Fraud Prevention</li>
                            <li>Issuing achievement certificates</li>
                        </ul>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                                <Globe className="text-green-500" size={20} />
                            </div>
                            <h2 className="text-2xl font-manrope font-semibold text-white">4. Data Sharing & Security</h2>
                        </div>
                        <p className="mb-4">
                            We utilize enterprise-grade sub-processors to operate our platform securely:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-zinc-400 mb-8">
                            <li><strong>Infrastructure:</strong> Vercel (Hosting), Appwrite (Server & Database).</li>
                            <li><strong>AI Services:</strong> Groq API, Google Gemini (for interactive generations).</li>
                            <li><strong>Analytics:</strong> PostHog (for performance analytics).</li>
                        </ul>
                        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                            <p className="text-sm italic">
                                "We do not sell personal data. We implement HTTPS encryption, access controls, and regular security reviews to protect your information."
                            </p>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                                <LifeBuoy className="text-cyan-500" size={20} />
                            </div>
                            <h2 className="text-2xl font-manrope font-semibold text-white">5. Your Rights & Contacts</h2>
                        </div>
                        <p className="mb-6">
                            Depending on your jurisdiction, you may have the right to access, correct, or delete your personal data.
                        </p>
                        <div className="flex flex-col gap-4">
                            <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl">
                                <h4 className="text-white font-bold mb-2">Support & Data Requests</h4>
                                <p className="text-sm text-zinc-500 mb-4">Email our data protection team at:</p>
                                <a href="mailto:support@elitefolks.com" className="text-orange-500 hover:underline font-mono text-lg font-bold">support@elitefolks.com</a>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="mt-24 pt-10 border-t border-white/5 flex justify-between items-center">
                    <Link href="/" className="text-orange-500 hover:underline flex items-center gap-2">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                    <span className="text-zinc-600 text-xs font-mono">ELITEFOLKS_P01_2026</span>
                </div>
            </div>
        </div>
    );
}
