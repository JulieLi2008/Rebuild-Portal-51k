
import React from 'react';
import { OrganizedContentData, ProposalTheme } from '../types';
import { FileText, List, AlignLeft } from 'lucide-react';

interface Props {
  data: OrganizedContentData;
  theme?: ProposalTheme;
}

export const OrganizedContentPreview: React.FC<Props> = ({ data, theme }) => {
  const primaryColor = theme?.primaryColor || '#17365D';
  const secondaryColor = theme?.secondaryColor || '#365F91';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden relative">
      {/* Decorative top bar */}
      <div className="h-2 w-full bg-gradient-to-r from-brand-500 to-blue-600"></div>
      
      <div className="p-8 md:p-12 prose prose-slate max-w-none">
        <h1 style={{ color: primaryColor }} className="text-3xl font-bold mb-6">{data.title}</h1>
        
        <div className="bg-slate-50 border-l-4 border-brand-500 p-6 mb-8 rounded-r-lg shadow-sm">
          <h3 className="flex items-center gap-2 text-brand-700 font-bold mt-0 mb-3 text-sm uppercase tracking-wide">
            <AlignLeft size={16} /> Abstract (摘要)
          </h3>
          <p className="m-0 text-slate-700 italic leading-relaxed text-sm md:text-base">{data.abstract}</p>
        </div>

        <h2 style={{ color: secondaryColor }} className="flex items-center gap-2 text-xl border-b border-slate-100 pb-3 mb-6">
           <FileText size={20} /> Organized Content
        </h2>
        <div className="whitespace-pre-wrap mb-10 text-slate-700 leading-7 text-justify">
          {data.mainContent}
        </div>

        <h2 style={{ color: secondaryColor }} className="flex items-center gap-2 text-xl border-b border-slate-100 pb-3 mb-6">
          <List size={20} /> Key Points
        </h2>
        <ul className="space-y-3 pl-0">
          {data.keyPoints.map((point, idx) => (
            <li key={idx} className="flex gap-3 text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
               <div className="h-1.5 w-1.5 rounded-full bg-brand-500 mt-2.5 flex-shrink-0"></div>
               <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
