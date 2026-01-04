
import React, { useState, useEffect } from 'react';
import { OrganizedContentData, DeepDiveData, ReportSection } from '../types';
import { GripVertical, Eye, CheckCircle, Circle, ArrowRight, FileText, Network, Layers, FileSearch, Zap, AlertCircle, RefreshCw, ChevronRight, Share2 } from 'lucide-react';
import { getCostEstimate } from '../services/geminiService';

interface Props {
  organizedData: OrganizedContentData | null;
  deepDiveData: DeepDiveData | null;
  onGenerate: (sections: ReportSection[], mode: 'standard' | 'full') => void;
  isLoading: boolean;
  selectedModel: string;
}

// --- Mind Map Visualizer Component ---
const MindMapVisualizer: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  
  return (
    <div className="space-y-1 py-2 font-sans">
      {lines.map((line, idx) => {
        // Determine indentation level based on spaces/tabs or markdown symbols
        const indentMatch = line.match(/^(\s*)/);
        const spaces = indentMatch ? indentMatch[1].length : 0;
        // Approximate level: 2 spaces = 1 level
        const level = Math.floor(spaces / 2);
        
        // Clean text (remove markers like - * 1. etc)
        const text = line.replace(/^\s*[-*•]\s*/, '').replace(/^\s*\d+\.\s*/, '').trim();
        
        // Styling based on level
        let containerClass = "border-l-4 pl-3 py-2 rounded-r-lg text-sm transition-all hover:translate-x-1";
        let textClass = "";
        
        if (level === 0) {
          containerClass += " bg-slate-800 border-brand-500 text-white shadow-md mt-4 mb-2";
          textClass = "font-bold text-base tracking-wide uppercase";
        } else if (level === 1) {
          containerClass += " bg-white border-brand-300 text-brand-800 shadow-sm mt-2";
          textClass = "font-bold";
        } else if (level === 2) {
          containerClass += " bg-slate-50 border-slate-300 text-slate-700 ml-2";
          textClass = "font-medium";
        } else {
          containerClass += " bg-transparent border-slate-200 text-slate-500 hover:bg-slate-50 border-l-2 ml-2";
          textClass = "text-xs";
        }

        return (
          <div 
            key={idx} 
            style={{ marginLeft: `${level * 16}px` }} 
            className={`flex items-center gap-2 ${containerClass}`}
          >
            {level > 0 && <ChevronRight size={12} className={level === 1 ? "text-brand-400" : "text-slate-300"} />}
            {level === 0 && <Share2 size={16} className="text-brand-400" />}
            <span className={textClass}>{text}</span>
          </div>
        );
      })}
    </div>
  );
};

