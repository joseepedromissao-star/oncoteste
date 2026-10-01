import React, { useState } from 'react';
import { FlowNode, PathwayType } from '../types';
import { 
  ShieldAlert, 
  Activity, 
  Stethoscope, 
  CopyCheck, 
  Microscope, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  Sparkles, 
  FileText, 
  Play, 
  Info,
  Check
} from 'lucide-react';

interface FlowchartViewProps {
  nodes: FlowNode[];
  onSelectNodeForSimulation: (node: FlowNode) => void;
  onOpenReceptionWithScenario: (scenarioType: PathwayType) => void;
}

export const FlowchartView: React.FC<FlowchartViewProps> = ({
  nodes,
  onSelectNodeForSimulation,
  onOpenReceptionWithScenario,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PathwayType | 'todas'>('todas');
  const [activeNode, setActiveNode] = useState<FlowNode | null>(nodes[0]);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const filteredNodes = selectedCategory === 'todas'
    ? nodes
    : nodes.filter(n => n.category === selectedCategory || n.category === 'geral');

  const toggleCheckItem = (nodeId: string, idx: number) => {
    const key = `${nodeId}-${idx}`;
    setCompletedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-sky-400" />;
      case 'Stethoscope':
        return <Stethoscope className="w-5 h-5 text-emerald-400" />;
      case 'CopyCheck':
        return <CopyCheck className="w-5 h-5 text-indigo-400" />;
      case 'Microscope':
        return <Microscope className="w-5 h-5 text-fuchsia-400" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      default:
        return <Info className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Core Rule of Thumb */}
      <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/40 border border-rose-800/40 rounded-xl p-5 shadow-lg backdrop-blur">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">Regra de Ouro da Recepção Oncológica</span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400 font-mono">POP-RECEP-01</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                A OCI deve ser o primeiro procedimento efetivado no sistema!
              </h2>
              <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Antes de aprovar consultas ou exames correlatos, verifique data do exame, confirme RT da unidade móvel, 
                troque o CBO para Médico Ginecologista (225250) e vincule o código CID-10.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenReceptionWithScenario('geral')}
              className="px-4 py-2 text-xs font-medium text-rose-200 bg-rose-900/60 hover:bg-rose-900 border border-rose-700/50 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Testar no Simulador</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto max-w-full">
          {[
            { id: 'todas', label: 'Fluxo Completo Integrado' },
            { id: 'geral', label: '1. Regra Geral de Entrada' },
            { id: 'mama', label: '2. Câncer de Mama' },
            { id: 'multi_oci', label: '3. Dupla OCI (2 OCIs)' },
            { id: 'colo', label: '4. Colo do Útero' },
            { id: 'birads_critico', label: '5. BIRADS 0, 4 ou 5' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === tab.id
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>{filteredNodes.length} etapas mapeadas</span>
          <span className="text-slate-600">·</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% aderente ao POP Hospital de Amor
          </span>
        </div>
      </div>

      {/* Main Grid: Visual Interactive Flowchart + Step Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Flow Steps */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1 flex items-center justify-between">
            <span>Sequência Operacional de Atendimento</span>
            <span className="text-slate-500 font-normal">Clique no cartão para examinar e validar</span>
          </div>

          <div className="space-y-3">
            {filteredNodes.map((node, index) => {
              const isSelected = activeNode?.id === node.id;
              return (
                <div key={node.id} className="relative group">
                  {/* Step Connector Line */}
                  {index < filteredNodes.length - 1 && (
                    <div className="absolute left-6 top-14 bottom-[-16px] w-0.5 bg-gradient-to-b from-slate-700 to-slate-800/20 z-0 group-hover:from-rose-500/50 transition-colors" />
                  )}

                  <div
                    onClick={() => setActiveNode(node)}
                    className={`relative z-10 p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/90 border-rose-500/70 shadow-lg shadow-rose-950/20 ring-1 ring-rose-500/30'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-lg border shrink-0 transition-colors ${
                          isSelected 
                            ? 'bg-rose-500/20 border-rose-500/40' 
                            : 'bg-slate-800 border-slate-700'
                        }`}>
                          {getIcon(node.iconName)}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 font-mono">
                              ETAPA 0{node.stepNumber}
                            </span>
                            <span className="text-slate-600">·</span>
                            <span className="text-xs text-rose-300 font-medium">
                              {node.subtitle}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-white mt-0.5 group-hover:text-rose-200 transition-colors">
                            {node.title}
                          </h3>
                          <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                            {node.description}
                          </p>
                        </div>
                      </div>

                      <ChevronRight className={`w-5 h-5 shrink-0 transition-transform ${
                        isSelected ? 'text-rose-400 translate-x-1' : 'text-slate-600'
                      }`} />
                    </div>

                    {/* Operational Rule Chip */}
                    {node.highlightRule && (
                      <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-amber-300 font-medium truncate">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                          <span className="truncate">{node.highlightRule}</span>
                        </div>
                        <span className="text-slate-400 shrink-0 font-mono text-[11px] bg-slate-800/70 px-2 py-0.5 rounded">
                          {node.systemDestination}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Inspector & Step Execution Walkthrough */}
        <div className="lg:col-span-5 sticky top-20">
          {activeNode ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
              {/* Header */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                      PROTOCOLO #{activeNode.stepNumber}
                    </span>
                    <span className="text-xs text-slate-400">Linha {activeNode.category.toUpperCase()}</span>
                  </div>
                  <button
                    onClick={() => onOpenReceptionWithScenario(activeNode.category)}
                    className="text-xs font-semibold text-rose-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>Executar no Sistema</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-white mt-2">
                  {activeNode.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {activeNode.description}
                </p>
              </div>

              {/* Operational Rule Box */}
              <div className="bg-slate-950/80 border border-amber-500/30 rounded-lg p-3.5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Regra Mandatória de Sistema</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {activeNode.operationalRule}
                </p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Destino no Sistema HIS:</span>
                  <span className="font-mono text-emerald-300 font-semibold">{activeNode.systemDestination}</span>
                </div>
              </div>

              {/* Interactive Operational Checklist */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Checklist da Recepcionista / Operador</span>
                  <span className="text-[11px] text-slate-500 font-normal">Marque para conferir</span>
                </div>

                <div className="space-y-1.5">
                  {activeNode.checklist.map((item, idx) => {
                    const isChecked = !!completedSteps[`${activeNode.id}-${idx}`];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleCheckItem(activeNode.id, idx)}
                        className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-emerald-950/20 border-emerald-700/50 text-emerald-200'
                            : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isChecked
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : 'border-slate-600 bg-slate-900'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={`leading-tight ${isChecked ? 'line-through opacity-80' : ''}`}>
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CRM Automation Impact */}
              {activeNode.crmAction && (
                <div className="bg-slate-950/60 border border-indigo-500/30 rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Automação no CRM & Jornada do Paciente</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeNode.crmAction}
                  </p>
                </div>
              )}

              {/* Actions Footer */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onOpenReceptionWithScenario(activeNode.category)}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  <span>Carregar Este Cenário na Recepção</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-sm">
              Selecione uma etapa no fluxograma para visualizar as regras e detalhes de sistema.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
