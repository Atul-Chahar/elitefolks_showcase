'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Script from 'next/script';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

/* ────────────────────────────────────────────
 * PSYCHOLOGY TRICKS DEPLOYED IN THIS PAGE
 * ────────────────────────────────────────────
 * 1. Anchoring Effect — Elite price shown first visually (right), anchors Pro as the deal
 * 2. Decoy Effect — Free tier makes Pro feel premium; Elite makes Pro feel reasonable
 * 3. Default Effect — Annual billing pre-selected (higher LTV)
 * 4. Paradox of Choice — Only 3 cards, not 5
 * 5. Price Relativity / Good-Better-Best — Classic 3-tier with middle highlighted
 * 6. Charm Pricing — ₹999, ₹2,699 etc. (left-digit effect)
 * 7. Mental Accounting — "Less than ₹33/day" reframing
 * 8. Social Proof — "Join 2,000+ learners" strip
 * 9. Loss Aversion — "Don't miss unlimited voice AI" copy
 * 10. Scarcity — "Early adopter pricing" badge
 * 11. Regret Aversion — 30-day money-back guarantee badge
 * 12. Bandwagon — "Most Popular" badge on Pro
 * 13. Commitment & Consistency — Free → Pro upgrade path
 * 14. Zero-Price Effect — Free tier prominent
 * 15. Contrast Effect — Savings callout vs monthly pricing
 * 16. Authority Bias — "Trusted by developers" strip
 * ────────────────────────────────────────────*/

type BillingCycle = 'monthly' | 'quarterly' | 'annual';
type Currency = 'INR' | 'USD';

// ─── Price Matrix ───
const PRICE_DATA = {
    pro: {
        monthly:   { INR: 999,   USD: 25,  dailyINR: '₹33', dailyUSD: '$0.83' },
        quarterly: { INR: 2699,  USD: 68,  dailyINR: '₹30', dailyUSD: '$0.76', saveINR: '₹298', saveUSD: '$7', savePct: '10%' },
        annual:    { INR: 9999,  USD: 249, dailyINR: '₹27', dailyUSD: '$0.68', saveINR: '₹1,989', saveUSD: '$51', savePct: '17%' },
    },
    elite: {
        monthly:   { INR: 1499,  USD: 34,  dailyINR: '₹50', dailyUSD: '$1.13' },
        quarterly: { INR: 3999,  USD: 92,  dailyINR: '₹44', dailyUSD: '$1.02', saveINR: '₹498', saveUSD: '$10', savePct: '11%' },
        annual:    { INR: 14999, USD: 339, dailyINR: '₹41', dailyUSD: '$0.93', saveINR: '₹2,989', saveUSD: '$69', savePct: '17%' },
    },
};

// Map billing + tier → Razorpay plan key (used in API call)
const PLAN_KEYS: Record<string, string> = {
    'pro_monthly': 'pro_monthly',
    'pro_quarterly': 'pro_quarterly',
    'pro_annual': 'pro_annual',
    'elite_monthly': 'elite_monthly',
    'elite_quarterly': 'elite_quarterly',
    'elite_annual': 'elite_annual',
};

const formatPrice = (amount: number, currency: Currency) => {
    if (currency === 'INR') return `₹${amount.toLocaleString('en-IN')}`;
    return `$${amount}`;
};

