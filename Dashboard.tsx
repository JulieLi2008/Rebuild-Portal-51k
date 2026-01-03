import React from 'react';
import { 
  DollarSign, 
  Car, 
  TrendingUp, 
  PlusCircle, 
  UserPlus, 
  ShoppingCart, 
  Clock, 
  ChevronRight,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { Order, OrderStatus } from './types';

interface DashboardProps {
  orders: Order[];
  onNewEstimate: () => void;
  onSelectOrder: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ orders, onNewEstimate, onSelectOrder }) => {
  const activeOrders = orders.filter(o => o.status !== OrderStatus.Completed);

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Today's Revenue", val: "$2,034.00", trend: "+15.4%", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Vehicles In Bay", val: "5", trend: "Steady", icon: Car, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Avg RO Value", val: "$406.80", trend: "+3.2%", icon: Activity, color: "text-amber-600", bg: "bg-amber-50" }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.label}</p>
              <div className={`${item.bg} ${item.color} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                <item.icon size={20} />
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{item.val}</h3>
              {item.trend !== "Steady" && (
                <span className="text-[10px] font-black text-emerald-500 flex items-center gap-0.5">
                  <ArrowUpRight size={12} /> {item.trend}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <button 
            onClick={onNewEstimate}
            className="flex items-center gap-5 p-7 bg-blue-600 rounded-[32px] text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 group active:scale-95"
          >
            <PlusCircle size={28} />
            <div className="text-left">
              <p className="text-lg font-black tracking-tight">New Estimate</p>
              <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-0.5">Start Intake</p>
            </div>
          </button>
          <button className="flex items-center gap-5 p-7 bg-slate-50 border border-slate-100 rounded-[32px] text-slate-900 hover:bg-slate-100 transition-all group active:scale-95">
            <UserPlus size={28} className="text-slate-600" />
            <div className="text-left">
              <p className="text-lg font-black tracking-tight">New Customer</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Enrollment</p>
            </div>
          </button>
          <button className="flex items-center gap-5 p-7 bg-slate-50 border border-slate-100 rounded-[32px] text-slate-900 hover:bg-slate-100 transition-all group active:scale-95">
            <ShoppingCart size={28} className="text-slate-600" />
            <div className="text-left">
              <p className="text-lg font-black tracking-tight">Order Parts</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Procurement</p>
            </div>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-6">Active Queue</h4>
        <div className="grid grid-cols-1 gap-5">
          {activeOrders.map(order => (
            <div 
              key={order.id} 
              onClick={() => onSelectOrder(order.id)}
              className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-slate-400 font-black group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                  <span className="text-[9px] uppercase opacity-50">RO</span>
                  <span className="text-lg">{order.order_no}</span>
                </div>
                <div>
                  <h5 className="font-black text-xl text-slate-900 tracking-tight leading-tight">{order.client_info.name}</h5>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={12} /> Received: {order.date}
                  </p>
                </div>
              </div>
              <ChevronRight size={24} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;