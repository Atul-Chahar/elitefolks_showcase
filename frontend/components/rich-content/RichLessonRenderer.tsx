/**
 * RichLessonRenderer — Main orchestrator component that reads
 * section types from the explanations JSONB array and renders
 * the appropriate widget for each section.
 * 
 * This replaces the old approach of rendering raw HTML from explanations[0].
 * Now, explanations[] contains typed section objects like:
 *   { type: "text", content: "..." }
 *   { type: "code", language: "javascript", code: "...", explanation: "..." }
 *   { type: "callout", style: "info", title: "...", content: "..." }
 *   etc.
 */
'use client';

import React from 'react';
import CalloutBox from './CalloutBox';
import CodeBlock from './CodeBlock';
import ComparisonTable from './ComparisonTable';
import KeyConceptCard from './KeyConceptCard';
import StepList from './StepList';
import RealWorldCard from './RealWorldCard';
import AsciiDiagram from './AsciiDiagram';
import MemoryModel from './MemoryModel';
import InteractiveDemo from './InteractiveDemo';

interface ContentSection {
    type: string;
    [key: string]: any;
}

interface RichLessonRendererProps {
    sections: ContentSection[];
}

const RichLessonRenderer: React.FC<RichLessonRendererProps> = ({ sections }) => {
    if (!sections || sections.length === 0) {
        return null;
    }

    return (
        <div className="space-y-2">
            {sections.map((section, index) => (
                <RichSection key={index} section={section} />
            ))}
        </div>
    );
};

/**
 * RichSection — Dispatches to the correct component based on section.type
 */
const RichSection: React.FC<{ section: ContentSection }> = ({ section }) => {
    switch (section.type) {
        case 'text':
            return <TextSection content={section.content} />;

        case 'callout':
            return (
                <CalloutBox
                    style={section.style || 'info'}
                    title={section.title}
                    content={section.content}
                />
            );

        case 'code':
            return (
                <CodeBlock
                    language={section.language || 'javascript'}
                    title={section.title}
                    code={section.code}
                    explanation={section.explanation}
                />
            );

        case 'comparison_table':
            return (
                <ComparisonTable
                    title={section.title}
                    headers={section.headers || []}
                    rows={section.rows || []}
                />
            );

        case 'key_concept':
            return (
                <KeyConceptCard
                    term={section.term}
                    definition={section.definition}
                    icon={section.icon}
                />
            );

        case 'step_list':
            return (
                <StepList
                    title={section.title}
                    steps={section.steps || []}
                />
            );

        case 'real_world_example':
            return (
                <RealWorldCard
                    title={section.title}
                    company={section.company}
                    description={section.description || section.content || ''}
                    takeaway={section.takeaway}
                />
            );

        case 'ascii_diagram':
            return (
                <AsciiDiagram
                    title={section.title}
                    diagram={section.diagram || section.content || ''}
                />
            );

        case 'memory_model':
            return (
                <MemoryModel
                    title={section.title}
                    description={section.description}
                    diagram={section.diagram}
                    variables={section.variables}
                />
            );

        case 'interactive_demo':
            return (
                <InteractiveDemo
                    title={section.title}
                    starter_code={section.starter_code || ''}
                    expected_output={section.expected_output}
                    hint={section.hint}
                    language={section.language}
                />
            );

        case 'visual_aid':
            return <VisualAidPlaceholder section={section} />;

        default:
            // Fallback: render as text if we don't recognize the type
            return <TextSection content={section.content || JSON.stringify(section)} />;
    }
};

/**
 * TextSection — Renders markdown-formatted text content.
 * Handles inline markdown: # headings, **bold**, `code`, etc.
 */
