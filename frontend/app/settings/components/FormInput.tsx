'use client';

import React from 'react';

interface FormInputProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder?: string;
    type?: string;
    multiline?: boolean;
    rows?: number;
}

const FormInput: React.FC<FormInputProps> = ({
    label,
    name,
    value,
    onChange,
    placeholder = '',
    type = 'text',
    multiline = false,
    rows = 4,
}) => {
    const baseClasses = `
        w-full bg-zinc-950/80 border border-zinc-800/50 rounded-xl px-4 py-3 
        text-white placeholder:text-zinc-600
        focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 focus:bg-zinc-950
        outline-none transition-all duration-300
        hover:border-zinc-700/50
        backdrop-blur-sm
    `;

    return (
        <div className="space-y-2 group">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em] group-focus-within:text-orange-400 transition-colors duration-300">
                {label}
            </label>
            {multiline ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    rows={rows}
                    placeholder={placeholder}
                    className={`${baseClasses} resize-none`}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={baseClasses}
                />
            )}
        </div>
    );
};

export default FormInput;
