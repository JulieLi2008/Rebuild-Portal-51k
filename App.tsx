
import React, { useState, useRef, useEffect } from 'react';
import { Bot, FileAudio, FileText, ArrowRight, Settings, AlertCircle, UploadCloud, X, ChevronDown, FileDown, Layers, FileOutput, Zap, Trash2, Plus, Sparkles, Sliders, CreditCard, Key, ShieldCheck, Server, History, Save, Edit3, Clock, CheckCircle2 } from 'lucide-react';
import { generateOrganizedContent, generateNextSteps, generateFinalReport } from './services/geminiService';
import { OrganizedContentData, DeepDiveData, FinalReportData, AppState, ProcessingLanguage, ProposalTheme, ReportSection, GeminiModel, SavedVersion } from './types';
import { TemplateSettings } from './components/TemplateSettings';
import { OrganizedContentPreview } from './components/OrganizedContentPreview';
import { ActionSelector } from './components/ActionSelector';
import { FinalReportPreview } from './components/FinalReportPreview';
import { ReportBuilder } from './components/ReportBuilder';
import { exportToWord, exportToPdf, exportToMarkdown, sanitizeFilename, formatMarkdownToHtml } from './utils/exportUtils';

const DEFAULT_THEME: ProposalTheme = {
  primaryColor: '#17365D',
  secondaryColor: '#365F91',
  fontFamily: 'sans',
  logoUrl: null,
  filenamePrefix: 'Organized_Content'
};

const FREE_TIER_LIMIT = 40 * 1024 * 1024;
const PAID_TIER_LIMIT = 100 * 1024 * 1024;

