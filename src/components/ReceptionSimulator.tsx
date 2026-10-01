import React, { useState } from 'react';
import { Patient, PathwayType, ExamProcedure } from '../types';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Check, 
  RefreshCw, 
  Send, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface ReceptionSimulatorProps {
  patients: Patient[];
  activePatient: Patient;
  onSelectPatient: (patient: Patient) => void;
  onUpdatePatient: (updated: Patient) => void;
  onNavigateToCrm: () => void;
  onNavigateToSisconco: () => void;
}

export const ReceptionSimulator: React.FC<ReceptionSimulatorProps> = ({
  patients,
  activePatient,
  onSelectPatient,
  onUpdatePatient,
  onNavigateToCrm,
  onNavigateToSisconco,
}) => {
  // Simulator State Fields
  const [examDate, setExamDate] = useState<string>('2026-07-31');
  const [rtName, setRtName] = useState<string>(activePatient.rtResponsavel || 'DRA. PRISCILA CATELAN SOUTO');
  const [cboCode, setCboCode] = useState<string>(activePatient.cbo || '225250 - MÉDICO GINECOLOGISTA E OBSTETRA');
  const [cidCode, setCidCode] = useState<string>(activePatient.cid || 'N64 - Outr Doenc da Mama');
  const [selectedFila, setSelectedFila] = useState<'mamografia' | 'medico_consulta'>('mamografia');
  const [simulationNotice, setSimulationNotice] = useState<string | null>(null);

  // Procedure list in reception queue
  const [localProcedures, setLocalProcedures] = useState<ExamProcedure[]>(activePatient.procedimentos);

  // Helper check: is OCI the first effective procedure?
  const ociProcedure = localProcedures.find(p => p.type === 'oci');
  const isOciFirstEffected = ociProcedure ? ociProcedure.status === 'efetivado' : false;
  const isCboGinecologista = cboCode.includes('225250') || cboCode.toLowerCase().includes('ginecologista');
  const isRtValid = rtName.trim().length > 3;
  const isDateValid = examDate.length > 5;
  const isCidValid = cidCode.trim().length > 2;

  // Sync when activePatient changes
  const handleSwitchPatient = (patient: Patient) => {
    onSelectPatient(patient);
    setExamDate('2026-07-31');
    setRtName(patient.rtResponsavel || 'DRA. PRISCILA CATELAN SOUTO');
    setCboCode(patient.cbo || '225250 - MÉDICO GINECOLOGISTA E OBSTETRA');
    setCidCode(patient.cid || 'N64 - Outr Doenc da Mama');
    setLocalProcedures(patient.procedimentos);
    setSimulationNotice(null);
  };

  // Efetivar OCI Primeiro (Mandatory Rule Button)
  const handlePrioritizeOci = () => {
    const updated = localProcedures.map(p => {
      if (p.type === 'oci') {
        return { ...p, status: 'efetivado' as const, date: examDate };
      }
      return p;
    });
    setLocalProcedures(updated);
    setSimulationNotice('✅ Regra de Ouro cumprida: A OCI foi efetivada com sucesso como 1º procedimento!');
  };

  // Fix CBO to Ginecologista
  const handleFixCbo = () => {
    setCboCode('225250 - MÉDICO GINECOLOGISTA E OBSTETRA');
    setSimulationNotice('✅ CBO alterado para Médico Ginecologista e Obstetra (225250) conforme exigência de entrada.');
  };

  // Vincular 2 OCIs simultâneas (Slide 2)
  const handleLinkDoubleOci = () => {
    setSelectedFila('medico_consulta');
    const updated = localProcedures.map(p => ({
      ...p,
      filaDestino: 'medico_consulta' as const,
      status: 'efetivado' as const
    }));
    setLocalProcedures(updated);
    setSimulationNotice('✅ Vantagens ativadas: Ambas as consultas vinculadas na fila "médico-consulta" para evolução única e fechamento duplo!');
  };

  // Vincular 3 procedimentos de Colposcopia (Slide 4)
  const handleLinkColposcopyTriple = () => {
    setSelectedFila('medico_consulta');
    const updated = localProcedures.map(p => ({
      ...p,
      filaDestino: 'medico_consulta' as const,
      status: 'efetivado' as const
    }));
    setLocalProcedures(updated);
    setSimulationNotice('✅ Protocolo de Colo do Útero: Os 3 procedimentos vinculados juntos na etapa "médico-consulta"!');
  };

  // Vincular para Mamografia (Slide 3)
  const handleLinkMamografia = () => {
    setSelectedFila('mamografia');
    const updated = localProcedures.map(p => {
      if (p.name.includes('MAMOGRAFIA') || p.name.includes('ECOGRAFIA')) {
        return { ...p, filaDestino: 'mamografia' as const, status: 'efetivado' as const };
      }
      return p;
    });
    setLocalProcedures(updated);
    setSimulationNotice('✅ No dia do exame: Mamografia e USG vinculados na etapa do processo "mamografia"!');
  };

  // Vincular para Médico Consulta (Slide 3)
  const handleLinkMedicoConsulta = () => {
    setSelectedFila('medico_consulta');
    const updated = localProcedures.map(p => {
      if (p.type === 'consulta' || p.name.includes('TELECONSULTA') || p.name.includes('CONSULTA')) {
        return { ...p, filaDestino: 'medico_consulta' as const, status: 'efetivado' as const };
      }
      return p;
    });
    setLocalProcedures(updated);
    setSimulationNotice('✅ No dia da consulta: Consulta/Teleconsulta vinculada na etapa do processo "médico-consulta"!');
  };

  // Save & Sync to CRM
  const handleSaveAndSyncCrm = () => {
    const updatedPatient: Patient = {
      ...activePatient,
      cbo: cboCode,
      rtResponsavel: rtName,
      cid: cidCode,
      procedimentos: localProcedures,
      timeline: [
        {
          id: `tl_save_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          title: 'Recepção Efetivada & Auditada',
          description: `Procedimentos sincronizados. OCI: ${isOciFirstEffected ? 'Efetivada (OK)' : 'Aguardando'}. CBO: ${cboCode}. Fila: ${selectedFila}.`,
          author: 'Paula Carvalho Ribeiro (Recepção)',
          category: 'recepcao',
          highlight: true
        },
        ...activePatient.timeline
      ]
    };
    onUpdatePatient(updatedPatient);
    setSimulationNotice('🚀 Atendimento efetivado no sistema HIS e transmitido ao CRM da Jornada com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Top Patient Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Ambiente de Simulação de Recepção</div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Paciente em Atendimento:</span>
              <span className="text-rose-300 font-mono">{activePatient.name}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400">Alternar Paciente / Cenário:</span>
          <select
            value={activePatient.id}
            onChange={(e) => {
              const found = patients.find(p => p.id === e.target.value);
              if (found) handleSwitchPatient(found);
            }}
            className="bg-slate-950 border border-slate-700 text-xs font-semibold text-slate-200 rounded-lg px-3 py-1.5 focus:border-rose-500 outline-none cursor-pointer"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.pathway === 'mama' ? 'Câncer de Mama' : p.pathway === 'multi_oci' ? '2 OCIs' : p.pathway === 'colo' ? 'Colo do Útero' : 'BIRADS 5 Crítico'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Real-Time Rule Feedback Banner */}
      {simulationNotice && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 px-4 py-3 rounded-xl text-xs flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{simulationNotice}</span>
          </div>
          <button 
            onClick={() => setSimulationNotice(null)}
            className="text-slate-400 hover:text-white text-xs font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Split: Left HIS Form (faithfully modeled on slide 1-4) & Right Rule Validation Engine */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 cols): The Simulated HIS Reception Screen */}
        <div className="xl:col-span-8 bg-slate-950 border-2 border-slate-700 rounded-xl overflow-hidden shadow-2xl">
          {/* Header of HIS screen */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 px-4 py-2.5 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white uppercase tracking-wider">Recepção de Atendimento Geral</span>
              <span className="text-slate-500">·</span>
              <span className="font-mono text-slate-400">Filial: ANTENOR DUARTE VILELA - BARRETOS</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span>Usuário: EXP0064C</span>
              <span>Data: 31/07/2026</span>
              <span className="text-emerald-400 font-bold">Status: EM ATENDIMENTO</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            {/* Top row: Patient Identification (Slide 1 Box 1) */}
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-lg p-3 space-y-3">
              <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center justify-between">
                <span>Pessoas (Pacientes) · Identificação</span>
                <span className="text-slate-400 font-mono">Código: {activePatient.id}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                <div className="sm:col-span-5">
                  <label className="text-[10px] text-slate-400 block mb-0.5">Nome da Paciente</label>
                  <input
                    type="text"
                    readOnly
                    value={activePatient.name}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-white font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] text-slate-400 block mb-0.5">Idade</label>
                  <input
                    type="text"
                    readOnly
                    value={`${activePatient.age} anos`}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] text-slate-400 block mb-0.5">Sexo</label>
                  <input
                    type="text"
                    readOnly
                    value={activePatient.gender}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="text-[10px] text-slate-400 block mb-0.5">Cartão SUS</label>
                  <input
                    type="text"
                    readOnly
                    value={activePatient.susCard}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-300 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Middle Section: Solicitação, Facilitadores, RT e CBO (Slide 1 Box 2 & Slide 2) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              {/* Facilitadores & Parâmetros */}
              <div className="sm:col-span-6 bg-slate-900/60 border border-slate-800 rounded-lg p-3 space-y-2.5 text-xs">
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                  Inf. Gerais (Facilitadores) & Unidade Móvel
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">
                    Centro de Custo Solicitante / Unidade Móvel
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={activePatient.unidadeMovel}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Caráter Atend.:</span>
                    <span className="font-mono text-slate-300">1768 - ROTINA</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Tipo Atend.:</span>
                    <span className="font-mono text-slate-300">590 - AMBULATORIAL</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Tipo Paciente:</span>
                    <span className="font-mono text-slate-300">1783 - EXTERNO</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Modalidade:</span>
                    <span className="font-mono text-slate-300">79157 - AGSUS</span>
                  </div>
                </div>
              </div>

              {/* Regras Críticas: Data, RT, CBO e CID */}
              <div className="sm:col-span-6 bg-slate-900/60 border border-slate-800 rounded-lg p-3 space-y-2 text-xs">
                <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center justify-between">
                  <span>Campos Mandatórios de Recepção</span>
                  <span className="text-[10px] text-slate-500 font-normal">Slide 1 POP</span>
                </div>

                {/* 1. Data do exame */}
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="text-[10px] text-slate-300 font-medium">1. Data que o exame foi realizado:</label>
                    {isDateValid ? (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                        <Check className="w-3 h-3" /> OK
                      </span>
                    ) : (
                      <span className="text-[10px] text-rose-400">Obrigatório</span>
                    )}
                  </div>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-100 font-mono text-xs focus:border-rose-500 outline-none"
                  />
                </div>

                {/* 2. Nome do RT da unidade móvel */}
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="text-[10px] text-slate-300 font-medium">2. Nome do RT da Unidade Móvel:</label>
                    {isRtValid ? (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                        <Check className="w-3 h-3" /> OK
                      </span>
                    ) : (
                      <span className="text-[10px] text-rose-400">Pendente</span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={rtName}
                    onChange={(e) => setRtName(e.target.value)}
                    placeholder="Nome do Médico RT da Unidade Móvel..."
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-100 text-xs focus:border-rose-500 outline-none"
                  />
                </div>

                {/* 3. Trocar CBO para Ginecologista */}
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="text-[10px] text-slate-300 font-medium">3. CBO Profissional:</label>
                    {isCboGinecologista ? (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                        <Check className="w-3 h-3" /> Ginecologista (OK)
                      </span>
                    ) : (
                      <button
                        onClick={handleFixCbo}
                        className="text-[10px] text-amber-300 hover:text-white underline cursor-pointer font-bold"
                      >
                        Trocar para Ginecologista ➔
                      </button>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={cboCode}
                      onChange={(e) => setCboCode(e.target.value)}
                      className={`w-full bg-slate-950 border rounded px-2 py-1 text-xs outline-none ${
                        isCboGinecologista 
                          ? 'border-emerald-600/60 text-emerald-300 font-medium' 
                          : 'border-rose-500 text-rose-300 font-bold'
                      }`}
                    />
                    {!isCboGinecologista && (
                      <button
                        onClick={handleFixCbo}
                        className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded text-[10px] font-bold shrink-0 cursor-pointer"
                      >
                        Fixar 225250
                      </button>
                    )}
                  </div>
                </div>

                {/* 4. Colocar o CID */}
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="text-[10px] text-slate-300 font-medium">4. Diagnóstico (CID-10):</label>
                    {isCidValid && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                        <Check className="w-3 h-3" /> OK
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={cidCode}
                    onChange={(e) => setCidCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-100 text-xs focus:border-rose-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Section: Exames Solicitados & Regra da OCI Primeiro (Slide 1 Box 3) */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Exames & Procedimentos Solicitados
                  </span>
                  <span className="text-xs text-slate-400">· Status no Sistema</span>
                </div>

                {/* OCI Priority Banner */}
                {!isOciFirstEffected ? (
                  <div className="flex items-center gap-2 bg-rose-500/20 border border-rose-500/40 px-2.5 py-1 rounded text-xs text-rose-300">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                    <span className="font-semibold">A OCI DEVE SER O PRIMEIRO PROCEDIMENTO EFETIVADO!</span>
                    <button
                      onClick={handlePrioritizeOci}
                      className="ml-1 px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10px] font-bold cursor-pointer"
                    >
                      Efetivar OCI Agora
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>OCI Efetivada como 1º Procedimento (Conforme POP)</span>
                  </div>
                )}
              </div>

              {/* Procedures Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-1.5 px-2">Código</th>
                      <th className="py-1.5 px-2">Descrição do Procedimento</th>
                      <th className="py-1.5 px-2">Convênio</th>
                      <th className="py-1.5 px-2">Fila de Atendimento</th>
                      <th className="py-1.5 px-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {localProcedures.map((proc) => {
                      const isOci = proc.type === 'oci';
                      return (
                        <tr 
                          key={proc.id} 
                          className={`${
                            isOci 
                              ? 'bg-rose-950/20 font-medium' 
                              : 'hover:bg-slate-800/40'
                          }`}
                        >
                          <td className="py-2 px-2 font-mono text-[11px] text-slate-400">
                            {proc.code}
                          </td>
                          <td className="py-2 px-2">
                            <div className="flex items-center gap-2">
                              {isOci && (
                                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-bold px-1.5 py-0.2 rounded font-mono">
                                  PRIORITÁRIA
                                </span>
                              )}
                              <span className={isOci ? 'text-rose-200 font-bold' : 'text-slate-200'}>
                                {proc.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 px-2 font-mono text-[11px] text-slate-400">
                            {proc.convenio}
                          </td>
                          <td className="py-2 px-2 text-[11px]">
                            <span className="bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-300">
                              {proc.filaDestino === 'mamografia' ? 'MAMOGRAFIA' : proc.filaDestino === 'medico_consulta' ? 'MÉDICO - CONSULTA' : 'RECEPÇÃO'}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-right">
                            {proc.status === 'efetivado' ? (
                              <span className="text-emerald-400 font-bold font-mono text-[11px] flex items-center justify-end gap-1">
                                <Check className="w-3 h-3" /> EFETIVADO
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  if (isOci) {
                                    handlePrioritizeOci();
                                  } else if (!isOciFirstEffected) {
                                    setSimulationNotice('⚠️ Bloqueio de Segurança: A OCI deve ser efetivada antes dos outros exames!');
                                  } else {
                                    setLocalProcedures(prev => prev.map(p => p.id === proc.id ? { ...p, status: 'efetivado' } : p));
                                  }
                                }}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                                  isOci 
                                    ? 'bg-rose-600 hover:bg-rose-500 text-white' 
                                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                }`}
                              >
                                {isOci ? 'Efetivar OCI' : 'Efetivar'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fila & Vinculação Controls (Slide 2, 3 e 4) */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                <span className="font-bold text-white">Etapa do Processo / Fila de Atendimento</span>
                <span className="text-[11px] text-slate-400">Vincular solicitações conforme tipo de visita</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {/* Button: Mama Dia Exame */}
                <button
                  onClick={handleLinkMamografia}
                  className="p-2.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-left text-xs transition-colors cursor-pointer"
                >
                  <div className="text-[10px] text-sky-400 font-mono font-bold">SLIDE 3 · DIA DO EXAME</div>
                  <div className="text-white font-semibold mt-0.5">Fila "MAMOGRAFIA"</div>
                  <div className="text-[11px] text-slate-400 mt-1">Vincula mamografia e/ou USG mamária</div>
                </button>

                {/* Button: Mama Dia Consulta */}
                <button
                  onClick={handleLinkMedicoConsulta}
                  className="p-2.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-left text-xs transition-colors cursor-pointer"
                >
                  <div className="text-[10px] text-emerald-400 font-mono font-bold">SLIDE 3 · DIA DA CONSULTA</div>
                  <div className="text-white font-semibold mt-0.5">Fila "MÉDICO-CONSULTA"</div>
                  <div className="text-[11px] text-slate-400 mt-1">Vincula consulta ou teleconsulta</div>
                </button>

                {/* Button: Paciente 2 OCIs */}
                <button
                  onClick={handleLinkDoubleOci}
                  className="p-2.5 rounded-lg border border-indigo-700/60 bg-indigo-950/30 hover:bg-indigo-900/40 text-left text-xs transition-colors cursor-pointer"
                >
                  <div className="text-[10px] text-indigo-400 font-mono font-bold">SLIDE 2 · 2 OCIS</div>
                  <div className="text-white font-semibold mt-0.5">Vincular 2 OCIs Juntas</div>
                  <div className="text-[11px] text-slate-400 mt-1">1 única evolução clínica + Fechamento duplo</div>
                </button>

                {/* Button: Colo 3 Procedimentos */}
                <button
                  onClick={handleLinkColposcopyTriple}
                  className="p-2.5 rounded-lg border border-fuchsia-700/60 bg-fuchsia-950/30 hover:bg-fuchsia-900/40 text-left text-xs transition-colors cursor-pointer"
                >
                  <div className="text-[10px] text-fuchsia-400 font-mono font-bold">SLIDE 4 · COLPOSCOPIA</div>
                  <div className="text-white font-semibold mt-0.5">Vincular 3 Procedimentos</div>
                  <div className="text-[11px] text-slate-400 mt-1">Colposcopia + Consulta + OCI Colo</div>
                </button>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>Operador: Paula Carvalho Ribeiro</span>
                <span className="text-slate-600">·</span>
                <span className="text-emerald-400 font-medium">Sessão Autenticada</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleSaveAndSyncCrm}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Efetivar & Sincronizar com CRM</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Validation Engine & Operational Rule Inspector */}
        <div className="xl:col-span-4 space-y-4">
          {/* Rules Compliance Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Auditor de Regras em Tempo Real
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-400">
                CHECKLIST POP
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {/* Check 1 */}
              <div className={`p-2.5 rounded-lg border flex items-start gap-2.5 ${
                isOciFirstEffected
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
              }`}>
                <div className="shrink-0 mt-0.5">
                  {isOciFirstEffected ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  )}
                </div>
                <div>
                  <div className="font-bold">Regra 1: OCI é o 1º procedimento efetivado?</div>
                  <div className="text-[11px] opacity-80 mt-0.5">
                    {isOciFirstEffected 
                      ? 'Em conformidade com a Regra Geral da Recepção.' 
                      : 'ATENÇÃO: A OCI deve ser o primeiro procedimento efetivado!'}
                  </div>
                  {!isOciFirstEffected && (
                    <button
                      onClick={handlePrioritizeOci}
                      className="mt-1.5 text-[10px] font-bold text-rose-300 bg-rose-900/60 hover:bg-rose-900 px-2 py-0.5 rounded cursor-pointer"
                    >
                      Priorizar OCI Automaticamente
                    </button>
                  )}
                </div>
              </div>

              {/* Check 2 */}
              <div className={`p-2.5 rounded-lg border flex items-start gap-2.5 ${
                isDateValid
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
              }`}>
                <div className="shrink-0 mt-0.5">
                  <CheckCircle2 className={`w-4 h-4 ${isDateValid ? 'text-emerald-400' : 'text-slate-600'}`} />
                </div>
                <div>
                  <div className="font-bold">Regra 2: Data que o exame foi realizado</div>
                  <div className="text-[11px] opacity-80 mt-0.5 font-mono">
                    {isDateValid ? `Registrada: ${examDate}` : 'Preenchimento pendente.'}
                  </div>
                </div>
              </div>

              {/* Check 3 */}
              <div className={`p-2.5 rounded-lg border flex items-start gap-2.5 ${
                isRtValid
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
              }`}>
                <div className="shrink-0 mt-0.5">
                  <CheckCircle2 className={`w-4 h-4 ${isRtValid ? 'text-emerald-400' : 'text-slate-600'}`} />
                </div>
                <div>
                  <div className="font-bold">Regra 3: Nome do RT da unidade móvel</div>
                  <div className="text-[11px] opacity-80 mt-0.5">
                    {isRtValid ? `RT: ${rtName}` : 'Nome do RT não preenchido.'}
                  </div>
                </div>
              </div>

              {/* Check 4 */}
              <div className={`p-2.5 rounded-lg border flex items-start gap-2.5 ${
                isCboGinecologista
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
              }`}>
                <div className="shrink-0 mt-0.5">
                  {isCboGinecologista ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  )}
                </div>
                <div>
                  <div className="font-bold">Regra 4: CBO trocado para "Ginecologista"?</div>
                  <div className="text-[11px] opacity-80 mt-0.5">
                    {isCboGinecologista 
                      ? 'CBO 225250 (Ginecologista) validado.' 
                      : 'Obrigatório trocar CBO para "ginecologista" (225250).'}
                  </div>
                  {!isCboGinecologista && (
                    <button
                      onClick={handleFixCbo}
                      className="mt-1.5 text-[10px] font-bold text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/40 px-2 py-0.5 rounded cursor-pointer"
                    >
                      Trocar CBO para 225250
                    </button>
                  )}
                </div>
              </div>

              {/* Check 5 */}
              <div className={`p-2.5 rounded-lg border flex items-start gap-2.5 ${
                isCidValid
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
              }`}>
                <div className="shrink-0 mt-0.5">
                  <CheckCircle2 className={`w-4 h-4 ${isCidValid ? 'text-emerald-400' : 'text-slate-600'}`} />
                </div>
                <div>
                  <div className="font-bold">Regra 5: Código CID-10 informado</div>
                  <div className="text-[11px] opacity-80 mt-0.5 font-mono">
                    {isCidValid ? `CID: ${cidCode}` : 'Código CID pendente.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Link to CRM & SISCONCO */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <button
                onClick={onNavigateToCrm}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Acompanhar Paciente no CRM</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {activePatient.biradsResult && ['0', '4', '5'].includes(activePatient.biradsResult) && (
                <button
                  onClick={onNavigateToSisconco}
                  className="w-full py-2 px-3 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-500/40 text-amber-300 text-xs font-semibold rounded-lg transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ver no Painel SISCONCO (BIRADS {activePatient.biradsResult})</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
