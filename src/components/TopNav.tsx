import React from 'react';
import { 
  GitFork, 
  LayoutGrid, 
  FileCheck2, 
  AlertTriangle, 
  Bot, 
  PlusCircle, 
  Sparkles,
  Layers,
  Monitor
} from 'lucide-react';

export type AppNavTab = 'sis_onco' | 'flowchart' | 'reception' | 'crm' | 'sisconco' | 'automations';

interface TopNavProps {
  activeTab: AppNavTab;
  setActiveTab: (tab: AppNavTab) => void;
  onOpenNewPatientModal: () => void;
  activeAlertsCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewPatientModal,
  activeAlertsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md px-4 lg:px-8 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-sm shadow-rose-950">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-base lg:text-lg font-bold tracking-tight text-white flex items-center gap-2">
            OncoFluxo & CRM
            <span className="hidden sm:inline text-xs font-normal text-slate-400">· Recepção & Linha de Cuidado</span>
          </span>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {/* PRIMARY: SIS-ONCO Oracle Forms System Simulator */}
          <button
            onClick={() => setActiveTab('sis_onco')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'sis_onco'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Monitor className="w-4 h-4 text-amber-400" />
            <span>SIS-ONCO (Oracle Forms)</span>
            <span className="text-[10px] bg-red-600/80 text-white font-mono px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
              Vídeo Treinamento
            </span>
          </button>

          <button
            onClick={() => setActiveTab('flowchart')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'flowchart'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <GitFork className="w-4 h-4 text-rose-400" />
            <span>Fluxograma POP</span>
          </button>

          <button
            onClick={() => setActiveTab('reception')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'reception'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-sky-400" />
            <span>Validador POP</span>
          </button>

          <button
            onClick={() => setActiveTab('crm')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'crm'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-emerald-400" />
            <span>Kanban CRM</span>
          </button>

          <button
            onClick={() => setActiveTab('sisconco')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'sisconco'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Painel SISCONCO</span>
            {activeAlertsCount > 0 && (
              <span className="bg-amber-500/20 text-amber-300 text-xs px-1.5 py-0.2 rounded font-mono font-bold">
                {activeAlertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('automations')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'automations'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Bot className="w-4 h-4 text-purple-400" />
            <span>Automações</span>
          </button>
        </nav>

        {/* Zone 3: Primary action button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenNewPatientModal}
            className="px-3 py-1.5 text-xs lg:text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 rounded-lg shadow-sm shadow-rose-950/50 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Cenários de Teste</span>
            <span className="sm:hidden">Cenário</span>
          </button>
        </div>
      </div>
    </header>
  );
};