const App: React.FC = () => {
  // Config State
  const [showTemplateSettings, setShowTemplateSettings] = useState<boolean>(false);
  const [theme, setTheme] = useState<ProposalTheme>(DEFAULT_THEME);
  const [history, setHistory] = useState<SavedVersion[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [editingVersionId, setEditingVersionId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');

  // Input State
  const [activeTab, setActiveTab] = useState<'text' | 'audio'>('audio');
  const [textSegments, setTextSegments] = useState<string[]>(['']);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings
  const [targetLanguage, setTargetLanguage] = useState<ProcessingLanguage>('CN');
  // Fix: Updated default model name
  const [selectedModel, setSelectedModel] = useState<GeminiModel>('gemini-3-flash-preview');
  const [isPaidKey, setIsPaidKey] = useState<boolean>(false);
  const [userApiKey, setUserApiKey] = useState<string>('');

  // App State
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loadingText, setLoadingText] = useState<string>('');
  
  // Results
  const [organizedData, setOrganizedData] = useState<OrganizedContentData | null>(null);
  const [deepDiveData, setDeepDiveData] = useState<DeepDiveData | null>(null);
  const [finalReportData, setFinalReportData] = useState<FinalReportData | null>(null);

  // Persistence
  useEffect(() => {
    const savedHistory = localStorage.getItem('voxia_workspace_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const persistHistory = (newHistory: SavedVersion[]) => {
    setHistory(newHistory);
    localStorage.setItem('voxia_workspace_history', JSON.stringify(newHistory));
  };

  const handleSaveToWorkspace = () => {
    if (!organizedData) return;
    const newVersion: SavedVersion = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      name: organizedData.title || `Report ${new Date().toLocaleDateString()}`,
      organizedData,
      deepDiveData,
      finalReportData,
      theme
    };
    persistHistory([newVersion, ...history]);
  };

  const handleLoadVersion = (v: SavedVersion) => {
    setOrganizedData(v.organizedData);
    setDeepDiveData(v.deepDiveData);
    setFinalReportData(v.finalReportData);
    setTheme(v.theme);
    setAppState(v.finalReportData ? AppState.REPORT_COMPLETE : AppState.ORGANIZED);
    setShowHistory(false);
  };

  const handleDeleteVersion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    persistHistory(history.filter(v => v.id !== id));
  };

  const startRenaming = (v: SavedVersion, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingVersionId(v.id);
    setTempName(v.name);
  };

  const saveRename = () => {
    if (!editingVersionId) return;
    persistHistory(history.map(v => v.id === editingVersionId ? { ...v, name: tempName } : v));
    setEditingVersionId(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles: File[] = Array.from(e.target.files);
      const currentLimit = isPaidKey ? PAID_TIER_LIMIT : FREE_TIER_LIMIT;
      const invalidFiles = newFiles.filter(f => f.size > currentLimit);
      
      if (invalidFiles.length > 0) {
        const limitLabel = isPaidKey ? "100MB" : "40MB";
        setErrorMsg(`Warning: ${invalidFiles.length} file(s) exceeded the ${limitLabel} limit and were skipped.`);
        const validFiles = newFiles.filter(f => f.size <= currentLimit);
        setSelectedFiles(prev => [...prev, ...validFiles]);
      } else {
        setSelectedFiles(prev => [...prev, ...newFiles]);
        setErrorMsg('');
      }
      setActiveTab('audio');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const prepareInputData = async () => {
    if (activeTab === 'audio') {
       if (selectedFiles.length === 0) return null;
       return Promise.all(selectedFiles.map(async (file) => ({
         data: await blobToBase64(file),
         mimeType: file.type || 'audio/mp3'
       })));
    } else {
      const validSegments = textSegments.filter(t => t.trim().length > 0);
      return validSegments.length > 0 ? validSegments : null;
    }
  };

  const handleOrganize = async () => {
    if (activeTab === 'text' && !textSegments.some(t => t.trim().length > 0)) {
      setErrorMsg("Please provide text segment."); return;
    }
    if (activeTab === 'audio' && selectedFiles.length === 0) {
      setErrorMsg("Please upload audio."); return;
    }
    if (isPaidKey && !userApiKey.trim()) {
      setErrorMsg("Please enter your API Key."); return;
    }

    setAppState(AppState.PROCESSING);
    setLoadingText("Analyzing & Organizing...");
    setErrorMsg('');
    setOrganizedData(null);
    setDeepDiveData(null);
    setFinalReportData(null);

    try {
      const inputData = await prepareInputData();
      if (!inputData) throw new Error("Input data missing.");
      const result = await generateOrganizedContent(inputData as any, activeTab, targetLanguage, selectedModel, isPaidKey ? userApiKey : undefined);
      setOrganizedData(result);
      setAppState(AppState.ORGANIZED);
    } catch (err: any) {
      setErrorMsg(err.message || "Processing failed.");
      setAppState(AppState.ERROR);
    }
  };

  const handleRunActions = async (options: { expand: boolean; businessPlan: boolean; mindMap: boolean }) => {
    if (!organizedData) return;
    setAppState(AppState.GENERATING_STEPS);
    setLoadingText("Generating Deep Dives...");
    try {
      const result = await generateNextSteps(organizedData, options, targetLanguage, selectedModel, isPaidKey ? userApiKey : undefined);
      setDeepDiveData(result);
      setAppState(AppState.STEPS_COMPLETE);
    } catch (err: any) {
      setErrorMsg("Failed to run next steps.");
      setAppState(AppState.ORGANIZED);
    }
  };

  const handleGenerateReport = async (sections: ReportSection[], mode: 'standard' | 'full' = 'standard') => {
    setAppState(AppState.GENERATING_REPORT);
    setLoadingText(mode === 'full' ? "Stitching Full Report (Step-by-Step)..." : "Stitching Final Report...");
    try {
       const result = await generateFinalReport(sections, targetLanguage, mode, selectedModel, isPaidKey ? userApiKey : undefined);
       setFinalReportData(result);
       setAppState(AppState.REPORT_COMPLETE);
    } catch (err: any) {
      setErrorMsg("Failed to generate final report.");
      setAppState(AppState.STEPS_COMPLETE);
    }
  };

  const handleOneClick = async () => {
    if (activeTab === 'audio' && selectedFiles.length === 0) { setErrorMsg("Please upload audio."); return; }
    if (activeTab === 'text' && !textSegments.some(t => t.trim().length > 0)) { setErrorMsg("Please provide text."); return; }
    if (isPaidKey && !userApiKey.trim()) { setErrorMsg("Please enter API Key."); return; }

    setErrorMsg('');
    setOrganizedData(null);
    setDeepDiveData(null);
    setFinalReportData(null);

    try {
      setAppState(AppState.PROCESSING);
      setLoadingText("Step 1/3: Analyzing Source...");
      const inputData = await prepareInputData();
      if (!inputData) throw new Error("Input data missing");
      const apiKey = isPaidKey ? userApiKey : undefined;
      const organizedRes = await generateOrganizedContent(inputData as any, activeTab, targetLanguage, selectedModel, apiKey);
      setOrganizedData(organizedRes);

      if (selectedModel === 'gemini-3-pro-preview' && !isPaidKey) {
        setLoadingText("Free Tier Pacing (32s)...");
        await new Promise(resolve => setTimeout(resolve, 32000));
      }

      setAppState(AppState.GENERATING_STEPS);
      setLoadingText("Step 2/3: Business Analysis...");
      const deepDiveRes = await generateNextSteps(organizedRes, { expand: true, businessPlan: true, mindMap: true }, targetLanguage, selectedModel, apiKey);
      setDeepDiveData(deepDiveRes);

      if (selectedModel === 'gemini-3-pro-preview' && !isPaidKey) {
        setLoadingText("Free Tier Pacing (32s)...");
        await new Promise(resolve => setTimeout(resolve, 32000));
      }

      setAppState(AppState.GENERATING_REPORT);
      setLoadingText("Step 3/3: Stitching Final Narrative...");
      
      // Fix: Explicitly cast the sections array to ReportSection[] to satisfy union type constraints
      const sections: ReportSection[] = ([
        { id: 'org', title: 'Core Content', content: organizedRes.mainContent, type: 'organized', included: true },
        { id: 'exp', title: 'Expansion', content: deepDiveRes.expandedContent || '', type: 'expanded', included: true },
        { id: 'bp', title: 'Business Plan', content: deepDiveRes.businessPlan || '', type: 'businessPlan', included: true },
        { id: 'mm', title: 'Mind Map', content: deepDiveRes.mindMap || '', type: 'mindMap', included: true }
      ] as ReportSection[]).filter(s => s.content);

      const reportRes = await generateFinalReport(sections, targetLanguage, 'standard', selectedModel, apiKey);
      setFinalReportData(reportRes);
      setAppState(AppState.REPORT_COMPLETE);
    } catch (err: any) {
      setErrorMsg(err.message || "Synthesis failed.");
      setAppState(AppState.ERROR);
    }
  };

  const handleExport = (format: 'word' | 'pdf' | 'md') => {
    if (!organizedData) return;
    let html = `<h1>${finalReportData ? finalReportData.title : organizedData.title}</h1>`;
    if (finalReportData) {
      html += `<h3>Executive Summary</h3><p>${finalReportData.executiveSummary}</p>`;
      html += `<h3>Full Report</h3><div>${formatMarkdownToHtml(finalReportData.fullNarrative)}</div>`;
    } else {
      html += `<h3>Abstract</h3><p>${organizedData.abstract}</p>`;
      html += `<h3>Organized Content</h3><div>${organizedData.mainContent}</div>`;
    }
    const title = finalReportData ? finalReportData.title : organizedData.title;
    const filename = sanitizeFilename(title || theme.filenamePrefix);
    if (format === 'word') exportToWord(filename, title, html, theme);
    if (format === 'pdf') exportToPdf(title, html, theme);
    if (format === 'md') exportToMarkdown(filename, finalReportData ? finalReportData.fullNarrative : organizedData.mainContent);
  };

  const reset = () => {
    setAppState(AppState.IDLE);
    setOrganizedData(null);
    setDeepDiveData(null);
    setFinalReportData(null);
    setTextSegments(['']);
    setSelectedFiles([]);
    setErrorMsg('');
  };

  const isBusy = appState === AppState.PROCESSING || appState === AppState.GENERATING_STEPS || appState === AppState.GENERATING_REPORT;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans selection:bg-brand-100 selection:text-brand-900">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={reset}>
            <div className="bg-brand-600 p-2 rounded-xl text-white shadow-md group-hover:scale-105 transition-transform"><Bot size={22} /></div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">51 汇声成章 <span className="text-brand-600">Voxia Flow</span></h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowHistory(!showHistory)} className={`p-2.5 rounded-xl transition-all ${showHistory ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`} title="Workspace History">
              <History size={20} />
            </button>
            <button onClick={() => setShowTemplateSettings(true)} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-600 border border-transparent hover:border-slate-200" title="Settings">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      {showHistory && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowHistory(false)}></div>
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-slide-left p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><History size={20}/> Workspace History</h3>
            <div className="flex-1 overflow-y-auto space-y-3">
              {history.length === 0 && <p className="text-slate-400 text-sm text-center py-10 italic">No saved versions in this workspace.</p>}
              {history.map(v => (
                <div key={v.id} className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 group flex items-start justify-between cursor-pointer" onClick={() => handleLoadVersion(v)}>
                   <div className="flex-1 min-w-0 pr-2">
                      {editingVersionId === v.id ? (
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <input autoFocus value={tempName} onChange={e => setTempName(e.target.value)} onBlur={saveRename} onKeyDown={e => e.key === 'Enter' && saveRename()} className="w-full text-sm font-bold border-b border-brand-500 outline-none" />
                        </div>
                      ) : (
                        <h4 className="font-bold text-sm text-slate-800 truncate">{v.name}</h4>
                      )}
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><Clock size={10}/> {new Date(v.timestamp).toLocaleString()}</p>
                   </div>
                   <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={(e) => startRenaming(v, e)} className="p-1.5 text-slate-400 hover:text-brand-600"><Edit3 size={14}/></button>
                     <button onClick={(e) => handleDeleteVersion(v.id, e)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showTemplateSettings && <TemplateSettings theme={theme} onUpdate={setTheme} onClose={() => setShowTemplateSettings(false)} />}

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
           <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2"><Sliders size={14}/> Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Target Language</label>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                      <button onClick={() => setTargetLanguage('CN')} className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${targetLanguage === 'CN' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>🇨🇳 Chinese</button>
                      <button onClick={() => setTargetLanguage('EN')} className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${targetLanguage === 'EN' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>🇺🇸 English</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">AI Model</label>
                    <div className="relative">
                      <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value as GeminiModel)} className="w-full appearance-none bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-brand-500 outline-none transition-all hover:bg-slate-100">
                        {/* Fix: Updated model option names */}
                        <option value="gemini-3-flash-preview">Gemini 3.0 Flash</option>
                        <option value="gemini-3-pro-preview">Gemini 3.0 Pro</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">API Configuration</label>
                    <div className="space-y-3">
                        <label onClick={() => setIsPaidKey(false)} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${!isPaidKey ? 'bg-brand-50 border-brand-200 ring-1 ring-brand-200 shadow-sm' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                            <div className={`mt-0.5 rounded-full p-0.5 ${!isPaidKey ? 'text-brand-600' : 'text-slate-300'}`}><input type="radio" checked={!isPaidKey} readOnly className="accent-brand-600" /></div>
                            <div>
                                <div className={`text-sm font-bold flex items-center gap-2 ${!isPaidKey ? 'text-brand-700' : 'text-slate-700'}`}><Server size={14}/> Default System API</div>
                                <div className="text-xs text-slate-500 mt-1 leading-tight">Subject to Free Tier rate limits.</div>
                            </div>
                        </label>
                        <label onClick={() => setIsPaidKey(true)} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isPaidKey ? 'bg-brand-50 border-brand-200 ring-1 ring-brand-200 shadow-sm' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                             <div className={`mt-0.5 rounded-full p-0.5 ${isPaidKey ? 'text-brand-600' : 'text-slate-300'}`}><input type="radio" checked={isPaidKey} readOnly className="accent-brand-600" /></div>
                            <div>
                                <div className={`text-sm font-bold flex items-center gap-2 ${isPaidKey ? 'text-brand-700' : 'text-slate-700'}`}><CreditCard size={14}/> Use My API Key</div>
                                <div className="text-xs text-slate-500 mt-1 leading-tight">Bypass rate limits. Larger file support.</div>
                            </div>
                        </label>
                    </div>
                    {isPaidKey && (
                        <div className="mt-3 animate-fade-in pl-1">
                            <div className="relative group">
                                <input type="password" value={userApiKey} onChange={(e) => setUserApiKey(e.target.value)} placeholder="Paste Gemini API Key..." className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-white shadow-sm transition-all group-hover:border-brand-300" />
                                <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>
                    )}
                  </div>
                </div>
              </div>
           </div>

           <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[400px]">
                <div className="flex border-b border-slate-100">
                  <button onClick={() => setActiveTab('audio')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all relative ${activeTab === 'audio' ? 'text-brand-600 bg-brand-50/50' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <FileAudio size={18} /> Audio Files
                    {activeTab === 'audio' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-500"></div>}
                  </button>
                  <button onClick={() => setActiveTab('text')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all relative ${activeTab === 'text' ? 'text-brand-600 bg-brand-50/50' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <FileText size={18} /> Text Notes
                    {activeTab === 'text' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-500"></div>}
                  </button>
                </div>
                <div className="p-8 flex-1 bg-slate-50/30">
                  {activeTab === 'audio' ? (
                    <div className="space-y-4 h-full flex flex-col">
                      {selectedFiles.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
                          {selectedFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm group">
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600"><FileAudio size={16} /></div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="font-medium text-slate-800 text-sm truncate">{file.name}</span>
                                    <span className="text-[10px] text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                  </div>
                                </div>
                                <button onClick={() => removeFile(idx)} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div onClick={() => fileInputRef.current?.click()} className={`flex-1 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group min-h-[200px] ${selectedFiles.length > 0 ? 'border-slate-200 bg-slate-50' : 'border-slate-300 hover:border-brand-400 hover:bg-brand-50/50'}`}>
                        <div className="w-16 h-16 rounded-full bg-slate-100 group-hover:bg-brand-100 flex items-center justify-center mb-4 transition-colors"><UploadCloud className="text-slate-400 group-hover:text-brand-600" size={32} /></div>
                        <p className="text-slate-700 font-bold text-lg">Upload Audio Files</p>
                        <p className="text-slate-500 text-sm mt-1">Drag & drop or click to browse</p>
                        <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400 bg-slate-100 px-3 py-1 rounded-full"><AlertCircle size={12}/> Max 40MB (Free Tier)</div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="audio/*" multiple onChange={handleFileChange} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {textSegments.map((segment, idx) => (
                        <div key={idx} className="relative group animate-fade-in">
                          <textarea value={segment} onChange={e => {
                            const n = [...textSegments];
                            n[idx] = e.target.value;
                            setTextSegments(n);
                          }} placeholder={`Paste transcript or notes here...`} className="w-full h-40 p-5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none text-sm leading-relaxed resize-none shadow-sm bg-white" />
                          {textSegments.length > 1 && (
                            <button onClick={() => setTextSegments(textSegments.filter((_, i) => i !== idx))} className="absolute top-3 right-3 p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                          )}
                        </div>
                      ))}
                      <button onClick={() => setTextSegments([...textSegments, ''])} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-medium hover:border-brand-300 hover:text-brand-600 transition-colors flex items-center justify-center gap-2"><Plus size={18} /> Add Segment</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                     <div className="flex-1 w-full text-center md:text-left">
                        <h3 className="text-lg font-bold flex items-center justify-center md:justify-start gap-2 mb-1"><Zap className="text-yellow-400 fill-yellow-400" size={20} /> Ready to Generate?</h3>
                        <p className="text-slate-400 text-sm">Choose a generation mode below to start.</p>
                     </div>
                     <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                         <button onClick={handleOneClick} disabled={isBusy} className="px-6 py-3 bg-gradient-to-r from-brand-500 to-blue-600 hover:from-brand-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                            {isBusy ? <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"/> : <Sparkles size={18} />}
                            One-Click Generate
                         </button>
                         <button onClick={handleOrganize} disabled={isBusy} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-slate-200 font-semibold rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2 disabled:opacity-50">Step-by-Step <ArrowRight size={16} /></button>
                     </div>
                </div>
                {loadingText && isBusy && (
                     <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-3 animate-pulse">
                        <div className="animate-spin w-4 h-4 border-2 border-brand-200 border-t-brand-600 rounded-full"></div>
                        <span className="text-sm font-medium text-slate-600">{loadingText}</span>
                     </div>
                )}
              </div>
           </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-200 flex items-start gap-4 animate-slide-up shadow-sm">
            <AlertCircle size={24} className="flex-shrink-0 mt-1"/> 
            <div className="flex-1 whitespace-pre-wrap font-medium text-sm leading-relaxed">{errorMsg}</div>
          </div>
        )}

        <div className="space-y-8">
          {organizedData && (
            <div className="animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
                   <h3 className="text-lg font-bold text-slate-700">Organized Content</h3>
                 </div>
                 <button onClick={handleSaveToWorkspace} className="flex items-center gap-2 text-sm font-bold text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100 transition-all"><Save size={16}/> Save to Workspace</button>
              </div>
              <OrganizedContentPreview data={organizedData} theme={theme} />
            </div>
          )}

          {organizedData && (
            <div className="animate-fade-in-up">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">2</div>
                 <h3 className="text-lg font-bold text-slate-700">Generate Deep Dives</h3>
              </div>
               <ActionSelector onRunActions={handleRunActions} isLoading={isBusy && appState === AppState.GENERATING_STEPS} />
            </div>
          )}

          {deepDiveData && (
            <div className="space-y-8 animate-fade-in-up">
              {deepDiveData.expandedContent && (
                 <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                   <h2 className="text-xl font-bold text-brand-700 mb-4 flex items-center gap-2"><FileText size={20}/> Expanded Content</h2>
                   <div className="prose max-w-none whitespace-pre-wrap text-slate-700 leading-relaxed">{deepDiveData.expandedContent}</div>
                 </div>
              )}
              {deepDiveData.businessPlan && (
                 <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                   <h2 className="text-xl font-bold text-brand-700 mb-4 flex items-center gap-2"><Layers size={20}/> Business Plan</h2>
                   <div className="prose max-w-none whitespace-pre-wrap text-slate-700 leading-relaxed">{deepDiveData.businessPlan}</div>
                 </div>
              )}
            </div>
          )}

          {(organizedData || deepDiveData) && (
             <div className="animate-fade-in-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm">3</div>
                  <h3 className="text-lg font-bold text-slate-700">Assemble Final Report</h3>
                </div>
                <ReportBuilder organizedData={organizedData} deepDiveData={deepDiveData} onGenerate={handleGenerateReport} isLoading={isBusy && appState === AppState.GENERATING_REPORT} selectedModel={selectedModel} />
             </div>
          )}

          {finalReportData && (
             <div className="animate-fade-in-up">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm">4</div>
                  <h3 className="text-lg font-bold text-slate-700">Final Output</h3>
                </div>
               <FinalReportPreview data={finalReportData} theme={theme} />
             </div>
          )}

          {(organizedData || finalReportData) && (
            <section className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden sticky bottom-6 z-40 animate-slide-up max-w-3xl mx-auto ring-1 ring-slate-900/5">
               <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                 <div className="flex items-center gap-3">
                    <div className="bg-brand-100 p-2 rounded-lg text-brand-600"><FileOutput size={20} /></div>
                    <div>
                      <h2 className="font-bold text-slate-700 text-sm">Ready to Export</h2>
                      <div className="text-xs text-slate-400 truncate max-w-[200px]">{sanitizeFilename(finalReportData?.title || organizedData?.title)}</div>
                    </div>
                 </div>
                 <div className="flex gap-2 w-full sm:w-auto">
                   <button onClick={() => handleExport('word')} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-bold text-sm transition-colors"><FileText size={16} /> Word</button>
                   <button onClick={() => handleExport('pdf')} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl font-bold text-sm transition-colors"><FileDown size={16} /> PDF</button>
                 </div>
               </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
