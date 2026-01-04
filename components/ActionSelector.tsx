
import React, { useState } from 'react';
import { ArrowRight, Layers, FileText, Network } from 'lucide-react';

interface Props {
  onRunActions: (options: { expand: boolean; businessPlan: boolean; mindMap: boolean }) => void;
  isLoading: boolean;
}

export const ActionSelector: React.FC<Props> = ({ onRunActions, isLoading }) => {
  const [options, setOptions] = useState({
    expand: false,
    businessPlan: false,
    mindMap: false
  });

  const toggle = (key: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const hasSelection = Object.values(options).some(Boolean);

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-xl">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Layers className="text-brand-400" /> Step 3: Select Next Steps
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div 
          onClick={() => toggle('expand')}
          className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${options.expand ? 'border-brand-500 bg-brand-500/20' : 'border-slate-600 hover:bg-white/5'}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-5 h-5 rounded border flex items-center justify-center ${options.expand ? 'bg-brand-500 border-brand-500' : 'border-slate-400'}`}>
              {options.expand && <div className="w-3 h-3 bg-white rounded-sm" />}
            </div>
            <span className="font-bold">Expand Content</span>
          </div>
          <p className="text-sm text-slate-400 pl-8">Add depth, details, and context to the organized text (Target Lang).</p>
        </div>

        <div 
          onClick={() => toggle('businessPlan')}
          className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${options.businessPlan ? 'border-brand-500 bg-brand-500/20' : 'border-slate-600 hover:bg-white/5'}`}
        >
          <div className="flex items-center gap-3 mb-2">
             <div className={`w-5 h-5 rounded border flex items-center justify-center ${options.businessPlan ? 'bg-brand-500 border-brand-500' : 'border-slate-400'}`}>
              {options.businessPlan && <div className="w-3 h-3 bg-white rounded-sm" />}
            </div>
            <span className="font-bold flex items-center gap-2"><FileText size={16}/> Business Plan</span>
          </div>
          <p className="text-sm text-slate-400 pl-8">Generate a formal structure (Strategy, Market, Operations) in Target Lang.</p>
        </div>

        <div 
          onClick={() => toggle('mindMap')}
          className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${options.mindMap ? 'border-brand-500 bg-brand-500/20' : 'border-slate-600 hover:bg-white/5'}`}
        >
          <div className="flex items-center gap-3 mb-2">
             <div className={`w-5 h-5 rounded border flex items-center justify-center ${options.mindMap ? 'bg-brand-500 border-brand-500' : 'border-slate-400'}`}>
              {options.mindMap && <div className="w-3 h-3 bg-white rounded-sm" />}
            </div>
            <span className="font-bold flex items-center gap-2"><Network size={16}/> Mind Map</span>
          </div>
          <p className="text-sm text-slate-400 pl-8">Create a hierarchical text-based Mind Map in Target Lang.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onRunActions(options)}
          disabled={!hasSelection || isLoading}
          className="px-8 py-3 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg flex items-center gap-2"
        >
          {isLoading ? "Generating..." : "Run Selected Actions"} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
