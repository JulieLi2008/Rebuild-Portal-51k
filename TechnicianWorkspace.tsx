import React from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  ClipboardCheck, 
  MessageSquare, 
  Camera,
  Hammer,
  AlertCircle
} from 'lucide-react';
import { Order, OrderStatus, ProductionTasks } from './types';

interface TechnicianWorkspaceProps {
  order: Order;
  tasks: ProductionTasks | undefined;
  onBack: () => void;
  onToggleTask: (taskId: string) => void;
}

const TechnicianWorkspace: React.FC<TechnicianWorkspaceProps> = ({ order, tasks, onBack, onToggleTask }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in slide-in-from-right-10 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-white rounded-2xl border border-transparent hover:border-slate-200 transition-all">
          <ArrowLeft size={24} className="text-slate-400" />
        </button>
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Job Card: #{order.order_no}</h3>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{order.client_info.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Production Checklist</h4>
            <div className="space-y-4">
              {tasks?.tasks.map(task => (
                <button 
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all ${
                    task.is_complete ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {task.is_complete ? <CheckCircle2 size={24} className="text-emerald-500" /> : <Circle size={24} className="text-slate-300" />}
                    <p className={`text-sm font-black ${task.is_complete ? 'text-emerald-700' : 'text-slate-700'}`}>{task.task_name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <div className="bg-[#1e293b] rounded-[40px] p-10 text-white shadow-xl">
            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-8">Customer Matrix</h4>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Owner</p>
                <p className="font-black text-lg">{order.client_info.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Phone</p>
                <p className="font-black text-lg">{order.client_info.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianWorkspace;