'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

interface GoogleAdProps {
    client?: string;
    slot: string;
    format?: string;
    responsive?: boolean;
    style?: React.CSSProperties;
    className?: string;
    layoutKey?: string;
}

export default function GoogleAd({
    client = 'ca-pub-1347339927443696', // Using the provided AdSense Publisher ID
    slot,
    format = 'auto',
    responsive = true,
    style,
    className,
    layoutKey,
}: GoogleAdProps) {
    const pathname = usePathname();

    useEffect(() => {
        try {
            // @ts-ignore
            if (typeof window !== 'undefined') {
                // @ts-ignore
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (error: any) {
            console.error('AdSense error:', error.message);
        }
    }, [pathname]);

    return (
        <div className={`google-ad-container overflow-hidden flex justify-center items-center w-full ${className || ''}`}>
            <ins
                className="adsbygoogle"
                style={style || { display: 'block', width: '100%' }}
                data-ad-client={client}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? 'true' : 'false'}
                data-ad-layout-key={layoutKey}
            />
            {/* The main AdSense script should be loaded once in the app layout, but we'll include it here with strategy="lazyOnload" to ensure it loads if a page needs it */}
            <Script
                id={`adsense-script-${slot}`}
                src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
                strategy="lazyOnload"
                crossOrigin="anonymous"
            />
        </div>
    );
}
