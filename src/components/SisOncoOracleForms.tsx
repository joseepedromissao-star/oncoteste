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
  Folder, 
  FolderOpen, 
  FileText, 
  Layers, 
  ArrowDown, 
  Info,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  Lock,
  ChevronDown
} from 'lucide-react';
import { Patient } from '../types';

interface SisOncoOracleFormsProps {
  onSyncWithCrm?: (patient: Patient) => void;
}

export const SisOncoOracleForms: React.FC<SisOncoOracleFormsProps> = ({ onSyncWithCrm }) => {
  // Navigation State within SIS-ONCO
  const [activeScreen, setActiveScreen] = useState<'recepcao' | 'solicitacao'>('recepcao');
  
  // Left Tree menu expanded states
  const [menuExpanded, setMenuExpanded] = useState({
    atendimento: true,
    prontuario: true,
    bancoSangue: false,
    compras: false,
    estoque: false
  });

  // Training Guide Assistant Step (0 = Free Practice, 1..8 = Guided Steps)
  const [trainingStep, setTrainingStep] = useState<number>(1);
  const [trainingMode, setTrainingMode] = useState<boolean>(true);

  // Form Fields - Header
  const [etapaProcesso, setEtapaProcesso] = useState('RECEPÇÃO');
  const [centroCustoCode, setCentroCustoCode] = useState('77263');
  const [centroCustoName, setCentroCustoName] = useState('UNIDADE MOVEL 21 - SUS');
  const [numeroAtendimento, setNumeroAtendimento] = useState('31117242');
  const [dataAtendimento, setDataAtendimento] = useState('31/07/2026 14:49:41');
  const [statusAtendimento, setStatusAtendimento] = useState<'EM ATENDIMENTO' | 'FINALIZADO'>('EM ATENDIMENTO');
  const [isPrimeiraVez, setIsPrimeiraVez] = useState(false);
  const [isLeitorBarras, setIsLeitorBarras] = useState(false);
  const [isGeral, setIsGeral] = useState(false);

  // Patient Fields
  const [rhNumber, setRhNumber] = useState('');
  const [pacienteCodigo, setPacienteCodigo] = useState('4531822');
  const [pacienteNome, setPacienteNome] = useState('MARIA TESTE BRUNINHO');
  const [dataNascimento, setDataNascimento] = useState('07/06/1990');
  const [idadeAnos, setIdadeAnos] = useState('36');
  const [idadeMeses, setIdadeMeses] = useState('2');
  const [nomeMae, setNomeMae] = useState('SEM IDENTIFICACAO');
  const [cartaoSus, setCartaoSus] = useState('898.0012.4431.0019');
  const [sexoPaciente, setSexoPaciente] = useState('FEMININO');

  // Processo Fields
  const [processoCodigo, setProcessoCodigo] = useState('59885');
  const [processoNome, setProcessoNome] = useState('REALIZAR EXAME');
  const [especialidadeCodigo, setEspecialidadeCodigo] = useState('3');
  const [especialidadeNome, setEspecialidadeNome] = useState('GINECOLOGIA');
  const [caraterAtend, setCaraterAtend] = useState('1768 - ROTINA');
  const [tipoAtend, setTipoAtend] = useState('590 - AMBULATORIAL');
  const [tipoPaciente, setTipoPaciente] = useState('1783 - EXTERNO');
  const [modalidade, setModalidade] = useState('79157 - AGSUS');
  const [observacao, setObservacao] = useState('');
  const [pacienteTrouxeExame, setPacienteTrouxeExame] = useState(false);

  // Fila de Atendimento (Middle Grid)
  const [filasAtendimento, setFilasAtendimento] = useState<Array<{ id: string; sr: string; etapa: string; centroCusto: string; selected?: boolean }>>([
    { id: 'f1', sr: '61696', etapa: 'MAMOGRAFIA', centroCusto: 'UNIDADE MOVEL 21 - SUS', selected: true },
    { id: 'f2', sr: '61697', etapa: 'MÉDICO - CONSULTA', centroCusto: 'UNIDADE MOVEL 21 - SUS' },
    { id: 'f3', sr: '61698', etapa: 'US - MAMA', centroCusto: 'UNIDADE MOVEL 21 - SUS' }
  ]);
  const [selectedFilaIndex, setSelectedFilaIndex] = useState<number>(0);

  // Solicitações list
  const [solicitacaoNumero, setSolicitacaoNumero] = useState('20253972');
  const [solicitacaoData, setSolicitacaoData] = useState('31/07/2026');

  // Procedures available in solicitation (loaded after Kit or by default)
  const [solicitacaoProcedures, setSolicitacaoProcedures] = useState<Array<{
    id: string;
    code: string;
    name: string;
    convenio: string;
    selected?: boolean;
    linkedTo?: string;
  }>>([
    { id: 'p1', code: '45351064', name: 'ECOGRAFIA DE ESTR. SUPER. MAMAS', convenio: 'OCI' },
    { id: 'p2', code: '45361084', name: 'TELECONSULTA MEDICA NA ATENÇÃO ESPECIALIZADA', convenio: 'OCI' },
    { id: 'p3', code: '45351063', name: 'CONSULTA EM ONCOLOGIA', convenio: 'OCI' },
    { id: 'p4', code: '45361085', name: 'MAMOGRAFIA', convenio: 'SUS' },
    { id: 'p5', code: '4291057', name: 'OCI AVALIAÇÃO DIAGNOSTICA INICIAL DE CANCER DE MAMA', convenio: 'OCI' }
  ]);
  const [selectedProcId, setSelectedProcId] = useState<string>('p4');

  // Linked Procedures table (Solicitações Vinculadas ao Atendimento)
  const [vinculados, setVinculados] = useState<Array<{
    id: string;
    code: string;
    name: string;
    convenio: string;
    inicio: string;
    fim: string;
    motCancel: string;
    fila: string;
  }>>([]);

  // Screen 2: Solicitação Specific State
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

  // Search in LOV Pacientes
  const [lovSearchName, setLovSearchName] = useState('');

  // Anamnese Mamografia State (from video at 02:28)
  const [anamnese, setAnamnese] = useState({
    tipoMamografia: 'rastreamento', // rastreamento | diagnostica
    fezAntes: 'Sim',
    anoAnterior: '2024',
    cirurgiaAnterior: 'Não',
    riscoElevado: 'Não',
    exameClinico: 'Normal',
    kinesUnidade: '77263',
    noduloDireito: false,
    noduloEsquerdo: false,
    descargaDireita: false,
    descargaEsquerda: false,
    dorDireita: false,
    dorEsquerda: false,
    sintomatica: false
  });

  // Pesquisa de Divulgação (Como Ficou Sabendo) State (from video at 02:59)
  const [divulgacao, setDivulgacao] = useState({
    carretaRua: true,
    veiculacaoTv: false,
    cartaz: false,
    acs: true,
    panfleto: false,
    igreja: false,
    palestra: false,
    radio: false,
    amigoVizinho: false,
    carroSom: false,
    redesSociais: false
  });

  // Handle linking procedure to active queue (Video 02:25)
  const handleVincularProcedimento = () => {
    const activeFila = filasAtendimento[selectedFilaIndex];
    const proc = solicitacaoProcedures.find(p => p.id === selectedProcId);
    if (!proc || !activeFila) return;

    // If linking Mamografia, trigger Anamnese first! (as in video 02:27)
    if (proc.name.includes('MAMOGRAFIA')) {
      setModalOpen('anamnese_mamografia');
      return;
    }

    // Add to vinculados
    finishLinking(proc, activeFila.etapa);
  };

  const finishLinking = (proc: any, etapaFila: string) => {
    if (vinculados.some(v => v.id === proc.id)) return;

    const newVinculado = {
      id: proc.id,
      code: proc.code,
      name: proc.name,
      convenio: proc.convenio,
      inicio: '31/07/2026',
      fim: '',
      motCancel: '',
      fila: etapaFila
    };
    setVinculados(prev => [...prev, newVinculado]);

    if (trainingStep === 6) {
      setTrainingStep(7);
    }
  };

  // Complete Anamnese
  const handleConfirmAnamnese = () => {
    setModalOpen('pesquisa_divulgacao');
  };

  // Complete Pesquisa Divulgação
  const handleConfirmPesquisa = () => {
    setModalOpen(null);
    const proc = solicitacaoProcedures.find(p => p.id === selectedProcId) || solicitacaoProcedures[3];
    const activeFila = filasAtendimento[selectedFilaIndex] || filasAtendimento[0];
    finishLinking(proc, activeFila.etapa);
    if (trainingStep === 7) {
      setTrainingStep(8);
    }
  };

  // Finalize Atendimento (Video 03:17)
  const handleFinalizarAtendimento = () => {
    setModalOpen('alerta_finalizar_cpf');
  };

  const handleConfirmFinalizacao = () => {
    setModalOpen(null);
    setStatusAtendimento('FINALIZADO');
    if (trainingStep === 8) {
      setTrainingStep(1); // loop back or complete
    }

    // Sync with CRM
    if (onSyncWithCrm) {
      onSyncWithCrm({
        id: pacienteCodigo,
        susCard: cartaoSus,
        name: pacienteNome,
        motherName: nomeMae,
        birthDate: dataNascimento,
        age: parseInt(idadeAnos) || 36,
        gender: sexoPaciente as any,
        phone: '(17) 99872-3341',
        cidade: 'Barretos / SP',
        unidadeMovel: centroCustoName,
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
            title: 'Atendimento SIS-ONCO Finalizado',
            description: `Atendimento nº ${numeroAtendimento} finalizado no Oracle Forms por Paula Carvalho Ribeiro.`,
            author: 'SIS-ONCO Oracle Forms',
            category: 'recepcao',
            highlight: true
          }
        ],
        alerts: []
      });
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top Training Assistant Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-xs">
            POP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Simulador Idêntico: SIS-ONCO / Oracle Forms Services
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-[11px] text-slate-300">Treinamento Oficial da Recepção de Carretas</span>
            </div>
            <div className="text-xs text-white mt-0.5">
              {trainingStep === 1 && 'Passo 1: Inserir Registro e Selecionar o Centro de Custo da Carreta (77263 UNIDADE MOVEL 21).'}
              {trainingStep === 2 && 'Passo 2: No campo Paciente, clique no botão LOV [?] para buscar a paciente e confirme o alerta.'}
              {trainingStep === 3 && 'Passo 3: Na Fila de Atendimento, confira as 3 filas: MAMOGRAFIA, MÉDICO - CONSULTA e US - MAMA.'}
              {trainingStep === 4 && 'Passo 4: Clique no botão [Solicitação] (lado direito) para cadastrar os exames da OCI.'}
              {trainingStep === 5 && 'Passo 5: Defina Convênio AGSUS, CBO Ginecologista e clique em [Kit Procedimento] para carregar o Kit Mama.'}
              {trainingStep === 6 && 'Passo 6: Salve a solicitação, volte para a Recepção e vincule os procedimentos às respectivas filas.'}
              {trainingStep === 7 && 'Passo 7: Ao vincular a Mamografia, preencha a Anamnese e a Pesquisa de Divulgação da Carreta.'}
              {trainingStep === 8 && 'Passo 8: Clique em [Impressão de Etiquetas] e depois em [Finalizar Atendimento] para concluir.'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <button
            onClick={() => setTrainingStep(prev => prev > 1 ? prev - 1 : 1)}
            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 cursor-pointer"
          >
            Anterior
          </button>
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
            Passo {trainingStep} / 8
          </span>
          <button
            onClick={() => setTrainingStep(prev => prev < 8 ? prev + 1 : 8)}
            className="px-2.5 py-1 text-xs bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded cursor-pointer"
          >
            Próximo
          </button>
          <button
            onClick={() => {
              setStatusAtendimento('EM ATENDIMENTO');
              setVinculados([]);
              setTrainingStep(1);
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
            title="Reiniciar Treinamento"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Oracle Forms Window Shell */}
      <div className="bg-[#d4d0c8] text-black font-sans text-xs rounded-t-md shadow-2xl border-2 border-[#808080] overflow-hidden select-none">
        
        {/* Oracle Forms Classic Window Titlebar */}
        <div className="bg-gradient-to-r from-[#0a246a] to-[#a6caf0] text-white px-2 py-1 flex items-center justify-between font-bold text-xs shadow-inner">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-600 rounded-sm inline-block border border-white" />
            <span>Oracle Forms Services - [SIS-ONCO: SISTEMA DE GESTÃO ONCOLÓGICA]</span>
          </div>
          <div className="flex items-center gap-1 text-[10px]">
            <button className="w-4 h-3.5 bg-[#d4d0c8] text-black border border-white flex items-center justify-center font-mono">_</button>
            <button className="w-4 h-3.5 bg-[#d4d0c8] text-black border border-white flex items-center justify-center font-mono">□</button>
            <button className="w-4 h-3.5 bg-[#d4d0c8] text-black border border-white flex items-center justify-center font-mono text-red-600 font-bold">×</button>
          </div>
        </div>

        {/* Oracle Forms Menu Bar (Ação, Editar, Consultar, Bloco, Registro, Tela, Ajuda, Logoff) */}
        <div className="bg-[#ece9d8] border-b border-[#999] px-2 py-0.5 flex items-center justify-between text-[11px] text-[#222]">
          <div className="flex items-center gap-3">
            <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.2 rounded-sm cursor-pointer"><u>A</u>ção</span>
            <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.2 rounded-sm cursor-pointer"><u>E</u>ditar</span>
            <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.2 rounded-sm cursor-pointer"><u>C</u>onsultar</span>
            <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.2 rounded-sm cursor-pointer"><u>B</u>loco</span>
            <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.2 rounded-sm cursor-pointer"><u>R</u>egistro</span>
            <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.2 rounded-sm cursor-pointer"><u>T</u>ela</span>
            <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.2 rounded-sm cursor-pointer">A<u>j</u>uda</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#003366]">Filial: ANTENOR DUARTE VILELA - BARRETOS</span>
            <span className="text-[#666]">|</span>
            <button 
              onClick={() => {
                setStatusAtendimento('EM ATENDIMENTO');
                setVinculados([]);
              }}
              className="text-blue-800 hover:underline font-semibold"
            >
              Logoff
            </button>
          </div>
        </div>

        {/* Oracle Forms Iconic Toolbar (Disquete, Impressora, Sair, LOV, etc.) */}
        <div className="bg-[#ece9d8] border-b-2 border-[#fff] px-2 py-1 flex items-center gap-1 shadow-sm">
          <button 
            title="Salvar (Ctrl+S)"
            onClick={() => alert('Registro salvo com sucesso no banco Oracle!')}
            className="p-1 hover:bg-[#d4d0c8] border border-transparent hover:border-[#999] active:border-black rounded-sm cursor-pointer"
          >
            <Save className="w-4 h-4 text-blue-900" />
          </button>
          <button 
            title="Imprimir" 
            onClick={() => alert('Enviado para o spool de impressão.')}
            className="p-1 hover:bg-[#d4d0c8] border border-transparent hover:border-[#999] rounded-sm cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-700" />
          </button>
          <button 
            title="Limpar tela"
            onClick={() => {
              setPacienteCodigo('');
              setPacienteNome('');
            }}
            className="p-1 hover:bg-[#d4d0c8] border border-transparent hover:border-[#999] rounded-sm cursor-pointer"
          >
            <Eraser className="w-4 h-4 text-amber-700" />
          </button>
          <span className="w-px h-4 bg-[#999] mx-1" />
          <button 
            title="Inserir Registro (+)"
            onClick={() => {
              setNumeroAtendimento(Math.floor(31110000 + Math.random() * 9999).toString());
              setStatusAtendimento('EM ATENDIMENTO');
              if (trainingStep === 1) setTrainingStep(2);
            }}
            className="p-1 hover:bg-[#d4d0c8] border border-transparent hover:border-[#999] rounded-sm cursor-pointer font-bold text-green-800"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button 
            title="Remover Registro" 
            className="p-1 hover:bg-[#d4d0c8] border border-transparent hover:border-[#999] rounded-sm cursor-pointer text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
          <button 
            title="Bloquear Registro" 
            className="p-1 hover:bg-[#d4d0c8] border border-transparent hover:border-[#999] rounded-sm cursor-pointer text-slate-700"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
          <span className="w-px h-4 bg-[#999] mx-1" />
          <button 
            title="Lista de Valores (F9 / ?)"
            onClick={() => setModalOpen('lov_pacientes')}
            className={`p-1 border rounded-sm cursor-pointer font-bold ${
              trainingStep === 2 ? 'bg-amber-300 border-amber-600 animate-pulse' : 'hover:bg-[#d4d0c8] border-transparent hover:border-[#999]'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-[#000080]" />
          </button>
          <span className="w-px h-4 bg-[#999] mx-1" />
          <span className="text-[11px] font-mono text-[#555]">
            Módulo: <strong className="text-black">ATENCAO_BASICA_SIS_ONCO</strong>
          </span>
        </div>

        {/* Body Split: Left Oracle Navigation Tree + Right Form Canvas */}
        <div className="flex bg-[#d4d0c8] min-h-[640px]">
          
          {/* Left Menu Tree (Navigation Pane) */}
          <div className="w-64 bg-white border-r-2 border-[#808080] p-2 overflow-y-auto text-[11px] font-sans shrink-0">
            <div className="flex items-center gap-1 font-bold text-[#003366] pb-1 border-b border-[#ccc] mb-2">
              <Layers className="w-4 h-4 text-[#006699]" />
              <span>SIS-ONCO</span>
            </div>

            {/* Tree Items */}
            <div className="space-y-1">
              {/* Menu Atendimento */}
              <div>
                <div 
                  onClick={() => setMenuExpanded(prev => ({ ...prev, atendimento: !prev.atendimento }))}
                  className="flex items-center gap-1 cursor-pointer font-bold text-[#333] hover:bg-[#e8e8e8] px-1 py-0.5 rounded"
                >
                  <span className="font-mono text-xs">{menuExpanded.atendimento ? '[-]' : '[+]'}</span>
                  <span>Atendimento</span>
                </div>

                {menuExpanded.atendimento && (
                  <div className="pl-4 space-y-0.5 border-l border-[#ddd] ml-2 text-[#444]">
                    <div className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">Cadastro do Paciente (Geral)</div>
                    <div className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">Declaração de Paciente Internado</div>
                    <div className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">Ficha de Pré-Atendimento</div>
                    <div className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">Atendimento Geral</div>
                    
                    {/* Active Reception item from video */}
                    <div 
                      onClick={() => setActiveScreen('recepcao')}
                      className={`px-1.5 py-0.5 rounded cursor-pointer font-bold flex items-center gap-1 ${
                        activeScreen === 'recepcao' ? 'bg-[#0a246a] text-white' : 'hover:bg-[#316ac5] hover:text-white text-blue-900'
                      }`}
                    >
                      <span>•</span>
                      <span>Recepção de Atendimento Geral</span>
                    </div>

                    <div className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">Histórico de Atendimento</div>
                    <div className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">Indicadores de Atendimento Paciente</div>
                    <div className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">Fila de Atendimento</div>

                    {/* Submenu Prontuário */}
                    <div>
                      <div 
                        onClick={() => setMenuExpanded(prev => ({ ...prev, prontuario: !prev.prontuario }))}
                        className="flex items-center gap-1 cursor-pointer font-bold text-[#555] hover:bg-[#e8e8e8] px-1 py-0.5 rounded"
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

              {/* Other modules from video */}
              <div className="text-[#666] px-1 py-0.5 hover:bg-[#e8e8e8] cursor-pointer">[+] Banco de Sangue</div>
              <div className="text-[#666] px-1 py-0.5 hover:bg-[#e8e8e8] cursor-pointer">[+] Bulario</div>
              <div className="text-[#666] px-1 py-0.5 hover:bg-[#e8e8e8] cursor-pointer">[+] Compras</div>
              <div className="text-[#666] px-1 py-0.5 hover:bg-[#e8e8e8] cursor-pointer">[+] Controle de Cirurgia</div>
              <div className="text-[#666] px-1 py-0.5 hover:bg-[#e8e8e8] cursor-pointer">[+] Contas</div>
              <div className="text-[#666] px-1 py-0.5 hover:bg-[#e8e8e8] cursor-pointer">[+] Dieta</div>
              <div className="text-[#666] px-1 py-0.5 hover:bg-[#e8e8e8] cursor-pointer">[+] Estoque</div>
            </div>
          </div>

          {/* Right Main Screen Container */}
          <div className="flex-1 p-2 bg-[#d4d0c8] overflow-x-auto">
            
            {/* ======================================================== */}
            {/* SCREEN 1: Recepção de Atendimento Geral (Principal)       */}
            {/* ======================================================== */}
            {activeScreen === 'recepcao' && (
              <div className="border border-[#808080] bg-[#ece9d8] p-2 space-y-2 shadow-inner min-w-[940px]">
                
                {/* Form Title Banner */}
                <div className="bg-gradient-to-r from-[#003366] to-[#4682b4] text-white px-2 py-0.5 font-bold text-xs flex items-center justify-between">
                  <span>Recepção de Atendimento Geral (Recepção de Atendimento)</span>
                  <span className="text-[10px] font-normal text-yellow-200">Terminal Carreta Móvel</span>
                </div>

                {/* Top Parameters Block (Etapa, Centro de Custo, Nº Atend, Status) */}
                <div className="grid grid-cols-12 gap-1.5 items-center text-[11px] bg-[#e4e0d4] p-1.5 border border-[#b5b1a4]">
                  <div className="col-span-2">
                    <label className="text-[10px] text-gray-700 block font-semibold">Etapa do Processo</label>
                    <input 
                      type="text" 
                      readOnly 
                      value={etapaProcesso} 
                      className="w-full bg-[#f0ede4] border border-[#7f9db9] px-1.5 py-0.5 font-bold text-black"
                    />
                  </div>

                  <div className="col-span-4">
                    <label className="text-[10px] text-gray-700 block font-semibold flex items-center justify-between">
                      <span>Centro de Custo</span>
                      <button 
                        onClick={() => alert('Lista de Centros de Custo')} 
                        className="text-[9px] text-blue-900 underline font-normal"
                      >
                        Pesquisar
                      </button>
                    </label>
                    <div className="flex gap-1">
                      <input 
                        type="text" 
                        value={centroCustoCode} 
                        onChange={(e) => setCentroCustoCode(e.target.value)}
                        className="w-16 bg-white border border-[#7f9db9] px-1 py-0.5 font-mono font-bold"
                      />
                      <input 
                        type="text" 
                        value={centroCustoName} 
                        readOnly 
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
                        className="w-20 bg-white border border-[#7f9db9] px-1 py-0.5 font-mono font-bold"
                      />
                      <input 
                        type="text" 
                        value={dataAtendimento} 
                        readOnly 
                        className="flex-1 bg-[#f0ede4] border border-[#7f9db9] px-1 py-0.5 font-mono text-[10px]"
                      />
                    </div>
                  </div>

                  <div className="col-span-3">
                    <label className="text-[10px] text-gray-700 block font-semibold">Status</label>
                    <div className={`px-2 py-0.5 text-center font-bold font-mono text-xs border ${
                      statusAtendimento === 'FINALIZADO' 
                        ? 'bg-red-600 text-white border-red-800' 
                        : 'bg-white text-blue-900 border-[#7f9db9]'
                    }`}>
                      {statusAtendimento}
                    </div>
                  </div>
                </div>

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

                {/* Middle Split: Dados do Paciente (Left) + Histórico de Atendimentos (Right) */}
                <div className="grid grid-cols-12 gap-2">
                  
                  {/* Left Column (8 cols): Dados do Paciente e Processo */}
                  <div className="col-span-8 space-y-1.5">
                    
                    {/* Dados do Paciente Fieldset */}
                    <fieldset className="border border-[#999] p-2 bg-[#f4f1e8]">
                      <legend className="px-1 font-bold text-[#003366] text-[11px]">Dados do Paciente</legend>
                      
                      <div className="grid grid-cols-12 gap-1.5 text-[11px]">
                        <div className="col-span-2">
                          <label className="text-[10px] text-gray-600 block">RH</label>
                          <input 
                            type="text" 
                            value={rhNumber} 
                            onChange={(e) => setRhNumber(e.target.value)} 
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
                              onChange={(e) => setPacienteCodigo(e.target.value)} 
                              className="w-20 bg-white border border-[#7f9db9] px-1 py-0.5 font-mono font-bold"
                            />
                            {/* LOV Button from video 00:27 */}
                            <button
                              title="Buscar Paciente (F9)"
                              onClick={() => setModalOpen('lov_pacientes')}
                              className={`px-2 py-0.5 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] text-[#000080] font-bold cursor-pointer text-xs ${
                                trainingStep === 2 ? 'ring-2 ring-amber-500 bg-amber-200' : ''
                              }`}
                            >
                              ?
                            </button>
                            <input 
                              type="text" 
                              value={pacienteNome} 
                              readOnly 
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

                    {/* Sub-bloco Processo & Especialidade */}
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
                        <label className="text-[10px] text-gray-600 block">Caráter de Atendimento</label>
                        <input 
                          type="text" 
                          value={caraterAtend} 
                          readOnly 
                          className="w-full bg-[#f0ede4] border border-[#7f9db9] px-1 py-0.5"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="text-[10px] text-gray-600 block">Tipo de Atendimento</label>
                        <input 
                          type="text" 
                          value={tipoAtend} 
                          readOnly 
                          className="w-full bg-[#f0ede4] border border-[#7f9db9] px-1 py-0.5"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="text-[10px] text-gray-600 block">Tipo de Paciente</label>
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

                  {/* Right Column (4 cols): Histórico de Atendimentos Table */}
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
                          </tbody>
                        </table>
                      </div>

                      <div className="text-right text-[10px] text-gray-600 mt-1 font-mono">
                        Total: 0006
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
                        <div className="flex gap-1 text-[10px]">
                          <button 
                            onClick={() => setModalOpen('lov_filas')}
                            className={`px-1.5 py-0.2 bg-[#ece9d8] border border-[#999] text-blue-900 font-bold hover:bg-[#d4d0c8] cursor-pointer ${
                              trainingStep === 3 ? 'bg-amber-300 ring-2 ring-amber-500' : ''
                            }`}
                          >
                            + Inserir Fila
                          </button>
                        </div>
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
                            {filasAtendimento.map((f, idx) => (
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
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="pt-2 text-[10px] text-gray-600 flex items-center justify-between border-t border-[#ccc]">
                      <span>Fila Ativa: <strong>{filasAtendimento[selectedFilaIndex]?.etapa}</strong></span>
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

                      {/* Button [Solicitação] from video 01:38 - CRITICAL STEP */}
                      <button
                        onClick={() => {
                          setActiveScreen('solicitacao');
                          if (trainingStep === 4) setTrainingStep(5);
                        }}
                        className={`px-3 py-1 bg-gradient-to-b from-[#f9f9f9] to-[#d4d0c8] hover:from-white hover:to-[#c0bcb4] border-2 border-[#808080] font-bold text-xs text-[#003366] shadow cursor-pointer active:translate-y-px ${
                          trainingStep === 4 ? 'ring-2 ring-amber-500 bg-amber-200 animate-pulse' : ''
                        }`}
                      >
                        [ Solicitação ➔ ]
                      </button>
                    </div>

                    {/* Exames/Procedimentos Grid (Available to link) */}
                    <div>
                      <div className="text-[10px] text-gray-600 font-semibold mb-0.5 flex items-center justify-between">
                        <span>Exames / Medicamentos / Procedimentos / Serviços</span>
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
                            {solicitacaoProcedures.map((p) => {
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
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Button Vincular Selecionado à Fila */}
                    <div className="flex justify-center">
                      <button
                        onClick={handleVincularProcedimento}
                        className={`px-4 py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#777] text-xs font-bold text-blue-900 flex items-center gap-1.5 shadow-sm cursor-pointer ${
                          trainingStep === 6 ? 'ring-2 ring-amber-500 bg-amber-200 animate-pulse' : ''
                        }`}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                        <span>Vincular Procedimento à Fila: "{filasAtendimento[selectedFilaIndex]?.etapa}"</span>
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
                                  Nenhum procedimento vinculado ainda. Selecione acima e clique em Vincular.
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

                {/* ========================================================= */}
                {/* Bottom Actions Bar: Finalização, Impressão, Pulseira      */}
                {/* ========================================================= */}
                <div className="bg-[#e4e0d4] border border-[#999] p-2 flex flex-col md:flex-row items-center justify-between gap-2">
                  <div className="flex items-center gap-3 text-[11px]">
                    <div>
                      <span className="text-gray-600 block text-[9px]">Colaborador:</span>
                      <strong className="text-[#003366] font-mono">1095860 PAULA CARVALHO RIBEIRO</strong>
                    </div>
                    <span className="text-gray-400">|</span>
                    <button 
                      onClick={() => alert('Etiqueta teste impressa com sucesso.')}
                      className="px-2 py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] text-[10px]"
                    >
                      Etiqueta Teste
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button 
                      onClick={() => alert('Imprimindo etiquetas com código de barras para prontuário e tubos...')}
                      className={`px-2.5 py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] font-semibold text-[11px] cursor-pointer ${
                        trainingStep === 8 ? 'ring-2 ring-amber-500' : ''
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

                    {/* Finalizar Atendimento Button from video 03:18 */}
                    <button 
                      onClick={handleFinalizarAtendimento}
                      className={`px-4 py-1 bg-gradient-to-b from-[#d9534f] to-[#c9302c] hover:from-[#c9302c] hover:to-[#ac2925] text-white font-bold text-xs border border-[#761c19] shadow cursor-pointer ${
                        trainingStep === 8 ? 'ring-2 ring-yellow-400 animate-bounce' : ''
                      }`}
                    >
                      Finalizar Atendimento
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* ======================================================== */}
            {/* SCREEN 2: Solicitação do Atendimento (Video 01:38-02:20) */}
            {/* ======================================================== */}
            {activeScreen === 'solicitacao' && (
              <div className="border border-[#808080] bg-[#ece9d8] p-2 space-y-2 shadow-inner min-w-[940px]">
                
                {/* Form Title Banner */}
                <div className="bg-gradient-to-r from-[#003366] to-[#4682b4] text-white px-2 py-0.5 font-bold text-xs flex items-center justify-between">
                  <span>Solicitação do Atendimento - [Inclusão de Procedimentos e OCIs]</span>
                  <button 
                    onClick={() => setActiveScreen('recepcao')}
                    className="text-xs text-yellow-200 hover:underline font-bold"
                  >
                    [ ➔ Voltar para Recepção ]
                  </button>
                </div>

                {/* Top Patient Header */}
                <div className="bg-[#f4f1e8] border border-[#999] p-2 text-[11px] grid grid-cols-12 gap-2">
                  <div className="col-span-2">
                    <span className="text-[10px] text-gray-600 block">Código</span>
                    <strong className="font-mono text-blue-900">{pacienteCodigo}</strong>
                  </div>
                  <div className="col-span-6">
                    <span className="text-[10px] text-gray-600 block">Nome do Paciente</span>
                    <strong className="text-black">{pacienteNome}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-gray-600 block">Idade</span>
                    <span>{idadeAnos} anos</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-gray-600 block">Data Nasc.</span>
                    <span className="font-mono">{dataNascimento}</span>
                  </div>
                </div>

                {/* Solicitação Parameters Form */}
                <div className="grid grid-cols-12 gap-2">
                  
                  {/* Left Form: Solicitação Parameters */}
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
                            value={centroCustoCode} 
                            readOnly 
                            className="w-16 bg-[#f0ede4] border border-[#7f9db9] px-1 py-0.5 font-mono"
                          />
                          <input 
                            type="text" 
                            value={centroCustoName} 
                            readOnly 
                            className="flex-1 bg-[#f0ede4] border border-[#7f9db9] px-1 py-0.5"
                          />
                        </div>
                      </div>

                      {/* Convênio from video 01:42 - Always AGSUS or OCI */}
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
                          <button
                            onClick={() => setModalOpen('lov_convenio')}
                            className="px-1.5 py-0.5 bg-[#ece9d8] border border-[#999] text-[#000080] font-bold"
                          >
                            ?
                          </button>
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
                          onChange={(e) => setSolicitanteNome(e.target.value)} 
                          className="w-full bg-white border border-[#7f9db9] px-1 py-0.5"
                        />
                      </div>
                    </div>

                    {/* Facilitadores & CBO / CID */}
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
                        <span className="text-green-800 font-bold">5 Procedimentos OCI Ativos</span>
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

                  {/* Right Column: Solic. do Paciente & Action Buttons (From video 01:40) */}
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
                            <tr className="hover:bg-blue-50 text-gray-700">
                              <td className="py-0.5 px-1">30/07/2026</td>
                              <td className="py-0.5 px-1">20251225</td>
                            </tr>
                            <tr className="hover:bg-blue-50 text-gray-700">
                              <td className="py-0.5 px-1">30/07/2026</td>
                              <td className="py-0.5 px-1">20251168</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Operational Buttons (Video 01:54) */}
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
                      <button 
                        onClick={() => alert('Biometria confirmada.')}
                        className="w-full py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] text-[10px] font-semibold text-center"
                      >
                        Imprime Biometria
                      </button>

                      {/* CRITICAL BUTTON FROM VIDEO 01:54 - Kit Procedimento */}
                      <button 
                        onClick={() => setModalOpen('kit_procedimento')}
                        className={`w-full py-2 bg-gradient-to-b from-[#fffae6] to-[#ffd966] hover:from-[#fff] hover:to-[#ffc000] border-2 border-[#b38600] font-bold text-xs text-[#664d00] shadow cursor-pointer ${
                          trainingStep === 5 ? 'ring-2 ring-amber-500 animate-pulse' : ''
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
                      <button 
                        onClick={() => alert('Integração Shift sincronizada.')}
                        className="w-full py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] text-[10px] font-semibold text-center"
                      >
                        Integração Shift
                      </button>
                    </div>

                    {/* Bottom Save & Return buttons */}
                    <div className="pt-3 border-t border-[#ccc] flex gap-2">
                      <button
                        onClick={() => {
                          alert('Solicitação salva com sucesso!');
                          setActiveScreen('recepcao');
                          if (trainingStep === 5) setTrainingStep(6);
                        }}
                        className="flex-1 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-sm cursor-pointer"
                      >
                        Salvar e Voltar
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>
        </div>

        {/* Oracle Forms Classic Status Bar at the bottom */}
        <div className="bg-[#ece9d8] border-t-2 border-[#fff] px-2 py-0.5 flex items-center justify-between text-[10px] text-[#555] font-mono">
          <div className="flex items-center gap-4">
            <span className="border-r border-[#999] pr-3">Registro: 1/1</span>
            <span className="border-r border-[#999] pr-3">&lt;OSC&gt;</span>
            <span className="border-r border-[#999] pr-3 text-blue-900 font-bold">Modo Inserção</span>
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
          <div className="w-full max-w-2xl bg-[#d4d0c8] border-2 border-white shadow-2xl p-1 text-black font-sans text-xs">
            <div className="bg-[#0a246a] text-white px-2 py-1 font-bold text-xs flex items-center justify-between">
              <span>Pessoas / Selecionar [Lista de Valores]</span>
              <button onClick={() => setModalOpen(null)} className="text-white hover:text-red-300 font-mono font-bold">×</button>
            </div>

            <div className="p-3 bg-[#ece9d8] space-y-2">
              <div className="text-[11px] text-gray-700">
                Informe um valor para pesquisa ou utilize % para ver todos.
              </div>

              <div className="grid grid-cols-12 gap-2 bg-[#f4f1e8] p-2 border border-[#999]">
                <div className="col-span-6">
                  <label className="text-[10px] text-gray-600 block">Nome:</label>
                  <input 
                    type="text" 
                    value={lovSearchName} 
                    onChange={(e) => setLovSearchName(e.target.value)} 
                    placeholder="ex: MARIA ou TESTE%"
                    className="w-full bg-white border border-[#7f9db9] px-1 py-0.5"
                  />
                </div>
                <div className="col-span-3">
                  <label className="text-[10px] text-gray-600 block">Data Nasc.:</label>
                  <input type="text" placeholder="DD/MM/AAAA" className="w-full bg-white border border-[#7f9db9] px-1 py-0.5" />
                </div>
                <div className="col-span-3">
                  <label className="text-[10px] text-gray-600 block">CPF/CNPJ:</label>
                  <input type="text" placeholder="CPF..." className="w-full bg-white border border-[#7f9db9] px-1 py-0.5" />
                </div>
              </div>

              {/* Grid of Results from Video 00:34 */}
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
                      onClick={() => {
                        setPacienteCodigo('4531822');
                        setPacienteNome('MARIA TESTE BRUNINHO');
                        setDataNascimento('07/06/1990');
                        setIdadeAnos('36');
                        setCartaoSus('898.0012.4431.0019');
                        setModalOpen('alerta_paciente_atualizar');
                      }}
                      className="hover:bg-blue-100 cursor-pointer font-bold bg-blue-50 text-blue-900"
                    >
                      <td className="py-1 px-1.5 font-sans">MARIA TESTE BRUNINHO</td>
                      <td className="py-1 px-1.5">07/06/1990</td>
                      <td className="py-1 px-1.5">89800124431</td>
                    </tr>
                    <tr 
                      onClick={() => {
                        setPacienteCodigo('4531899');
                        setPacienteNome('TESTE 06 AGENDADO');
                        setDataNascimento('08/04/1975');
                        setIdadeAnos('51');
                        setModalOpen('alerta_sem_agenda');
                      }}
                      className="hover:bg-blue-100 cursor-pointer"
                    >
                      <td className="py-1 px-1.5 font-sans">TESTE 06 AGENDADO</td>
                      <td className="py-1 px-1.5">08/04/1975</td>
                      <td className="py-1 px-1.5">24119743031</td>
                    </tr>
                    <tr className="hover:bg-blue-100 cursor-pointer">
                      <td className="py-1 px-1.5 font-sans">TESTE PREVENCAO PALMAS</td>
                      <td className="py-1 px-1.5">16/09/1976</td>
                      <td className="py-1 px-1.5">00000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#ccc]">
                <button 
                  onClick={() => {
                    setModalOpen('alerta_paciente_atualizar');
                  }}
                  className="px-4 py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] font-bold text-xs"
                >
                  OK
                </button>
                <button 
                  onClick={() => setModalOpen(null)}
                  className="px-4 py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] text-xs"
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
              <button onClick={() => setModalOpen(null)} className="text-white hover:text-red-300 font-mono">×</button>
            </div>
            <div className="p-4 bg-[#ece9d8] space-y-3 text-center">
              <div className="bg-yellow-300 border border-yellow-600 p-2 font-bold text-red-900 text-sm">
                É necessário atualizar os dados do paciente!
              </div>
              <p className="text-xs text-gray-700">
                O cadastro do paciente possui pendências de conferência de endereço ou documentos.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button 
                  onClick={() => {
                    setModalOpen(null);
                    if (trainingStep === 2) setTrainingStep(3);
                  }}
                  className="px-6 py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] font-bold text-xs"
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
                    if (trainingStep === 2) setTrainingStep(3);
                  }}
                  className="px-4 py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] font-bold text-xs"
                >
                  Sim
                </button>
                <button 
                  onClick={() => setModalOpen(null)}
                  className="px-4 py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] text-xs"
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

              {/* Kits List from video 01:58 */}
              <div className="h-48 overflow-y-auto bg-white border border-[#7f9db9]">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#e4e0d4] text-[#333] border-b border-[#ccc] font-semibold sticky top-0">
                    <tr>
                      <th className="py-1 px-2">Kit Procedimento OCI</th>
                      <th className="py-1 px-2 text-right">Código</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr 
                      onClick={() => {
                        setModalOpen(null);
                        alert('Carregados 5 procedimentos do KIT OCI AVALIAÇÃO DIAGNOSTICA INICIAL DE CÂNCER DE MAMA!');
                        if (trainingStep === 5) setTrainingStep(6);
                      }}
                      className="hover:bg-blue-100 cursor-pointer bg-blue-50 font-bold text-blue-900"
                    >
                      <td className="py-1.5 px-2">
                        KIT OCI AVALIAÇÃO DIAGNOSTICA INICIAL DE CÂNCER DE MAMA
                      </td>
                      <td className="py-1.5 px-2 text-right font-mono">2001</td>
                    </tr>
                    <tr 
                      onClick={() => {
                        setModalOpen(null);
                        alert('Carregados procedimentos do KIT OCI INVESTIGAÇÃO DIAGNÓSTICA DE CÂNCER COLO DO ÚTERO!');
                      }}
                      className="hover:bg-blue-100 cursor-pointer text-gray-700"
                    >
                      <td className="py-1.5 px-2">
                        KIT OCI INVESTIGAÇÃO DIAGNÓSTICA DE CÂNCER COLO DO ÚTERO
                      </td>
                      <td className="py-1.5 px-2 text-right font-mono">2002</td>
                    </tr>
                    <tr className="hover:bg-blue-100 cursor-pointer text-gray-700">
                      <td className="py-1.5 px-2">KIT OCI CONSULTA GINECOLOGICA</td>
                      <td className="py-1.5 px-2 text-right font-mono">2003</td>
                    </tr>
                    <tr className="hover:bg-blue-100 cursor-pointer text-gray-700">
                      <td className="py-1.5 px-2">KIT OCI COLPOSCOPIA (3 PROCEDIMENTOS)</td>
                      <td className="py-1.5 px-2 text-right font-mono">2004</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#ccc]">
                <button 
                  onClick={() => {
                    setModalOpen(null);
                    if (trainingStep === 5) setTrainingStep(6);
                  }}
                  className="px-5 py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] font-bold text-xs"
                >
                  OK
                </button>
                <button 
                  onClick={() => setModalOpen(null)}
                  className="px-5 py-1 bg-[#ece9d8] hover:bg-[#d4d0c8] border border-[#999] text-xs"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: Anamnese Mamografia (Video 02:28-02:57)          */}
      {/* ======================================================== */}
      {modalOpen === 'anamnese_mamografia' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3">
          <div className="w-full max-w-2xl bg-[#d4d0c8] border-2 border-white shadow-2xl p-1 text-black font-sans text-xs">
            <div className="bg-[#0a246a] text-white px-2 py-1 font-bold text-xs flex items-center justify-between">
              <span>Prevenção do Atendimento - [Anamnese de Mamografia]</span>
              <span className="text-[10px] font-mono text-yellow-200">Kines: {centroCustoCode}</span>
            </div>

            <div className="p-3 bg-[#ece9d8] space-y-2 text-[11px]">
              
              {/* Question 1: Diagnóstica vs Rastreamento */}
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

              {/* Question 2: Fez Mamografia alguma vez? */}
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

              {/* Question 3 & 4: Cirurgia anterior e Risco Elevado */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-[#f4f1e8] border border-[#999] flex items-center justify-between">
                  <span className="font-bold text-[#003366]">3. Cirurgia anterior nas mamas?</span>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1"><input type="radio" name="cirurgia" defaultChecked={false} /> Sim</label>
                    <label className="flex items-center gap-1"><input type="radio" name="cirurgia" defaultChecked={true} /> Não</label>
                  </div>
                </div>

                <div className="p-2 bg-[#f4f1e8] border border-[#999] flex items-center justify-between">
                  <span className="font-bold text-[#003366]">4. Risco elevado de câncer de mama?</span>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1"><input type="radio" name="risco" defaultChecked={false} /> Sim</label>
                    <label className="flex items-center gap-1"><input type="radio" name="risco" defaultChecked={true} /> Não</label>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="p-2 bg-[#e4e0d4] border border-[#999] flex items-center justify-between">
                <div>
                  <span className="text-gray-600 text-[10px]">Classificação Clínica:</span>
                  <strong className={`ml-2 px-2 py-0.5 rounded text-xs ${
                    anamnese.sintomatica ? 'bg-red-200 text-red-900 border border-red-400' : 'bg-green-200 text-green-900 border border-green-400'
                  }`}>
                    {anamnese.sintomatica ? 'Sintomática' : 'Assintomática'}
                  </strong>
                </div>

                <button 
                  onClick={handleConfirmAnamnese}
                  className="px-5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-sm cursor-pointer shadow"
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
          <div className="w-full max-w-xl bg-[#d4d0c8] border-2 border-white shadow-2xl p-1 text-black font-sans text-xs">
            <div className="bg-[#0a246a] text-white px-2 py-1 font-bold text-xs flex items-center justify-between">
              <span>Pesquisa de Divulgação - [Hospital de Amor / Unidade Móvel]</span>
            </div>

            <div className="p-3 bg-[#ece9d8] space-y-2">
              <div className="font-bold text-[#003366] text-xs border-b border-[#ccc] pb-1">
                COMO VOCÊ FICOU SABENDO DOS EXAMES PREVENTIVOS DA CARRETA?
              </div>

              <div className="grid grid-cols-2 gap-2 bg-[#f4f1e8] p-3 border border-[#999] text-[11px]">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={divulgacao.carretaRua} 
                    onChange={(e) => setDivulgacao(prev => ({ ...prev, carretaRua: e.target.checked }))} 
                  />
                  <span>CARRETA NA SUA RUA/BAIRRO</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={divulgacao.acs} 
                    onChange={(e) => setDivulgacao(prev => ({ ...prev, acs: e.target.checked }))} 
                  />
                  <span>AGENTE COMUNITÁRIO DE SAÚDE (ACS)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" />
                  <span>VEICULAÇÃO DE RUA / TV</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" />
                  <span>CARTAZ / CONVITE</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" />
                  <span>FOLHETO / PANFLETO</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" />
                  <span>IGREJA</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" />
                  <span>PALESTRA NA COMUNIDADE / PSF</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" />
                  <span>RÁDIO</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" />
                  <span>AMIGO / VIZINHO</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" />
                  <span>REDES SOCIAIS</span>
                </label>
              </div>

              <div className="flex justify-end pt-2 border-t border-[#ccc]">
                <button 
                  onClick={handleConfirmPesquisa}
                  className="px-6 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-sm cursor-pointer shadow"
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
                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
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
                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
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
