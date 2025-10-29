import React from 'react';
import { MODULES } from '../../constants';
import type { ModuleType } from '../../types';
import { Icon } from '../common/Icon';

interface DashboardProps {
  onSelectModule: (module: ModuleType) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectModule }) => {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome to Pebble</h2>
        <p className="text-gray-300 max-w-2xl">
          Tiny tools for big business wins. Select a module below to generate quotes, compare vendors, build SOWs, and more—all in minutes.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODULES.map((module) => (
          <button
            key={module.id}
            onClick={() => onSelectModule(module.id)}
            className="glass-card p-6 text-left"
          >
            <div className="flex items-center gap-4 mb-3">
               <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/5">
                <span className="gradient-text">
                  <Icon icon={module.icon} className="h-6 w-6" />
                </span>
               </div>
               <h3 className="text-xl font-bold text-white">{module.title}</h3>
            </div>
            <p className="text-gray-300">{module.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