const TextSection: React.FC<{ content: string }> = ({ content }) => {
    // Simple markdown-to-JSX for common patterns
    const lines = content.split('\n');

    return (
        <div className="my-3 space-y-2">
            {lines.map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return <div key={i} className="h-2" />;

                // Headers
                if (trimmed.startsWith('# ')) {
                    return (
                        <h2 key={i} className="text-2xl font-bold text-white mt-6 mb-2">
                            {trimmed.substring(2)}
                        </h2>
                    );
                }
                if (trimmed.startsWith('## ')) {
                    return (
                        <h3 key={i} className="text-xl font-bold text-white mt-4 mb-2">
                            {trimmed.substring(3)}
                        </h3>
                    );
                }
                if (trimmed.startsWith('### ')) {
                    return (
                        <h4 key={i} className="text-lg font-semibold text-zinc-200 mt-3 mb-1">
                            {trimmed.substring(4)}
                        </h4>
                    );
                }

                // List items
                if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
                    return (
                        <div key={i} className="flex items-start gap-2 ml-2">
                            <span className="text-orange-500 mt-1 flex-shrink-0">•</span>
                            <span className="text-zinc-300 text-sm leading-relaxed">
                                <InlineMarkdown text={trimmed.substring(2)} />
                            </span>
                        </div>
                    );
                }

                // Regular paragraph
                return (
                    <p key={i} className="text-zinc-300 text-[15px] leading-relaxed">
                        <InlineMarkdown text={trimmed} />
                    </p>
                );
            })}
        </div>
    );
};

/**
 * InlineMarkdown — Handles bold, italics, inline code, and links
 */
const InlineMarkdown: React.FC<{ text: string }> = ({ text }) => {
    // Process inline markdown: **bold**, *italic*, `code`
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
        // Bold: **text**
        const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
        // Inline code: `text`
        const codeMatch = remaining.match(/`([^`]+)`/);

        // Find the earliest match
        const boldStart = boldMatch ? remaining.indexOf(boldMatch[0]) : Infinity;
        const codeStart = codeMatch ? remaining.indexOf(codeMatch[0]) : Infinity;

        if (boldStart === Infinity && codeStart === Infinity) {
            parts.push(<React.Fragment key={key++}>{remaining}</React.Fragment>);
            break;
        }

        if (boldStart <= codeStart && boldMatch) {
            if (boldStart > 0) {
                parts.push(<React.Fragment key={key++}>{remaining.substring(0, boldStart)}</React.Fragment>);
            }
            parts.push(
                <strong key={key++} className="text-white font-semibold">
                    {boldMatch[1]}
                </strong>
            );
            remaining = remaining.substring(boldStart + boldMatch[0].length);
        } else if (codeMatch) {
            if (codeStart > 0) {
                parts.push(<React.Fragment key={key++}>{remaining.substring(0, codeStart)}</React.Fragment>);
            }
            parts.push(
                <code key={key++} className="px-1.5 py-0.5 bg-[#1a1a2e] rounded text-orange-300 text-[13px] font-mono">
                    {codeMatch[1]}
                </code>
            );
            remaining = remaining.substring(codeStart + codeMatch[0].length);
        }
    }

    return <>{parts}</>;
};

/**
 * VisualAidPlaceholder — Placeholder for visual aid sections
 * until images are generated.
 */
const VisualAidPlaceholder: React.FC<{ section: ContentSection }> = ({ section }) => {
    if (section.url) {
        // If an image URL exists, render it
        return (
            <div className="my-4 rounded-xl overflow-hidden border border-white/10">
                <img
                    src={section.url}
                    alt={section.alt_text || section.description}
                    className="w-full"
                    loading="lazy"
                />
                {(section.alt_text || section.description) && (
                    <div className="px-4 py-2 bg-[#0f0f1a] text-zinc-500 text-xs text-center">
                        {section.alt_text || section.description}
                    </div>
                )}
            </div>
        );
    }

    // Placeholder
    return (
        <div className="my-4 rounded-xl border-2 border-dashed border-white/10 bg-[#0f0f1a] p-6 text-center">
            <span className="text-3xl">🖼️</span>
            <p className="text-zinc-500 text-sm mt-2">{section.description || 'Visual aid coming soon'}</p>
            {section.suggested_style && (
                <p className="text-zinc-600 text-xs mt-1">Style: {section.suggested_style}</p>
            )}
        </div>
    );
};

export default RichLessonRenderer;
