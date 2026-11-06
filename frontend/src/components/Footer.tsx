import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 mt-auto border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h4 className="text-white font-bold text-sm mb-1">
            Smart Traffic Management System (STMS)
          </h4>
          <p className="text-slate-400 max-w-md">
            Academic Decision-Support Prototype • Problem-Based Learning (PBL) • Team RouteX
          </p>
        </div>

        <div className="text-left md:text-right max-w-lg">
          <p className="text-slate-400 leading-relaxed">
            <strong className="text-slate-200">Demonstration Notice:</strong> All road metrics, speeds, and traffic conditions displayed are simulated demo data. This prototype is for educational analytics demonstration and does not provide real-time navigation or actual physical signal control.
          </p>
        </div>
      </div>
    </footer>
  );
};
