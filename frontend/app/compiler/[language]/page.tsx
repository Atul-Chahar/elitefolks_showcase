import React from 'react';
import { notFound } from 'next/navigation';
import { LANGUAGES, getLanguageBySlug } from '@/lib/judge0';
import CompilerClient from './CompilerClient';
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{ language: string }>;
}

// Generate static routes for all languages to ensure fast loading
export async function generateStaticParams() {
    return LANGUAGES.map((lang) => ({
        language: lang.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { language } = await params;
    const langConfig = getLanguageBySlug(language);

    if (!langConfig) {
        return {
            title: 'Language Not Found - EliteFolks',
        };
    }

    return {
        title: `Online ${langConfig.name} Compiler - Run ${langConfig.name} Code Free`,
        description: `Write and run ${langConfig.name} code online with our free compiler. No installation required. Supports standard input, stdout, and stderr.`,
        keywords: [`${langConfig.name} compiler`, `online ${langConfig.name} ide`, `run ${langConfig.name} online`, 'online code editor', 'free compiler'],
    };
}

export default async function CompilerPage({ params }: PageProps) {
    const { language } = await params;
    const langConfig = getLanguageBySlug(language);

    if (!langConfig) {
        notFound();
    }

    return <CompilerClient initialLanguage={langConfig} />;
}
