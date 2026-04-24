'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const TermsPage = () => {
    return (
        <div className="min-h-screen pt-32 pb-24 px-6 bg-[#0D0D0D]">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-manrope font-bold mb-8 text-white">Terms and Conditions</h1>
                <p className="font-bold text-zinc-300 mb-12">Effective Date: February 14, 2026</p>

                <div className="space-y-12 text-zinc-300 font-sans leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">1. Acceptance of Terms</h2>
                        <p className="mb-4">
                            Welcome to EliteFolks, an AI-driven platform for mastering programming through structured learning paths, AI mentoring, competitive Arena contests, and project-based education.
                        </p>
                        <p className="mb-4">
                            By accessing or using our websites and Services (collectively, the “Services”), you confirm that you have read, understood, and agree to be legally bound by these Terms and Conditions (“Terms”).
                        </p>
                        <p className="mb-4">
                            If you do not agree, you must immediately stop using the Services.
                        </p>
                        <p>
                            We may modify these Terms at any time. Updated versions will be posted on the website. Continued use constitutes acceptance of revised Terms. Material changes will be notified via email or platform notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">2. Electronic Communications Consent</h2>
                        <p className="mb-4">By using the Services, you consent to receive communications electronically, including:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4 text-zinc-400">
                            <li>Legal notices</li>
                            <li>Policy updates</li>
                            <li>Billing communications</li>
                            <li>Account notifications</li>
                        </ul>
                        <p>Electronic communications satisfy any legal requirement for written communication.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">3. Free and Paid Access Models</h2>

                        <h3 className="text-xl font-semibold text-white mb-4">Free Tier</h3>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-zinc-400">
                            <li>Basic modules</li>
                            <li>Limited AI Tutor access</li>
                            <li>Public Arena contests</li>
                            <li>Introductory exercises</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-white mb-4">Paid “Elite” Subscription</h3>
                        <p className="mb-2">Includes:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-zinc-400">
                            <li>Advanced structured modules</li>
                            <li>Unlimited AI Tutor access</li>
                            <li>Exclusive guided projects</li>
                            <li>Digital completion certificates</li>
                            <li>Priority Arena access</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-white mb-4">Subscription Terms</h3>
                        <ul className="list-disc pl-6 space-y-2 mb-4 text-zinc-400">
                            <li>Auto-renew monthly/annually</li>
                            <li>Cancel anytime (access continues until billing cycle ends)</li>
                            <li>No prorated refunds unless required by law</li>
                            <li>Taxes may apply</li>
                            <li>Pricing and features may change with notice</li>
                        </ul>
                        <p>Free or paid access creates no ownership or perpetual access rights.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">4. Eligibility and Age Policy</h2>
                        <p className="mb-4">The Platform welcomes global users.</p>
                        <p className="mb-4">Users under 18 must have parental/guardian consent. Parents assume responsibility for minors.</p>
                        <p className="mb-4">We do not knowingly collect personal data from children under 13 without verifiable parental consent.</p>
                        <p className="mb-4">You represent that your use complies with all applicable laws in your jurisdiction.</p>
                        <p>We may require age verification for certificates or paid services.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">5. Account Registration</h2>
                        <p className="mb-4">You must provide accurate information.</p>
                        <p className="mb-2">You are responsible for:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4 text-zinc-400">
                            <li>Safeguarding login credentials</li>
                            <li>All activity under your account</li>
                            <li>Notifying <a href="mailto:support@elitefolks.com" className="text-orange-500 hover:underline">support@elitefolks.com</a> of unauthorized access</li>
                        </ul>
                        <p>We may suspend or terminate accounts at our discretion.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">6. Description of Services</h2>
                        <p className="mb-2">EliteFolks provides:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4 text-zinc-400">
                            <li>Programming modules</li>
                            <li>AI-powered tutoring</li>
                            <li>Competitive Arena contests</li>
                            <li>Guided projects</li>
                            <li>Digital certificates</li>
                        </ul>
                        <p className="mb-4">Certificates indicate verified platform completion only and are not third-party accreditation.</p>
                        <p>We may modify, suspend, or discontinue Services at any time without liability.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">7. AI Tutor and Services Disclaimer</h2>
                        <p className="mb-4">Services are provided “AS IS” and “AS AVAILABLE.”</p>
                        <p className="mb-2">You acknowledge:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4 text-zinc-400">
                            <li>AI outputs may contain errors or inaccuracies</li>
                            <li>Services are for educational purposes only</li>
                            <li>No professional, legal, financial, medical, or career advice is provided</li>
                            <li>No guarantees of job placement, income, mastery, or certification value</li>
                        </ul>
                        <p>You must independently verify AI-generated information.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">8. User Conduct and Prohibited Activities</h2>
                        <p className="mb-2">You may not:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4 text-zinc-400">
                            <li>Engage in illegal or harmful conduct</li>
                            <li>Harass or abuse others</li>
                            <li>Upload malware</li>
                            <li>Reverse engineer or hack</li>
                            <li>Use bots or scrapers</li>
                            <li>Copy or redistribute Platform Content</li>
                            <li>Cheat in Arena contests</li>
                        </ul>
                        <p className="mb-4">We use automated similarity detection and manual review.</p>
                        <p className="mb-2">Violations may result in:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4 text-zinc-400">
                            <li>Immediate suspension</li>
                            <li>Permanent ban</li>
                            <li>Certificate revocation</li>
                            <li>Legal action</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">9. Arena Competitions & Publicity Consent</h2>
                        <p className="mb-4">Arena decisions are final.</p>
                        <p className="mb-2">We may:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4 text-zinc-400">
                            <li>Disqualify participants</li>
                            <li>Adjust rankings</li>
                            <li>Cancel contests</li>
                        </ul>
                        <p className="mb-2">By participating, you consent to public display of:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4 text-zinc-400">
                            <li>Username</li>
                            <li>Rankings</li>
                            <li>Achievements</li>
                        </ul>
                        <p>Prizes (if any) may be subject to tax obligations.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">10. Intellectual Property</h2>
                        <p className="mb-4">All Platform Content is exclusively owned by EliteFolks or its licensors.</p>
                        <p className="mb-4">You receive a limited, non-transferable, revocable license for personal learning use.</p>
                        <p className="mb-2">You may NOT:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4 text-zinc-400">
                            <li>Copy</li>
                            <li>Screenshot</li>
                            <li>Record</li>
                            <li>Sell</li>
                            <li>Redistribute</li>
                            <li>Create derivative works</li>
                            <li>Use content commercially</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-white mb-4">User Content License</h3>
                        <p className="mb-4">You grant EliteFolks a perpetual, worldwide, royalty-free license to use submissions to improve Services.</p>
                        <p>You retain ownership but warrant no third-party infringement.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">11. Feedback</h2>
                        <p>Any feedback or suggestions provided may be used by EliteFolks without restriction or compensation.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">12. Copyright / DMCA Policy</h2>
                        <p className="mb-2">If you believe content infringes your copyright, submit written notice including:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4 text-zinc-400">
                            <li>Identification of copyrighted work</li>
                            <li>Identification of infringing material</li>
                            <li>Contact information</li>
                            <li>Good faith statement</li>
                            <li>Accuracy declaration</li>
                        </ul>
                        <p className="mb-4">We may remove allegedly infringing material and terminate repeat offenders.</p>
                        <p>Counter-notices may be submitted where applicable.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">13. Payments & Refunds</h2>
                        <p className="mb-4">Subscriptions auto-renew.</p>
                        <p className="mb-4">No refunds once access begins except where required by law.</p>
                        <p className="mb-4">Chargebacks for valid transactions may result in account termination.</p>
                        <p>Billing disputes: <a href="mailto:billing@elitefolks.com" className="text-orange-500 hover:underline">billing@elitefolks.com</a></p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">14. No Guarantee of Results</h2>
                        <p className="mb-2">EliteFolks makes no guarantees regarding:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4 text-zinc-400">
                            <li>Academic performance</li>
                            <li>Skill acquisition</li>
                            <li>Employment</li>
                            <li>Competition results</li>
                            <li>Financial gain</li>
                        </ul>
                        <p>Outcomes depend entirely on individual effort.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">15. Warranty Disclaimer</h2>
                        <p className="mb-2">To the maximum extent permitted by law, EliteFolks disclaims all warranties, express or implied, including:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4 text-zinc-400">
                            <li>Merchantability</li>
                            <li>Fitness for a particular purpose</li>
                            <li>Non-infringement</li>
                            <li>Availability</li>
                            <li>Accuracy</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">16. Limitation of Liability</h2>
                        <p className="mb-2">To the fullest extent permitted by law:</p>
                        <p className="mb-2">EliteFolks shall not be liable for:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4 text-zinc-400">
                            <li>Indirect, incidental, special, consequential, or punitive damages</li>
                            <li>Data loss</li>
                            <li>Service interruptions</li>
                            <li>Cyberattacks</li>
                            <li>AI output reliance</li>
                        </ul>
                        <p className="mb-2">Liability capped at:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4 text-zinc-400">
                            <li>Fees paid in last 12 months (paid users)</li>
                            <li>$100 maximum (free users)</li>
                        </ul>
                        <p>Except where prohibited by law or involving willful misconduct.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">17. Indemnification</h2>
                        <p className="mb-2">You agree to indemnify and hold harmless EliteFolks from claims, damages, losses, and legal fees arising from:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4 text-zinc-400">
                            <li>Your use of Services</li>
                            <li>Violations of Terms</li>
                            <li>Third-party rights infringement</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">18. Export Control & Sanctions</h2>
                        <p className="mb-4">You agree not to use Services in violation of export laws or sanctions regulations.</p>
                        <p>Services may not be used in jurisdictions subject to trade restrictions under Indian or international law.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">19. Beta Features</h2>
                        <p className="mb-2">We may offer experimental features.</p>
                        <p className="mb-2">Beta features:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4 text-zinc-400">
                            <li>May contain bugs</li>
                            <li>May be discontinued</li>
                            <li>Provided without warranty</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">20. Data & Privacy</h2>
                        <p className="mb-4">Use of Services is governed by our Privacy Policy.</p>
                        <p className="mb-4">We collect usage analytics and AI logs to improve Services.</p>
                        <p>Reasonable security measures implemented; absolute protection not guaranteed.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">21. Termination</h2>
                        <p className="mb-4">We may suspend or terminate accounts without notice.</p>
                        <p className="mb-2">Upon termination:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4 text-zinc-400">
                            <li>License ends</li>
                            <li>Access revoked</li>
                            <li>No refunds</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">22. Survival</h2>
                        <p className="mb-2">The following survive termination:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4 text-zinc-400">
                            <li>Intellectual Property</li>
                            <li>Indemnification</li>
                            <li>Limitation of Liability</li>
                            <li>Dispute Resolution</li>
                            <li>Payment obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">23. Dispute Resolution</h2>
                        <p className="mb-4">Governing Law: India</p>
                        <p className="mb-4">Disputes resolved by binding arbitration in Bengaluru under Arbitration and Conciliation Act, 1996.</p>
                        <p className="mb-4">No class actions or representative proceedings permitted.</p>
                        <p>Bengaluru courts retain jurisdiction for injunctive relief.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">24. Force Majeure</h2>
                        <p>No liability for delays caused by events beyond reasonable control.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">25. Miscellaneous</h2>
                        <ul className="list-disc pl-6 space-y-2 mb-4 text-zinc-400">
                            <li><strong>Entire Agreement:</strong> These Terms constitute full agreement.</li>
                            <li><strong>Severability:</strong> Invalid provisions do not affect remaining Terms.</li>
                            <li><strong>No Waiver:</strong> Failure to enforce does not waive rights.</li>
                            <li><strong>Assignment:</strong> We may assign rights; users may not.</li>
                            <li>English Language prevails in case of translation conflicts.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">Contact</h2>
                        <ul className="list-none space-y-2 text-zinc-400">
                            <li><a href="mailto:support@elitefolks.com" className="text-orange-500 hover:underline">support@elitefolks.com</a></li>
                            <li>Bengaluru, Karnataka, India</li>
                        </ul>
                    </section>
                </div>

                <div className="mt-20 pt-10 border-t border-white/5">
                    <Link
                        href="/"
                        className="text-orange-500 hover:underline flex items-center gap-2"
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
