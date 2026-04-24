'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Coins, LogOut, User as UserIcon, LayoutDashboard, Trophy, Target, Settings, Menu, X } from 'lucide-react';

// Lazy load heavy components — only loaded when needed
const NotificationDropdown = dynamic(() => import('./NotificationDropdown'), { ssr: false });
const ShopModal = dynamic(() => import('./ShopModal'), { ssr: false });

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isHidden, setIsHidden] = useState(false);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);
    const [isShopOpen, setIsShopOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [gems, setGems] = useState(0);
    const [subscriptionTier, setSubscriptionTier] = useState<string>('free');

    useEffect(() => {
        const handleScroll = () => {
            if (ticking.current) return;
            ticking.current = true;
            requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                const delta = currentScrollY - lastScrollY.current;
                // Only trigger hide/show after a meaningful scroll distance
                if (Math.abs(delta) > 6) {
                    // Hide when scrolling DOWN past 80px, always show when near top
                    if (currentScrollY < 80) {
                        setIsHidden(false);
                    } else if (delta > 0) {
                        setIsHidden(true);  // scrolling down
                    } else {
                        setIsHidden(false); // scrolling up
                    }
                    lastScrollY.current = currentScrollY;
                }
                ticking.current = false;
            });
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (user) loadUserStats();
    }, [user, isShopOpen]); // Reload when shop closes to update balance

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const loadUserStats = async () => {
        if (!user) return;
        try {
            const res = await fetch('/api/data/profile');
            if (!res.ok) return;
            const data = await res.json();
            if (data.stats) {
                setGems(data.stats.coins || 0);
                setSubscriptionTier(data.stats.subscriptionTier || 'free');
            }
        } catch {}
    };

    const isActive = (path: string) => pathname === path;
    const activeLinkClass = "text-white bg-white/10 px-3 py-1.5 rounded-full";
    const inactiveLinkClass = "text-zinc-400 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/5 transition-all";

    // Hide global Navbar during active battle
    if (pathname?.match(/^\/training\/competitive\/[a-zA-Z0-9_-]+$/)) {
        return null;
    }

    return (
        <>
            {/* Gradient scrim — moves with the navbar so text behind never overlaps */}
            <div
                className="fixed top-0 left-0 w-full pointer-events-none z-40 will-change-transform h-[110px] bg-[linear-gradient(to_bottom,rgba(0,0,0,0.58)_0%,rgba(0,0,0,0.2)_60%,transparent_100%)] transition-transform duration-[0.45s] ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{
                    transform: isHidden ? 'translateY(-100%)' : 'translateY(0)',
                }}
                aria-hidden="true"
            />
            <div
                className="fixed flex w-full z-50 top-0 left-0 justify-center will-change-transform transition-transform duration-[0.45s] ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{
                    transform: isHidden ? 'translateY(-100%)' : 'translateY(0)',
                }}
            >
                <nav className="flex items-center justify-between w-full px-6 md:px-12 py-4 bg-transparent"
                    style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
                >
                    <Link href="/" className="flex items-center gap-3 shrink-0 cursor-pointer lg:w-[240px]">
                        <img src="/voicecode-logo.png" alt="EliteFolks Logo" className="h-6 w-auto" width="24" height="24" />
                        <span className="text-xl font-[var(--font-bebas)] tracking-widest text-foreground flex items-center mt-1">
                            ELITEFOLKS
                        </span>
                    </Link>

                    {/* Main Nav Links container with flex-1 to distribute evenly without absolute positioning */}
                    <div className="hidden md:flex items-center justify-center flex-1">
                        <div className="flex items-center gap-8 px-4 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
                            style={{
                                opacity: user !== undefined ? 1 : 0,
                                transform: user !== undefined ? 'translateY(0)' : 'translateY(-10px)'
                            }}
                        >
                            <Link href="/" className={`font-mono text-[10px] uppercase tracking-widest transition-colors ${isActive('/') ? 'text-accent' : 'text-muted-foreground hover:text-foreground'}`}>Index</Link>
                            <Link href="/courses" className={`font-mono text-[10px] uppercase tracking-widest transition-colors ${isActive('/courses') ? 'text-accent' : 'text-muted-foreground hover:text-foreground'}`}>Courses</Link>
                            <Link href="/compiler" className={`font-mono text-[10px] uppercase tracking-widest transition-colors ${isActive('/compiler') ? 'text-accent' : 'text-muted-foreground hover:text-foreground'}`}>Compiler</Link>
                            <Link href="/pricing" className={`font-mono text-[10px] uppercase tracking-widest transition-colors ${isActive('/pricing') ? 'text-accent' : 'text-muted-foreground hover:text-foreground'}`}>Pricing</Link>
                            <Link href="/community" className={`font-mono text-[10px] uppercase tracking-widest transition-colors ${isActive('/community') ? 'text-accent' : 'text-muted-foreground hover:text-foreground'}`}>Community</Link>

                            {/* Auth-dependent Links with sliding reveal to prevent layout snap */}
                            <div
                                className={`flex items-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${user ? 'max-w-[500px] opacity-100 gap-8' : 'max-w-0 opacity-0 gap-0'}`}
                            >
                                <Link href="/dashboard" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
                                    Dashboard
                                </Link>
                                <Link href="/training" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
                                    Training
                                </Link>
                                <Link href="/leaderboard" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
                                    Leaderboard
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 shrink-0 z-10 lg:w-auto lg:min-w-[240px] justify-end">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        {/* Animate Auth Actions Wrapper */}
                        <div
                            className="hidden md:flex items-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
                            style={{
                                opacity: user !== undefined ? 1 : 0,
                                transform: user !== undefined ? 'translateX(0)' : 'translateX(10px)'
                            }}
                        >
                            {!user ? (
                                <div className="flex items-center gap-6">
                                    <Link href="/login" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
                                    <Link href="/signup" className="font-mono text-[10px] uppercase tracking-[0.2em] bg-white text-black hover:bg-zinc-200 px-5 py-2 transition-all">
                                        Get Started
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 border border-border/20 bg-zinc-950 px-4 py-1.5 rounded-full">
                                    {/* Gems / Shop Trigger */}
                                    <button
                                        onClick={() => setIsShopOpen(true)}
                                        className="flex items-center gap-1.5 text-accent hover:text-orange-400 transition-colors group px-2 border-r border-border/20"
                                    >
                                        <Coins size={12} className="group-hover:scale-110 transition-transform" />
                                        <span className="font-mono text-[10px] tracking-widest hidden sm:inline pt-[1px]">{gems.toLocaleString()}</span>
                                    </button>

                                    {/* Premium Badge */}
                                    {subscriptionTier !== 'free' && (
                                        <span className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                                            subscriptionTier === 'elite'
                                                ? 'bg-orange-500/20 text-orange-400 border-orange-500/30 shadow-[0_0_8px_rgba(249,115,22,0.2)]'
                                                : 'bg-white/10 text-white/80 border-white/20'
                                        }`}>
                                            {subscriptionTier === 'elite' ? '⚡ ELITE' : '★ PRO'}
                                        </span>
                                    )}

                                    {/* Notifications */}
                                    <div className="hidden md:block">
                                        <NotificationDropdown />
                                    </div>

                                    {/* Settings */}
                                    <Link
                                        href="/settings"
                                        className={`hidden md:block transition-colors px-1 ${isActive('/settings') ? 'text-accent' : 'text-muted-foreground hover:text-foreground'}`}
                                        title="Settings"
                                    >
                                        <Settings size={14} />
                                    </Link>

                                    {/* Profile & Logout */}
                                    <div className="hidden md:flex items-center gap-4 pl-2 border-l border-border/20">
                                        <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-all hover:scale-110">
                                            {user.avatar ? (
                                                <img 
                                                    src={user.avatar} 
                                                    alt={user.name} 
                                                    className="w-6 h-6 rounded-full object-cover border border-white/10 shadow-lg shadow-black/40"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                                    }}
                                                />
                                            ) : (
                                                <UserIcon size={18} />
                                            )}
                                        </Link>

                                        <button onClick={() => setShowLogoutModal(true)} className="text-muted-foreground hover:text-destructive transition-colors mr-1" title="Logout">
                                            <LogOut size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-lg pt-28 px-6 animate-in slide-in-from-top-10 duration-200">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2">Menu</h3>
                            <Link href="/" className="text-xl font-bold text-white py-2">Product</Link>
                            <Link href="/courses" className="text-xl font-bold text-white py-2">Courses</Link>
                            <Link href="/compiler" className="text-xl font-bold text-white py-2">Compiler</Link>
                            <Link href="/pricing" className="text-xl font-bold text-white py-2">Pricing</Link>
                            <Link href="/community" className="text-xl font-bold text-white py-2">Community</Link>
                        </div>

                        {user && (
                            <div className="flex flex-col gap-2 border-t border-zinc-800 pt-6">
                                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2">Learning</h3>
                                <Link href="/dashboard" className="flex items-center gap-3 text-xl font-bold text-white py-2">
                                    <LayoutDashboard size={20} /> Dashboard
                                </Link>
                                <Link href="/training" className="flex items-center gap-3 text-xl font-bold text-white py-2">
                                    <Target size={20} /> Training
                                </Link>
                                <Link href="/leaderboard" className="flex items-center gap-3 text-xl font-bold text-white py-2">
                                    <Trophy size={20} /> Leaderboard
                                </Link>
                            </div>
                        )}

                        <div className="flex flex-col gap-2 border-t border-zinc-800 pt-6">
                            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2">Account</h3>
                            {!user ? (
                                <>
                                    <Link href="/login" className="text-xl font-bold text-white py-2">Sign in</Link>
                                    <Link href="/signup" className="text-xl font-bold text-orange-500 py-2">Get Started</Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/profile" className="flex items-center gap-3 text-xl font-bold text-white py-2">
                                        <UserIcon size={20} /> Profile
                                    </Link>
                                    <Link href="/settings" className="flex items-center gap-3 text-xl font-bold text-white py-2">
                                        <Settings size={20} /> Settings
                                    </Link>
                                    <button onClick={() => setShowLogoutModal(true)} className="flex items-center gap-3 text-xl font-bold text-red-500 py-2 text-left">
                                        <LogOut size={20} /> Sign Out
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Global Shop Modal */}
            <ShopModal
                isOpen={isShopOpen}
                onClose={() => setIsShopOpen(false)}
                currentGems={gems}
                onTransactionComplete={loadUserStats}
            />

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setShowLogoutModal(false)} />
                    <div className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl p-6 animate-bounce-in flex flex-col gap-4">
                        <div className="flex flex-col gap-1 text-center">
                            <h3 className="text-xl font-bold text-white font-outfit">Log Out?</h3>
                            <p className="text-zinc-400 text-sm">Are you sure you want to sign out of your account?</p>
                        </div>

                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-colors border border-white/5"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    logout();
                                    setShowLogoutModal(false);
                                }}
                                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors shadow-lg shadow-red-900/20"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;