import React from 'react';
import { ProcessingStep } from '../types';
import { Check, Loader2, Circle } from 'lucide-react';

interface Props {
  steps: ProcessingStep[];
}

export const StepIndicator: React.FC<Props> = ({ steps }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10" />
        
        {steps.map((step, index) => {
          let Icon = Circle;
          let colorClass = "bg-white border-gray-300 text-gray-400";
          let labelClass = "text-gray-400";

          if (step.status === 'completed') {
            Icon = Check;
            colorClass = "bg-green-500 border-green-500 text-white";
            labelClass = "text-green-600 font-medium";
          } else if (step.status === 'active') {
            Icon = Loader2;
            colorClass = "bg-brand-600 border-brand-600 text-white";
            labelClass = "text-brand-600 font-bold";
          }

          return (
            <div key={step.id} className="flex flex-col items-center group relative">
               <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${colorClass} z-10`}>
                 <Icon className={`w-5 h-5 ${step.status === 'active' ? 'animate-spin' : ''}`} />
               </div>
               <div className={`mt-2 text-xs md:text-sm text-center bg-white px-1 ${labelClass}`}>
                 {step.label}
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
