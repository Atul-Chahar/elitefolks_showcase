import React, { useState, useRef } from 'react';
import {
    Heading1, Heading2, Bold, Italic, List, ListOrdered,
    Quote, Code, Link as LinkIcon, Image as ImageIcon,
    Eye, EyeOff, Save, Loader2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useUserNotes } from '../hooks/useUserNotes';

interface NotesPanelProps {
    lessonId: string;
}

const NotesPanel: React.FC<NotesPanelProps> = ({ lessonId }) => {
    const { notes, updateNotes, isLoading, isSaving } = useUserNotes();
    const [isPreview, setIsPreview] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertFormatting = (prefix: string, suffix: string = '') => {
        if (!textareaRef.current) return;

        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionStart;
        const selectedText = notes.substring(start, end);

        const newText =
            notes.substring(0, start) +
            prefix + selectedText + suffix +
            notes.substring(end);

        updateNotes(newText);

        // Reset focus and selection
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(
                    start + prefix.length,
                    start + prefix.length + selectedText.length
                );
            }
        }, 0);
    };

    const toolbarActions = [
        { icon: Heading1, action: () => insertFormatting('# ', ''), label: 'H1' },
        { icon: Heading2, action: () => insertFormatting('## ', ''), label: 'H2' },
        { icon: Bold, action: () => insertFormatting('**', '**'), label: 'Bold' },
        { icon: Italic, action: () => insertFormatting('_', '_'), label: 'Italic' },
        { icon: List, action: () => insertFormatting('- ', ''), label: 'Bullet List' },
        { icon: ListOrdered, action: () => insertFormatting('1. ', ''), label: 'Order List' },
        { icon: Quote, action: () => insertFormatting('> ', ''), label: 'Quote' },
        { icon: Code, action: () => insertFormatting('```\n', '\n```'), label: 'Code Block' },
        { icon: LinkIcon, action: () => insertFormatting('[', '](url)'), label: 'Link' },
        { icon: ImageIcon, action: () => insertFormatting('![alt](', ')'), label: 'Image' },
    ];

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-zinc-950">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-zinc-900/50">
                <div className="flex items-center gap-1">
                    {toolbarActions.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={item.action}
                            disabled={isPreview}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all title={item.label} disabled:opacity-30"
                        >
                            <item.icon size={18} />
                        </button>
                    ))}
                    <div className="w-[1px] h-6 bg-white/10 mx-1" />
                    <button
                        onClick={() => setIsPreview(!isPreview)}
                        className={`p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-medium ${isPreview
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                            }`}
                        title={isPreview ? "Edit Mode" : "Preview Mode"}
                    >
                        {isPreview ? <EyeOff size={18} /> : <Eye size={18} />}
                        <span>{isPreview ? "Edit" : "Preview"}</span>
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {isSaving && (
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                            <Loader2 size={12} className="animate-spin" />
                            Saving...
                        </div>
                    )}
                    {!isSaving && notes && (
                        <div className="flex items-center gap-1.5 text-[10px] text-green-500/50 uppercase tracking-widest font-bold">
                            <Save size={12} />
                            Saved
                        </div>
                    )}
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-hidden relative">
                {isPreview ? (
                    <div className="h-full overflow-y-auto p-6 prose prose-invert prose-orange max-w-none">
                        <ReactMarkdown
                            components={{
                                img: ({ node, ...props }) => {
                                    if (!props.src) return null;
                                    return <img {...props} />;
                                }
                            }}
                        >
                            {notes || "*No notes yet. Click the edit button to start typing!*"}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <textarea
                        ref={textareaRef}
                        value={notes}
                        onChange={(e) => updateNotes(e.target.value)}
                        className="w-full h-full bg-transparent p-6 text-zinc-300 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                        placeholder="Type here... (Markdown is enabled)"
                    />
                )}
            </div>
        </div>
    );
};

export default NotesPanel;
