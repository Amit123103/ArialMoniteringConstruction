import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="glass-panel w-full max-w-lg border border-slate-700 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <div className="border-b border-slate-800 p-4 flex justify-between items-center">
                    <h2 className="text-lg font-display font-bold text-slate-100 tracking-wider uppercase">{title}</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-red-500 font-mono text-xl leading-none">&times;</button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
