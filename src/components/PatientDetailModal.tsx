import React, { useState } from 'react';
import { Patient, PatientMessage, JourneyEvent } from '../types';
import { 
  X, 
  Phone, 
  MessageSquare, 
  Send, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Stethoscope, 
  Clock, 
  Check
} from 'lucide-react';

interface PatientDetailModalProps {
  patient: Patient;
  onClose: () => void;
  onUpdatePatient: (updated: Patient) => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  patient,
  onClose,
  onUpdatePatient,
}) => {
  const [activeTab, setActiveTab] = useState<'geral' | 'whatsapp' | 'timeline' | 'birads'>('geral');
  const [newMessageText, setNewMessageText] = useState('');

  const isBiradsCritical = patient.biradsResult && ['0', '4', '5'].includes(patient.biradsResult);

  // Send new WhatsApp message
  const handleSendMessage = (customText?: string) => {
    const textToSend = customText || newMessageText;
    if (!textToSend.trim()) return;

    const newMsg: PatientMessage = {
      id: `msg_${Date.now()}`,
      timestamp: 'Agora mesmo',
      type: 'whatsapp',
      direction: 'outbound',
      sender: 'Equipe da Unidade Móvel - Central de Cuidado',
      text: textToSend,
      status: 'entregue'
    };

    const newEvent: JourneyEvent = {
      id: `ev_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      title: 'Mensagem WhatsApp Enviada',
      description: textToSend.substring(0, 80) + '...',
      author: 'CRM Omnichannel Bot',
      category: 'contato'
    };

    onUpdatePatient({
      ...patient,
      messages: [...patient.messages, newMsg],
      timeline: [newEvent, ...patient.timeline]
    });

    setNewMessageText('');
  };

  // Schedule Free-Quota USG for BIRADS 0/4/5
  const handleScheduleComplementaryUsg = () => {
    const newEvent: JourneyEvent = {
      id: `ev_usg_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      title: 'USG Mamária de Complemento Agendada',
      description: 'Ultrassonografia mamária agendada pela equipe da carreta. Regra respeitada: NÃO contabilizada em cota OCI.',
      author: 'Equipe da Carreta',
      category: 'clinico',
      highlight: true
    };

    onUpdatePatient({
      ...patient,
      biradsComplementScheduled: true,
      stage: 'complementacao_urgente',
      timeline: [newEvent, ...patient.timeline],
      alerts: [
        'USG Complementar confirmada para esta semana pela equipe da carreta (Cota Isenta)',
        ...patient.alerts.filter(a => !a.includes('Obrigatório contato ativo'))
      ]
    });
  };

  // Log Team Call with patient
  const handleLogTeamCall = () => {
    const newEvent: JourneyEvent = {
      id: `ev_call_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      title: 'Busca Ativa: Contato Telefônico Realizado',
      description: 'Equipe da unidade móvel conversou com a paciente. Orientações prestadas com acolhimento.',
      author: 'Enfermeira da Carreta',
      category: 'contato',
      highlight: true
    };

    onUpdatePatient({
      ...patient,
      timeline: [newEvent, ...patient.timeline]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center font-bold font-mono">
              {patient.age}a
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-400 font-mono font-bold">PRONTUÁRIO #{patient.id}</span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-400 font-mono">SUS: {patient.susCard}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {patient.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-800 bg-slate-900/50 text-xs">
          <button
            onClick={() => setActiveTab('geral')}
            className={`pb-2.5 font-semibold transition-colors border-b-2 cursor-pointer ${
              activeTab === 'geral'
                ? 'border-rose-500 text-rose-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Dados Clínicos & Procedimentos
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`pb-2.5 font-semibold transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'whatsapp'
                ? 'border-emerald-500 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp & Acolhimento</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded font-mono">
              {patient.messages.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-2.5 font-semibold transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'border-sky-500 text-sky-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>Linha do Tempo CRM</span>
          </button>

          {isBiradsCritical && (
            <button
              onClick={() => setActiveTab('birads')}
              className={`pb-2.5 font-semibold transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'birads'
                  ? 'border-amber-500 text-amber-300'
                  : 'border-transparent text-amber-400/80 hover:text-amber-300'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Atenção Redobrada (BIRADS {patient.biradsResult})</span>
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: General & Procedures */}
          {activeTab === 'geral' && (
            <div className="space-y-4">
              {/* Critical Alert if BIRADS 0, 4 or 5 */}
              {isBiradsCritical && (
                <div className="bg-amber-950/40 border border-amber-500/50 rounded-xl p-3.5 text-xs text-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-amber-300">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>PONTO DE ATENÇÃO OPERACIONAL: LAUDO BIRADS {patient.biradsResult}</span>
                    </div>
                    <span className="font-mono text-[10px] bg-amber-500/20 px-2 py-0.5 rounded text-amber-300">
                      SLIDE 5 POP
                    </span>
                  </div>
                  <p className="leading-relaxed">
                    Sempre que o laudo trouxer resultado BIRADS 0, 4 ou 5, é <strong>obrigatório complementar a investigação</strong>.
                    A USG de complemento é agendada pela <strong>própria equipe da carreta</strong> e <strong>NÃO é contabilizada na quantidade de OCIs ofertadas</strong>.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleScheduleComplementaryUsg}
                      disabled={patient.biradsComplementScheduled}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        patient.biradsComplementScheduled
                          ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-500/40'
                          : 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                      }`}
                    >
                      {patient.biradsComplementScheduled ? '✓ USG Complementar Agendada (Cota Isenta)' : 'Agendar USG pela Carreta (Sem Débito OCI)'}
                    </button>

                    <button
                      onClick={handleLogTeamCall}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                    >
                      Registrar Contato Telefônico da Carreta
                    </button>
                  </div>
                </div>
              )}

              {/* Patient Identification Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Cidade / Domicílio:</span>
                  <span className="text-white font-medium">{patient.cidade}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Unidade Móvel:</span>
                  <span className="text-white font-medium">{patient.unidadeMovel}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Telefone de Contato:</span>
                  <span className="text-white font-mono">{patient.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">RT da Unidade Móvel:</span>
                  <span className="text-slate-200">{patient.rtResponsavel}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">CBO Validador:</span>
                  <span className="text-emerald-400 font-mono font-medium">{patient.cbo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Diagnóstico (CID-10):</span>
                  <span className="text-slate-200 font-mono">{patient.cid}</span>
                </div>
              </div>

              {/* Procedures & OCIs Table */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Procedimentos Vinculados & Status OCI</span>
                  <span className="text-slate-400 font-normal">Fila de destino e efetivação</span>
                </div>

                <div className="space-y-1.5">
                  {patient.procedimentos.map(proc => (
                    <div
                      key={proc.id}
                      className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-200 flex items-center gap-2">
                          {proc.type === 'oci' && (
                            <span className="bg-rose-500/20 text-rose-300 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
                              OCI
                            </span>
                          )}
                          <span>{proc.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Código: {proc.code} · Convênio: {proc.convenio} · Fila: {proc.filaDestino || 'Geral'}
                        </div>
                      </div>

                      <div className="shrink-0">
                        {proc.status === 'efetivado' ? (
                          <span className="text-emerald-400 font-bold font-mono text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Efetivado
                          </span>
                        ) : (
                          <span className="text-amber-400 font-mono text-[11px]">
                            Pendente
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WhatsApp & Patient Communication Simulator */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-3">
              {/* Preset quick templates */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-slate-500 text-[11px] shrink-0">Modelos Rápidos:</span>
                <button
                  onClick={() => handleSendMessage('Olá Sra. ' + patient.name.split(' ')[0] + ', confirmamos seu agendamento de Mamografia na Unidade Móvel. Lembre-se de não usar desodorante, talco ou cremes antes do exame.')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] whitespace-nowrap cursor-pointer"
                >
                  Instruções de Preparo
                </button>
                <button
                  onClick={() => handleSendMessage('Sra. ' + patient.name.split(' ')[0] + ', seu laudo já está disponível e a equipe da unidade móvel agendou sua ultrassonografia complementar sem custos. Nos vemos em breve!')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] whitespace-nowrap cursor-pointer"
                >
                  Aviso Laudo & Complemento
                </button>
                <button
                  onClick={() => handleSendMessage('Lembrete: sua consulta com o médico oncologista na Unidade Móvel está agendada para amanhã. Por favor, leve seus documentos e exames anteriores.')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] whitespace-nowrap cursor-pointer"
                >
                  Lembrete D-1 Consulta
                </button>
              </div>

              {/* Chat Thread */}
              <div className="h-72 bg-slate-950/80 border border-slate-800 rounded-xl p-4 overflow-y-auto space-y-3">
                {patient.messages.map(msg => {
                  const isOutbound = msg.direction === 'outbound';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isOutbound ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs shadow-sm ${
                        isOutbound 
                          ? 'bg-emerald-950/70 border border-emerald-600/40 text-emerald-100 rounded-br-none' 
                          : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
                      }`}>
                        <div className="text-[10px] text-slate-400 font-mono mb-1">
                          {msg.sender} · {msg.timestamp}
                        </div>
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5 px-1">
                        {msg.status}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Input box */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Escreva uma mensagem humanizada via WhatsApp para a paciente..."
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                />
                <button
                  onClick={() => handleSendMessage()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CRM Timeline */}
          {activeTab === 'timeline' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400">
                Histórico auditável de todos os passos clínicos, regras de recepção e contatos:
              </div>

              <div className="space-y-2 border-l-2 border-slate-800 ml-3 pl-4">
                {patient.timeline.map(ev => (
                  <div key={ev.id} className="relative pb-3">
                    <div className={`absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 ${
                      ev.highlight 
                        ? 'bg-amber-400 border-amber-300' 
                        : 'bg-slate-900 border-slate-600'
                    }`} />
                    <div className="text-[11px] font-mono text-slate-400">
                      {ev.timestamp} · {ev.author}
                    </div>
                    <div className="text-xs font-bold text-white mt-0.5">
                      {ev.title}
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      {ev.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Dedicated BIRADS 0, 4, 5 Protocol */}
          {activeTab === 'birads' && isBiradsCritical && (
            <div className="space-y-4 text-xs">
              <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span>Protocolo SISCONCO: BIRADS {patient.biradsResult} Detectado</span>
                </div>
                <div className="space-y-2 text-slate-200 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>Complementação Mandatória:</strong> Sempre que o laudo trouxer resultado BIRADS 0, 4 ou 5, é obrigatório complementar a investigação.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>Responsabilidade da Carreta:</strong> A ultrassonografia mamária de complemento é agendada pela <strong>própria equipe da carreta</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>Proteção de Cota:</strong> <strong>NÃO é contabilizada na quantidade de OCIs ofertadas</strong> pelo convênio/SUS.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>Busca Ativa Obrigatória:</strong> É responsabilidade da equipe entrar em contato ativo com a paciente e agendar o exame de imediato.</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-500/30 flex flex-wrap gap-2">
                  <button
                    onClick={handleScheduleComplementaryUsg}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Confirmar Agendamento USG Isenta (Sem Débito OCI)
                  </button>

                  <button
                    onClick={handleLogTeamCall}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg cursor-pointer transition-colors"
                  >
                    Registrar Ligação Telefônica da Equipe
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-950 border-t border-slate-800 p-3.5 px-5 flex items-center justify-between text-xs">
          <div className="text-slate-400">
            Jornada do Paciente OncoFluxo · Integração HIS/CRM ativa
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg cursor-pointer"
          >
            Fechar Detalhes
          </button>
        </div>
      </div>
    </div>
  );
};
