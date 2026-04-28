import React, { useState, useRef, useEffect } from 'react';

interface NeoSelectProps {
    label: string;
    value: string;
    options: string[];
    onChange: (val: string) => void;
    color?: string;
}

export const NeoSelect: React.FC<NeoSelectProps> = ({ label, value, options, onChange, color = "bg-white" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="relative w-full" ref={ref}>
            <label className="block font-black uppercase text-[10px] tracking-widest ml-2 mb-1 text-gray-500">{label}</label>
            <button type="button" onClick={() => setIsOpen(!isOpen)} className={`w-full border-4 border-black rounded-xl p-3 font-black text-left flex justify-between items-center transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] ${color}`}>
                {value}<span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border-4 border-black rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    {options.map(opt => (
                        <div key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className="p-3 font-bold border-b-2 border-black last:border-b-0 hover:bg-yellow-300 cursor-pointer">
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};





