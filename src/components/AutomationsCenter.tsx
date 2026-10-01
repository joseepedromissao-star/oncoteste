import React, { useState } from 'react';
import { AutomationRule } from '../types';
import { 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Activity, 
  Clock, 
  ShieldCheck, 
  Zap,
  Check
} from 'lucide-react';

interface AutomationsCenterProps {
  automations: AutomationRule[];
  onToggleAutomation: (ruleId: string) => void;
  onTriggerTestAutomation: (ruleId: string) => void;
}

export const AutomationsCenter: React.FC<AutomationsCenterProps> = ({
  automations,
  onToggleAutomation,
  onTriggerTestAutomation,
}) => {
  const [activeLogMessage, setActiveLogMessage] = useState<string | null>(null);

  const handleTest = (rule: AutomationRule) => {
    onTriggerTestAutomation(rule.id);
    setActiveLogMessage(`⚡ Automação disparada: "${rule.name}" processou evento e atualizou a jornada no CRM!`);
    setTimeout(() => {
      setActiveLogMessage(null);
    }, 4500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/50 border border-purple-500/40 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Motor de Automação CRM</span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400 font-mono">Workflow Engine v2.4</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Automações da Linha de Cuidado & Regras Operacionais
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Regras automatizadas baseadas no POP de recepção e na linha de cuidado oncológico.
                Protegem cotas, eliminam erros de digitação (CBO e RT), unificam evoluções médicas e acionam busca ativa imediata para laudos críticos.
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xs text-slate-400">Automações Ativas</div>
            <div className="text-2xl font-bold font-mono text-purple-300">
              {automations.filter(a => a.active).length} / {automations.length}
            </div>
          </div>
        </div>
      </div>

      {/* Live Toast */}
      {activeLogMessage && (
        <div className="bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl text-xs flex items-center gap-2.5 shadow-lg animate-fade-in">
          <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{activeLogMessage}</span>
        </div>
      )}

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {automations.map(rule => (
          <div
            key={rule.id}
            className={`p-4 rounded-xl border transition-all ${
              rule.active
                ? 'bg-slate-900 border-purple-500/40 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                    {rule.targetCategory.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Disparada {rule.timesTriggered} vezes
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1">
                  {rule.name}
                </h3>
              </div>

              {/* Toggle switch */}
              <button
                onClick={() => onToggleAutomation(rule.id)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  rule.active ? 'bg-purple-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    rule.active ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Trigger & Condition */}
            <div className="mt-3.5 space-y-2 text-xs">
              <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Gatilho (Trigger):</div>
                <div className="text-slate-200 mt-0.5">{rule.trigger}</div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg">
                <div className="text-[10px] text-purple-400 uppercase font-bold">Ação Automatizada:</div>
                <div className="text-slate-300 mt-0.5 leading-relaxed">{rule.action}</div>
              </div>
            </div>

            {/* Footer with simulator action */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                Última execução: <strong className="text-slate-200">{rule.lastTriggered || 'Recentemente'}</strong>
              </span>

              <button
                onClick={() => handleTest(rule)}
                className="px-3 py-1 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/40 text-purple-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play className="w-3 h-3" />
                <span>Simular Disparo</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white uppercase tracking-wider">Histórico de Execuções Recentes do CRM</span>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">Audit Trail SUS</span>
        </div>

        <div className="space-y-2 text-xs">
          {[
            {
              time: '14:49:28',
              rule: 'Alerta Crítico BI-RADS 4',
              patient: 'MARIA TESTE BRUNINHO',
              result: 'Tarefa de busca ativa criada para a Carreta 21. USG complementar marcada sem debitar cota OCI.',
              status: 'Sucesso'
            },
            {
              time: '14:45:10',
              rule: 'Unificação de Dupla OCI',
              patient: 'TEREZA DE JESUS ALBUQUERQUE',
              result: 'Vinculadas 2 solicitações à etapa médico-consulta. Gerado prontuário unificado.',
              status: 'Sucesso'
            },
            {
              time: '14:12:05',
              rule: 'Guardião de CBO & OCI',
              patient: 'MARIA TESTE BRUNINHO',
              result: 'Verificado CBO 225250 (Ginecologista) e RT Dra. Priscila. OCI liberada no topo.',
              status: 'Sucesso'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800 flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 text-[11px]">{item.time}</span>
                  <span className="text-purple-300 font-bold">{item.rule}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-white font-medium">{item.patient}</span>
                </div>
                <div className="text-slate-300 text-[11px] leading-relaxed">
                  {item.result}
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold shrink-0">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
