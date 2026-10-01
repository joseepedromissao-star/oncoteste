import React, { useState } from 'react';
import { Patient } from '../types';
import { 
  AlertTriangle, 
  Search, 
  Calendar, 
  Phone, 
  CheckCircle2, 
  Download, 
  Filter, 
  ShieldAlert, 
  Clock, 
  Check, 
  Truck,
  Sparkles
} from 'lucide-react';

interface SisconcoManagerProps {
  patients: Patient[];
  onOpenPatientDetail: (patient: Patient) => void;
  onUpdatePatient: (updated: Patient) => void;
}

export const SisconcoManager: React.FC<SisconcoManagerProps> = ({
  patients,
  onOpenPatientDetail,
  onUpdatePatient,
}) => {
  const [selectedBirads, setSelectedBirads] = useState<string>('todos_criticos');
  const [selectedUnit, setSelectedUnit] = useState<string>('todas');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Critical BIRADS patients
  const criticalPatients = patients.filter(p => {
    const hasResult = p.biradsResult !== undefined;
    const isCritical = ['0', '4', '5'].includes(p.biradsResult || '');
    
    if (selectedBirads === 'todos_criticos') {
      if (!isCritical) return false;
    } else if (selectedBirads !== 'todos') {
      if (p.biradsResult !== selectedBirads) return false;
    }

    if (selectedUnit !== 'todas' && !p.unidadeMovel.includes(selectedUnit)) {
      return false;
    }

    if (searchTerm) {
      const match = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.susCard.includes(searchTerm);
      if (!match) return false;
    }

    return true;
  });

  const handleQuickScheduleUsg = (patient: Patient) => {
    const updated: Patient = {
      ...patient,
      biradsComplementScheduled: true,
      stage: 'complementacao_urgente',
      timeline: [
        {
          id: `ev_sis_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          title: 'USG de Complemento Agendada via SISCONCO',
          description: 'Ultrassonografia mamária agendada pela equipe da carreta. Regra mandatória: NÃO debitou cota de OCI.',
          author: 'Equipe da Carreta',
          category: 'clinico',
          highlight: true
        },
        ...patient.timeline
      ]
    };
    onUpdatePatient(updated);
  };

  const handleQuickContactLog = (patient: Patient) => {
    const updated: Patient = {
      ...patient,
      messages: [
        ...patient.messages,
        {
          id: `msg_contact_${Date.now()}`,
          timestamp: 'Agora mesmo',
          type: 'ligacao',
          direction: 'outbound',
          sender: 'Equipe de Enfermagem da Carreta',
          text: `Contato telefônico realizado com ${patient.name}. Exame de ultrassom complementar orientado e agendado.`,
          status: 'respondido'
        }
      ],
      timeline: [
        {
          id: `ev_call_sis_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          title: 'Busca Ativa SISCONCO Concluída',
          description: 'Responsabilidade cumprida: equipe da carreta efetuou contato com a paciente.',
          author: 'Equipe da Carreta',
          category: 'contato',
          highlight: true
        },
        ...patient.timeline
      ]
    };
    onUpdatePatient(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Protocol Header from Slide 5 */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/40 border border-amber-500/50 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Ponto de Atenção Operacional</span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-300 font-mono">Painel Gerencial de Exames no SISCONCO</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                BIRADS 0, 4 ou 5: Atenção Redobrada
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-3xl leading-relaxed">
                Sempre que o laudo trouxer um desses resultados, é <strong>obrigatório complementar a investigação</strong>.
                A ultrassonografia mamária de complemento é agendada pela <strong>própria equipe da carreta</strong>,
                <strong> NÃO é contabilizada na quantidade de OCIs ofertadas</strong>, e é de responsabilidade da equipe entrar em contato imediato com a paciente.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Cota OCI 100% Protegida
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Metrics Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar paciente ou Cartão SUS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 outline-none"
            />
          </div>

          {/* BIRADS Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px]">Classificação:</span>
            <select
              value={selectedBirads}
              onChange={(e) => setSelectedBirads(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-amber-500 outline-none cursor-pointer"
            >
              <option value="todos_criticos">Críticos (0, 4 e 5)</option>
              <option value="0">BIRADS 0 (Inconclusivo)</option>
              <option value="4">BIRADS 4 (Suspeito)</option>
              <option value="5">BIRADS 5 (Altamente Suspeito)</option>
              <option value="todos">Todos os Laudos</option>
            </select>
          </div>

          {/* Unit Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px]">Carreta / Unidade:</span>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-amber-500 outline-none cursor-pointer"
            >
              <option value="todas">Todas as Unidades Móveis</option>
              <option value="UNIDADE MÓVEL 21">Unidade Móvel 21 - Barretos</option>
              <option value="UNIDADE MÓVEL 05">Unidade Móvel 05 - Bebedouro</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Mostrando {criticalPatients.length} casos prioritários
        </div>
      </div>

      {/* Main SISCONCO Data Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="bg-slate-900/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white uppercase tracking-wider">Painel Gerencial de Laudos & Busca Ativa</span>
            <span className="text-slate-500">·</span>
            <span className="text-amber-400 font-mono">SISTEMA SISCONCO / SIS-SUS</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Atualizado automaticamente a cada 15 min
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Prontuário / SUS</th>
                <th className="py-2.5 px-3">Nome da Paciente</th>
                <th className="py-2.5 px-3">Carreta / Unidade</th>
                <th className="py-2.5 px-3">Laudo Mamografia</th>
                <th className="py-2.5 px-3">Status de Contato</th>
                <th className="py-2.5 px-3">USG Complementar</th>
                <th className="py-2.5 px-3 text-right">Ações Mandatórias</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {criticalPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 italic">
                    Nenhum caso encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                criticalPatients.map((patient) => {
                  const isScheduled = patient.biradsComplementScheduled;
                  const hasContact = patient.messages.some(m => m.direction === 'outbound');

                  return (
                    <tr key={patient.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-3 font-mono text-[11px]">
                        <div className="text-white font-bold">{patient.id}</div>
                        <div className="text-slate-500">{patient.susCard}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div 
                          onClick={() => onOpenPatientDetail(patient)}
                          className="font-bold text-white hover:text-rose-300 cursor-pointer transition-colors"
                        >
                          {patient.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {patient.age} anos · {patient.cidade}
                        </div>
                      </td>

                      <td className="py-3 px-3 font-medium text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-slate-500" />
                          <span>{patient.unidadeMovel}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold font-mono text-xs ${
                          patient.biradsResult === '5'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : patient.biradsResult === '4'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        }`}>
                          <AlertTriangle className="w-3 h-3" />
                          BIRADS {patient.biradsResult}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        {hasContact ? (
                          <span className="text-emerald-400 font-medium flex items-center gap-1">
                            <Check className="w-3 h-3" /> Contato Realizado
                          </span>
                        ) : (
                          <span className="text-rose-400 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Pendente de Contato
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        {isScheduled ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Agendada (Cota Isenta)</span>
                          </span>
                        ) : (
                          <span className="text-amber-400 font-mono text-[11px]">
                            Aguardando Agendamento
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isScheduled ? (
                            <button
                              onClick={() => handleQuickScheduleUsg(patient)}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded text-[11px] cursor-pointer transition-colors shadow-sm"
                            >
                              Agendar USG Isenta
                            </button>
                          ) : (
                            <button
                              onClick={() => onOpenPatientDetail(patient)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] cursor-pointer"
                            >
                              Ver Agendamento
                            </button>
                          )}

                          {!hasContact && (
                            <button
                              onClick={() => handleQuickContactLog(patient)}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded text-[11px] flex items-center gap-1 cursor-pointer"
                            >
                              <Phone className="w-3 h-3" />
                              <span>Ligar</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info banner */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">✓ Diretriz Operacional:</span>
            <span>A ultrassonografia de complemento nunca é debitada da cota do município/convênio.</span>
          </div>
          <div className="font-mono text-slate-500">
            Regra Homologada pelo Hospital de Amor
          </div>
        </div>
      </div>
    </div>
  );
};
