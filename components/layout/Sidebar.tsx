import React from 'react';
import { MODULES } from '../../constants';
import type { ModuleType } from '../../types';
import { Icon } from '../common/Icon';

interface SidebarProps {
  activeModule: ModuleType | null;
  setActiveModule: (module: ModuleType | null) => void;
}

const PebbleLogo: React.FC = () => (
    <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-white/50"></div>
        </div>
        <span className="text-xl font-bold">Pebble</span>
    </div>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule }) => {
  return (
    <nav className="hidden md:flex flex-col gap-8 p-4 w-64 glass-card m-4 my-auto h-[calc(100vh-2rem)]">
      <div className="p-2">
         <button onClick={() => setActiveModule(null)} className="transition-transform hover:scale-105">
            <PebbleLogo />
        </button>
      </div>
      <ul className="flex flex-col gap-2">
        <li>
            <button
              onClick={() => setActiveModule(null)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-200 ${
                activeModule === null
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <Icon icon="home" className={`h-6 w-6 ${activeModule === null ? 'gradient-text' : ''}`} />
              <span>Dashboard</span>
            </button>
        </li>
        {MODULES.map((module) => (
          <li key={module.id}>
            <button
              onClick={() => setActiveModule(module.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-200 ${
                activeModule === module.id
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <Icon icon={module.icon} className={`h-6 w-6 ${activeModule === module.id ? 'gradient-text' : ''}`} />
              <span>{module.title}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-auto p-2">
        <div className="glass-card p-4 text-center">
            <h4 className="font-bold">Upgrade to Pro</h4>
            <p className="text-xs opacity-70 mt-1 mb-3">Unlock templates, unlimited artifacts & more.</p>
            <button className="glass-btn w-full py-2 rounded-lg bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white font-bold text-sm">Upgrade</button>
        </div>
      </div>
    </nav>
  );
};
