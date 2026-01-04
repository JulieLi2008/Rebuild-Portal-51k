
import React, { useState, useEffect, useRef } from 'react';
import { ProposalData, ProposalTheme } from '../types';
import { Copy, FileDown, ChevronDown, ChevronRight, Clock, FileText, Printer, FileCode, Sparkles, FileType, Save } from 'lucide-react';
import { exportToWord, exportToText, exportToPdf, exportToMarkdown, sanitizeFilename, generateProposalHtml } from '../utils/exportUtils';

interface Props {
  data: ProposalData;
  theme?: ProposalTheme;
}

export const ProposalPreview: React.FC<Props> = ({ data, theme }) => {
  const { proposal, extraction, transcript, transcriptSummary } = data;
  const [showTranscript, setShowTranscript] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Default colors if theme is missing (shouldn't happen with updated App.tsx)
  const primaryColor = theme?.primaryColor || '#17365D';
  const secondaryColor = theme?.secondaryColor || '#365F91';
  const fontFamilyClass = theme?.fontFamily === 'serif' ? 'font-serif' : theme?.fontFamily === 'mono' ? 'font-mono' : 'font-sans';
  
  // Use proposal title if available, otherwise fallback
  const filename = sanitizeFilename(proposal.title, '_Part1');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveForLater = () => {
    try {
      const existingSaves = JSON.parse(localStorage.getItem('voxia_saved_proposals') || '[]');
      const newSave = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        title: proposal.title,
        data: data
      };
      localStorage.setItem('voxia_saved_proposals', JSON.stringify([newSave, ...existingSaves]));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save proposal:", err);
      alert("Error saving proposal to local storage.");
    }
  };

  const getPlainText = () => {
    return `
${proposal.title}

EXECUTIVE SUMMARY
${proposal.executiveSummary}

PROBLEM STATEMENT
${proposal.problemStatement}

PROPOSED SOLUTION
${proposal.proposedSolution}

METHODOLOGY & DELIVERABLES
${proposal.methodologyAndDeliverables.map(d => `- ${d}`).join('\n')}

TIMELINE
${proposal.timeline}

INVESTMENT
${proposal.investment}

TERMS & CONDITIONS
${proposal.termsAndConditions}
    `;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getPlainText());
    alert("Copied to clipboard!");
  };

  const handleExportWord = () => {
    exportToWord(filename, proposal.title, generateProposalHtml(data, theme), theme);
    setShowExportMenu(false);
  };

  const handleExportText = () => {
    exportToText(filename, getPlainText());
    setShowExportMenu(false);
  };

  const handleExportMarkdown = () => {
    exportToMarkdown(filename, getPlainText());
    setShowExportMenu(false);
  };

  const handleExportPdf = () => {
    exportToPdf(proposal.title, generateProposalHtml(data, theme), theme);
    setShowExportMenu(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Extraction Analysis (Phase 2) */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Phase 2: Information Extraction</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Detected Pain Points</h4>
              <ul className="mt-1 list-disc list-inside text-sm text-slate-600">
                {extraction.painPoints.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Key Solution</h4>
              <p className="mt-1 text-sm text-slate-600">{extraction.proposedSolution}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900">Scope Items</h4>
              <ul className="mt-1 list-disc list-inside text-sm text-slate-600">
                {extraction.scopeItems.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Timeline</h4>
                <p className="text-sm text-slate-600">{extraction.timelineParams}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Budget</h4>
                <p className="text-sm text-slate-600">{extraction.budgetParams}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Transcript Section */}
        {transcript && transcript.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <button 
              onClick={() => setShowTranscript(!showTranscript)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Clock size={16} />
                <span>Transcript & Timeline</span>
              </div>
              {showTranscript ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            
            {showTranscript && (
              <div className="p-0 bg-slate-50 max-h-96 overflow-y-auto">
                 {/* Auto Summary Section */}
                 {transcriptSummary && (
                   <div className="p-4 bg-blue-50 border-b border-blue-100">
                     <div className="flex items-center gap-2 mb-2 text-blue-700 text-xs font-bold uppercase tracking-wider">
                       <Sparkles size={12} /> Auto-Summary
                     </div>
                     <p className="text-sm text-slate-700 italic leading-relaxed">
                       "{transcriptSummary}"
                     </p>
                   </div>
                 )}
                 
                 {/* Transcript List */}
                 {transcript.map((seg, idx) => (
                   <div key={idx} className="p-3 border-b border-slate-100 hover:bg-slate-100 transition-colors group">
                     <div className="text-xs font-mono text-brand-600 mb-1 opacity-75 group-hover:opacity-100">{seg.time}</div>
                     <p className="text-sm text-slate-700">{seg.text}</p>
                   </div>
                 ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Column: Proposal Preview */}
      <div className="lg:col-span-2">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
          {/* Toolbar */}
          <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleSaveForLater}
                className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all font-medium border shadow-sm active:scale-95 ${isSaved ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                title="Save this proposal to local storage"
              >
                <Save size={16} /> {isSaved ? 'Saved!' : 'Save for Later'}
              </button>

              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-2 text-sm bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-all font-medium shadow-sm hover:shadow-md active:scale-95"
                  title="View export formats"
                >
                  <FileDown size={16} /> Export Options <ChevronDown size={14} className={`transition-transform duration-200 ${showExportMenu ? 'rotate-180' : ''}`} />
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 top-full mt-2 w-[22rem] bg-white border border-slate-200 rounded-xl shadow-2xl z-30 overflow-hidden animate-fade-in origin-top-right transform transition-all ring-1 ring-slate-900/5">
                    
                    <div className="p-2">
                      <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Documents
                      </div>
                      
                      <div className="grid grid-cols-1 gap-1">
                        <button 
                          onClick={handleExportWord} 
                          className="w-full text-left p-2.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-3 group"
                          title="Download as Microsoft Word (.doc) for editing"
                        >
                          <div className="p-2 bg-blue-100 text-blue-600 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <FileText size={18} />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-800">Word Document</div>
                            <div className="text-xs text-slate-500">Editable format (.doc)</div>
                          </div>
                        </button>

                        <button 
                          onClick={handleExportPdf} 
                          className="w-full text-left p-2.5 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-3 group"
                          title="Print or Save as PDF"
                        >
                          <div className="p-2 bg-red-100 text-red-600 rounded-md group-hover:bg-red-600 group-hover:text-white transition-all">
                            <Printer size={18} />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-800">Print / PDF</div>
                            <div className="text-xs text-slate-500">Ready to sign</div>
                          </div>
                        </button>
                      </div>

                      <div className="my-2 border-t border-slate-100 mx-2"></div>

                      <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Data & Code
                      </div>

                      <div className="grid grid-cols-2 gap-1">
                        <button 
                          onClick={handleExportText} 
                          className="text-left p-2 rounded-lg hover:bg-slate-100 transition-colors flex flex-col gap-1.5 group border border-transparent hover:border-slate-200"
                          title="Download as Plain Text (.txt)"
                        >
                          <div className="flex items-center gap-2">
                            <FileType size={16} className="text-slate-500 group-hover:text-slate-700" />
                            <span className="text-sm font-medium text-slate-700">Text</span>
                          </div>
                        </button>

                        <button 
                          onClick={handleExportMarkdown} 
                          className="text-left p-2 rounded-lg hover:bg-slate-100 transition-colors flex flex-col gap-1.5 group border border-transparent hover:border-slate-200"
                          title="Download as Markdown (.md)"
                        >
                          <div className="flex items-center gap-2">
                            <FileCode size={16} className="text-slate-500 group-hover:text-slate-700" />
                            <span className="text-sm font-medium text-slate-700">Markdown</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                onClick={copyToClipboard}
                className="p-2 text-slate-400 hover:text-brand-600 transition-colors hover:bg-brand-50 rounded-lg"
                title="Copy content to Clipboard"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          {/* Document Content */}
          <div className={`p-8 md:p-12 overflow-y-auto bg-white ${fontFamilyClass} max-w-none prose prose-slate prose-headings:font-bold prose-h1:text-center prose-h1:text-3xl prose-h2:text-xl prose-p:text-slate-600`}>
             <h1 style={{ color: primaryColor }} className="text-center text-3xl font-bold uppercase mb-8">{proposal.title}</h1>
             
             <h2 style={{ color: secondaryColor }} className="text-xl border-b pb-2 mb-4">Executive Summary</h2>
             <p className="whitespace-pre-wrap mb-6">{proposal.executiveSummary}</p>

             <h2 style={{ color: secondaryColor }} className="text-xl border-b pb-2 mb-4">Problem Statement</h2>
             <p className="whitespace-pre-wrap mb-6">{proposal.problemStatement}</p>

             <h2 style={{ color: secondaryColor }} className="text-xl border-b pb-2 mb-4">Proposed Solution</h2>
             <p className="whitespace-pre-wrap mb-6">{proposal.proposedSolution}</p>

             <h2 style={{ color: secondaryColor }} className="text-xl border-b pb-2 mb-4">Methodology & Deliverables</h2>
             <ul className="list-disc pl-5 mb-6 space-y-2">
               {proposal.methodologyAndDeliverables.map((item, idx) => (
                 <li key={idx}>{item}</li>
               ))}
             </ul>

             <h2 style={{ color: secondaryColor }} className="text-xl border-b pb-2 mb-4">Timeline</h2>
             <p className="whitespace-pre-wrap mb-6">{proposal.timeline}</p>

             <h2 style={{ color: secondaryColor }} className="text-xl border-b pb-2 mb-4">Investment</h2>
             <p className="whitespace-pre-wrap mb-6">{proposal.investment}</p>

             <h2 style={{ color: secondaryColor }} className="text-xl border-b pb-2 mb-4">Terms & Conditions</h2>
             <p className="whitespace-pre-wrap mb-6">{proposal.termsAndConditions}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
