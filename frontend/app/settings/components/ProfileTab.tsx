'use client';

import React from 'react';
import { Save, Loader2, User } from 'lucide-react';
import FormInput from './FormInput';

interface ProfileFormData {
    name: string;
    tagline: string;
    bio: string;
    location: string;
    githubHandle: string;
    linkedinHandle: string;
    websiteUrl: string;
}

interface ProfileTabProps {
    formData: ProfileFormData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSave: (e: React.FormEvent) => void;
    saving: boolean;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ formData, onInputChange, onSave, saving }) => {
    return (
        <div className="animate-fade-in">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-xl flex items-center justify-center">
                    <User size={18} className="text-orange-500" />
                </div>
                <div>
                    <h2 className="font-[family-name:var(--font-bebas)] text-3xl tracking-wide text-white">Profile Information</h2>
                    <p className="text-zinc-500 text-xs">Tell us about yourself</p>
                </div>
            </div>

            <form onSubmit={onSave} className="space-y-8">
                {/* Name & Tagline Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={onInputChange}
                        placeholder="John Doe"
                    />
                    <FormInput
                        label="Tagline"
                        name="tagline"
                        value={formData.tagline}
                        onChange={onInputChange}
                        placeholder="Aspiring Developer"
                    />
                </div>

                {/* Bio */}
                <FormInput
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={onInputChange}
                    placeholder="Tell the world about your coding journey..."
                    multiline
                    rows={4}
                />

                {/* Location & Website Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={onInputChange}
                        placeholder="New York, USA"
                    />
                    <FormInput
                        label="Website URL"
                        name="websiteUrl"
                        value={formData.websiteUrl}
                        onChange={onInputChange}
                        placeholder="https://yourportfolio.com"
                        type="url"
                    />
                </div>

                {/* Social Handles Section */}
                <div className="pt-6 border-t border-zinc-800/50">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em] mb-6">
                        Social Profiles
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                            label="GitHub Handle"
                            name="githubHandle"
                            value={formData.githubHandle}
                            onChange={onInputChange}
                            placeholder="username"
                        />
                        <FormInput
                            label="LinkedIn Handle"
                            name="linkedinHandle"
                            value={formData.linkedinHandle}
                            onChange={onInputChange}
                            placeholder="username"
                        />
                    </div>
                </div>

                {/* Save Button */}
                <div className="pt-6 border-t border-zinc-800/50 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2.5 transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {/* Button glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-white/20 to-orange-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                        {saving ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        <span className="relative">{saving ? 'Saving...' : 'Save Profile'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileTab;
