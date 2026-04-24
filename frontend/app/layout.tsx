import './globals.css';
import type { Metadata } from 'next';
import { Inter, Outfit, Manrope, JetBrains_Mono, Bebas_Neue, IBM_Plex_Mono } from 'next/font/google';
import { Providers } from '../components/Providers';
import LayoutWrapper from '../components/LayoutWrapper';
import Script from 'next/script';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getServerUser } from '@/lib/appwrite-server';
import { serverDbService as dbService } from '@/services/serverDbService';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });
const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' });
const ibmPlexMono = IBM_Plex_Mono({ weight: ['400', '500'], subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
    title: 'EliteFolks - Master Coding with US',
    description: 'Learn to code using your voice. Interactive lessons for JavaScript, Python, and more.',
    openGraph: {
        title: 'EliteFolks - Master Coding with US',
        description: 'Learn to code using your voice. Interactive lessons for JavaScript, Python, and more.',
        url: 'https://elitefolks.com',
        siteName: 'EliteFolks',
        images: [
            {
                url: 'https://elitefolks.com/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'EliteFolks preview',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'EliteFolks - Master Coding with US',
        description: 'Learn to code using your voice. Interactive lessons for JavaScript, Python, and more.',
        images: ['https://elitefolks.com/og-image.jpg'],
    },
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1. Fetch User Session via Appwrite
    const user = await getServerUser();

    // 2. Determine Global Subscription Tier
    let isProUser = false;
    if (user) {
        try {
            const stats = await dbService.getUserStats(user.id);
            if (stats?.subscriptionTier === 'pro' || stats?.subscriptionTier === 'elite') {
                isProUser = true;
            }
        } catch (error) {
            console.error('[RootLayout] Failed to verify user tier for Ads:', error);
        }
    }

    const shouldShowAds = !isProUser;

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* Global Google AdSense Verification & Auto Ads (Free/Guest Tier Only) */}
                {shouldShowAds && (
                    <script
                        async
                        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1347339927443696"
                        crossOrigin="anonymous"
                    ></script>
                )}
            </head>
            <body
                className={`${inter.variable} ${outfit.variable} ${manrope.variable} ${jetbrainsMono.variable} ${bebasNeue.variable} ${ibmPlexMono.variable} font-sans antialiased`}
                suppressHydrationWarning
            >
                {/* Strip browser-extension injected attributes BEFORE React hydrates */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
(function(){
  var attrs = ['data-darkreader-inline-stroke','data-darkreader-inline-fill',
    'data-darkreader-inline-color','data-darkreader-inline-bgcolor',
    'data-darkreader-inline-outline','data-darkreader-inline-border',
    'data-darkreader-inline-boxshadow','data-darkreader-inline-bg'];
  attrs.forEach(function(a){
    document.querySelectorAll('['+a+']').forEach(function(el){
      el.removeAttribute(a);
    });
  });
  var styles = document.querySelectorAll('style.darkreader');
  styles.forEach(function(s){ s.disabled = true; });
})();
`,
                    }}
                />
                <Providers>
                    <LayoutWrapper>
                        {children}
                    </LayoutWrapper>
                </Providers>
                <Script
                    src="https://cdn.unicorn.studio/v1.2.1/unicornStudio.umd.js"
                    strategy="lazyOnload"
                />
                <SpeedInsights />
            </body>
        </html>
    );
}
