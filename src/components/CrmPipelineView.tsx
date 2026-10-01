import React, { useState } from 'react';
import { Patient, PatientStage, PathwayType } from '../types';
import { 
  Users, 
  Search, 
  Filter, 
  AlertTriangle, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  MessageSquare,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface CrmPipelineViewProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onMovePatientStage: (patientId: string, newStage: PatientStage) => void;
  onOpenPatientDetail: (patient: Patient) => void;
}

const STAGES: { id: PatientStage; title: string; subtitle: string; color: string }[] = [
  { id: 'recepcao', title: '1. Recepção Unidade Móvel', subtitle: 'Conferência OCI, RT e CBO', color: 'border-sky-500/50 text-sky-300' },
  { id: 'exames', title: '2. Exames em Andamento', subtitle: 'Fila "mamografia" / Carreta', color: 'border-blue-500/50 text-blue-300' },
  { id: 'triagem_laudo', title: '3. Triagem de Laudos', subtitle: 'Importação SISCONCO', color: 'border-purple-500/50 text-purple-300' },
  { id: 'complementacao_urgente', title: '4. Atenção Redobrada', subtitle: 'BIRADS 0/4/5 · Contato Carreta', color: 'border-amber-500/50 text-amber-300' },
  { id: 'consulta_medica', title: '5. Médico-Consulta', subtitle: 'Teleconsulta ou Presencial', color: 'border-emerald-500/50 text-emerald-300' },
  { id: 'fechamento_oci', title: '6. Fechamento de OCI', subtitle: 'Efetivação e Faturamento SUS', color: 'border-rose-500/50 text-rose-300' },
];

export const CrmPipelineView: React.FC<CrmPipelineViewProps> = ({
  patients,
  onSelectPatient,
  onMovePatientStage,
  onOpenPatientDetail,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPathway, setFilterPathway] = useState<PathwayType | 'todas'>('todas');

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.susCard.includes(searchTerm) ||
      patient.cidade.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPathway = filterPathway === 'todas' || patient.pathway === filterPathway;
    return matchesSearch && matchesPathway;
  });

  // Calculate KPIs
  const totalPatients = patients.length;
  const biradsCriticalCount = patients.filter(p => p.biradsResult && ['0', '4', '5'].includes(p.biradsResult)).length;
  const doubleOciCount = patients.filter(p => p.hasDoubleOci).length;
  const colposcopyCount = patients.filter(p => p.isColposcopyBundle).length;

  return (
    <div className="space-y-6">
      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total na Jornada CRM</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {totalPatients}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Monitoradas em tempo real
          </div>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-4 shadow-sm bg-gradient-to-br from-slate-900 to-amber-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-300 font-medium">BIRADS 0, 4 ou 5 (Busca Ativa)</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {biradsCriticalCount}
          </div>
          <div className="text-[11px] text-amber-300/80 mt-0.5">
            USG agendada pela carreta (Cota isenta)
          </div>
        </div>

        <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-indigo-300 font-medium">Pacientes com 2 OCIs</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-300 mt-1">
            {doubleOciCount}
          </div>
          <div className="text-[11px] text-indigo-300/80 mt-0.5">
            1 evolução única · Fechamento duplo
          </div>
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-300 font-medium">Conformidade OCI / CBO</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            100%
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-0.5">
            Zero glosas por inversão de OCI
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por paciente, Cartão SUS, cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 outline-none"
            />
          </div>
        </div>

        {/* Pathway Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'todas', label: 'Todas as Linhas' },
            { id: 'mama', label: 'Mama' },
            { id: 'birads_critico', label: 'BIRADS Crítico' },
            { id: 'multi_oci', label: '2 OCIs' },
            { id: 'colo', label: 'Colo do Útero' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterPathway(tab.id as any)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
                filterPathway === tab.id
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1300px]">
          {STAGES.map(stage => {
            const stagePatients = filteredPatients.filter(p => p.stage === stage.id);
            return (
              <div 
                key={stage.id} 
                className="w-72 shrink-0 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col max-h-[750px]"
              >
                {/* Stage Header */}
                <div className="p-3 border-b border-slate-800 bg-slate-900/60 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white truncate">{stage.title}</h4>
                    <span className="text-[11px] font-mono font-bold bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded">
                      {stagePatients.length}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                    {stage.subtitle}
                  </div>
                </div>

                {/* Patient Cards List */}
                <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
                  {stagePatients.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-slate-500 italic">
                      Nenhuma paciente nesta etapa
                    </div>
                  ) : (
                    stagePatients.map(patient => {
                      const isBiradsWarning = patient.biradsResult && ['0', '4', '5'].includes(patient.biradsResult);
                      return (
                        <div
                          key={patient.id}
                          className={`p-3 rounded-lg border transition-all cursor-pointer bg-slate-900 hover:border-slate-600 shadow-sm ${
                            isBiradsWarning 
                              ? 'border-amber-500/60 ring-1 ring-amber-500/30' 
                              : patient.hasDoubleOci 
                              ? 'border-indigo-500/50' 
                              : 'border-slate-800'
                          }`}
                          onClick={() => onOpenPatientDetail(patient)}
                        >
                          {/* Top Tag Row */}
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1.5">
                            <span>ID: {patient.id}</span>
                            <span>{patient.cidade}</span>
                          </div>

                          {/* Patient Name */}
                          <div className="font-bold text-xs text-white hover:text-rose-300 transition-colors">
                            {patient.name}
                          </div>

                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {patient.age} anos · {patient.unidadeMovel}
                          </div>

                          {/* Badges for Key Operational Rules */}
                          <div className="mt-2.5 space-y-1">
                            {isBiradsWarning && (
                              <div className="bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[10px] px-2 py-1 rounded font-bold flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                                <span>BIRADS {patient.biradsResult} · Busca Carreta Obrigatória</span>
                              </div>
                            )}

                            {patient.hasDoubleOci && (
                              <div className="bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 shrink-0 text-indigo-400" />
                                <span>2 OCIs · Evolução Unificada</span>
                              </div>
                            )}

                            {patient.isColposcopyBundle && (
                              <div className="bg-fuchsia-950/60 border border-fuchsia-500/40 text-fuchsia-300 text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1.5">
                                <span>Colposcopia · 3 Procedimentos</span>
                              </div>
                            )}
                          </div>

                          {/* Footer with stage action mover */}
                          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400 flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 text-emerald-400" />
                              <span>{patient.messages.length} msgs</span>
                            </span>

                            {/* Advance Stage Control */}
                            <div className="flex items-center gap-1">
                              {stage.id !== 'fechamento_oci' ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const nextIdx = STAGES.findIndex(s => s.id === stage.id) + 1;
                                    if (nextIdx < STAGES.length) {
                                      onMovePatientStage(patient.id, STAGES[nextIdx].id);
                                    }
                                  }}
                                  className="text-[10px] text-rose-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded flex items-center gap-1 font-semibold cursor-pointer"
                                >
                                  <span>Avançar</span>
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              ) : (
                                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Finalizado
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
