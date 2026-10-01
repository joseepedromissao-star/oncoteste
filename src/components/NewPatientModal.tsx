import React, { useState } from 'react';
import { Patient, PathwayType } from '../types';
import { 
  X, 
  Sparkles, 
  UserPlus, 
  ShieldAlert, 
  Stethoscope, 
  Microscope, 
  AlertTriangle,
  Play
} from 'lucide-react';

interface NewPatientModalProps {
  onClose: () => void;
  onAddPatient: (patient: Patient) => void;
}

export const NewPatientModal: React.FC<NewPatientModalProps> = ({
  onClose,
  onAddPatient,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('preset_maria');
  
  // Custom form states
  const [name, setName] = useState('');
  const [susCard, setSusCard] = useState('');
  const [age, setAge] = useState<number>(45);
  const [unidade, setUnidade] = useState('UNIDADE MÓVEL 21 - SUS');
  const [pathway, setPathway] = useState<PathwayType>('mama');

  const presets = [
    {
      id: 'preset_maria',
      title: 'Maria Teste Bruninho (Slide 1 & 3)',
      subtitle: 'Entrada na Carreta · Mamografia & USG · Regra OCI Primeiro',
      pathway: 'mama' as PathwayType,
      birads: '4' as const,
      desc: 'Simula o fluxo completo de entrada na Unidade Móvel 21. Testa a priorização mandatória da OCI, verificação de RT e CBO ginecologista.',
      badge: 'Cenário Padrão dos Slides'
    },
    {
      id: 'preset_duas_ocis',
      title: 'Paciente com Duas OCIs (Slide 2)',
      subtitle: 'Unificação de 2 Consultas em Fila Médico-Consulta',
      pathway: 'multi_oci' as PathwayType,
      desc: 'Testa a regra de unificação: vincular as 2 consultas às respectivas solicitações para 1 única evolução e fechamento simultâneo.',
      badge: 'Unificação Dupla'
    },
    {
      id: 'preset_colpo',
      title: 'Investigação Colo do Útero (Slide 4)',
      subtitle: 'Combo dos 3 Procedimentos na Etapa Médico-Consulta',
      pathway: 'colo' as PathwayType,
      desc: 'Vincula Colposcopia (Diagnóstico/Controle) + Consulta em Oncologia + OCI Investigação todos juntos na mesma fila.',
      badge: 'Combo 3 Procedimentos'
    },
    {
      id: 'preset_birads_5',
      title: 'Atenção Redobrada BIRADS 5 (Slide 5)',
      subtitle: 'SISCONCO · Busca Ativa da Carreta · USG Isenta',
      pathway: 'birads_critico' as PathwayType,
      birads: '5' as const,
      desc: 'Laudo altamente suspeito. Aciona protocolo da carreta: contato telefônico obrigatório e USG sem descontar cota de OCI.',
      badge: 'Alerta Crítico'
    }
  ];

  const handleApplyPreset = (presetId: string) => {
    const randomId = Math.floor(1000000 + Math.random() * 9000000).toString();
    let newPatient: Patient;

    if (presetId === 'preset_maria') {
      newPatient = {
        id: randomId,
        susCard: `898.${Math.floor(1000 + Math.random() * 9000)}.4431.0019`,
        name: 'MARIA TESTE BRUNINHO (SIMULAÇÃO)',
        motherName: 'SEM IDENTIFICACAO',
        birthDate: '1990-06-07',
        age: 36,
        gender: 'Feminino',
        phone: '(17) 99872-3341',
        cidade: 'Barretos / SP',
        unidadeMovel: 'UNIDADE MÓVEL 21 - SUS',
        rtResponsavel: 'DRA. PRISCILA CATELAN SOUTO',
        cbo: '225250 - MÉDICO GINECOLOGISTA E OBSTETRA',
        cid: 'N64 - Outras doenças da mama',
        pathway: 'mama',
        stage: 'recepcao',
        hasDoubleOci: false,
        isColposcopyBundle: false,
        biradsResult: '4',
        biradsComplementNeeded: true,
        biradsComplementScheduled: false,
        biradsComplementFreeQuota: true,
        alerts: [
          'A OCI deve ser o primeiro procedimento efetivado!',
          'Resultado do laudo: BIRADS 4 (Obrigatório complementar)'
        ],
        procedimentos: [
          {
            id: `p_oci_${Date.now()}`,
            code: '4291057',
            name: 'OCI AVALIAÇÃO DIAGNOSTICA INICIAL DE CANCER DE MAMA',
            type: 'oci',
            status: 'pendente',
            convenio: 'OCI',
            date: '2026-07-31',
            filaDestino: 'mamografia'
          },
          {
            id: `p_mam_${Date.now()}`,
            code: '0204030188',
            name: 'MAMOGRAFIA BILATERAL PARA RASTREAMENTO',
            type: 'exame',
            status: 'pendente',
            convenio: 'SUS',
            date: '2026-07-31',
            filaDestino: 'mamografia'
          }
        ],
        messages: [
          {
            id: `msg_${Date.now()}`,
            timestamp: 'Hoje',
            type: 'whatsapp',
            direction: 'outbound',
            sender: 'Carreta de Prevenção',
            text: 'Olá Sra. Maria! Confirmamos seu agendamento de Mamografia na Unidade Móvel 21.',
            status: 'entregue'
          }
        ],
        timeline: [
          {
            id: `tl_${Date.now()}`,
            timestamp: 'Hoje',
            title: 'Entrada na Recepção',
            description: 'Paciente deu entrada na carreta. Aguardando conferência de OCI e CBO.',
            author: 'Recepção',
            category: 'recepcao'
          }
        ]
      };
    } else if (presetId === 'preset_duas_ocis') {
      newPatient = {
        id: randomId,
        susCard: `741.${Math.floor(1000 + Math.random() * 9000)}.1154.0042`,
        name: 'ANA LUCIA PEREIRA (2 OCIS)',
        motherName: 'LUCIA PEREIRA',
        birthDate: '1982-04-12',
        age: 44,
        gender: 'Feminino',
        phone: '(17) 98122-4411',
        cidade: 'Colina / SP',
        unidadeMovel: 'UNIDADE MÓVEL 21 - SUS',
        rtResponsavel: 'DRA. PRISCILA CATELAN SOUTO',
        cbo: '225250 - MÉDICO GINECOLOGISTA E OBSTETRA',
        cid: 'N64 - Outr Doenc da Mama',
        pathway: 'multi_oci',
        stage: 'recepcao',
        hasDoubleOci: true,
        isColposcopyBundle: false,
        alerts: [
          'Paciente com 2 OCIs: Vincular consultas simultaneamente na etapa médico-consulta!'
        ],
        procedimentos: [
          {
            id: `p_oci1_${Date.now()}`,
            code: '45351063',
            name: 'CONSULTA EM ONCOLOGIA (OCI MAMA)',
            type: 'oci',
            status: 'pendente',
            convenio: 'OCI',
            filaDestino: 'medico_consulta'
          },
          {
            id: `p_oci2_${Date.now()}`,
            code: '45351212',
            name: 'CONSULTA EM ONCOLOGIA (OCI GINECO)',
            type: 'oci',
            status: 'pendente',
            convenio: 'OCI',
            filaDestino: 'medico_consulta'
          }
        ],
        messages: [],
        timeline: [
          {
            id: `tl_${Date.now()}`,
            timestamp: 'Hoje',
            title: 'Entrada Multi-OCI',
            description: 'Identificadas 2 OCIs ativas para a mesma paciente.',
            author: 'Sistema OncoFluxo',
            category: 'recepcao'
          }
        ]
      };
    } else if (presetId === 'preset_colpo') {
      newPatient = {
        id: randomId,
        susCard: `883.${Math.floor(1000 + Math.random() * 9000)}.9011.0033`,
        name: 'BEATRIZ SANTOS NOGUEIRA',
        motherName: 'MARIA APARECIDA',
        birthDate: '1988-09-25',
        age: 38,
        gender: 'Feminino',
        phone: '(17) 99120-7764',
        cidade: 'Guaíra / SP',
        unidadeMovel: 'UNIDADE MÓVEL 21 - SUS',
        rtResponsavel: 'DRA. PRISCILA CATELAN SOUTO',
        cbo: '225250 - MÉDICO GINECOLOGISTA E OBSTETRA',
        cid: 'N87 - Displasia cervical uterina',
        pathway: 'colo',
        stage: 'recepcao',
        hasDoubleOci: false,
        isColposcopyBundle: true,
        alerts: [
          'Para colposcopia, vincular os 3 procedimentos na etapa médico-consulta!'
        ],
        procedimentos: [
          {
            id: `pc1_${Date.now()}`,
            code: '45362128',
            name: 'COLPOSCOPIA (DIAGNÓSTICO / CONTROLE)',
            type: 'exame',
            status: 'pendente',
            convenio: 'SUS',
            filaDestino: 'medico_consulta'
          },
          {
            id: `pc2_${Date.now()}`,
            code: '45352129',
            name: 'CONSULTA EM ONCOLOGIA',
            type: 'consulta',
            status: 'pendente',
            convenio: 'OCI',
            filaDestino: 'medico_consulta'
          },
          {
            id: `pc3_${Date.now()}`,
            code: '45362130',
            name: 'OCI INVESTIGAÇÃO DIAGNÓSTICA DE CÂNCER COLO DO ÚTERO',
            type: 'oci',
            status: 'pendente',
            convenio: 'OCI',
            filaDestino: 'medico_consulta'
          }
        ],
        messages: [],
        timeline: [
          {
            id: `tl_${Date.now()}`,
            timestamp: 'Hoje',
            title: 'Entrada Colposcopia',
            description: 'Preparação do trio de procedimentos na fila médico-consulta.',
            author: 'Recepção',
            category: 'recepcao'
          }
        ]
      };
    } else {
      // BIRADS 5
      newPatient = {
        id: randomId,
        susCard: `901.${Math.floor(1000 + Math.random() * 9000)}.1287.0091`,
        name: 'FRANCISCA HELENA ROCHA',
        motherName: 'HELENA ROCHA',
        birthDate: '1970-11-03',
        age: 56,
        gender: 'Feminino',
        phone: '(17) 99655-9876',
        cidade: 'Bebedouro / SP',
        unidadeMovel: 'UNIDADE MÓVEL 21 - SUS',
        rtResponsavel: 'DRA. PRISCILA CATELAN SOUTO',
        cbo: '225250 - MÉDICO GINECOLOGISTA E OBSTETRA',
        cid: 'N64 - Outr Doenc da Mama',
        pathway: 'birads_critico',
        stage: 'triagem_laudo',
        hasDoubleOci: false,
        isColposcopyBundle: false,
        biradsResult: '5',
        biradsComplementNeeded: true,
        biradsComplementScheduled: false,
        biradsComplementFreeQuota: true,
        alerts: [
          'ALERTA CRÍTICO: Laudo SISCONCO BIRADS 5',
          'Equipe da carreta deve contatar a paciente e agendar USG (Cota Isenta)'
        ],
        procedimentos: [
          {
            id: `pb1_${Date.now()}`,
            code: '4291057',
            name: 'OCI AVALIAÇÃO DIAGNOSTICA INICIAL DE CANCER DE MAMA',
            type: 'oci',
            status: 'efetivado',
            convenio: 'OCI',
            filaDestino: 'mamografia'
          },
          {
            id: `pb2_${Date.now()}`,
            code: '0204030188',
            name: 'MAMOGRAFIA DIGITAL BILATERAL',
            type: 'exame',
            status: 'efetivado',
            convenio: 'SUS',
            filaDestino: 'mamografia'
          }
        ],
        messages: [],
        timeline: [
          {
            id: `tl_${Date.now()}`,
            timestamp: 'Hoje',
            title: 'Laudo BIRADS 5 Importado',
            description: 'Detectada alteração altamente suspeita. Protocolo de atenção redobrada ativo.',
            author: 'Robô SISCONCO',
            category: 'laudo',
            highlight: true
          }
        ]
      };
    }

    onAddPatient(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Simular Novo Paciente / Carregar Cenário dos Slides
              </h2>
              <p className="text-xs text-slate-400">
                Escolha um caso real dos slides da apresentação para testar regras e a jornada CRM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Preset Cards */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Selecione o Cenário Operacional para Iniciar:
          </div>

          <div className="space-y-3">
            {presets.map(preset => {
              const isSelected = selectedPreset === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-950/20 border-rose-500 ring-1 ring-rose-500/30'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-rose-300 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                          {preset.badge}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {preset.subtitle}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">
                        {preset.title}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {preset.desc}
                      </p>
                    </div>

                    <div className="shrink-0 mt-1">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-rose-500 bg-rose-500' : 'border-slate-600'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            Cancelar
          </button>

          <button
            onClick={() => handleApplyPreset(selectedPreset)}
            className="px-5 py-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Carregar Cenário & Iniciar Atendimento</span>
          </button>
        </div>
      </div>
    </div>
  );
};
