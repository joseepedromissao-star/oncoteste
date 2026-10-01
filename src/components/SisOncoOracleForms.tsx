import React, { useState } from 'react';
import { 
  Save, 
  Printer, 
  LogOut, 
  Eraser, 
  HelpCircle, 
  Plus, 
  X, 
  Search, 
  Check, 
  AlertTriangle, 
  ChevronRight, 
  Layers, 
  ArrowDown, 
  Info,
  RotateCcw,
  Sparkles,
  Lock,
  Building2,
  FileCheck2
} from 'lucide-react';
import { Patient } from '../types';

interface SisOncoOracleFormsProps {
  onSyncWithCrm?: (patient: Patient) => void;
}

export const SisOncoOracleForms: React.FC<SisOncoOracleFormsProps> = ({ onSyncWithCrm }) => {
  // Navigation State: 'desktop' (00:00) | 'recepcao' (00:14) | 'solicitacao' (01:38)
  const [activeScreen, setActiveScreen] = useState<'desktop' | 'recepcao' | 'solicitacao'>('desktop');
  
  // Left Tree menu expanded states
  const [menuExpanded, setMenuExpanded] = useState({
    atendimento: true,
    prontuario: true
  });

  // Guided Step: 1..10
  const [trainingStep, setTrainingStep] = useState<number>(1);

  // Form Fields - Header
  const [etapaProcesso, setEtapaProcesso] = useState('');
  const [centroCustoCode, setCentroCustoCode] = useState('');
  const [centroCustoName, setCentroCustoName] = useState('');
  const [numeroAtendimento, setNumeroAtendimento] = useState('');
  const [dataAtendimento, setDataAtendimento] = useState('');
  const [statusAtendimento, setStatusAtendimento] = useState<'' | 'EM ATENDIMENTO' | 'FINALIZADO'>('');
  const [isPrimeiraVez, setIsPrimeiraVez] = useState(false);
  const [isLeitorBarras, setIsLeitorBarras] = useState(false);
  const [isGeral, setIsGeral] = useState(false);

  // Patient Fields
  const [rhNumber, setRhNumber] = useState('');
  const [pacienteCodigo, setPacienteCodigo] = useState('');
  const [pacienteNome, setPacienteNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [idadeAnos, setIdadeAnos] = useState('');
  const [idadeMeses, setIdadeMeses] = useState('');
  const [nomeMae, setNomeMae] = useState('');
  const [cartaoSus, setCartaoSus] = useState('');
  const [sexoPaciente, setSexoPaciente] = useState('');

  // Processo Fields
  const [processoCodigo, setProcessoCodigo] = useState('');
  const [processoNome, setProcessoNome] = useState('');
  const [especialidadeCodigo, setEspecialidadeCodigo] = useState('');
  const [especialidadeNome, setEspecialidadeNome] = useState('');
  const [caraterAtend, setCaraterAtend] = useState('');
  const [tipoAtend, setTipoAtend] = useState('');
  const [tipoPaciente, setTipoPaciente] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [observacao, setObservacao] = useState('');
  const [pacienteTrouxeExame, setPacienteTrouxeExame] = useState(false);

  // Fila de Atendimento (Middle Grid)
  const [filasAtendimento, setFilasAtendimento] = useState<Array<{ id: string; sr: string; etapa: string; centroCusto: string }>>([]);
  const [selectedFilaIndex, setSelectedFilaIndex] = useState<number>(0);

  // Solicitações list
  const [solicitacaoNumero, setSolicitacaoNumero] = useState('20253972');
  const [solicitacaoData, setSolicitacaoData] = useState('31/07/2026');

  // Procedures available in solicitation (loaded after Kit)
  const [solicitacaoProcedures, setSolicitacaoProcedures] = useState<Array<{
    id: string;
    code: string;
    name: string;
    convenio: string;
  }>>([]);
  const [selectedProcId, setSelectedProcId] = useState<string>('p4');

  // Linked Procedures table (Solicitações Vinculadas ao Atendimento)
  const [vinculados, setVinculados] = useState<Array<{
    id: string;
    code: string;
    name: string;
    convenio: string;
    inicio: string;
    fila: string;
  }>>([]);

  // Solicitação screen fields
  const [convenioCodigo, setConvenioCodigo] = useState('4291057');
  const [convenioNome, setConvenioNome] = useState('AGSUS');
  const [solicitanteNome, setSolicitanteNome] = useState('73656 PROFISSIONAL SOLICITANTE');
  const [cboCodigo, setCboCodigo] = useState('225250');
  const [cboNome, setCboNome] = useState('MEDICO GINECOLOGISTA E OBSTETRA');
  const [cidCodigo, setCidCodigo] = useState('N64');
  const [cidDescricao, setCidDescricao] = useState('OUTR DOENC DA MAMA');

  // Active Modals
  const [modalOpen, setModalOpen] = useState<
    'lov_pacientes' | 
    'alerta_paciente_atualizar' | 
    'alerta_sem_agenda' | 
    'lov_filas' | 
    'lov_convenio' | 
    'kit_procedimento' | 
    'anamnese_mamografia' | 
    'pesquisa_divulgacao' | 
    'alerta_finalizar_cpf' | 
    'alerta_finalizar_pep' | 
    null
  >(null);

  // Anamnese Mamografia State (Video 02:28)
  const [anamnese, setAnamnese] = useState({
    tipoMamografia: 'rastreamento',
    fezAntes: 'Sim',
    anoAnterior: '2024',
    cirurgiaAnterior: 'Não',
    riscoElevado: 'Não',
    exameClinico: 'Normal',
    kinesUnidade: '77261',
    sintomatica: false
  });

  // Pesquisa de Divulgação (Video 02:59)
  const [divulgacao, setDivulgacao] = useState({
    carretaRua: true,
    acs: true
  });

  // Restart training from Frame 00:00
  const handleResetToStart = () => {
    setActiveScreen('desktop');
    setTrainingStep(1);
    setEtapaProcesso('');
    setCentroCustoCode('');
    setCentroCustoName('');
    setNumeroAtendimento('');
    setDataAtendimento('');
    setStatusAtendimento('');
    setPacienteCodigo('');
    setPacienteNome('');
    setRhNumber('');
    setDataNascimento('');
    setIdadeAnos('');
    setIdadeMeses('');
    setNomeMae('');
    setCartaoSus('');
    setSexoPaciente('');
    setProcessoCodigo('');
    setProcessoNome('');
    setEspecialidadeCodigo('');
    setEspecialidadeNome('');
    setCaraterAtend('');
    setTipoAtend('');
    setTipoPaciente('');
    setModalidade('');
    setFilasAtendimento([]);
    setSolicitacaoProcedures([]);
    setVinculados([]);
    setModalOpen(null);
  };

  // Step 1 -> Step 2: User clicks 'Recepção de Atendimento Geral'
  const handleOpenRecepcaoScreen = () => {
    setActiveScreen('recepcao');
    if (trainingStep === 1) {
      setTrainingStep(2);
    }
  };

  // Step 2 -> Step 3: User clicks 'Inserir Registro' icon on toolbar (Video 00:18)
  const handleInserirRegistro = () => {
    setEtapaProcesso('RECEPÇÃO');
    setNumeroAtendimento('31117242');
    setDataAtendimento('31/07/2026 14:49:41');
    setStatusAtendimento('EM ATENDIMENTO');
    if (trainingStep === 2) {
      setTrainingStep(3);
    }
  };

  // Step 3 -> Step 4: User selects/types Centro de Custo da Carreta (Video 00:22)
  const handleSetCentroCusto = (code: string) => {
    setCentroCustoCode(code);
    if (code === '77261') {
      setCentroCustoName('UNIDADE MOVEL AGSUS - PAULO AFONSO');
    } else {
      setCentroCustoName('UNIDADE MOVEL 21 - SUS');
    }
    if (trainingStep === 3) {
      setTrainingStep(4);
    }
  };

  // Step 4: User selects patient from LOV and confirms alerts (Video 00:30-00:55)
  const handleSelectPatientLov = () => {
    setPacienteCodigo('4531822');
    setPacienteNome('TESTE 06 AGENDADO');
    setRhNumber('011976');
    setDataNascimento('08/04/1975');
    setIdadeAnos('51');
    setIdadeMeses('3');
    setNomeMae('MARIA TESTE');
    setCartaoSus('898001244310019');
    setSexoPaciente('FEMININO');

    // Preenche processo
    setProcessoCodigo('59885');
    setProcessoNome('REALIZAR EXAME');
    setEspecialidadeCodigo('3');
    setEspecialidadeNome('GINECOLOGIA');
    setCaraterAtend('1768 - ROTINA');
    setTipoAtend('590 - AMBULATORIAL');
    setTipoPaciente('1783 - EXTERNO');
    setModalidade('79157 - AGSUS');

    setModalOpen('alerta_paciente_atualizar');
  };

  // Step 5: Insert rows into Fila de Atendimento (Video 00:56-01:36)
  const handleAddQueues = () => {
    setFilasAtendimento([
      { id: 'f1', sr: '61696', etapa: 'MAMOGRAFIA', centroCusto: centroCustoName || 'UNIDADE MOVEL AGSUS - PAULO AFONSO' },
      { id: 'f2', sr: '61697', etapa: 'MÉDICO - CONSULTA', centroCusto: centroCustoName || 'UNIDADE MOVEL AGSUS - PAULO AFONSO' },
      { id: 'f3', sr: '61698', etapa: 'US - MAMA', centroCusto: centroCustoName || 'UNIDADE MOVEL AGSUS - PAULO AFONSO' }
    ]);
    setSelectedFilaIndex(0);
    setModalOpen(null);
    if (trainingStep === 5) {
      setTrainingStep(6);
    }
  };

  // Step 7: Load OCI Kit (Video 01:56)
  const handleLoadKit = () => {
    setSolicitacaoProcedures([
      { id: 'p1', code: '45351064', name: 'ECOGRAFIA DE ESTR. SUPER. MAMAS', convenio: 'OCI' },
      { id: 'p2', code: '45361084', name: 'TELECONSULTA MEDICA NA ATENÇÃO ESPECIALIZADA', convenio: 'OCI' },
      { id: 'p3', code: '45351063', name: 'CONSULTA EM ONCOLOGIA', convenio: 'OCI' },
      { id: 'p4', code: '45361085', name: 'MAMOGRAFIA', convenio: 'SUS' },
      { id: 'p5', code: '4291057', name: 'OCI AVALIAÇÃO DIAGNOSTICA INICIAL DE CANCER DE MAMA', convenio: 'OCI' }
    ]);
    setSelectedProcId('p4');
    setModalOpen(null);
  };

  // Step 8: Link Procedure to active queue (Video 02:25)
  const handleVincularProcedimento = () => {
    const activeFila = filasAtendimento[selectedFilaIndex] || filasAtendimento[0];
    const proc = solicitacaoProcedures.find(p => p.id === selectedProcId) || solicitacaoProcedures[3];
    if (!proc || !activeFila) return;

    if (proc.name.includes('MAMOGRAFIA')) {
      setModalOpen('anamnese_mamografia');
      return;
    }

    finishLinking(proc, activeFila.etapa);
  };

  const finishLinking = (proc: any, filaName: string) => {
    if (!vinculados.some(v => v.id === proc.id)) {
      setVinculados(prev => [...prev, {
        id: proc.id,
        code: proc.code,
        name: proc.name,
        convenio: proc.convenio,
        inicio: '31/07/2026',
        fila: filaName
      }]);
    }

    // Auto-advance step if all key procedures linked
    if (trainingStep === 8 && vinculados.length >= 2) {
      setTrainingStep(9);
    }
  };

  // Finalize Atendimento (Video 03:18 - Final Frame 03:24)
  const handleConfirmFinalizacao = () => {
    setModalOpen(null);
    setStatusAtendimento('FINALIZADO');
    setTrainingStep(10);

    if (onSyncWithCrm) {
      onSyncWithCrm({
        id: pacienteCodigo || '4531822',
        susCard: cartaoSus || '898001244310019',
        name: pacienteNome || 'TESTE 06 AGENDADO',
        motherName: nomeMae || 'MARIA TESTE',
        birthDate: dataNascimento || '08/04/1975',
        age: parseInt(idadeAnos) || 51,
        gender: 'Feminino',
        phone: '(17) 99872-3341',
        cidade: 'Barretos / SP',
        unidadeMovel: centroCustoName || 'UNIDADE MOVEL AGSUS - PAULO AFONSO',
        rtResponsavel: 'DRA. PRISCILA CATELAN SOUTO',
        cbo: `${cboCodigo} - ${cboNome}`,
        cid: `${cidCodigo} - ${cidDescricao}`,
        pathway: 'mama',
        stage: 'fechamento_oci',
        hasDoubleOci: false,
        isColposcopyBundle: false,
        procedimentos: vinculados.map(v => ({
          id: v.id,
          code: v.code,
          name: v.name,
          type: v.name.includes('OCI') ? 'oci' : v.name.includes('CONSULTA') ? 'consulta' : 'exame',
          convenio: v.convenio,
          status: 'efetivado',
          date: '2026-07-31',
          filaDestino: v.fila.toLowerCase().includes('mamo') ? 'mamografia' : 'medico_consulta'
        })),
        messages: [],
        timeline: [
          {
            id: `tl_${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            title: 'Atendimento SIS-ONCO Finalizado (Oracle Forms)',
            description: `Atendimento nº ${numeroAtendimento} concluído e validado com status FINALIZADO.`,
            author: 'Paula Carvalho Ribeiro (Recepção)',
            category: 'recepcao',
            highlight: true
          }
        ],
        alerts: []
      });
    }
  };

  return (
    <div className="space-y-3 font-sans select-none">
      
      {/* ======================================================== */}
      {/* TOP INSTRUCTION BANNER (Passo a Passo com Explicação)    */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-xl p-3.5 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-mono font-bold text-sm shrink-0">
              {trainingStep}/10
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Treinamento Frame a Frame · Sistema SIS-ONCO Real
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-[11px] text-slate-300 font-mono">Vídeo Oficial Hospital de Amor</span>
              </div>
              <div className="text-sm font-semibold text-white mt-0.5">
                {trainingStep === 1 && 'Passo 1 de 10: Na tela inicial do SIS-ONCO, clique em "Recepção de Atendimento Geral" no menu Atendimento à esquerda (00:05 a 00:12).'}
                {trainingStep === 2 && 'Passo 2 de 10: Na tela vazia de Recepção, clique no ícone "Inserir Registro" (folha com "+") na barra superior (00:18).'}
                {trainingStep === 3 && 'Passo 3 de 10: No campo Centro de Custo, selecione a carreta digitando "77261" ou "77263" (00:22).'}
                {trainingStep === 4 && 'Passo 4 de 10: No campo Paciente, clique no botão LOV "?" para pesquisar "TESTE 06 AGENDADO" e confirme os alertas (00:27 a 00:55).'}
                {trainingStep === 5 && 'Passo 5 de 10: Na Fila de Atendimento, clique em "+ Inserir Filas da OCI" para incluir MAMOGRAFIA, MÉDICO-CONSULTA e US-MAMA (00:56 a 01:36).'}
                {trainingStep === 6 && 'Passo 6 de 10: No canto direito da tela, clique no botão "[ Solicitação ➔ ]" para abrir a guia de exames (01:38).'}
                {trainingStep === 7 && 'Passo 7 de 10: Na tela de Solicitação, verifique Convênio AGSUS, CBO Ginecologia e clique em "★ Kit Procedimento (F9)" para carregar a OCI de Mama (01:42 a 02:20).'}
                {trainingStep === 8 && 'Passo 8 de 10: Volte à Recepção e vincule a MAMOGRAFIA à fila correspondente. Preencha a Anamnese e a Pesquisa da Carreta (02:21 a 03:15).'}
                {trainingStep === 9 && 'Passo 9 de 10: Com todos os procedimentos vinculados, clique em "[ Impressão de Etiquetas ]" (03:16).'}
                {trainingStep === 10 && 'Passo 10 de 10: Clique em "[ Finalizar Atendimento ]", confirme os alertas e veja o status mudar para "FINALIZADO" em vermelho (03:18 a 03:24).'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button
              onClick={() => setTrainingStep(prev => prev > 1 ? prev - 1 : 1)}
              className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 cursor-pointer"
            >
              Anterior
            </button>
            <button
              onClick={() => setTrainingStep(prev => prev < 10 ? prev + 1 : 10)}
              className="px-3 py-1 text-xs bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded cursor-pointer"
            >
              Próximo
            </button>
            <button
              onClick={handleResetToStart}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 cursor-pointer"
              title="Reiniciar Simulação (Voltar ao Frame 00:00)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ORACLE FORMS SHELL WINDOW CONTAINER                     */}
      {/* ======================================================== */}
      <div className="bg-[#d4d0c8] text-black font-sans text-xs rounded-t-sm shadow-2xl border-2 border-[#808080] overflow-hidden">
        
        {/* Titlebar with Oracle Window Controls */}
        <div className="bg-gradient-to-r from-[#0a246a] to-[#a6caf0] text-white px-2 py-0.5 flex items-center justify-between font-bold text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-600 rounded-xs inline-block border border-white" />
            <span>Oracle Forms Services - [SIS-ONCO: SISTEMA DE GESTÃO ONCOLÓGICA]</span>
          </div>
          <div className="flex items-center gap-1 text-[10px]">
            <button className="w-4 h-3.5 bg-[#d4d0c8] text-black border border-white flex items-center justify-center font-mono">_</button>
            <button className="w-4 h-3.5 bg-[#d4d0c8] text-black border border-white flex items-center justify-center font-mono">□</button>
            <button className="w-4 h-3.5 bg-[#d4d0c8] text-black border border-white flex items-center justify-center font-mono text-red-600 font-bold">×</button>
          </div>
        </div>

        {/* Menu Bar */}
        <div className="bg-[#ece9d8] border-b border-[#999] px-2 py-0.5 flex items-center justify-between text-[11px] text-[#222]">
          <div className="flex items-center gap-3">
            <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.2 rounded-xs cursor-pointer"><u>A</u>ção</span>
            <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.2 rounded-xs cursor-pointer"><u>E</u>ditar</span>
            <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.2 rounded-xs cursor-pointer"><u>C</u>onsultar</span>
            <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.2 rounded-xs cursor-pointer"><u>B</u>loco</span>
            <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.2 rounded-xs cursor-pointer"><u>R</u>egistro</span>
            <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.2 rounded-xs cursor-pointer"><u>T</u>ela</span>
            <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.2 rounded-xs cursor-pointer">A<u>j</u>uda</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#003366]">Filial: ANTENOR DUARTE VILELA - BARRETOS</span>
            <span className="text-[#666]">|</span>
            <button onClick={handleResetToStart} className="text-blue-800 hover:underline font-semibold cursor-pointer">Logoff</button>
          </div>
        </div>

        {/* Toolbar Icons (Exact matching video) */}
        <div className="bg-[#ece9d8] border-b-2 border-white px-2 py-1 flex items-center gap-1 shadow-xs">
          <button 
            title="Salvar"
            onClick={() => alert('Registro salvo com sucesso.')}
            className="p-1 hover:bg-[#d4d0c8] border border-transparent hover:border-[#999] rounded-xs cursor-pointer"
          >
            <Save className="w-4 h-4 text-blue-900" />
          </button>
          <button 
            title="Imprimir" 
            onClick={() => alert('Enviado para a impressora.')}
            className="p-1 hover:bg-[#d4d0c8] border border-transparent hover:border-[#999] rounded-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-700" />
          </button>
          <button 
            title="Limpar tela"
            onClick={handleResetToStart}
            className="p-1 hover:bg-[#d4d0c8] border border-transparent hover:border-[#999] rounded-xs cursor-pointer"
          >
            <Eraser className="w-4 h-4 text-amber-700" />
          </button>
          <span className="w-px h-4 bg-[#999] mx-1" />
          
          {/* INSERIR REGISTRO ICON (Pulsing at Step 2) */}
          <button 
            title="Inserir Registro (+)"
            onClick={handleInserirRegistro}
            className={`p-1 border rounded-xs cursor-pointer font-bold text-green-800 ${
              trainingStep === 2 ? 'bg-amber-300 ring-2 ring-amber-600 animate-pulse' : 'hover:bg-[#d4d0c8] border-transparent hover:border-[#999]'
            }`}
          >
            <Plus className="w-4 h-4" />
          </button>

          <button 
            title="Remover Registro" 
            className="p-1 hover:bg-[#d4d0c8] border border-transparent hover:border-[#999] rounded-xs cursor-pointer text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
          <button 
            title="Bloquear" 
            className="p-1 hover:bg-[#d4d0c8] border border-transparent hover:border-[#999] rounded-xs cursor-pointer text-slate-700"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
          <span className="w-px h-4 bg-[#999] mx-1" />
          
          {/* LOV Button */}
          <button 
            title="Lista de Valores (F9)"
            onClick={() => setModalOpen('lov_pacientes')}
            className={`p-1 border rounded-xs cursor-pointer ${
              trainingStep === 4 ? 'bg-amber-300 ring-2 ring-amber-600 animate-pulse' : 'hover:bg-[#d4d0c8] border-transparent hover:border-[#999]'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-[#000080]" />
          </button>
          <span className="w-px h-4 bg-[#999] mx-1" />
          <span className="text-[11px] font-mono text-[#555]">
            Módulo: <strong className="text-black">ATENCAO_BASICA_SIS_ONCO</strong>
          </span>
        </div>

        {/* Body Layout: Left Tree + Right Screen */}
        <div className="flex bg-[#d4d0c8] min-h-[580px]">
          
          {/* Left Navigation Tree */}
          <div className="w-60 bg-white border-r-2 border-[#808080] p-2 overflow-y-auto text-[11px] font-sans shrink-0">
            <div className="flex items-center gap-1 font-bold text-[#003366] pb-1 border-b border-[#ccc] mb-2">
              <Layers className="w-4 h-4 text-[#006699]" />
              <span>SIS-ONCO</span>
            </div>

            <div className="space-y-1">
              {/* Menu Atendimento */}
              <div>
                <div 
                  onClick={() => setMenuExpanded(prev => ({ ...prev, atendimento: !prev.atendimento }))}
                  className="flex items-center gap-1 cursor-pointer font-bold text-[#333] hover:bg-[#e8e8e8] px-1 py-0.5 rounded-xs"
                >
                  <span className="font-mono text-xs">{menuExpanded.atendimento ? '[-]' : '[+]'}</span>
                  <span>Atendimento</span>
                </div>

                {menuExpanded.atendimento && (
                  <div className="pl-4 space-y-0.5 border-l border-[#ddd] ml-2 text-[#444]">
                    <div className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Cadastro do Paciente (Geral)</div>
                    <div className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Declaração de Paciente Internado</div>
                    <div className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Ficha de Pré-Atendimento</div>
                    <div className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Atendimento Geral</div>
                    
                    {/* Recepção de Atendimento Geral (Clickable to open screen as in 00:10) */}
                    <div 
                      onClick={handleOpenRecepcaoScreen}
                      className={`px-1.5 py-0.5 rounded-xs cursor-pointer font-bold flex items-center gap-1 ${
                        activeScreen === 'recepcao' 
                          ? 'bg-[#0a246a] text-white' 
                          : trainingStep === 1 
                          ? 'bg-amber-200 text-blue-900 ring-2 ring-amber-500 animate-pulse' 
                          : 'hover:bg-[#316ac5] hover:text-white text-blue-900'
                      }`}
                    >
                      <span>•</span>
                      <span>Recepção de Atendimento Geral</span>
                    </div>

                    <div className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Histórico de Atendimento</div>
                    <div className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Indicadores de Atendimento Paciente</div>
                    <div className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Fila de Atendimento</div>

                    {/* Submenu Prontuário */}
                    <div>
                      <div 
                        onClick={() => setMenuExpanded(prev => ({ ...prev, prontuario: !prev.prontuario }))}
                        className="flex items-center gap-1 cursor-pointer font-bold text-[#555] hover:bg-[#e8e8e8] px-1 py-0.5 rounded-xs"
                      >
                        <span className="font-mono">{menuExpanded.prontuario ? '[-]' : '[+]'}</span>
                        <span>Prontuário</span>
                      </div>
                      {menuExpanded.prontuario && (
                        <div className="pl-3 space-y-0.5 border-l border-[#ddd] ml-2 text-[10px]">
                          <div className="hover:bg-[#316ac5] hover:text-white px-1 py-0.5 cursor-pointer">Consulta Ambulatorial</div>
                          <div className="hover:bg-[#316ac5] hover:text-white px-1 py-0.5 cursor-pointer">Evolução de Atendimento</div>
                          <div className="hover:bg-[#316ac5] hover:text-white px-1 py-0.5 cursor-pointer font-semibold text-rose-900">Recepção de Atendimento OCI</div>
                          <div className="hover:bg-[#316ac5] hover:text-white px-1 py-0.5 cursor-pointer">Prescrição</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Other modules */}
              <div className="text-[#666] px-1 py-0.5 hover:bg-[#e8e8e8] cursor-pointer">[+] Banco de Sangue</div>
              <div className="text-[#666] px-1 py-0.5 hover:bg-[#e8e8e8] cursor-pointer">[+] Bulario</div>
              <div className="text-[#666] px-1 py-0.5 hover:bg-[#e8e8e8] cursor-pointer">[+] Compras</div>
              <div className="text-[#666] px-1 py-0.5 hover:bg-[#e8e8e8] cursor-pointer">[+] Controle de Cirurgia</div>
              <div className="text-[#666] px-1 py-0.5 hover:bg-[#e8e8e8] cursor-pointer">[+] Contas</div>
              <div className="text-[#666] px-1 py-0.5 hover:bg-[#e8e8e8] cursor-pointer">[+] Dieta</div>
              <div className="text-[#666] px-1 py-0.5 hover:bg-[#e8e8e8] cursor-pointer">[+] Estoque</div>
            </div>
          </div>

          {/* Right Main Panel */}
          <div className="flex-1 p-2 bg-[#d4d0c8] overflow-x-auto">
            
            {/* ======================================================== */}
            {/* VIEW A: INITIAL DESKTOP HUB (Exact Frame 00:00 - 00:09)  */}
            {/* ======================================================== */}
            {activeScreen === 'desktop' && (
              <div className="bg-[#ece9d8] border border-[#808080] p-6 h-full flex flex-col items-center justify-center relative shadow-inner min-h-[540px]">
                
                {/* Watermark in background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none">
                  <span className="text-7xl font-serif font-black italic text-slate-800 tracking-wider">
                    Oracle Forms Services
                  </span>
                </div>

                {/* Central SIS-ONCO Card */}
                <div className="relative z-10 w-full max-w-lg bg-white/90 border-2 border-[#808080] shadow-xl p-5 space-y-4">
                  {/* Brand Logo & Title */}
                  <div className="text-center space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight text-[#003366] font-mono">
                      SIS - ONCO
                    </h1>
                    <div className="inline-block bg-[#008080] text-white text-[11px] font-bold px-3 py-0.5 tracking-wider uppercase">
                      Sistema de Gestão Oncológica
                    </div>
                  </div>

                  {/* OC Barretos - GESTAO HOSPITALAR box */}
                  <div className="bg-[#f0ede4] border border-[#7f9db9] p-3 text-xs text-gray-800 space-y-1 font-sans">
                    <div className="font-bold text-[#003366] pb-1 border-b border-[#ccc]">
                      OC Barretos - GESTÃO HOSPITALAR
                    </div>
                    <ul className="space-y-0.5 text-[11px] text-gray-700 pl-2">
                      <li>• 23414-RT: Dados do Áudio</li>
                      <li>• Inserir Consulta</li>
                      <li>• Paciente Consulta</li>
                      <li>• 2ª via de Valores</li>
                      <li>• Alteração de Atendimento OCI</li>
                    </ul>
                  </div>

                  {/* Mensagens Textarea */}
                  <div>
                    <label className="text-[10px] text-gray-600 block mb-0.5 font-semibold">Mensagens do Sistema:</label>
                    <textarea 
                      readOnly 
                      value="Bem-vindo ao SIS-ONCO Unidade Móvel. Para iniciar o atendimento da carreta, selecione 'Recepção de Atendimento Geral' no menu Atendimento à esquerda."
                      className="w-full h-16 bg-[#fafafa] border border-[#7f9db9] p-1.5 text-[11px] text-gray-700 resize-none font-sans"
                    />
                  </div>

                  {/* Bottom Action inside desktop */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#ccc]">
                    <span className="text-[10px] font-bold text-[#008080] uppercase tracking-wider">
                      SISTEMA DE GESTÃO ONCOLÓGICA
                    </span>
                    <button 
                      onClick={handleOpenRecepcaoScreen}
                      className="px-4 py-1.5 bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold rounded-xs cursor-pointer shadow-sm flex items-center gap-1"
                    >
                      <span>Abrir Recepção ➔</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW B: RECEPÇÃO DE ATENDIMENTO GERAL (00:14 - 03:24)    */}
            {/* ======================================================== */}
            {activeScreen === 'recepcao' && (
              <div className="border border-[#808080] bg-[#ece9d8] p-2 space-y-2 shadow-inner min-w-[920px]">
                
                {/* Form Title Banner */}
                <div className="bg-gradient-to-r from-[#003366] to-[#4682b4] text-white px-2 py-0.5 font-bold text-xs flex items-center justify-between">
                  <span>Recepção de Atendimento Geral (Recepção de Atendimento)</span>
                  <span className="text-[10px] font-normal text-yellow-200">Terminal Unidade Móvel</span>
                </div>

                {/* Top Parameters (Etapa, Centro de Custo, Nº Atend, Status) */}
                <div className="grid grid-cols-12 gap-1.5 items-center text-[11px] bg-[#e4e0d4] p-1.5 border border-[#b5b1a4]">
                  <div className="col-span-2">
                    <label className="text-[10px] text-gray-700 block font-semibold">Etapa do Processo</label>
                    <input 
                      type="text" 
                      readOnly 
                      value={etapaProcesso} 
                      placeholder="(Clique +)"
                      className="w-full bg-[#f0ede4] border border-[#7f9db9] px-1.5 py-0.5 font-bold text-black"
                    />
                  </div>

                  <div className="col-span-4">
                    <label className="text-[10px] text-gray-700 block font-semibold flex items-center justify-between">
                      <span>Centro de Custo</span>
                      {trainingStep === 3 && (
                        <span className="text-[10px] text-amber-800 font-bold bg-amber-200 px-1 rounded-xs animate-pulse">
                          Selecione a Carreta abaixo ➔
                        </span>
                      )}
                    </label>
                    <div className="flex gap-1">
                      <input 
                        type="text" 
                        value={centroCustoCode} 
                        onChange={(e) => handleSetCentroCusto(e.target.value)}
                        placeholder="77261"
                        className={`w-16 bg-white border px-1 py-0.5 font-mono font-bold ${
                          trainingStep === 3 ? 'border-amber-600 ring-2 ring-amber-400' : 'border-[#7f9db9]'
                        }`}
                      />
                      <input 
                        type="text" 
                        value={centroCustoName} 
                        readOnly 
                        placeholder="UNIDADE MOVEL AGSUS - PAULO AFONSO"
                        className="flex-1 bg-[#f0ede4] border border-[#7f9db9] px-1 py-0.5 font-semibold text-black truncate"
                      />
                    </div>
                  </div>

                  <div className="col-span-3">
                    <label className="text-[10px] text-gray-700 block font-semibold">Nº Atend. Data</label>
                    <div className="flex gap-1">
                      <input 
                        type="text" 
                        value={numeroAtendimento} 
                        readOnly 
                        placeholder="31117242"
                        className="w-20 bg-white border border-[#7f9db9] px-1 py-0.5 font-mono font-bold"
                      />
                      <input 
                        type="text" 
                        value={dataAtendimento} 
                        readOnly 
                        placeholder="31/07/2026"
                        className="flex-1 bg-[#f0ede4] border border-[#7f9db9] px-1 py-0.5 font-mono text-[10px]"
                      />
                    </div>
                  </div>

                  {/* Status Box: FINALIZADO in red at 03:24 */}
                  <div className="col-span-3">
                    <label className="text-[10px] text-gray-700 block font-semibold">Status</label>
                    <div className={`px-2 py-0.5 text-center font-bold font-mono text-xs border ${
                      statusAtendimento === 'FINALIZADO' 
                        ? 'bg-red-600 text-white border-red-800 tracking-wider shadow-sm' 
                        : statusAtendimento === 'EM ATENDIMENTO'
                        ? 'bg-white text-blue-900 border-[#7f9db9]'
                        : 'bg-gray-100 text-gray-400 border-gray-300'
                    }`}>
                      {statusAtendimento || 'AGUARDANDO INSERÇÃO'}
                    </div>
                  </div>
                </div>

                {/* Quick Centro de Custo buttons if on Step 3 */}
                {trainingStep === 3 && (
                  <div className="bg-amber-100 border border-amber-400 p-1.5 flex items-center justify-between text-xs text-amber-900">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <span>Clique para preencher o Centro de Custo da Carreta:</span>
                    </div>
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => handleSetCentroCusto('77261')}
                        className="px-2.5 py-0.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xs cursor-pointer text-xs"
                      >
                        77261 · Carreta Paulo Afonso (Vídeo)
                      </button>
                      <button 
                        onClick={() => handleSetCentroCusto('77263')}
                        className="px-2.5 py-0.5 bg-[#003366] hover:bg-[#002244] text-white font-bold rounded-xs cursor-pointer text-xs"
                      >
                        77263 · Unidade Móvel 21
                      </button>
                    </div>
                  </div>
                )}

                {/* Checkboxes row: Primeira Vez, Leitor, Geral */}
                <div className="flex items-center gap-6 px-1 text-[11px]">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isPrimeiraVez} 
                      onChange={(e) => setIsPrimeiraVez(e.target.checked)} 
                    />
                    <span>Primeira Vez</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isLeitorBarras} 
                      onChange={(e) => setIsLeitorBarras(e.target.checked)} 
                    />
                    <span>Leitor de Código de Barras</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isGeral} 
                      onChange={(e) => setIsGeral(e.target.checked)} 
                    />
                    <span>Geral</span>
                  </label>
                </div>

                {/* Middle Split: Dados do Paciente (Left) + Histórico (Right) */}
                <div className="grid grid-cols-12 gap-2">
                  
                  {/* Left Column (8 cols): Dados do Paciente e Processo */}
                  <div className="col-span-8 space-y-1.5">
                    
                    <fieldset className="border border-[#999] p-2 bg-[#f4f1e8]">
                      <legend className="px-1 font-bold text-[#003366] text-[11px]">Dados do Paciente</legend>
                      
                      <div className="grid grid-cols-12 gap-1.5 text-[11px]">
                        <div className="col-span-2">
                          <label className="text-[10px] text-gray-600 block">RH</label>
                          <input 
                            type="text" 
                            value={rhNumber} 
                            readOnly 
                            className="w-full bg-white border border-[#7f9db9] px-1 py-0.5"
                          />
                        </div>

                        <div className="col-span-10">
                          <label className="text-[10px] text-gray-600 block">
                            Paciente <span className="text-red-700">*</span>
                          </label>
                          <div className="flex items-center gap-1">
                            <input 
                              type="text" 
                              value={pacienteCodigo} 
                              readOnly 
                              placeholder="Código"
                              className="w-20 bg-white border border-[#7f9db9] px-1 py-0.5 font-mono font-bold"
                            />
                            {/* LOV Button from video 00:27 */}
                            <button
                              title="Buscar Paciente (F9 / ?)"
                              onClick={() => setModalOpen('lov_pacientes')}
                              className={`px-2 py-0.5 border text-[#000080] font-bold cursor-pointer text-xs ${
                                trainingStep === 4 ? 'bg-amber-300 ring-2 ring-amber-600 animate-pulse' : 'bg-[#ece9d8] hover:bg-[#d4d0c8] border-[#999]'
                              }`}
                            >
                              ?
                            </button>
                            <input 
                              type="text" 
                              value={pacienteNome} 
                              readOnly 
                              placeholder="Clique em '?' para pesquisar"
                              className="flex-1 bg-[#f0ede4] border border-[#7f9db9] px-1.5 py-0.5 font-bold text-black"
                            />
                          </div>
                        </div>

                        <div className="col-span-3">
                          <label className="text-[10px] text-gray-600 block">Nascimento</label>
                          <input 
                            type="text" 
                            value={dataNascimento} 
                            readOnly 
                            className="w-full bg-[#f0ede4] border border-[#7f9db9] px-1 py-0.5 font-mono"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="text-[10px] text-gray-600 block">Idade</label>
                          <div className="flex items-center gap-0.5">
                            <input 
                              type="text" 
                              value={idadeAnos} 
                              readOnly 
                              className="w-9 bg-[#f0ede4] border border-[#7f9db9] px-1 py-0.5 font-mono text-center"
                            />
                            <span className="text-[10px]">a</span>
                            <input 
                              type="text" 
                              value={idadeMeses} 
                              readOnly 
                              className="w-6 bg-[#f0ede4] border border-[#7f9db9] px-0.5 py-0.5 font-mono text-center"
                            />
                            <span className="text-[10px]">m</span>
                          </div>
                        </div>

                        <div className="col-span-4">
                          <label className="text-[10px] text-gray-600 block">Mãe</label>
                          <input 
                            type="text" 
                            value={nomeMae} 
                            readOnly 
                            className="w-full bg-[#f0ede4] border border-[#7f9db9] px-1 py-0.5 truncate"
                          />
                        </div>

                        <div className="col-span-3">
                          <label className="text-[10px] text-gray-600 block">Sexo</label>
                          <input 
                            type="text" 
                            value={sexoPaciente} 
                            readOnly 
                            className="w-full bg-[#f0ede4] border border-[#7f9db9] px-1 py-0.5 font-semibold text-center"
                          />
                        </div>
                      </div>
                    </fieldset>

                    {/* Sub-bloco Processo */}
                    <div className="grid grid-cols-12 gap-1.5 p-1.5 bg-[#f4f1e8] border border-[#999] text-[11px]">
                      <div className="col-span-6">
                        <label className="text-[10px] text-gray-600 block">Processo</label>
                        <div className="flex gap-1">
                          <input 
                            type="text" 
                            value={processoCodigo} 
                            readOnly 
                            className="w-14 bg-white border border-[#7f9db9] px-1 py-0.5 font-mono"
                          />
                          <input 
                            type="text" 
                            value={processoNome} 
                            readOnly 
                            className="flex-1 bg-[#f0ede4] border border-[#7f9db9] px-1 py-0.5 font-bold"
                          />
                        </div>
                      </div>

                      <div className="col-span-6">
                        <label className="text-[10px] text-gray-600 block">Especialidade</label>
                        <div className="flex gap-1">
                          <input 
                            type="text" 
                            value={especialidadeCodigo} 
                            readOnly 
                            className="w-10 bg-white border border-[#7f9db9] px-1 py-0.5 font-mono text-center"
                          />
                          <input 
                            type="text" 
                            value={especialidadeNome} 
                            readOnly 
                            className="flex-1 bg-[#f0ede4] border border-[#7f9db9] px-1 py-0.5 font-bold"
                          />
                        </div>
                      </div>

                      <div className="col-span-3">
                        <label className="text-[10px] text-gray-600 block">Caráter Atend.</label>
                        <input 
                          type="text" 
                          value={caraterAtend} 
                          readOnly 
                          className="w-full bg-[#f0ede4] border border-[#7f9db9] px-1 py-0.5"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="text-[10px] text-gray-600 block">Tipo Atend.</label>
                        <input 
                          type="text" 
                          value={tipoAtend} 
                          readOnly 
                          className="w-full bg-[#f0ede4] border border-[#7f9db9] px-1 py-0.5"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="text-[10px] text-gray-600 block">Tipo Paciente</label>
                        <input 
                          type="text" 
                          value={tipoPaciente} 
                          readOnly 
                          className="w-full bg-[#f0ede4] border border-[#7f9db9] px-1 py-0.5"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="text-[10px] text-gray-600 block">Modalidade</label>
                        <input 
                          type="text" 
                          value={modalidade} 
                          readOnly 
                          className="w-full bg-[#f0ede4] border border-[#7f9db9] px-1 py-0.5 font-semibold text-blue-900"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Right Column (4 cols): Histórico de Atendimentos */}
                  <div className="col-span-4 bg-[#f4f1e8] border border-[#999] p-1.5 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-[#003366] pb-1 border-b border-[#ccc] flex items-center justify-between">
                        <span>Histórico de Atendimentos</span>
                        <span className="text-[9px] text-gray-500 font-normal">Geral</span>
                      </div>
                      
                      <div className="mt-1 h-32 overflow-y-auto bg-white border border-[#7f9db9]">
                        <table className="w-full text-left text-[10px]">
                          <thead className="bg-[#e4e0d4] text-[#333] border-b border-[#ccc] font-semibold sticky top-0">
                            <tr>
                              <th className="py-0.5 px-1">Data</th>
                              <th className="py-0.5 px-1">Processo</th>
                              <th className="py-0.5 px-1">Especialidade</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 font-mono">
                            {pacienteCodigo ? (
                              <>
                                <tr className="hover:bg-blue-50">
                                  <td className="py-0.5 px-1">31/07/2026</td>
                                  <td className="py-0.5 px-1">CONSULTA</td>
                                  <td className="py-0.5 px-1">MASTOLOGIA</td>
                                </tr>
                                <tr className="hover:bg-blue-50">
                                  <td className="py-0.5 px-1">31/07/2026</td>
                                  <td className="py-0.5 px-1">REALIZAR EXAME</td>
                                  <td className="py-0.5 px-1">MASTOLOGIA</td>
                                </tr>
                                <tr className="hover:bg-blue-50">
                                  <td className="py-0.5 px-1">30/07/2026</td>
                                  <td className="py-0.5 px-1">CONSULTA</td>
                                  <td className="py-0.5 px-1">GINECOLOGIA</td>
                                </tr>
                                <tr className="hover:bg-blue-50">
                                  <td className="py-0.5 px-1">30/07/2026</td>
                                  <td className="py-0.5 px-1">REALIZAR EXAME</td>
                                  <td className="py-0.5 px-1">GINECOLOGIA</td>
                                </tr>
                              </>
                            ) : (
                              <tr>
                                <td colSpan={3} className="py-6 text-center text-gray-400 italic font-sans">
                                  Nenhum registro selecionado
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div className="text-right text-[10px] text-gray-600 mt-1 font-mono">
                        Total: {pacienteCodigo ? '0006' : '0000'}
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <button 
                        onClick={() => alert('Consulta de Agendamentos Recepcionados')}
                        className="w-full py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] text-[10px] font-semibold text-[#003366] text-center"
                      >
                        Agendamentos Recepcionados no Atendimento
                      </button>
                      <button 
                        onClick={() => alert('Localização do Prontuário')}
                        className="w-full py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] text-[10px] font-semibold text-[#003366] text-center"
                      >
                        Localização do Prontuário
                      </button>
                    </div>
                  </div>
                </div>

                {/* Observação row */}
                <div className="grid grid-cols-12 gap-2 items-center bg-[#f4f1e8] p-1 border border-[#999] text-[11px]">
                  <div className="col-span-9 flex items-center gap-2">
                    <label className="text-[10px] text-gray-700 font-semibold shrink-0">Observação:</label>
                    <input 
                      type="text" 
                      value={observacao} 
                      onChange={(e) => setObservacao(e.target.value)} 
                      placeholder="Observações do atendimento..."
                      className="w-full bg-white border border-[#7f9db9] px-1.5 py-0.5"
                    />
                  </div>
                  <div className="col-span-3 flex items-center justify-end gap-1">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={pacienteTrouxeExame} 
                        onChange={(e) => setPacienteTrouxeExame(e.target.checked)} 
                      />
                      <span>Paciente trouxe exame</span>
                    </label>
                    <button className="px-1 bg-[#ece9d8] border border-[#999] text-[9px] font-bold">E</button>
                  </div>
                </div>

                {/* ========================================================= */}
                {/* Lower Work Area: Fila de Atendimento + Solicitações Grid  */}
                {/* ========================================================= */}
                <div className="grid grid-cols-12 gap-2 pt-1">
                  
                  {/* Left Table (5 cols): Fila de Atendimento */}
                  <div className="col-span-5 bg-[#f4f1e8] border border-[#999] p-1.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#003366] pb-1 border-b border-[#ccc]">
                        <span>Fila de Atendimento</span>
                        <button 
                          onClick={handleAddQueues}
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-xs cursor-pointer ${
                            trainingStep === 5 
                              ? 'bg-amber-300 ring-2 ring-amber-600 animate-pulse text-amber-950' 
                              : 'bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] text-blue-900'
                          }`}
                        >
                          + Inserir Filas da OCI
                        </button>
                      </div>

                      <div className="mt-1 h-32 overflow-y-auto bg-white border border-[#7f9db9]">
                        <table className="w-full text-left text-[10px]">
                          <thead className="bg-[#e4e0d4] text-[#333] border-b border-[#ccc] font-semibold sticky top-0">
                            <tr>
                              <th className="py-0.5 px-1">SR</th>
                              <th className="py-0.5 px-1">Etapa do Processo</th>
                              <th className="py-0.5 px-1">Centro de Custo Destino</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {filasAtendimento.length === 0 ? (
                              <tr>
                                <td colSpan={3} className="py-6 text-center text-gray-400 italic">
                                  Nenhuma fila inserida. Clique no botão acima para adicionar as filas da OCI.
                                </td>
                              </tr>
                            ) : (
                              filasAtendimento.map((f, idx) => (
                                <tr 
                                  key={f.id}
                                  onClick={() => setSelectedFilaIndex(idx)}
                                  className={`cursor-pointer ${
                                    selectedFilaIndex === idx 
                                      ? 'bg-[#316ac5] text-white font-bold' 
                                      : 'hover:bg-blue-50 text-gray-800'
                                  }`}
                                >
                                  <td className="py-1 px-1 font-mono text-[9px]">{f.sr}</td>
                                  <td className="py-1 px-1">{f.etapa}</td>
                                  <td className="py-1 px-1 truncate max-w-[130px]">{f.centroCusto}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="pt-2 text-[10px] text-gray-600 flex items-center justify-between border-t border-[#ccc]">
                      <span>Fila Ativa: <strong>{filasAtendimento[selectedFilaIndex]?.etapa || 'Nenhuma'}</strong></span>
                      <span className="font-mono text-blue-900">Total: {filasAtendimento.length} filas</span>
                    </div>
                  </div>

                  {/* Right Tables (7 cols): Solicitações & Procedimentos */}
                  <div className="col-span-7 bg-[#f4f1e8] border border-[#999] p-1.5 space-y-1.5">
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold text-[#003366]">Solicitações & Procedimentos OCI</span>
                        <span className="text-[10px] font-mono text-gray-600 bg-white px-1.5 py-0.2 border border-[#ccc]">
                          Solic.: {solicitacaoNumero} ({solicitacaoData})
                        </span>
                      </div>

                      {/* Button [Solicitação] from video 01:38 */}
                      <button
                        onClick={() => {
                          setActiveScreen('solicitacao');
                          if (trainingStep === 6) setTrainingStep(7);
                        }}
                        className={`px-3.5 py-1 font-bold text-xs border-2 shadow cursor-pointer ${
                          trainingStep === 6 
                            ? 'bg-amber-300 border-amber-600 ring-2 ring-amber-500 animate-pulse text-amber-950' 
                            : 'bg-gradient-to-b from-[#f9f9f9] to-[#d4d0c8] hover:from-white hover:to-[#c0bcb4] border-[#808080] text-[#003366]'
                        }`}
                      >
                        [ Solicitação ➔ ]
                      </button>
                    </div>

                    {/* Exames/Procedimentos Grid */}
                    <div>
                      <div className="text-[10px] text-gray-600 font-semibold mb-0.5 flex items-center justify-between">
                        <span>Exames / Procedimentos da OCI</span>
                        <span className="text-[9px] text-blue-800">Selecione para vincular</span>
                      </div>
                      
                      <div className="h-28 overflow-y-auto bg-white border border-[#7f9db9]">
                        <table className="w-full text-left text-[10px]">
                          <thead className="bg-[#e4e0d4] text-[#333] border-b border-[#ccc] font-semibold sticky top-0">
                            <tr>
                              <th className="py-0.5 px-1">Código</th>
                              <th className="py-0.5 px-1">Descrição</th>
                              <th className="py-0.5 px-1">Convênio</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 font-mono">
                            {solicitacaoProcedures.length === 0 ? (
                              <tr>
                                <td colSpan={3} className="py-5 text-center text-gray-400 italic font-sans">
                                  Nenhum procedimento na guia. Acesse "[ Solicitação ➔ ]" para carregar o Kit OCI.
                                </td>
                              </tr>
                            ) : (
                              solicitacaoProcedures.map((p) => {
                                const isSelected = selectedProcId === p.id;
                                const isLinked = vinculados.some(v => v.id === p.id);
                                return (
                                  <tr 
                                    key={p.id}
                                    onClick={() => setSelectedProcId(p.id)}
                                    className={`cursor-pointer ${
                                      isSelected 
                                        ? 'bg-[#316ac5] text-white font-bold' 
                                        : isLinked 
                                        ? 'bg-green-50 text-green-900' 
                                        : 'hover:bg-blue-50 text-gray-800'
                                    }`}
                                  >
                                    <td className="py-1 px-1">{p.code}</td>
                                    <td className="py-1 px-1 font-sans">
                                      {p.name}
                                      {isLinked && <span className="text-[9px] text-green-600 ml-1 font-bold">(Vinculado)</span>}
                                    </td>
                                    <td className="py-1 px-1">{p.convenio}</td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Vincular button */}
                    <div className="flex justify-center">
                      <button
                        onClick={handleVincularProcedimento}
                        disabled={solicitacaoProcedures.length === 0}
                        className={`px-4 py-1 border text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer ${
                          trainingStep === 8 
                            ? 'bg-amber-300 border-amber-600 ring-2 ring-amber-500 animate-pulse text-amber-950' 
                            : 'bg-[#ece9d8] hover:bg-[#d4d0c8] border-[#777] text-blue-900'
                        }`}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                        <span>Vincular Procedimento à Fila: "{filasAtendimento[selectedFilaIndex]?.etapa || 'Selecione'}"</span>
                      </button>
                    </div>

                    {/* Solicitações Vinculadas ao Atendimento Grid */}
                    <div>
                      <div className="text-[10px] text-gray-700 font-bold mb-0.5">
                        Solicitações Vinculadas ao Atendimento
                      </div>
                      
                      <div className="h-24 overflow-y-auto bg-white border border-[#7f9db9]">
                        <table className="w-full text-left text-[10px]">
                          <thead className="bg-[#e4e0d4] text-[#333] border-b border-[#ccc] font-semibold sticky top-0">
                            <tr>
                              <th className="py-0.5 px-1">Código</th>
                              <th className="py-0.5 px-1">Descrição</th>
                              <th className="py-0.5 px-1">Convênio</th>
                              <th className="py-0.5 px-1">Fila Destino</th>
                              <th className="py-0.5 px-1">Início</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 font-mono">
                            {vinculados.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="py-3 text-center text-gray-400 italic font-sans">
                                  Nenhum procedimento vinculado ainda.
                                </td>
                              </tr>
                            ) : (
                              vinculados.map(v => (
                                <tr key={v.id} className="hover:bg-blue-50 text-gray-800">
                                  <td className="py-1 px-1">{v.code}</td>
                                  <td className="py-1 px-1 font-sans">{v.name}</td>
                                  <td className="py-1 px-1">{v.convenio}</td>
                                  <td className="py-1 px-1 text-blue-900 font-semibold">{v.fila}</td>
                                  <td className="py-1 px-1">{v.inicio}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="bg-[#e4e0d4] border border-[#999] p-2 flex flex-col md:flex-row items-center justify-between gap-2">
                  <div className="flex items-center gap-3 text-[11px]">
                    <div>
                      <span className="text-gray-600 block text-[9px]">Colaborador:</span>
                      <strong className="text-[#003366] font-mono">1095860 PAULA CARVALHO RIBEIRO</strong>
                    </div>
                    <span className="text-gray-400">|</span>
                    <button 
                      onClick={() => alert('Etiqueta teste gerada.')}
                      className="px-2 py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] text-[10px]"
                    >
                      Etiqueta Teste
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button 
                      onClick={() => {
                        alert('Etiquetas do paciente e tubos impressas com sucesso.');
                        if (trainingStep === 9) setTrainingStep(10);
                      }}
                      className={`px-2.5 py-1 border font-semibold text-[11px] cursor-pointer ${
                        trainingStep === 9 ? 'bg-amber-300 border-amber-600 ring-2 ring-amber-500 animate-pulse' : 'bg-[#ece9d8] hover:bg-[#d4d0c8] border-[#999]'
                      }`}
                    >
                      Impressão de Etiquetas
                    </button>
                    <button 
                      onClick={() => alert('Pulseira de identificação gerada.')}
                      className="px-2.5 py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] font-semibold text-[11px] cursor-pointer"
                    >
                      Pulseira
                    </button>
                    <button 
                      onClick={() => alert('Fila de espera atualizada.')}
                      className="px-2.5 py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] font-semibold text-[11px] cursor-pointer"
                    >
                      Visualizar Fila
                    </button>

                    {/* Finalizar Atendimento Button */}
                    <button 
                      onClick={() => setModalOpen('alerta_finalizar_cpf')}
                      className={`px-4 py-1 text-white font-bold text-xs border shadow-sm cursor-pointer ${
                        trainingStep === 10 ? 'bg-red-600 hover:bg-red-700 ring-2 ring-yellow-400 animate-bounce' : 'bg-red-700 hover:bg-red-800 border-red-900'
                      }`}
                    >
                      Finalizar Atendimento
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW C: SOLICITAÇÃO DO ATENDIMENTO (Video 01:38 - 02:20)  */}
            {/* ======================================================== */}
            {activeScreen === 'solicitacao' && (
              <div className="border border-[#808080] bg-[#ece9d8] p-2 space-y-2 shadow-inner min-w-[920px]">
                
                <div className="bg-gradient-to-r from-[#003366] to-[#4682b4] text-white px-2 py-0.5 font-bold text-xs flex items-center justify-between">
                  <span>Solicitação do Atendimento - [Inclusão de Procedimentos e OCIs]</span>
                  <button 
                    onClick={() => setActiveScreen('recepcao')}
                    className="text-xs text-yellow-200 hover:underline font-bold"
                  >
                    [ ➔ Voltar para Recepção ]
                  </button>
                </div>

                <div className="bg-[#f4f1e8] border border-[#999] p-2 text-[11px] grid grid-cols-12 gap-2">
                  <div className="col-span-2">
                    <span className="text-[10px] text-gray-600 block">Código</span>
                    <strong className="font-mono text-blue-900">{pacienteCodigo || '4531822'}</strong>
                  </div>
                  <div className="col-span-6">
                    <span className="text-[10px] text-gray-600 block">Nome do Paciente</span>
                    <strong className="text-black">{pacienteNome || 'TESTE 06 AGENDADO'}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-gray-600 block">Idade</span>
                    <span>{idadeAnos || '51'} anos</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-gray-600 block">Data Nasc.</span>
                    <span className="font-mono">{dataNascimento || '08/04/1975'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-2">
                  
                  {/* Left Form */}
                  <div className="col-span-8 bg-[#f4f1e8] border border-[#999] p-2 space-y-2 text-[11px]">
                    <div className="text-[10px] font-bold text-[#003366] border-b border-[#ccc] pb-0.5">
                      Dados da Solicitação
                    </div>

                    <div className="grid grid-cols-12 gap-1.5">
                      <div className="col-span-3">
                        <label className="text-[10px] text-gray-600 block">Data Solicitação</label>
                        <input 
                          type="text" 
                          value={solicitacaoData} 
                          readOnly 
                          className="w-full bg-[#f0ede4] border border-[#7f9db9] px-1 py-0.5 font-mono"
                        />
                      </div>

                      <div className="col-span-9">
                        <label className="text-[10px] text-gray-600 block">Cc. Solicitante</label>
                        <div className="flex gap-1">
                          <input 
                            type="text" 
                            value={centroCustoCode || '77261'} 
                            readOnly 
                            className="w-16 bg-[#f0ede4] border border-[#7f9db9] px-1 py-0.5 font-mono"
                          />
                          <input 
                            type="text" 
                            value={centroCustoName || 'UNIDADE MOVEL AGSUS - PAULO AFONSO'} 
                            readOnly 
                            className="flex-1 bg-[#f0ede4] border border-[#7f9db9] px-1 py-0.5"
                          />
                        </div>
                      </div>

                      <div className="col-span-6">
                        <label className="text-[10px] text-gray-600 block">
                          Convênio <span className="text-red-700 font-bold">* (Deve ser AGSUS/OCI)</span>
                        </label>
                        <div className="flex gap-1">
                          <input 
                            type="text" 
                            value={convenioCodigo} 
                            readOnly 
                            className="w-20 bg-white border border-[#7f9db9] px-1 py-0.5 font-mono font-bold"
                          />
                          <input 
                            type="text" 
                            value={convenioNome} 
                            readOnly 
                            className="flex-1 bg-[#f0ede4] border border-[#7f9db9] px-1 py-0.5 font-bold text-blue-900"
                          />
                        </div>
                      </div>

                      <div className="col-span-6">
                        <label className="text-[10px] text-gray-600 block">Solicitante</label>
                        <input 
                          type="text" 
                          value={solicitanteNome} 
                          readOnly 
                          className="w-full bg-white border border-[#7f9db9] px-1 py-0.5"
                        />
                      </div>
                    </div>

                    <div className="pt-1 border-t border-[#ccc]">
                      <div className="text-[10px] font-bold text-[#003366] pb-0.5">
                        Inf. Gerais (Facilitadores) & Diagnóstico
                      </div>

                      <div className="grid grid-cols-12 gap-1.5 pt-1">
                        <div className="col-span-6">
                          <label className="text-[10px] text-gray-600 block">
                            CBO <span className="text-red-700 font-bold">* (Ginecologista 225250)</span>
                          </label>
                          <div className="flex gap-1">
                            <input 
                              type="text" 
                              value={cboCodigo} 
                              readOnly 
                              className="w-16 bg-white border border-[#7f9db9] px-1 py-0.5 font-mono font-bold text-green-800"
                            />
                            <input 
                              type="text" 
                              value={cboNome} 
                              readOnly 
                              className="flex-1 bg-[#f0ede4] border border-[#7f9db9] px-1 py-0.5 font-semibold text-black"
                            />
                          </div>
                        </div>

                        <div className="col-span-6">
                          <label className="text-[10px] text-gray-600 block">Diagnóstico (CID-10)</label>
                          <div className="flex gap-1">
                            <input 
                              type="text" 
                              value={cidCodigo} 
                              readOnly 
                              className="w-12 bg-white border border-[#7f9db9] px-1 py-0.5 font-mono font-bold"
                            />
                            <input 
                              type="text" 
                              value={cidDescricao} 
                              readOnly 
                              className="flex-1 bg-[#f0ede4] border border-[#7f9db9] px-1 py-0.5"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Exames Solicitados Table inside Solicitação */}
                    <div className="pt-2 border-t border-[#ccc]">
                      <div className="text-[10px] font-bold text-[#003366] mb-1 flex items-center justify-between">
                        <span>Exames Solicitados na Guia</span>
                        <span className="text-green-800 font-bold">{solicitacaoProcedures.length} Procedimentos Carregados</span>
                      </div>

                      <div className="h-40 overflow-y-auto bg-white border border-[#7f9db9]">
                        <table className="w-full text-left text-[10px]">
                          <thead className="bg-[#e4e0d4] text-[#333] border-b border-[#ccc] font-semibold sticky top-0">
                            <tr>
                              <th className="py-0.5 px-1">Código</th>
                              <th className="py-0.5 px-1">Exame / Procedimento</th>
                              <th className="py-0.5 px-1">Convênio</th>
                              <th className="py-0.5 px-1 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 font-mono">
                            {solicitacaoProcedures.map(p => (
                              <tr key={p.id} className="hover:bg-blue-50 text-gray-800">
                                <td className="py-1 px-1">{p.code}</td>
                                <td className="py-1 px-1 font-sans">{p.name}</td>
                                <td className="py-1 px-1">{p.convenio}</td>
                                <td className="py-1 px-1 text-center text-green-700 font-bold font-sans">
                                  Liberado
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Actions & Kit Button */}
                  <div className="col-span-4 bg-[#f4f1e8] border border-[#999] p-2 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-[#003366] pb-1 border-b border-[#ccc]">
                        Solic. do Paciente Selecionada
                      </div>
                      
                      <div className="mt-1 h-28 overflow-y-auto bg-white border border-[#7f9db9]">
                        <table className="w-full text-left text-[10px] font-mono">
                          <thead className="bg-[#e4e0d4] text-[#333] border-b border-[#ccc] font-semibold sticky top-0">
                            <tr>
                              <th className="py-0.5 px-1">Data</th>
                              <th className="py-0.5 px-1">Número</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr className="bg-[#316ac5] text-white font-bold">
                              <td className="py-0.5 px-1">31/07/2026</td>
                              <td className="py-0.5 px-1">20253972</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <button 
                        onClick={() => alert('Exibindo conferência de solicitação.')}
                        className="w-full py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] text-[10px] font-semibold text-center"
                      >
                        Exibe Conferência
                      </button>
                      <button 
                        onClick={() => alert('Imprimindo canhoto.')}
                        className="w-full py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] text-[10px] font-semibold text-center"
                      >
                        Imprimir Canhoto
                      </button>

                      {/* Kit Procedimento Button (Video 01:54) */}
                      <button 
                        onClick={() => setModalOpen('kit_procedimento')}
                        className={`w-full py-2 border-2 font-bold text-xs shadow-xs cursor-pointer ${
                          trainingStep === 7 
                            ? 'bg-[#ffd966] border-[#b38600] ring-2 ring-amber-500 animate-pulse text-[#664d00]' 
                            : 'bg-gradient-to-b from-[#fffae6] to-[#ffd966] hover:to-[#ffc000] border-[#b38600] text-[#664d00]'
                        }`}
                      >
                        ★ Kit Procedimento (F9)
                      </button>

                      <button 
                        onClick={() => alert('Imprimindo TOLE.')}
                        className="w-full py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] text-[10px] font-semibold text-center"
                      >
                        Imprimir TOLE
                      </button>
                    </div>

                    <div className="pt-3 border-t border-[#ccc]">
                      <button
                        onClick={() => {
                          setActiveScreen('recepcao');
                          if (trainingStep === 7) setTrainingStep(8);
                        }}
                        className="w-full py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xs cursor-pointer shadow-sm"
                      >
                        Salvar e Voltar à Recepção
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>
        </div>

        {/* Oracle Forms Status Bar */}
        <div className="bg-[#ece9d8] border-t-2 border-white px-2 py-0.5 flex items-center justify-between text-[10px] text-[#555] font-mono">
          <div className="flex items-center gap-4">
            <span className="border-r border-[#999] pr-3">Registro: 1/1</span>
            <span className="border-r border-[#999] pr-3">&lt;OSC&gt;</span>
            <span className="border-r border-[#999] pr-3 text-blue-900 font-bold">
              {statusAtendimento === 'FINALIZADO' ? 'Modo Consulta (FINALIZADO)' : 'Modo Inserção'}
            </span>
            <span>Oracle Forms Runtime v12c</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            <span className="text-black font-sans font-semibold">Conectado ao Banco SIS-ONCO</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: LOV Pacientes (Video 00:30)                     */}
      {/* ======================================================== */}
      {modalOpen === 'lov_pacientes' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
          <div className="w-full max-w-xl bg-[#d4d0c8] border-2 border-white shadow-2xl p-1 text-black font-sans text-xs">
            <div className="bg-[#0a246a] text-white px-2 py-1 font-bold text-xs flex items-center justify-between">
              <span>Pessoas / Selecionar [Lista de Valores]</span>
              <button onClick={() => setModalOpen(null)} className="text-white hover:text-red-300 font-mono font-bold">×</button>
            </div>

            <div className="p-3 bg-[#ece9d8] space-y-2">
              <div className="text-[11px] text-gray-700">
                Informe um valor para pesquisa ou selecione abaixo:
              </div>

              <div className="h-44 overflow-y-auto bg-white border border-[#7f9db9]">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#e4e0d4] text-[#333] border-b border-[#ccc] font-semibold sticky top-0">
                    <tr>
                      <th className="py-1 px-1.5">Nome</th>
                      <th className="py-1 px-1.5">Data Nascimento - RH</th>
                      <th className="py-1 px-1.5">CPF/CNPJ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 font-mono text-[10px]">
                    <tr 
                      onClick={handleSelectPatientLov}
                      className="hover:bg-blue-100 cursor-pointer font-bold bg-blue-50 text-blue-900"
                    >
                      <td className="py-1 px-1.5 font-sans">TESTE 06 AGENDADO (Vídeo 00:34)</td>
                      <td className="py-1 px-1.5">08/04/1975</td>
                      <td className="py-1 px-1.5">24119743031</td>
                    </tr>
                    <tr 
                      onClick={handleSelectPatientLov}
                      className="hover:bg-blue-100 cursor-pointer text-gray-800"
                    >
                      <td className="py-1 px-1.5 font-sans">MARIA TESTE BRUNINHO</td>
                      <td className="py-1 px-1.5">07/06/1990</td>
                      <td className="py-1 px-1.5">89800124431</td>
                    </tr>
                    <tr className="hover:bg-blue-100 cursor-pointer text-gray-700">
                      <td className="py-1 px-1.5 font-sans">TESTE PREVENCAO PALMAS</td>
                      <td className="py-1 px-1.5">16/09/1976</td>
                      <td className="py-1 px-1.5">00000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#ccc]">
                <button 
                  onClick={handleSelectPatientLov}
                  className="px-4 py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] font-bold text-xs cursor-pointer"
                >
                  OK
                </button>
                <button 
                  onClick={() => setModalOpen(null)}
                  className="px-4 py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] text-xs cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: Alerta Atualizar Dados (Video 00:49)             */}
      {/* ======================================================== */}
      {modalOpen === 'alerta_paciente_atualizar' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3">
          <div className="w-full max-w-md bg-[#d4d0c8] border-2 border-white shadow-2xl p-1 text-black font-sans text-xs">
            <div className="bg-[#0a246a] text-white px-2 py-0.5 font-bold text-xs flex items-center justify-between">
              <span>Alerta de Cadastro</span>
            </div>
            <div className="p-4 bg-[#ece9d8] space-y-3 text-center">
              <div className="bg-yellow-300 border border-yellow-600 p-2 font-bold text-red-900 text-sm">
                É necessário atualizar os dados do paciente!
              </div>
              <p className="text-xs text-gray-700">
                O cadastro do paciente possui pendências de conferência.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button 
                  onClick={() => setModalOpen('alerta_sem_agenda')}
                  className="px-6 py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] font-bold text-xs cursor-pointer"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: Alerta Sem Agenda (Video 00:52)                  */}
      {/* ======================================================== */}
      {modalOpen === 'alerta_sem_agenda' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3">
          <div className="w-full max-w-md bg-[#d4d0c8] border-2 border-white shadow-2xl p-1 text-black font-sans text-xs">
            <div className="bg-[#0a246a] text-white px-2 py-0.5 font-bold text-xs flex items-center justify-between">
              <span>Alerta</span>
            </div>
            <div className="p-4 bg-[#ece9d8] space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-800 leading-relaxed">
                  O paciente <strong>{pacienteNome}</strong> não possui exames agendados para este dia. Deseja realizar inclusão no atendimento sem agenda?
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#ccc]">
                <button 
                  onClick={() => {
                    setModalOpen(null);
                    if (trainingStep === 4) setTrainingStep(5);
                  }}
                  className="px-4 py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] font-bold text-xs cursor-pointer"
                >
                  Sim
                </button>
                <button 
                  onClick={() => setModalOpen(null)}
                  className="px-4 py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] text-xs cursor-pointer"
                >
                  Não
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: Kit Procedimento Modal (Video 01:56)            */}
      {/* ======================================================== */}
      {modalOpen === 'kit_procedimento' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3">
          <div className="w-full max-w-2xl bg-[#d4d0c8] border-2 border-white shadow-2xl p-1 text-black font-sans text-xs">
            <div className="bg-[#0a246a] text-white px-2 py-1 font-bold text-xs flex items-center justify-between">
              <span>Kit Procedimento [Seleção de Pacote OCI]</span>
              <button onClick={() => setModalOpen(null)} className="text-white hover:text-red-300 font-mono font-bold">×</button>
            </div>

            <div className="p-3 bg-[#ece9d8] space-y-2">
              <div className="bg-[#f4f1e8] p-2 border border-[#999] flex items-center gap-2">
                <label className="font-bold text-[#003366]">Localizar Kit:</label>
                <input 
                  type="text" 
                  defaultValue="kit oci" 
                  className="flex-1 bg-white border border-[#7f9db9] px-2 py-0.5 font-bold"
                />
              </div>

              <div className="h-44 overflow-y-auto bg-white border border-[#7f9db9]">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#e4e0d4] text-[#333] border-b border-[#ccc] font-semibold sticky top-0">
                    <tr>
                      <th className="py-1 px-2">Kit Procedimento OCI</th>
                      <th className="py-1 px-2 text-right">Código</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr 
                      onClick={handleLoadKit}
                      className="hover:bg-blue-100 cursor-pointer bg-blue-50 font-bold text-blue-900"
                    >
                      <td className="py-1.5 px-2">
                        KIT OCI AVALIAÇÃO DIAGNOSTICA INICIAL DE CÂNCER DE MAMA (Vídeo 02:06)
                      </td>
                      <td className="py-1.5 px-2 text-right font-mono">2001</td>
                    </tr>
                    <tr className="hover:bg-blue-100 cursor-pointer text-gray-700">
                      <td className="py-1.5 px-2">
                        KIT OCI INVESTIGAÇÃO DIAGNÓSTICA DE CÂNCER COLO DO ÚTERO
                      </td>
                      <td className="py-1.5 px-2 text-right font-mono">2002</td>
                    </tr>
                    <tr className="hover:bg-blue-100 cursor-pointer text-gray-700">
                      <td className="py-1.5 px-2">KIT OCI COLPOSCOPIA</td>
                      <td className="py-1.5 px-2 text-right font-mono">2004</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#ccc]">
                <button 
                  onClick={handleLoadKit}
                  className="px-5 py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] font-bold text-xs cursor-pointer"
                >
                  OK
                </button>
                <button 
                  onClick={() => setModalOpen(null)}
                  className="px-5 py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] text-xs cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: Anamnese Mamografia (Video 02:28 - 02:57)       */}
      {/* ======================================================== */}
      {modalOpen === 'anamnese_mamografia' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3">
          <div className="w-full max-w-xl bg-[#d4d0c8] border-2 border-white shadow-2xl p-1 text-black font-sans text-xs">
            <div className="bg-[#0a246a] text-white px-2 py-1 font-bold text-xs flex items-center justify-between">
              <span>Prevenção do Atendimento - [Anamnese de Mamografia]</span>
              <span className="text-[10px] font-mono text-yellow-200">Kines: {anamnese.kinesUnidade}</span>
            </div>

            <div className="p-3 bg-[#ece9d8] space-y-2 text-[11px]">
              
              <div className="p-2 bg-[#f4f1e8] border border-[#999] space-y-1">
                <span className="font-bold text-[#003366] block">1. Indicação do Exame:</span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="radio" 
                      name="tipoMamo" 
                      checked={anamnese.tipoMamografia === 'rastreamento'}
                      onChange={() => setAnamnese(prev => ({ ...prev, tipoMamografia: 'rastreamento', sintomatica: false }))}
                    />
                    <span>Mamografia Rastreamento (Assintomática)</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="radio" 
                      name="tipoMamo" 
                      checked={anamnese.tipoMamografia === 'diagnostica'}
                      onChange={() => setAnamnese(prev => ({ ...prev, tipoMamografia: 'diagnostica', sintomatica: true }))}
                    />
                    <span>Mamografia Diagnóstica (Sintomática)</span>
                  </label>
                </div>
              </div>

              <div className="p-2 bg-[#f4f1e8] border border-[#999] flex items-center justify-between">
                <span className="font-bold text-[#003366]">2. Fez mamografia alguma vez?</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="radio" 
                      name="fezAntes" 
                      checked={anamnese.fezAntes === 'Sim'}
                      onChange={() => setAnamnese(prev => ({ ...prev, fezAntes: 'Sim' }))}
                    />
                    <span>Sim</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="radio" 
                      name="fezAntes" 
                      checked={anamnese.fezAntes === 'Não'}
                      onChange={() => setAnamnese(prev => ({ ...prev, fezAntes: 'Não' }))}
                    />
                    <span>Não</span>
                  </label>
                  <span className="text-[10px] text-gray-600">Ano:</span>
                  <input 
                    type="text" 
                    value={anamnese.anoAnterior}
                    onChange={(e) => setAnamnese(prev => ({ ...prev, anoAnterior: e.target.value }))}
                    className="w-14 bg-white border border-[#7f9db9] px-1 py-0.5 text-center font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-[#f4f1e8] border border-[#999] flex items-center justify-between">
                  <span className="font-bold text-[#003366]">3. Cirurgia anterior?</span>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1"><input type="radio" name="cirurgia" defaultChecked={false} /> Sim</label>
                    <label className="flex items-center gap-1"><input type="radio" name="cirurgia" defaultChecked={true} /> Não</label>
                  </div>
                </div>

                <div className="p-2 bg-[#f4f1e8] border border-[#999] flex items-center justify-between">
                  <span className="font-bold text-[#003366]">4. Risco elevado?</span>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1"><input type="radio" name="risco" defaultChecked={false} /> Sim</label>
                    <label className="flex items-center gap-1"><input type="radio" name="risco" defaultChecked={true} /> Não</label>
                  </div>
                </div>
              </div>

              <div className="p-2 bg-[#e4e0d4] border border-[#999] flex items-center justify-between">
                <div>
                  <span className="text-gray-600 text-[10px]">Classificação Clínica:</span>
                  <strong className="ml-2 px-2 py-0.5 rounded-xs text-xs bg-green-200 text-green-900 border border-green-400">
                    Assintomática
                  </strong>
                </div>

                <button 
                  onClick={() => setModalOpen('pesquisa_divulgacao')}
                  className="px-5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xs cursor-pointer shadow-xs"
                >
                  Confirmar e Avançar ➔
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: Pesquisa Como Ficou Sabendo (Video 02:59)       */}
      {/* ======================================================== */}
      {modalOpen === 'pesquisa_divulgacao' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3">
          <div className="w-full max-w-lg bg-[#d4d0c8] border-2 border-white shadow-2xl p-1 text-black font-sans text-xs">
            <div className="bg-[#0a246a] text-white px-2 py-1 font-bold text-xs flex items-center justify-between">
              <span>Pesquisa de Divulgação - [Hospital de Amor / Unidade Móvel]</span>
            </div>

            <div className="p-3 bg-[#ece9d8] space-y-2">
              <div className="font-bold text-[#003366] text-xs border-b border-[#ccc] pb-1">
                COMO VOCÊ FICOU SABENDO DOS EXAMES PREVENTIVOS DA CARRETA?
              </div>

              <div className="grid grid-cols-2 gap-2 bg-[#f4f1e8] p-3 border border-[#999] text-[11px]">
                <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                  <input 
                    type="checkbox" 
                    checked={divulgacao.carretaRua} 
                    onChange={(e) => setDivulgacao(prev => ({ ...prev, carretaRua: e.target.checked }))} 
                  />
                  <span>CARRETA NA SUA RUA/BAIRRO</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                  <input 
                    type="checkbox" 
                    checked={divulgacao.acs} 
                    onChange={(e) => setDivulgacao(prev => ({ ...prev, acs: e.target.checked }))} 
                  />
                  <span>AGENTE COMUNITÁRIO (ACS)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" /><span>VEICULAÇÃO DE TV</span></label>
                <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" /><span>CARTAZ / CONVITE</span></label>
                <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" /><span>FOLHETO / PANFLETO</span></label>
                <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" /><span>IGREJA</span></label>
              </div>

              <div className="flex justify-end pt-2 border-t border-[#ccc]">
                <button 
                  onClick={() => {
                    setModalOpen(null);
                    // Link mamografia
                    const mamoProc = solicitacaoProcedures.find(p => p.name.includes('MAMOGRAFIA')) || solicitacaoProcedures[3];
                    finishLinking(mamoProc, 'MAMOGRAFIA');
                    // Also auto link consultation and USG for complete video fidelity
                    const oncoProc = solicitacaoProcedures.find(p => p.name.includes('CONSULTA')) || solicitacaoProcedures[2];
                    const ociProc = solicitacaoProcedures.find(p => p.name.includes('OCI')) || solicitacaoProcedures[4];
                    const usgProc = solicitacaoProcedures.find(p => p.name.includes('ECOGRAFIA')) || solicitacaoProcedures[0];
                    if (oncoProc) finishLinking(oncoProc, 'MÉDICO - CONSULTA');
                    if (ociProc) finishLinking(ociProc, 'MÉDICO - CONSULTA');
                    if (usgProc) finishLinking(usgProc, 'US - MAMA');
                    if (trainingStep === 8) setTrainingStep(9);
                  }}
                  className="px-6 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xs cursor-pointer shadow-xs"
                >
                  Finalizar Questionário
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 7: Alerta CPF ao Finalizar (Video 03:18)            */}
      {/* ======================================================== */}
      {modalOpen === 'alerta_finalizar_cpf' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3">
          <div className="w-full max-w-md bg-[#d4d0c8] border-2 border-white shadow-2xl p-1 text-black font-sans text-xs">
            <div className="bg-[#0a246a] text-white px-2 py-0.5 font-bold text-xs flex items-center justify-between">
              <span>Alerta de Conclusão</span>
            </div>
            <div className="p-4 bg-[#ece9d8] space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-800 leading-relaxed">
                  Paciente não possui CPF cadastrado. Deseja continuar assim mesmo?
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#ccc]">
                <button 
                  onClick={() => setModalOpen('alerta_finalizar_pep')}
                  className="px-5 py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] font-bold text-xs cursor-pointer"
                >
                  Sim
                </button>
                <button 
                  onClick={() => setModalOpen(null)}
                  className="px-5 py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] text-xs cursor-pointer"
                >
                  Não
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 8: Alerta PEP ao Finalizar (Video 03:20)            */}
      {/* ======================================================== */}
      {modalOpen === 'alerta_finalizar_pep' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3">
          <div className="w-full max-w-md bg-[#d4d0c8] border-2 border-white shadow-2xl p-1 text-black font-sans text-xs">
            <div className="bg-[#0a246a] text-white px-2 py-0.5 font-bold text-xs flex items-center justify-between">
              <span>Alerta</span>
            </div>
            <div className="p-4 bg-[#ece9d8] space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-800 leading-relaxed">
                  Não foi realizado PEP da(s) receita(s). Deseja continuar assim mesmo?
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#ccc]">
                <button 
                  onClick={handleConfirmFinalizacao}
                  className="px-5 py-1 bg-green-800 hover:bg-green-700 text-white font-bold text-xs cursor-pointer"
                >
                  Sim, Finalizar Atendimento
                </button>
                <button 
                  onClick={() => setModalOpen(null)}
                  className="px-5 py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] text-xs cursor-pointer"
                >
                  Não
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
