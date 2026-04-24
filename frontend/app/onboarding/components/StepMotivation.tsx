import { useState } from "react";

export const StepMotivation = ({ onSelect }: { onSelect: (val: string) => void }) => {
    const [selected, setSelected] = useState('');

    const options = [
        { id: 'career', label: 'To start a new career in tech' },
        { id: 'upskill', label: 'To upskill for my current job' },
        { id: 'school', label: 'I need it for school' },
        { id: 'projects', label: 'To build my own projects' },
        { id: 'fun', label: 'Just for fun' },
    ];

    const handleSelect = (id: string) => {
        setSelected(id);
        onSelect(id);
    };

    return (
        <div className="max-w-xl w-full flex flex-col items-center">
            <div className="flex items-center gap-4 mb-10 bg-zinc-900/40 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-orange-500/5 group-hover:scale-110 transition-transform duration-500" />
                    <img src="/voicecode-logo.png" alt="EliteFolks Logo" className="w-8 h-8 object-contain relative z-10" />
                </div>
                <p className="text-zinc-300 text-sm md:text-base font-medium leading-relaxed">
                    Great work on those lessons! Let's gather just a bit more info... <br />
                    <span className="text-white font-bold">Why do you want to learn to code?</span>
                </p>
            </div>

            <div className="w-full space-y-4">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => handleSelect(opt.id)}
                        className={`w-full py-5 px-8 rounded-2xl border transition-all duration-500 text-center font-medium relative overflow-hidden group/opt ${selected === opt.id
                            ? 'bg-white text-black border-white shadow-[0_0_40px_rgba(255,255,255,0.15)] scale-[1.02]'
                            : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:border-orange-500/30 hover:bg-zinc-900/60 hover:text-white'
                            }`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 translate-x-[-100%] group-hover/opt:translate-x-[100%] transition-transform duration-1000`} />
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StepMotivation;