'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import Script from 'next/script';

interface TurnstileWidgetProps {
    onVerify: (token: string) => void;
    onExpire?: () => void;
    onError?: () => void;
}

declare global {
    interface Window {
        turnstile?: {
            render: (container: string | HTMLElement, options: Record<string, unknown>) => string;
            reset: (widgetId: string) => void;
            remove: (widgetId: string) => void;
        };
        onTurnstileLoad?: () => void;
    }
}

const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({ onVerify, onExpire, onError }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const scriptLoadedRef = useRef(false);

    const renderWidget = useCallback(() => {
        if (!containerRef.current || !window.turnstile || widgetIdRef.current) return;

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
            theme: 'dark',
            callback: (token: string) => onVerify(token),
            'expired-callback': () => onExpire?.(),
            'error-callback': () => onError?.(),
        });
    }, [onVerify, onExpire, onError]);

    useEffect(() => {
        // If script was already loaded (e.g. navigated back), render immediately
        if (window.turnstile && containerRef.current && !widgetIdRef.current) {
            renderWidget();
        }

        return () => {
            if (widgetIdRef.current && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current);
                widgetIdRef.current = null;
            }
        };
    }, [renderWidget]);

    const handleScriptLoad = () => {
        scriptLoadedRef.current = true;
        renderWidget();
    };

    return (
        <>
            <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                strategy="afterInteractive"
                onLoad={handleScriptLoad}
            />
            <div
                ref={containerRef}
                className="flex justify-center"
            />
        </>
    );
};

export default TurnstileWidget;
