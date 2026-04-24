import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import HeroSection from './landing/HeroSection';

// Lazy load below-fold sections — only loaded when they scroll into view
const FeaturesSection = dynamic(() => import('./landing/FeaturesSection'), { ssr: false });
const CareerPathSection = dynamic(() => import('./CareerPathSection'), { ssr: false });
const MobileDemoSection = dynamic(() => import('./landing/MobileDemoSection'), { ssr: false });
const ContactSection = dynamic(() => import('./landing/ContactSection'), { ssr: false });

import LoadingScreen from './ui/LoadingScreen';

const LandingPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);

    // Initialize animations on mount
    useEffect(() => {
        if ((window as any).initInViewAnimations) {
            (window as any).initInViewAnimations();
        }

        // Defer Unicorn Studio initialization to allow hero text animations to play smoothly first
        const timer = setTimeout(() => {
            if ((window as any).UnicornStudio) {
                (window as any).UnicornStudio.init();
            } else {
                // Fallback if script hasn't loaded yet
                const checkUnicorn = setInterval(() => {
                    if ((window as any).UnicornStudio) {
                        (window as any).UnicornStudio.init();
                        clearInterval(checkUnicorn);
                    }
                }, 100);
                setTimeout(() => clearInterval(checkUnicorn), 5000);
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {/* Loading Screen Overlay */}
            {isLoading && <LoadingScreen onFinished={() => setIsLoading(false)} />}

            <div className="min-h-screen bg-background relative overflow-x-hidden">

                {/* Background Component */}
                <div className="aura-background-component fixed top-0 w-full h-screen mix-blend-screen brightness-50 opacity-50 saturate-0 z-10 pointer-events-none"
                    data-alpha-mask="80"
                    style={{ maskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)' }}>
                    <div className="aura-background-component top-0 w-full -z-10 absolute h-full">
                        {/* Unicorn Studio Project */}
                        <div data-us-project="bKN5upvoulAmWvInmHza" className="absolute w-full h-full left-0 top-0 -z-10"></div>
                    </div>
                </div>

                {/* Progressive Blur Top */}
                <div className="gradient-blur">
                    <div></div>
                    <div className=""></div>
                    <div></div>
                    <div className=""></div>
                    <div></div>
                    <div></div>
                </div>

                {/* Hero Section — loaded eagerly (above the fold) */}
                <HeroSection enableAnimations={!isLoading} />

                {/* Below-fold sections — lazy loaded */}
                <FeaturesSection />
                <CareerPathSection />
                <MobileDemoSection />
                <ContactSection />
            </div>
        </>
    );
};

export default LandingPage;
