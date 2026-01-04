import React, { useRef } from 'react';
import { ProposalTheme } from '../types';
import { X, Upload, Trash2, LayoutTemplate } from 'lucide-react';

interface Props {
  theme: ProposalTheme;
  onUpdate: (theme: ProposalTheme) => void;
  onClose: () => void;
}

export const TemplateSettings: React.FC<Props> = ({ theme, onUpdate, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ ...theme, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-brand-600" />
            <h2 className="text-xl font-bold text-slate-800">Template Customization</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* File Naming */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Default Filename Prefix</label>
            <input 
              type="text" 
              value={theme.filenamePrefix}
              onChange={(e) => onUpdate({...theme, filenamePrefix: e.target.value})}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="e.g. Project_Alpha"
            />
            <p className="text-xs text-slate-500 mt-1">Files will be saved as: {theme.filenamePrefix}_Part1.doc</p>
          </div>

          <hr className="border-slate-100" />

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Company Logo</label>
            <div className="flex items-center gap-4">
              {theme.logoUrl ? (
                <div className="relative group">
                  <div className="w-24 h-24 border border-slate-200 rounded-lg bg-slate-50 flex items-center justify-center p-2">
                    <img src={theme.logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                  <button 
                    onClick={() => onUpdate({...theme, logoUrl: null})}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-sm hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-brand-400 hover:bg-brand-50 transition-colors"
                >
                  <Upload size={20} className="mb-1" />
                  <span className="text-xs">Upload</span>
                </div>
              )}
              <div className="flex-1 text-sm text-slate-500">
                <p>Upload a PNG or JPG logo.</p>
                <p>This will appear at the top of your exported documents.</p>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/png, image/jpeg, image/jpg" 
                onChange={handleLogoUpload} 
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Primary Color</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={theme.primaryColor}
                  onChange={(e) => onUpdate({...theme, primaryColor: e.target.value})}
                  className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                />
                <input 
                  type="text" 
                  value={theme.primaryColor}
                  onChange={(e) => onUpdate({...theme, primaryColor: e.target.value})}
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono uppercase"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Used for Main Titles</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Secondary Color</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={theme.secondaryColor}
                  onChange={(e) => onUpdate({...theme, secondaryColor: e.target.value})}
                  className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                />
                <input 
                  type="text" 
                  value={theme.secondaryColor}
                  onChange={(e) => onUpdate({...theme, secondaryColor: e.target.value})}
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono uppercase"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Used for Subtitles</p>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Typography */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Typography</label>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => onUpdate({...theme, fontFamily: 'sans'})}
                className={`px-3 py-2 border rounded-lg text-sm font-sans ${theme.fontFamily === 'sans' ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500' : 'border-slate-200 hover:bg-slate-50'}`}
              >
                Sans Serif
              </button>
              <button 
                onClick={() => onUpdate({...theme, fontFamily: 'serif'})}
                className={`px-3 py-2 border rounded-lg text-sm font-serif ${theme.fontFamily === 'serif' ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500' : 'border-slate-200 hover:bg-slate-50'}`}
              >
                Serif
              </button>
              <button 
                onClick={() => onUpdate({...theme, fontFamily: 'mono'})}
                className={`px-3 py-2 border rounded-lg text-sm font-mono ${theme.fontFamily === 'mono' ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500' : 'border-slate-200 hover:bg-slate-50'}`}
              >
                Monospace
              </button>
            </div>
          </div>

        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg shadow-sm transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