const PricingPage = () => {
    const router = useRouter();
    // PSYCHOLOGY: Default Effect — Annual pre-selected for higher LTV
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('annual');
    const [currency, setCurrency] = useState<Currency>('INR');
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [promoCode, setPromoCode] = useState('');
    const [showPromoInput, setShowPromoInput] = useState(false);
    const [userTier, setUserTier] = useState<string>('free');
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch current user's tier
    useEffect(() => {
        fetch('/api/data/profile')
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data?.stats?.subscriptionTier) {
                    setUserTier(data.stats.subscriptionTier);
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {
            gsap.from('.animate-header', {
                y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
            });
            gsap.fromTo('.pricing-card',
                { y: 80, opacity: 0, scale: 0.95 },
                {
                    y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.15, ease: 'power3.out',
                    scrollTrigger: { trigger: '.pricing-grid', start: 'top 85%' },
                }
            );
            gsap.from('.trust-badge', {
                y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out',
                scrollTrigger: { trigger: '.trust-section', start: 'top 90%' },
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    // ─── Razorpay Checkout ───
    const handleSubscribe = useCallback(async (tier: 'pro' | 'elite') => {
        const planKey = `${tier}_${billingCycle}`;
        setIsLoading(planKey);

        try {
            const res = await fetch('/api/payments/create-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    planKey,
                    offerId: promoCode.trim() || undefined 
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    router.push('/onboarding?redirect=/pricing');
                    return;
                }
                alert(data.error || 'Something went wrong');
                return;
            }

            // Load Razorpay SDK dynamically
            const Razorpay = (window as any).Razorpay;
            if (!Razorpay) {
                alert('Payment system loading... please try again.');
                return;
            }

            const options = {
                key: data.razorpay_key,
                subscription_id: data.subscription_id,
                name: 'EliteFolks',
                description: `${tier === 'pro' ? 'Pro' : 'Elite'} Plan — ${billingCycle}`,
                handler: function () {
                    // Payment success — webhook will handle the rest
                    router.push('/settings?tab=subscription&status=success');
                },
                prefill: {},
                theme: { color: '#F97316' },
                modal: {
                    ondismiss: function () {
                        setIsLoading(null);
                    },
                },
            };

            const rzp = new Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error('[Pricing] Checkout error:', err);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsLoading(null);
        }
    }, [billingCycle, router]);

    const proPrices = PRICE_DATA.pro[billingCycle];
    const elitePrices = PRICE_DATA.elite[billingCycle];

    return (
        <div ref={containerRef} className="min-h-screen relative overflow-hidden bg-[#0A0A0B] text-white font-sans selection:bg-orange-500/30 selection:text-orange-200">
            {/* Razorpay SDK */}
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

            {/* Background */}
            <div className="grid-bg fixed inset-0 opacity-20 pointer-events-none z-0" aria-hidden="true" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-orange-500/5 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* Floating code elements */}
            <div className="absolute top-40 left-10 font-mono text-white/15 -rotate-12 animate-pulse text-xs pointer-events-none">{'<elite />'}</div>
            <div className="absolute top-1/3 right-20 font-mono text-white/15 rotate-6 animate-pulse text-xs pointer-events-none delay-1000">{'[0, 1]'}</div>
            <div className="absolute bottom-40 left-1/4 font-mono text-white/15 -rotate-6 animate-pulse text-xs pointer-events-none delay-500">{'while(true)'}</div>

            <section className="pt-32 pb-24 px-4 md:px-6 relative z-10 w-full">
                <div className="max-w-[1200px] mx-auto">

                    {/* ╔═══════════════════════════════════════╗
                       ║  HEADER + SOCIAL PROOF STRIP          ║
                       ╚═══════════════════════════════════════╝ */}
                    <div className="text-center mb-12 md:mb-16">
                        {/* PSYCHOLOGY: Scarcity — Early adopter pricing */}
                        <div className="animate-header inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 mb-6 backdrop-blur-md">
                            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.5)]"></span>
                            <span className="text-xs font-medium text-orange-300 tracking-wide font-sans">Early Adopter Pricing — Lock in before prices increase</span>
                        </div>

                        <h1 className="animate-header font-[family-name:var(--font-bebas)] text-5xl md:text-7xl tracking-wider mb-4 text-zinc-100">
                            INVEST IN YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">FUTURE</span>
                        </h1>

                        {/* PSYCHOLOGY: Social Proof — Bandwagon Effect */}
                        <p className="animate-header text-base text-zinc-400 mb-2 font-sans">
                            Join <span className="text-white font-semibold">2,000+</span> developers already leveling up with EliteFolks
                        </p>
                        <p className="animate-header text-sm text-zinc-500 mb-8 font-sans">
                            Simple, transparent pricing. No hidden fees. Cancel anytime.
                        </p>

                        {/* ─── BILLING CYCLE TOGGLE ─── */}
                        {/* PSYCHOLOGY: Default Effect — Annual pre-selected */}
                        <div className="animate-header flex flex-col items-center gap-3">
                            <div className="flex items-center gap-1 p-1 bg-[#111] border border-white/5 rounded-full w-fit relative z-20">
                                {(['monthly', 'quarterly', 'annual'] as BillingCycle[]).map((cycle) => (
                                    <button
                                        key={cycle}
                                        onClick={() => setBillingCycle(cycle)}
                                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 font-sans tracking-wide relative ${
                                            billingCycle === cycle
                                                ? 'bg-[#222] text-white shadow-sm border border-white/10'
                                                : 'text-zinc-500 hover:text-white'
                                        }`}
                                    >
                                        {cycle === 'monthly' ? 'Monthly' : cycle === 'quarterly' ? 'Quarterly' : 'Annual'}
                                        {/* PSYCHOLOGY: Anchoring — Show savings on annual */}
                                        {cycle === 'annual' && (
                                            <span className="absolute -top-2.5 -right-2 bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                                                SAVE 17%
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Currency toggle */}
                            <div className="flex items-center gap-1 p-1 bg-[#111] border border-white/5 rounded-full w-fit">
                                <button
                                    onClick={() => setCurrency('INR')}
                                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 font-sans ${
                                        currency === 'INR' ? 'bg-[#222] text-white border border-white/10' : 'text-zinc-500 hover:text-white'
                                    }`}
                                >
                                    🇮🇳 INR
                                </button>
                                <button
                                    onClick={() => setCurrency('USD')}
                                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 font-sans ${
                                        currency === 'USD' ? 'bg-[#222] text-white border border-white/10' : 'text-zinc-500 hover:text-white'
                                    }`}
                                >
                                    🌍 USD
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ╔═══════════════════════════════════════╗
                       ║  PRICING GRID — 3 CARDS               ║
                       ╚═══════════════════════════════════════╝ */}
                    {/* PSYCHOLOGY: Good-Better-Best / Price Relativity */}
                    <div className="pricing-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 font-sans items-start">

                        {/* ──────── FREE CARD ──────── */}
                        {/* PSYCHOLOGY: Zero-Price Effect — "Free" triggers irrational preference */}
                        <div className="pricing-card relative p-8 rounded-2xl transition-all duration-500 flex flex-col bg-[#111112] border border-white/10 hover:border-white/20 group">
                            <div className="mb-6 flex flex-col items-start gap-3">
                                <div className="px-3 py-1 rounded-full text-[11px] font-medium tracking-wide bg-white/10 text-white/70 border border-white/20">
                                    Always Free
                                </div>
                                <h3 className="text-2xl font-semibold text-white/90">Free</h3>
                            </div>

                            <div className="mb-6 flex items-baseline min-h-[60px]">
                                <span className="text-5xl font-bold tracking-tight text-white">
                                    {currency === 'INR' ? '₹0' : '$0'}
                                </span>
                                <span className="text-white/40 ml-2 text-sm font-medium">forever</span>
                            </div>

                            <div className="w-full h-px bg-white/10 mb-6" />

                            <div className="space-y-3.5 flex-grow mb-8">
                                {[
                                    { text: 'Online compiler (with ads)', active: true },
                                    { text: 'First 3 modules per course', active: true },
                                    { text: 'Easy DSA problems only', active: true },
                                    { text: '5 min/day AI Voice Tutor', active: true },
                                    { text: '5 AI chat messages/day', active: true },
                                    { text: '1v1 arena — 1 match/day', active: true },
                                    { text: 'XP, streaks & shop', active: true },
                                    { text: 'Certificates', active: false },
                                    { text: 'Interview Prep', active: false },
                                    { text: 'Priority support', active: false },
                                ].map((f, i) => (
                                    <FeatureRow key={i} text={f.text} active={f.active} />
                                ))}
                            </div>

                            {/* PSYCHOLOGY: Foot-in-the-Door — Low commitment CTA */}
                            <button
                                onClick={() => router.push('/onboarding')}
                                className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20"
                            >
                                {userTier !== 'free' ? 'You\'re on a paid plan ✓' : 'Start Free →'}
                            </button>
                        </div>

                        {/* ──────── PRO CARD (HIGHLIGHTED) ──────── */}
                        {/* PSYCHOLOGY: Default Effect + Bandwagon — "Most Popular" + visual ring */}
                        <div className="pricing-card relative p-8 rounded-2xl transition-all duration-500 flex flex-col bg-[#111112] border-2 border-orange-500/40 hover:border-orange-500/60 shadow-[0_0_40px_rgba(249,115,22,0.1)] group md:-mt-4 md:mb-4">
                            {/* Most Popular badge */}
                            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[11px] font-bold px-4 py-1 rounded-full shadow-lg shadow-orange-500/25 uppercase tracking-wider">
                                    ⚡ Most Popular
                                </div>
                            </div>

                            <div className="mb-6 flex flex-col items-start gap-3 mt-2">
                                <div className="px-3 py-1 rounded-full text-[11px] font-medium tracking-wide bg-orange-500/20 text-orange-300 border border-orange-500/30">
                                    {billingCycle === 'annual' ? 'Best value' : billingCycle === 'quarterly' ? (proPrices as any).savePct : 'Most chosen'}
                                </div>
                                <h3 className="text-2xl font-semibold text-white/90">Pro</h3>
                            </div>

                            <div className="mb-1 flex items-baseline min-h-[48px]">
                                <span className="text-5xl font-bold tracking-tight text-white">
                                    {formatPrice(proPrices[currency], currency)}
                                </span>
                                <span className="text-white/40 ml-2 text-sm font-medium">
                                    /{billingCycle === 'monthly' ? 'mo' : billingCycle === 'quarterly' ? '3 mo' : 'yr'}
                                </span>
                            </div>

                            {/* PSYCHOLOGY: Mental Accounting — Daily cost reframe */}
                            <p className="text-xs text-zinc-500 mb-1 font-sans">
                                That's just <span className="text-orange-400 font-semibold">{currency === 'INR' ? proPrices.dailyINR : proPrices.dailyUSD}/day</span>
                                {' '} — less than a chai ☕
                            </p>

                            {/* PSYCHOLOGY: Contrast — Show savings vs monthly */}
                            {billingCycle !== 'monthly' && 'saveINR' in proPrices && (
                                <p className="text-xs text-orange-400 font-medium mb-4">
                                    You save {currency === 'INR' ? proPrices.saveINR : proPrices.saveUSD} vs monthly
                                </p>
                            )}
                            {billingCycle === 'monthly' && <div className="mb-4" />}

                            <div className="w-full h-px bg-orange-500/20 mb-6" />

                            <div className="space-y-3.5 flex-grow mb-6">
                                {[
                                    { text: 'All premium learning modules', active: true },
                                    { text: 'Open source contribution module', active: true },
                                    { text: '50 min/day AI Voice Tutor', active: true, badge: 'AI' },
                                    { text: '25 AI chat messages/day', active: true, badge: 'AI' },
                                    { text: '1v1 arena — 20 matches/day', active: true },
                                    { text: 'AI hints while solving', active: true },
                                    { text: 'Full DSA — All difficulties', active: true },
                                    { text: '10% discount on shop', active: true },
                                    { text: 'Course certificates', active: true },
                                    { text: 'Email support', active: true },
                                    { text: 'Interview Prep', active: false },
                                ].map((f, i) => (
                                    <FeatureRow key={i} text={f.text} active={f.active} badge={f.badge} />
                                ))}
                            </div>

                            {/* ─── PROMO CODE UI ─── */}
                            <div className="mb-4">
                                {!showPromoInput ? (
                                    <button 
                                        onClick={() => setShowPromoInput(true)}
                                        className="text-[11px] text-zinc-500 hover:text-white transition-colors font-medium flex items-center gap-1"
                                    >
                                        <Icon icon="lucide:tag" />
                                        Have a promo code?
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="text"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            placeholder="Enter code"
                                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 w-full"
                                        />
                                        <button 
                                            onClick={() => setShowPromoInput(false)}
                                            className="text-zinc-500 hover:text-white"
                                        >
                                            <Icon icon="lucide:x" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Main CTA */}
                            {userTier === 'pro' || userTier === 'elite' ? (
                                <div className="w-full py-3.5 rounded-xl text-sm font-bold text-center bg-white/5 border border-orange-500/30 text-orange-400">
                                    {userTier === 'pro' ? '✓ Current Plan' : '⚡ You\'re on Elite'}
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleSubscribe('pro')}
                                    disabled={isLoading !== null}
                                    className="w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-300 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-400 hover:to-orange-500 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                                >
                                    <span className="relative z-10">
                                        {isLoading === `pro_${billingCycle}` ? 'Processing...' : 'Go Pro →'}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </button>
                            )}
                        </div>

                        {/* ──────── ELITE CARD ──────── */}
                        {/* PSYCHOLOGY: Door-in-the-Face — Higher anchor makes Pro look reasonable */}
                        <div className="pricing-card relative p-8 rounded-2xl transition-all duration-500 flex flex-col bg-[#111112] border border-orange-500/30 hover:border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.08)] group">
                            <div className="mb-6 flex flex-col items-start gap-3 mt-2">
                                <div className="px-3 py-1 rounded-full text-[11px] font-medium tracking-wide bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    {billingCycle === 'annual' ? 'Best value' : billingCycle === 'quarterly' ? (elitePrices as any).savePct : 'Ultimate'}
                                </div>
                                <h3 className="text-2xl font-semibold text-white/90">Elite</h3>
                            </div>

                            <div className="mb-1 flex items-baseline min-h-[48px]">
                                <span className="text-5xl font-bold tracking-tight text-white">
                                    {formatPrice(elitePrices[currency], currency)}
                                </span>
                                <span className="text-white/40 ml-2 text-sm font-medium">
                                    /{billingCycle === 'monthly' ? 'mo' : billingCycle === 'quarterly' ? '3 mo' : 'yr'}
                                </span>
                            </div>

                            {/* PSYCHOLOGY: Mental Accounting */}
                            <p className="text-xs text-zinc-500 mb-1 font-sans">
                                That's just <span className="text-amber-400 font-semibold">{currency === 'INR' ? elitePrices.dailyINR : elitePrices.dailyUSD}/day</span>
                                {' '} — less than a coffee ☕
                            </p>

                            {billingCycle !== 'monthly' && 'saveINR' in elitePrices && (
                                <p className="text-xs text-emerald-400 font-medium mb-4">
                                    You save {currency === 'INR' ? elitePrices.saveINR : elitePrices.saveUSD} vs monthly
                                </p>
                            )}
                            <div className="w-full h-px bg-amber-500/20 mb-6" />

                            <div className="space-y-3.5 flex-grow mb-6">
                                {[
                                    { text: 'Everything in Pro Plan', active: true, highlight: true },
                                    { text: 'Unlimited AI Voice Tutor', active: true, badge: 'AI' },
                                    { text: 'Unlimited AI chat messages', active: true, badge: 'AI' },
                                    { text: '1v1 arena — Unlimited matches', active: true },
                                    { text: 'Live Interview preparation', active: true },
                                    { text: 'Access to All contests', active: true },
                                    { text: 'Priority customer support', active: true },
                                    { text: 'Placement assistance', active: true },
                                    { text: 'Personal Mentor access', active: true },
                                ].map((f, i) => (
                                    <FeatureRow key={i} text={f.text} active={f.active} badge={f.badge} highlight={f.highlight} />
                                ))}
                            </div>

                            {/* ─── PROMO CODE UI ─── */}
                            <div className="mb-4">
                                {!showPromoInput ? (
                                    <button 
                                        onClick={() => setShowPromoInput(true)}
                                        className="text-[11px] text-zinc-500 hover:text-white transition-colors font-medium flex items-center gap-1"
                                    >
                                        <Icon icon="lucide:tag" />
                                        Have a promo code?
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="text"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            placeholder="Enter code"
                                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 w-full"
                                        />
                                        <button 
                                            onClick={() => setShowPromoInput(false)}
                                            className="text-zinc-500 hover:text-white"
                                        >
                                            <Icon icon="lucide:x" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* PSYCHOLOGY: Loss Aversion — "Don't miss" framing */}
                            {userTier === 'elite' ? (
                                <div className="w-full py-3.5 rounded-xl text-sm font-bold text-center bg-orange-500/10 border border-orange-500/30 text-orange-400">
                                    ⚡ Current Plan
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleSubscribe('elite')}
                                    disabled={isLoading !== null}
                                    className="w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-300 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-400 hover:to-orange-500 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                                >
                                    <span className="relative z-10">
                                        {isLoading === `elite_${billingCycle}` ? 'Processing...' : 'Unlock Elite →'}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ╔═══════════════════════════════════════╗
                       ║  TRUST BADGES                         ║
                       ╚═══════════════════════════════════════╝ */}
                    {/* PSYCHOLOGY: Regret Aversion + Authority */}
                    <div className="trust-section flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-16 px-4">
                        <div className="trust-badge flex items-center gap-2 text-zinc-400 text-sm font-sans">
                            <Icon icon="lucide:shield-check" className="text-orange-400 text-lg" />
                            <span>30-day money-back guarantee</span>
                        </div>
                        <div className="trust-badge flex items-center gap-2 text-zinc-400 text-sm font-sans">
                            <Icon icon="lucide:lock" className="text-orange-400 text-lg" />
                            <span>Secure payments via Razorpay</span>
                        </div>
                        <div className="trust-badge flex items-center gap-2 text-zinc-400 text-sm font-sans">
                            <Icon icon="lucide:x-circle" className="text-zinc-400 text-lg" />
                            <span>Cancel anytime, no lock-in</span>
                        </div>
                        <div className="trust-badge flex items-center gap-2 text-zinc-400 text-sm font-sans">
                            <Icon icon="lucide:zap" className="text-orange-400 text-lg" />
                            <span>Instant access after payment</span>
                        </div>
                    </div>

                    {/* ╔═══════════════════════════════════════╗
                       ║  COMPARISON TABLE                     ║
                       ╚═══════════════════════════════════════╝ */}
                    {/* PSYCHOLOGY: Anchoring — boot.dev charges ₹4,900/mo for just backend */}
                    <div className="mb-16 max-w-3xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-bebas)] tracking-wider mb-2">WHY ELITEFOLKS?</h2>
                            <p className="text-sm text-zinc-500 font-sans">See what other platforms charge for less</p>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
                            <table className="w-full text-sm font-sans">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="text-left py-4 px-6 text-zinc-400 font-medium">Platform</th>
                                        <th className="text-left py-4 px-6 text-zinc-400 font-medium">Monthly Price</th>
                                        <th className="text-left py-4 px-6 text-zinc-400 font-medium">What You Get</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-white/5">
                                        <td className="py-3.5 px-6 text-zinc-400">boot.dev</td>
                                        <td className="py-3.5 px-6 text-zinc-400">$59/mo</td>
                                        <td className="py-3.5 px-6 text-zinc-400">Backend courses only</td>
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <td className="py-3.5 px-6 text-zinc-400">Codecademy Pro</td>
                                        <td className="py-3.5 px-6 text-zinc-400">$40/mo</td>
                                        <td className="py-3.5 px-6 text-zinc-400">Courses + projects</td>
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <td className="py-3.5 px-6 text-zinc-400">LeetCode Premium</td>
                                        <td className="py-3.5 px-6 text-zinc-400">$35/mo</td>
                                        <td className="py-3.5 px-6 text-zinc-400">DSA problems only</td>
                                    </tr>
                                    <tr className="bg-orange-500/5 border border-orange-500/20">
                                        <td className="py-3.5 px-6 text-white font-semibold flex items-center gap-2">
                                            EliteFolks Pro
                                            <span className="bg-orange-500/20 text-orange-400 text-[9px] px-1.5 py-0.5 rounded font-bold">YOU</span>
                                        </td>
                                        <td className="py-3.5 px-6 text-white font-semibold">{currency === 'INR' ? '₹999/mo' : '$25/mo'}</td>
                                        <td className="py-3.5 px-6 text-white font-medium">Courses + DSA + AI Voice + Arena + Interview Prep</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ╔═══════════════════════════════════════╗
                       ║  COLLEGE / TEAM SECTION                ║
                       ╚═══════════════════════════════════════╝ */}
                    <div className="text-center mb-16">
                        <div className="bg-gradient-to-r from-[#111] via-[#151515] to-[#111] border border-white/5 rounded-2xl p-8 md:p-12 max-w-2xl mx-auto">
                            <Icon icon="lucide:building-2" className="text-3xl text-zinc-400 mb-4 mx-auto" />
                            <h3 className="text-xl font-bold text-white mb-2 font-sans">For Teams & Colleges</h3>
                            <p className="text-sm text-zinc-400 mb-6 font-sans">
                                Get custom pricing for your team, college lab, or coding bootcamp. 
                                Bulk discounts, admin dashboards, and LMS integration.
                            </p>
                            <a
                                href="mailto:atulchahar1206@gmail.com?subject=EliteFolks%20Team/College%20Pricing"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
                            >
                                <Icon icon="lucide:mail" className="text-base" />
                                Contact Us for Custom Plans
                            </a>
                        </div>
                    </div>

                    {/* ╔═══════════════════════════════════════╗
                       ║  FAQ SECTION                          ║
                       ╚═══════════════════════════════════════╝ */}
                    <div className="max-w-2xl mx-auto mb-16">
                        <h2 className="text-2xl font-bold text-center text-white font-[family-name:var(--font-bebas)] tracking-wider mb-8">FREQUENTLY ASKED QUESTIONS</h2>
                        <div className="space-y-4">
                            {[
                                {
                                    q: 'Can I cancel anytime?',
                                    a: 'Yes! No lock-in. Cancel from your Settings page anytime. You\'ll keep access until the end of your billing period.'
                                },
                                {
                                    q: 'What payment methods do you accept?',
                                    a: 'We accept all major credit/debit cards, UPI, net banking, and wallets via Razorpay. For international users, we accept Visa/Mastercard.'
                                },
                                {
                                    q: 'Is there a money-back guarantee?',
                                    a: 'Yes — 30-day no-questions-asked refund policy. If EliteFolks isn\'t right for you, we\'ll refund your payment in full.'
                                },
                                {
                                    q: 'What happens after my free trial of 3 modules?',
                                    a: 'You can continue using the free compiler, 1 daily match, and AI voice (5 min/day) forever. To unlock all modules, upgrade to Pro or Elite.'
                                },
                                {
                                    q: 'Can I switch plans?',
                                    a: 'You can upgrade anytime. Your new plan starts immediately. Contact support to downgrade or switch billing cycles.'
                                },
                            ].map((faq, i) => (
                                <FAQItem key={i} question={faq.q} answer={faq.a} />
                            ))}
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
};

// ─── Feature Row Component ───
function FeatureRow({ text, active, badge, highlight }: { text: string; active: boolean; badge?: string; highlight?: boolean }) {
    return (
        <div className={`flex items-start gap-3 text-[13px] transition-colors font-medium leading-snug ${active ? (highlight ? 'text-amber-300' : 'text-white/80') : 'text-white/30'}`}>
            <div
                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: active ? 'rgba(249,115,22,0.15)' : 'transparent' }}
            >
                <Icon
                    icon={active ? 'lucide:check' : 'heroicons:x-mark-solid'}
                    className={`text-[12px] ${active ? 'text-orange-500' : 'text-white/20'}`}
                />
            </div>
            <span className="flex-1 flex items-center gap-2 flex-wrap">
                {text}
                {badge && (
                    <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                        {badge}
                    </span>
                )}
            </span>
        </div>
    );
}

// ─── FAQ Accordion Component ───
function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-white/5 rounded-xl overflow-hidden bg-[#111] hover:border-white/10 transition-colors">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
            >
                <span className="text-sm font-medium text-white/90 font-sans">{question}</span>
                <Icon
                    icon={open ? 'lucide:chevron-up' : 'lucide:chevron-down'}
                    className="text-zinc-400 text-lg flex-shrink-0 ml-4 transition-transform"
                />
            </button>
            {open && (
                <div className="px-6 pb-4">
                    <p className="text-sm text-zinc-400 font-sans leading-relaxed">{answer}</p>
                </div>
            )}
        </div>
    );
}

export default PricingPage;
