import React, { useState, useMemo } from 'react';
import { Search, X, User, Car, Phone, Plus, UserPlus, History, ChevronRight } from 'lucide-react';
import { Order } from './types';

interface IntakeModalProps {
  orders: Order[];
  onClose: () => void;
  onSelectCustomer: (order: Order) => void;
}

const IntakeModal: React.FC<IntakeModalProps> = ({ orders, onClose, onSelectCustomer }) => {
  const [query, setQuery] = useState('');

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    
    const seenNames = new Set();
    return orders.filter(o => {
      const name = o.client_info.name.toLowerCase();
      const phone = o.client_info.phone.toLowerCase();
      const orderNo = o.order_no.toLowerCase();
      
      const matches = name.includes(lowerQuery) || phone.includes(lowerQuery) || orderNo.includes(lowerQuery);
      if (matches && !seenNames.has(o.client_info.name)) {
        seenNames.add(o.client_info.name);
        return true;
      }
      return false;
    });
  }, [query, orders]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-3xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-white/20">
        <div className="p-12">
          <div className="flex justify-between items-start mb-12">
            <div className="space-y-1">
              <h3 className="text-3xl font-black tracking-tight text-slate-900">Intelligent Intake</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Step 01: Identification</p>
            </div>
            <button onClick={onClose} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-[20px] transition-all text-slate-400">
              <X size={24} />
            </button>
          </div>

          <div className="relative mb-10 group">
            <Search size={24} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
            <input 
              autoFocus
              type="text"
              placeholder="Search Customer, Phone, or RO#..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-[32px] pl-16 pr-8 py-6 text-lg font-bold outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner"
            />
          </div>

          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-3 scrollbar-hide pb-4">
            {filteredResults.map(order => (
              <button 
                key={order.id}
                onClick={() => onSelectCustomer(order)}
                className="w-full flex items-center justify-between p-8 bg-white border-2 border-slate-50 rounded-[32px] hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-50/50 transition-all group active:scale-[0.98]"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <User size={24} />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-black text-slate-900 leading-tight">{order.client_info.name}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{order.client_info.phone}</p>
                  </div>
                </div>
                <ChevronRight size={24} className="text-slate-300" />
              </button>
            ))}

            {query.length > 0 && filteredResults.length === 0 && (
              <button className="w-full flex items-center gap-6 p-10 border-2 border-dashed border-slate-200 rounded-[40px] hover:border-blue-600 transition-all group active:scale-[0.98]">
                <UserPlus size={28} className="text-blue-600" />
                <div className="text-left">
                  <p className="text-xl font-black text-slate-900">Enroll New Customer: "{query}"</p>
                  <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mt-1">Start New Master File</p>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntakeModal;