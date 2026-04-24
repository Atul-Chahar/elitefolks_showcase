'use client';

import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { serverProxiedDbService } from '../services/serverProxiedDbService';
import { ShopItem, InventoryItem } from '../types';
import { X, ShoppingBag, Coins, Flame, FlaskConical, Gem, Monitor, Terminal, Shield, Package, Play } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ShopModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentGems: number;
    onTransactionComplete: (newCoins?: number) => void;
    activeTheme?: string;
    // Initial data from server
    initialShopItems?: ShopItem[];
    initialInventory?: InventoryItem[];
    initialStats?: any;
}

// Import Server Actions
import { buyShopItem, sellShopItem, equipShopTheme, useShopItem } from '../app/actions/shop';

const ShopModal: React.FC<ShopModalProps> = ({ 
    isOpen, 
    onClose, 
    currentGems, 
    onTransactionComplete, 
    activeTheme = 'default',
    initialShopItems = [],
    initialInventory = [],
    initialStats = null
}) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
    const [shopItems, setShopItems] = useState<ShopItem[]>(initialShopItems);
    const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
    const [loading, setLoading] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [userStats, setUserStats] = useState<any>(initialStats);

    useEffect(() => {
        if (isOpen && user) {
            loadData();
        }
    }, [isOpen, user]);

    const loadData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const [items, inv, statsRes] = await Promise.all([
                serverProxiedDbService.getShopItems(),
                serverProxiedDbService.getInventory(user.id),
                serverProxiedDbService.getUserStats(user.id),
            ]);
            setShopItems(items);
            setInventory(inv);
            if (statsRes) setUserStats(statsRes);
        } catch (error) {
            console.error("Failed to load shop data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = async (item: ShopItem) => {
        if (!user) return;
        setProcessingId(item.id);
        setMessage(null);

        try {
            // Using Server Action
            const result = await buyShopItem(item.id, item.costGems);
            if (result.success) {
                setMessage({ text: `Successfully bought ${item.name}!`, type: 'success' });
                onTransactionComplete(currentGems - item.costGems); // Optimistic update
                loadData(); // Refresh local inventory
            } else {
                setMessage({ text: result.message || 'Purchase failed', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'An unexpected error occurred', type: 'error' });
        } finally {
            setProcessingId(null);
        }
    };

    const handleSell = async (item: ShopItem) => {
        if (!user) return;
        setProcessingId(item.id);
        setMessage(null);

        try {
            // Using Server Action
            const result = await sellShopItem(item.id, item.sellPriceGems);
            if (result.success) {
                setMessage({ text: `Sold ${item.name} for ${item.sellPriceGems} Gems`, type: 'success' });
                onTransactionComplete();
                loadData();
            } else {
                setMessage({ text: result.message || 'Sale failed', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Error selling item', type: 'error' });
        } finally {
            setProcessingId(null);
        }
    };

    const handleEquip = async (item: ShopItem) => {
        if (!user) return;
        setProcessingId(item.id);
        setMessage(null);

        try {
            // Using Server Action
            const result = await equipShopTheme(item.id);
            if (result.success) {
                setMessage({ text: `Equipped ${item.name}!`, type: 'success' });
                onTransactionComplete(); // Refresh parent stats (to get new activeTheme)
            } else {
                setMessage({ text: result.message || 'Equip failed', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Error equipping theme', type: 'error' });
        } finally {
            setProcessingId(null);
        }
    };

    const handleUse = async (item: ShopItem) => {
        if (!user) return;
        setProcessingId(item.id);
        setMessage(null);

        try {
            // Using Server Action
            const result = await useShopItem(item.id);
            if (result.success) {
                setMessage({ text: `${item.name} activated!`, type: 'success' });
                onTransactionComplete();
                loadData();
            } else {
                setMessage({ text: result.message || 'Failed to use item', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Error using item', type: 'error' });
        } finally {
            setProcessingId(null);
        }
    };

    const getIcon = (iconName: string, id: string) => {
        // Premium Icons mapping by ID
        if (id === 'xp_potion') return <img src="/images/shop/xp_potion.png" alt="XP Potion" className="w-10 h-10 object-contain" />;
        if (id === 'seer_stone') return <img src="/images/shop/seer_stone.png" alt="Seer Stone" className="w-10 h-10 object-contain" />;
        if (id === 'streak_freeze' || id === 'frozen_flame') return <img src="/images/shop/frozen_flame.png" alt="Frozen Flame" className="w-10 h-10 object-contain" />;
        if (id === 'theme_retro') return <img src="/images/shop/retro_terminal.png" alt="Retro Terminal" className="w-10 h-10 object-contain" />;
        if (id === 'theme_cyber') return <img src="/images/shop/cyberpunk_theme.png" alt="Cyberpunk Theme" className="w-10 h-10 object-contain" />;

        switch (iconName) {
            case 'flame-blue': return <Flame className="text-blue-500" size={32} />;
            case 'flask': return <FlaskConical className="text-purple-500" size={32} />;
            case 'gem': return <Gem className="text-pink-500" size={32} />;
            case 'monitor': return <Monitor className="text-cyan-500" size={32} />;
            case 'terminal': return <Terminal className="text-green-500" size={32} />;
            case 'shield': return <Shield className="text-red-500" size={32} />;
            default: return <Package className="text-zinc-500" size={32} />;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#121212] border border-zinc-800 rounded-3xl w-full max-w-4xl h-[600px] flex flex-col shadow-2xl relative overflow-hidden">

                {/* Header */}
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                        <ShoppingBag size={24} className="text-orange-500" />
                        <h2 className="text-2xl font-bold font-manrope text-white">Item Shop</h2>
                    </div>

                    <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-1 overflow-hidden">

                    {/* Sidebar / Tabs */}
                    <div className="w-1/4 bg-zinc-950 border-r border-zinc-800 p-4 flex flex-col gap-2">
                        <div className="bg-zinc-900 rounded-xl p-4 mb-4 border border-zinc-800">
                            <div className="text-zinc-500 text-xs uppercase font-bold tracking-wider mb-1">Your Coins</div>
                            <div className="flex items-center gap-2 text-[28px] font-black text-white italic">
                                <div className="w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                                    <Coins className="text-yellow-500" size={18} />
                                </div>
                                {currentGems.toLocaleString()}
                            </div>
                        </div>

                        <button
                            onClick={() => setActiveTab('buy')}
                            className={`flex items-center justify-between p-4 rounded-xl font-bold transition-all ${activeTab === 'buy' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-zinc-400 hover:bg-zinc-900'}`}
                        >
                            <span>Buy Items</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('sell')}
                            className={`flex items-center justify-between p-4 rounded-xl font-bold transition-all ${activeTab === 'sell' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900'}`}
                        >
                            <span>Sell Items</span>
                        </button>
                    </div>

                    {/* Main Grid */}
                    <div className="flex-1 p-6 overflow-y-auto bg-[#0D0D0D]">

                        {message && (
                            <div className={`mb-4 p-3 rounded-lg text-sm font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                {message.type === 'success' ? <div className="w-2 h-2 rounded-full bg-green-500" /> : <div className="w-2 h-2 rounded-full bg-red-500" />}
                                {message.text}
                            </div>
                        )}

                        {loading ? (
                            <div className="flex items-center justify-center h-40">
                                <i className="fas fa-circle-notch fa-spin text-orange-500 text-2xl"></i>
                            </div>
                        ) : activeTab === 'buy' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {shopItems.map(item => (
                                    <div key={item.id} className="bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 p-5 rounded-2xl flex flex-col items-center text-center transition-all hover:-translate-y-1">
                                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 mb-4 shadow-inner">
                                            {getIcon(item.iconName, item.id)}
                                        </div>
                                        <h3 className="font-bold text-white mb-1">{item.name}</h3>
                                        <p className="text-xs text-zinc-500 mb-4 h-8 px-2">{item.description}</p>

                                        <button
                                            onClick={() => handleBuy(item)}
                                            disabled={processingId === item.id || currentGems < item.costGems}
                                            className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all 
                                                ${currentGems >= item.costGems
                                                    ? 'bg-zinc-100 text-black hover:bg-white'
                                                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}
                                            `}
                                        >
                                            {processingId === item.id ? (
                                                <i className="fas fa-circle-notch fa-spin"></i>
                                            ) : (
                                                <>
                                                    <Coins size={14} className={currentGems >= item.costGems ? 'text-yellow-600' : 'text-zinc-600'} />
                                                    {item.costGems}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // SELL TAB
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {inventory.filter(i => i.quantity > 0).map(invItem => {
                                    const shopItem = shopItems.find(si => si.id === invItem.itemId);
                                    if (!shopItem) return null;

                                    return (
                                        <div key={invItem.id} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl flex flex-col items-center text-center">
                                            <div className="relative">
                                                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 mb-4">
                                                    {getIcon(shopItem.iconName, shopItem.id)}
                                                </div>
                                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-[#121212]">
                                                    {invItem.quantity}
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-white mb-1">{shopItem.name}</h3>

                                            {shopItem.category === 'theme' ? (
                                                <button
                                                    onClick={() => handleEquip(shopItem)}
                                                    disabled={processingId === shopItem.id || activeTheme === shopItem.id}
                                                    className={`w-full mt-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
                                                        ${activeTheme === shopItem.id
                                                            ? 'bg-green-500/20 text-green-400 cursor-default border border-green-500/30'
                                                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'}
                                                    `}
                                                >
                                                    {processingId === shopItem.id ? (
                                                        <i className="fas fa-circle-notch fa-spin"></i>
                                                    ) : activeTheme === shopItem.id ? (
                                                        <>
                                                            <i className="fas fa-check"></i> Equipped
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Monitor size={14} /> Equip
                                                        </>
                                                    )}
                                                </button>
                                            ) : shopItem.category === 'powerup' ? (
                                                <div className="flex gap-2 w-full mt-4">
                                                    <button
                                                        onClick={() => handleUse(shopItem)}
                                                        disabled={processingId === shopItem.id || (
                                                            shopItem.id === 'xp_potion' && userStats?.xpBoostUntil && new Date(userStats.xpBoostUntil) > new Date()
                                                        ) || (
                                                                shopItem.id === 'streak_freeze' && userStats?.streakFrozenUntil && new Date(userStats.streakFrozenUntil) > new Date()
                                                            ) || (
                                                                shopItem.id === 'seer_stone' && userStats?.seerStoneUntil && new Date(userStats.seerStoneUntil) > new Date()
                                                            )}
                                                        className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
                                                            ${(shopItem.id === 'xp_potion' && userStats?.xpBoostUntil && new Date(userStats.xpBoostUntil) > new Date()) ||
                                                                (shopItem.id === 'streak_freeze' && userStats?.streakFrozenUntil && new Date(userStats.streakFrozenUntil) > new Date()) ||
                                                                (shopItem.id === 'seer_stone' && userStats?.seerStoneUntil && new Date(userStats.seerStoneUntil) > new Date())
                                                                ? 'bg-green-500/20 text-green-400 cursor-default border border-green-500/30'
                                                                : 'bg-orange-600 text-white hover:bg-orange-500 shadow-lg shadow-orange-600/20'}
                                                        `}
                                                    >
                                                        {processingId === shopItem.id ? (
                                                            <i className="fas fa-circle-notch fa-spin"></i>
                                                        ) : (shopItem.id === 'xp_potion' && userStats?.xpBoostUntil && new Date(userStats.xpBoostUntil) > new Date()) ||
                                                            (shopItem.id === 'streak_freeze' && userStats?.streakFrozenUntil && new Date(userStats.streakFrozenUntil) > new Date()) ||
                                                            (shopItem.id === 'seer_stone' && userStats?.seerStoneUntil && new Date(userStats.seerStoneUntil) > new Date()) ? (
                                                            <>
                                                                <i className="fas fa-bolt animate-pulse"></i> Active
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Play size={14} /> Use
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleSell(shopItem)}
                                                        disabled={processingId === shopItem.id}
                                                        className="px-3 py-2.5 rounded-xl font-bold text-sm bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-all"
                                                        title="Sell for Gem Back"
                                                    >
                                                        <Coins size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleSell(shopItem)}
                                                    disabled={processingId === shopItem.id}
                                                    className="w-full mt-4 py-2.5 rounded-xl font-bold text-sm bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all flex items-center justify-center gap-2"
                                                >
                                                    {processingId === shopItem.id ? (
                                                        <i className="fas fa-circle-notch fa-spin"></i>
                                                    ) : (
                                                        <>
                                                            Sell for <Coins size={14} className="text-yellow-500" /> {shopItem.sellPriceGems}
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                                {inventory.every(i => i.quantity === 0) && (
                                    <div className="col-span-full py-12 text-center text-zinc-500 flex flex-col items-center">
                                        <Package size={48} className="mb-4 opacity-50" />
                                        <p>Your inventory is empty.</p>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopModal;
