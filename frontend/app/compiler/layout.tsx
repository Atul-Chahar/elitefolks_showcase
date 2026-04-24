import React from 'react';
import Script from 'next/script';
import { getServerUser } from '@/lib/appwrite-server';
import { dbService } from '../../services/dbService';

export default async function CompilerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1. Fetch User Session via Appwrite
    const user = await getServerUser();

    // 2. Determine Subscription Tier
    let isProUser = false;
    if (user) {
        try {
            const stats = await dbService.getUserStats(user.id);
            if (stats?.subscriptionTier === 'pro' || stats?.subscriptionTier === 'elite') {
                isProUser = true;
            }
        } catch (error) {
            console.error('[CompilerLayout] Failed to verify user tier:', error);
        }
    }

    // 3. Determine Ads Eligibility
    const shouldShowAds = !isProUser;

    return (
        <div className="h-screen w-full bg-[#0E0E0E] text-white flex flex-col font-sans selection:bg-orange-500/30 overflow-hidden pt-24">
            {shouldShowAds && (
                <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1347339927443696"
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />
            )}

            <main className="flex-1 flex flex-col relative min-h-0 overflow-hidden">
                {children}
            </main>
        </div>
    );
}