export const ReportBuilder: React.FC<Props> = ({ organizedData, deepDiveData, onGenerate, isLoading, selectedModel }) => {
  const [sections, setSections] = useState<ReportSection[]>([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [expandedPreview, setExpandedPreview] = useState<string | null>(null);
  
  // Cost & Mode Modal State
  const [showCostModal, setShowCostModal] = useState(false);
  const [costs, setCosts] = useState<{ standard: number, full: number, tokenCount: number } | null>(null);

  useEffect(() => {
    const initialSections: ReportSection[] = [];

    if (organizedData) {
      initialSections.push({
        id: 'org_main',
        title: 'Organized Content (Core)',
        content: organizedData.mainContent,
        type: 'organized',
        included: true
      });
    }

    if (deepDiveData) {
      if (deepDiveData.expandedContent) {
        initialSections.push({
          id: 'dd_expand',
          title: 'Deep Dive Expansion',
          content: deepDiveData.expandedContent,
          type: 'expanded',
          included: true
        });
      }
      if (deepDiveData.businessPlan) {
        initialSections.push({
          id: 'dd_plan',
          title: 'Formal Business Plan',
          content: deepDiveData.businessPlan,
          type: 'businessPlan',
          included: true
        });
      }
      if (deepDiveData.mindMap) {
        initialSections.push({
          id: 'dd_mindmap',
          title: 'Mind Map (Structure)',
          content: deepDiveData.mindMap,
          type: 'mindMap',
          included: false 
        });
      }
    }

    if (sections.length === 0 && initialSections.length > 0) {
      setSections(initialSections);
    } else if (initialSections.length > sections.length) {
       const existingIds = new Set(sections.map(s => s.id));
       const newItems = initialSections.filter(s => !existingIds.has(s.id));
       if (newItems.length > 0) {
         setSections(prev => [...prev, ...newItems]);
       }
    }
  }, [organizedData, deepDiveData]);

  const toggleInclude = (index: number) => {
    const newSections = [...sections];
    newSections[index].included = !newSections[index].included;
    setSections(newSections);
  };

  const togglePreview = (id: string) => {
    setExpandedPreview(prev => prev === id ? null : id);
  };

  // --- Drag & Drop Handlers ---
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Transparent drag image hack
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    const newSections = [...sections];
    const draggedItem = newSections[draggedItemIndex];
    newSections.splice(draggedItemIndex, 1);
    newSections.splice(index, 0, draggedItem);
    setSections(newSections);
    setDraggedItemIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'organized': return <FileText size={18} className="text-blue-500" />;
      case 'expanded': return <FileSearch size={18} className="text-purple-500" />;
      case 'businessPlan': return <Layers size={18} className="text-emerald-500" />;
      case 'mindMap': return <Network size={18} className="text-amber-500" />;
      default: return <FileText size={18} />;
    }
  };

  const activeCount = sections.filter(s => s.included).length;

  const handleInitialGenerateClick = () => {
    const estimates = getCostEstimate(sections, selectedModel);
    setCosts(estimates);
    setShowCostModal(true);
  };

  const confirmGenerate = (mode: 'standard' | 'full') => {
    setShowCostModal(false);
    onGenerate(sections, mode);
  };

  if (sections.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* HEADER */}
      <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h2 className="font-bold text-slate-700 flex items-center gap-2 text-sm uppercase tracking-wide">
           Drag to Reorder Sections
        </h2>
        <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded-full border border-slate-300">
          {activeCount} / {sections.length} Included
        </span>
      </div>

      <div className="p-6">
        
        {/* LIST */}
        <div className="space-y-3 mb-8">
          {sections.map((section, index) => (
            <div 
              key={section.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                relative border rounded-xl transition-all duration-300 group
                ${draggedItemIndex === index ? 'opacity-0 scale-95' : 'opacity-100'}
                ${section.included ? 'border-slate-200 bg-white hover:shadow-md hover:border-brand-200' : 'border-slate-100 bg-slate-50/50 opacity-60'}
              `}
            >
              <div className="flex items-center p-3 gap-4">
                <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 p-2"><GripVertical size={20} /></div>
                
                <div className={`p-2.5 rounded-lg border ${section.included ? 'bg-white border-slate-100 shadow-sm' : 'bg-transparent border-transparent'}`}>
                    {getIcon(section.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`font-bold text-sm truncate ${section.included ? 'text-slate-800' : 'text-slate-500'}`}>{section.title}</h4>
                  <div className="text-xs text-slate-400 truncate max-w-[300px]">{section.content.substring(0, 80)}...</div>
                </div>
                
                <div className="flex items-center gap-2 pr-2">
                   <button 
                    onClick={() => togglePreview(section.id)} 
                    className={`p-2 rounded-lg hover:bg-slate-100 transition-colors ${expandedPreview === section.id ? 'text-brand-600 bg-brand-50' : 'text-slate-400'}`}
                    title="Preview Content"
                   >
                       <Eye size={18} />
                   </button>
                   <div className="h-8 w-px bg-slate-100 mx-1"></div>
                   <button 
                    onClick={() => toggleInclude(index)} 
                    className={`transition-all duration-200 focus:outline-none transform active:scale-95 ${section.included ? 'text-brand-600' : 'text-slate-300'}`}
                    title={section.included ? "Exclude from Report" : "Include in Report"}
                   >
                       {section.included ? <CheckCircle size={24} className="fill-brand-50" /> : <Circle size={24} />}
                   </button>
                </div>
              </div>

              {expandedPreview === section.id && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-4 rounded-b-xl animate-fade-in">
                  <div className="max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                      {section.type === 'mindMap' ? (
                        <MindMapVisualizer content={section.content} />
                      ) : (
                        <div className="text-xs text-slate-600 font-mono whitespace-pre-wrap leading-relaxed">
                          {section.content}
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* GENERATE BUTTON */}
        <div className="flex justify-center">
          <button
            onClick={handleInitialGenerateClick}
            disabled={activeCount === 0 || isLoading}
            className="group px-8 py-4 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-xl shadow-slate-200 transition-all flex items-center gap-3 transform active:scale-95"
          >
            {isLoading ? (
               <><RefreshCw size={20} className="animate-spin" /> Stitching Report...</>
            ) : (
               <><Layers size={20} className="text-brand-300 group-hover:text-white transition-colors" /> Generate Final Report <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </div>
      </div>

      {/* COST / MODE MODAL */}
      {showCostModal && costs && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden scale-100 opacity-100 transition-all">
            <div className="bg-slate-50 p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">Select Generation Mode</h3>
              <p className="text-sm text-slate-500 mt-1">
                  Using Model: <span className="font-mono text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded text-xs">{selectedModel}</span>
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              
              {/* Option 1: Standard */}
              <button 
                onClick={() => confirmGenerate('standard')}
                className="w-full text-left p-4 border-2 border-slate-200 rounded-xl hover:border-slate-400 hover:bg-slate-50 transition-all group relative"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold text-slate-800 flex items-center gap-2">
                    <Zap className="text-yellow-500 fill-current" size={18} /> Fast / Standard
                  </div>
                  <div className="text-sm font-bold text-slate-600">~${costs.standard.toFixed(4)}</div>
                </div>
                <p className="text-xs text-slate-500 pr-8">
                  Generates the report in a single pass. Faster but may truncate long content.
                </p>
              </button>

              {/* Option 2: Full (Premium) */}
              <button 
                onClick={() => confirmGenerate('full')}
                className="w-full text-left p-4 border-2 border-brand-500 bg-brand-50/30 rounded-xl hover:bg-brand-50 transition-all group shadow-sm ring-1 ring-brand-100"
              >
                 <div className="flex justify-between items-start mb-1">
                  <div className="font-bold text-brand-800 flex items-center gap-2">
                    <Layers className="text-brand-600" size={18} /> Full Report (Recommended)
                  </div>
                  <div className="text-sm font-bold text-brand-700">~${costs.full.toFixed(4)}</div>
                </div>
                <p className="text-xs text-brand-800/80 mt-1 leading-relaxed">
                  Generates sections in <strong>parallel</strong> for maximum speed and completeness. 
                  Guarantees no truncation.
                </p>
              </button>
            </div>
            
            <div className="bg-slate-50 p-4 flex justify-end">
              <button onClick={() => setShowCostModal(false)} className="px-4 py-2 text-slate-500 font-bold hover:text-slate-700">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
