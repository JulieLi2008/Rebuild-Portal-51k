import React, { useState, useRef, useEffect } from 'react';
import { TranslatedProposalData, ProposalTheme } from '../types';
import { 
  Briefcase, 
  Users, 
  Target, 
  Shield, 
  PieChart, 
  TrendingDown, 
  Network, 
  Megaphone,
  Copy,
  FileDown,
  Languages,
  ChevronDown,
  FileText,
  Printer,
  FileSearch,
  FileCode
} from 'lucide-react';
import { exportToWord, exportToText, exportToPdf, exportToMarkdown, sanitizeFilename, formatMarkdownToHtml, generateExpansionHtml } from '../utils/exportUtils';

interface Props {
  data: TranslatedProposalData;
  theme?: ProposalTheme;
  title?: string;
}

export const TranslatedProposalView: React.FC<Props> = ({ data, theme, title }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const filename = sanitizeFilename(title || 'Strategic_Plan_CN', '_Part3_Translation');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sections = [
    {
      title: "摘要 (Abstract)",
      icon: FileSearch,
      content: data.abstract,
      color: "text-slate-700",
      bg: "bg-slate-100"
    },
    {
      title: "1. 核心业务模式 (Core Business)",
      icon: Briefcase,
      content: data.coreBusiness,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "2. 联盟与合作机会 (Coalition Opportunities)",
      icon: Users,
      content: data.coalitionOpportunities,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      title: "3. 商业与营销策略 (Business Strategy)",
      icon: Target,
      content: data.strategiesAndMembership,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      title: "4. 保险及跨行业商机 (Cross-Industry)",
      icon: Shield,
      content: data.insuranceAndCrossBusiness,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      title: "5. 股权架构 (Equity Structure)",
      icon: PieChart,
      content: data.equityStructure,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      title: "6. 财务风险分析 (Financial Risk)",
      icon: TrendingDown,
      content: data.financialRisk,
      color: "text-red-600",
      bg: "bg-red-50"
    },
    {
      title: "7. 思维导图 (Mind Map)",
      icon: Network,
      content: data.mindMap,
      color: "text-slate-600",
      bg: "bg-slate-100",
      isCode: true
    },
    {
      title: "8. 市场执行方案 (Marketing Plan)",
      icon: Megaphone,
      content: data.marketingProposal,
      color: "text-pink-600",
      bg: "bg-pink-50"
    }
  ];

  const getPlainText = () => {
    return sections.map(s => `=== ${s.title} ===\n${s.content}\n`).join('\n');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getPlainText());
    alert("已复制到剪贴板! (Copied!)");
  };

  const handleExportWord = () => {
    const html = generateExpansionHtml(data, title || "Strategic Expansion", "Phase 3: Chinese Translation");
    exportToWord(filename, `战略扩张计划书: ${title || ''}`, html, theme);
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
    const html = generateExpansionHtml(data, title || "Strategic Expansion", "Phase 3: Chinese Translation");
    exportToPdf(`战略扩张计划书: ${title || ''}`, html, theme);
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <Languages className="text-red-600 w-6 h-6" />
             <h2 className="text-2xl font-bold text-slate-800">Phase 3: 中文版 (Translation)</h2>
           </div>
           <p className="text-slate-500 text-sm">Professional Simplified Chinese Translation for Stakeholders</p>
        </div>
        <div className="flex gap-2">
           <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 text-sm bg-red-50 border border-red-200 px-3 py-1.5 rounded-md hover:bg-red-100 transition-colors text-red-700 font-medium"
            >
              <FileDown className="w-4 h-4" /> Export <ChevronDown className="w-3 h-3" />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-20 py-1 animate-fade-in">
                <button onClick={handleExportWord} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <FileDown className="w-4 h-4 text-blue-600" /> Word Document (.doc)
                </button>
                <button onClick={handleExportPdf} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <Printer className="w-4 h-4 text-red-600" /> Print / Save PDF
                </button>
                <button onClick={handleExportText} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-600" /> Plain Text (.txt)
                </button>
                <button onClick={handleExportMarkdown} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-slate-600" /> Markdown (.md)
                </button>
              </div>
            )}
           </div>

          <button 
            onClick={copyToClipboard}
            className="flex items-center gap-2 text-sm bg-white border border-slate-300 px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors text-slate-700 font-medium shadow-sm"
          >
            <Copy className="w-4 h-4" /> Copy All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => {
          const Icon = section.icon;
          const isFullWidth = idx === 0 || idx === 7 || idx === 8; // Abstract, MindMap, Marketing

          return (
            <div 
              key={idx} 
              className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow ${isFullWidth ? 'md:col-span-2' : ''}`}
            >
              <div className={`px-6 py-4 border-b border-slate-100 flex items-center gap-3 ${section.bg}`}>
                <Icon className={`w-5 h-5 ${section.color}`} />
                <h3 className={`font-bold text-lg ${section.color}`}>{section.title}</h3>
              </div>
              <div className="p-6">
                {section.isCode ? (
                  <pre className="whitespace-pre-wrap font-mono text-xs md:text-sm bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                    {section.content}
                  </pre>
                ) : (
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{section.content}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
