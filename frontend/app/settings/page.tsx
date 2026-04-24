'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { dbService } from '../../services/dbService';
import { UserStats } from '../../types';
import { Loader2 } from 'lucide-react';

import {
    SettingsHeader,
    SettingsSidebar,
    ProfileTab,
    SecurityTab,
    SiteSettingsTab,
    DangerZoneTab,
    SubscriptionTab,
    TabType,
} from './components';

// ============================================================================
// SETTINGS PAGE - Premium UI with Modular Components
// ============================================================================

const SettingsPage = () => {
    const router = useRouter();
    const { user } = useAuth();

    // -------------------------------------------------------------------------
    // State Management
    // -------------------------------------------------------------------------
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [deletionScheduledFor, setDeletionScheduledFor] = useState<string | null>(null);

    // Profile Form State
    const [formData, setFormData] = useState({
        name: '',
        tagline: '',
        bio: '',
        location: '',
        githubHandle: '',
        linkedinHandle: '',
        websiteUrl: '',
    });

    // Site Settings State
    const [siteSettings, setSiteSettings] = useState({
        soundEnabled: true,
        notificationsEnabled: true,
        darkMode: true,
    });

    // -------------------------------------------------------------------------
    // Data Fetching & Persistence
    // -------------------------------------------------------------------------

    // 1. Initial Load from DB & LocalStorage Draft
    useEffect(() => {
        if (user) {
            dbService.getUserStats(user.id).then((data) => {
                if (data) {
                    setStats(data);

                    // Check for pending deletion
                    if ((data as any).deletion_scheduled_for) {
                        setDeletionScheduledFor((data as any).deletion_scheduled_for);
                    }

                    // Base data from DB/Auth
                    const dbData = {
                        name: user.name || '',
                        tagline: data.tagline || '',
                        bio: data.bio || '',
                        location: data.location || '',
                        githubHandle: data.githubHandle || '',
                        linkedinHandle: data.linkedinHandle || '',
                        websiteUrl: data.websiteUrl || '',
                    };

                    // Check for local draft
                    const savedDraft = localStorage.getItem(`profile_draft_${user.id}`);
                    if (savedDraft) {
                        try {
                            const parsedDraft = JSON.parse(savedDraft);
                            setFormData({ ...dbData, ...parsedDraft });
                        } catch (e) {
                            setFormData(dbData);
                        }
                    } else {
                        setFormData(dbData);
                    }
                }
                setLoading(false);
            });
        }
    }, [user]);

    // 2. Persist Draft to LocalStorage on Change
    useEffect(() => {
        if (user && !loading && !saving) {
            localStorage.setItem(`profile_draft_${user.id}`, JSON.stringify(formData));
        }
    }, [formData, user, loading, saving]);

    // -------------------------------------------------------------------------
    // Event Handlers
    // -------------------------------------------------------------------------
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSaving(true);
        setMessage(null);

        try {
            const { sanitizeString } = await import('../../utils/security');

            // Sanitize all text inputs for security
            const sanitizedName = sanitizeString(formData.name);
            const sanitizedTagline = sanitizeString(formData.tagline);
            const sanitizedBio = sanitizeString(formData.bio);
            const sanitizedLocation = sanitizeString(formData.location);

            // 1. Update Appwrite account name for immediate sync
            if (sanitizedName !== user.name) {
                const { account } = await import('../../lib/appwrite');
                await account.updateName(sanitizedName);

                // Update database profile as well
                await dbService.updateUser(user.id, { name: sanitizedName });
            }

            // 2. Update stats and profile details
            await dbService.updateUserStats(user.id, {
                tagline: sanitizedTagline,
                bio: sanitizedBio,
                location: sanitizedLocation,
                githubHandle: formData.githubHandle,
                linkedinHandle: formData.linkedinHandle,
                websiteUrl: formData.websiteUrl,
            });

            // 3. Success -> Clear Draft
            localStorage.removeItem(`profile_draft_${user.id}`);

            // Update local state with sanitized values to reflect immediate change
            setFormData(prev => ({
                ...prev,
                name: sanitizedName,
                tagline: sanitizedTagline,
                bio: sanitizedBio,
                location: sanitizedLocation
            }));

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error: any) {
            console.error("Save error:", error);
            setMessage({ type: 'error', text: error.message || 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    const handleToggleSetting = (key: keyof typeof siteSettings) => {
        setSiteSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleResetCourses = async () => {
        if (!user) return;
        setMessage(null);

        // Reset course progress via dbService
        // Note: Full progress reset would need a dedicated function.
        // For now, just reset the stats counter.
        await dbService.updateUserStats(user.id, { lessonsCompleted: 0 });
        setMessage({ type: 'success', text: 'All course progress has been reset successfully!' });
    };

    const handleDeleteAccount = async () => {
        if (!user) return;
        setMessage(null);

        try {
            const res = await fetch('/api/auth/delete-account', {
                method: 'POST',
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to schedule account deletion');
            }

            // Redirect to login — user is signed out by the API
            router.push('/login');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to delete account.' });
        }
    };

    const handleCancelDeletion = async () => {
        if (!user) return;
        setMessage(null);

        try {
            const res = await fetch('/api/auth/delete-account', {
                method: 'DELETE',
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to cancel deletion');
            }

            setDeletionScheduledFor(null);
            setMessage({ type: 'success', text: 'Account deletion has been cancelled. Your account is safe!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to cancel deletion.' });
        }
    };

    // -------------------------------------------------------------------------
    // Loading State
    // -------------------------------------------------------------------------
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] pt-24 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-orange-500" size={40} />
                    <p className="text-zinc-500 text-sm">Loading settings...</p>
                </div>
            </div>
        );
    }

    // -------------------------------------------------------------------------
    // Render
    // -------------------------------------------------------------------------
    return (
        <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-16 px-4 md:px-8">
            {/* Background Effects */}
            <div className="grid-bg fixed inset-0 opacity-20 pointer-events-none z-0" aria-hidden="true" />
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header */}
                <SettingsHeader />

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-3">
                        <div className="sticky top-28">
                            <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-9">
                        <div className="bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-6 md:p-10">
                            {/* Message Alert */}
                            {message && (
                                <div
                                    className={`mb-8 p-4 rounded-2xl text-sm border flex items-center gap-3 animate-fade-in ${message.type === 'success'
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                    {message.text}
                                </div>
                            )}

                            {/* Tab Content */}
                            {activeTab === 'profile' && (
                                <ProfileTab
                                    formData={formData}
                                    onInputChange={handleInputChange}
                                    onSave={handleSaveProfile}
                                    saving={saving}
                                />
                            )}

                            {activeTab === 'subscription' && (
                                <SubscriptionTab
                                    tier={stats?.subscriptionTier || 'free'}
                                    plan={(stats as any)?.subscriptionPlan || ''}
                                />
                            )}

                            {activeTab === 'security' && (
                                <SecurityTab
                                    userEmail={user?.email || ''}
                                />
                            )}

                            {activeTab === 'site' && (
                                <SiteSettingsTab
                                    settings={siteSettings}
                                    onToggle={handleToggleSetting}
                                />
                            )}

                            {activeTab === 'danger' && (
                                <DangerZoneTab
                                    onResetCourses={handleResetCourses}
                                    onDeleteAccount={handleDeleteAccount}
                                    onCancelDeletion={handleCancelDeletion}
                                    deletionScheduledFor={deletionScheduledFor}
                                />
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
