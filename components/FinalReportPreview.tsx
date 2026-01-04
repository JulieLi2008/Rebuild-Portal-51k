
import React from 'react';
import { FinalReportData, ProposalTheme } from '../types';
import { BookOpen, Award } from 'lucide-react';

interface Props {
  data: FinalReportData;
  theme?: ProposalTheme;
}

export const FinalReportPreview: React.FC<Props> = ({ data, theme }) => {
  const primaryColor = theme?.primaryColor || '#17365D';
  const secondaryColor = theme?.secondaryColor || '#365F91';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-300/40 overflow-hidden animate-fade-in-up">
      <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
        {/* Abstract pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-500/20 rounded-full blur-2xl -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                <Award className="text-yellow-400" size={24} />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Final Report</h2>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight max-w-3xl">{data.title}</h1>
        </div>
      </div>

      <div className="p-10 md:p-16 prose prose-slate max-w-none">
        
        <div className="bg-slate-50 p-8 mb-12 rounded-xl border border-slate-100 relative">
           <div className="absolute top-0 left-8 w-16 h-1 bg-brand-500"></div>
          <h3 className="text-lg font-bold text-slate-800 mt-0 mb-4">Executive Summary</h3>
          <p className="m-0 text-slate-700 italic leading-relaxed">{data.executiveSummary}</p>
        </div>

        <div className="prose-h2:text-slate-800 prose-h2:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-p:text-slate-600 prose-p:leading-7 prose-p:text-justify prose-li:text-slate-600">
           {/* We render the narrative knowing the AI was instructed to use paragraphs */}
           <div className="whitespace-pre-wrap">{data.fullNarrative}</div>
        </div>

      </div>
    </div>
  );
};
