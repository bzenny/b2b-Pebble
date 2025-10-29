import React, { useState } from 'react';
import type { ModuleType } from './types';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/modules/Dashboard';
import { QuoteGen } from './components/modules/QuoteGen';
import { VendorCompare } from './components/modules/VendorCompare';
import { SOWBuilder } from './components/modules/SOWBuilder';
import { MODULES } from './constants';
import { Icon } from './components/common/Icon';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType | null>(null);

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'QuoteGen':
        return <QuoteGen />;
      case 'VendorCompare':
        return <VendorCompare />;
      case 'SOWBuilder':
        return <SOWBuilder />;
      default:
        return <Dashboard onSelectModule={setActiveModule} />;
    }
  };

  const currentModule = activeModule ? MODULES.find(m => m.id === activeModule) : null;

  return (
    <div className="flex h-screen w-full bg-transparent text-gray-200">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="p-4 md:p-6 sticky top-0 z-10">
           <div className="glass-card flex items-center justify-between p-3">
              <h1 className="text-xl font-bold gradient-text">
                {currentModule ? currentModule.title : 'Pebble Dashboard'}
              </h1>
               <div className="flex items-center gap-4">
                  <span className="text-sm opacity-70 hidden sm:block">Welcome, User</span>
                   <button className="glass-btn rounded-full p-2 h-10 w-10 flex items-center justify-center">
                    <Icon icon="user" className="h-5 w-5" />
                   </button>
               </div>
           </div>
        </header>
        <div className="flex-1 p-4 md:p-6 pt-0">
          <div className="animate-fade-in">
            {renderActiveModule()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
