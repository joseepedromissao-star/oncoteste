import { Patient, FlowNode, AutomationRule, ExamProcedure } from '../types';

export const INITIAL_FLOW_NODES: FlowNode[] = [
  {
    id: 'regra_geral',
    title: '1. Regra Geral de Entrada na Recepção',
    subtitle: 'Recepção / Porta de Entrada Ambulatorial & Unidade Móvel',
    category: 'geral',
    stepNumber: 1,
    description: 'A OCI (Oferta de Cuidados Integrados) deve ser impreterivelmente o primeiro procedimento a ser efetivado no sistema!',
    operationalRule: 'A OCI deve ser o primeiro procedimento efetivado! Não avance outros procedimentos sem efetivar a OCI.',
    checklist: [
      '1. Colocar a data exata em que o exame foi realizado',
      '2. Inserir o nome do Responsável Técnico (RT) da unidade móvel',
      '3. Trocar o CBO obrigatoriamente para "Ginecologista" (CBO 225250)',
      '4. Inserir o código CID-10 correspondente (ex: N64 - Outras doenças da mama)'
    ],
    systemDestination: 'Módulo de Efetivação / Solicitação Selecionada',
    highlightRule: 'A OCI DEVE SER O PRIMEIRO PROCEDIMENTO EFETIVADO!',
    iconName: 'ShieldAlert',
    crmAction: 'Gera registro de entrada no CRM, valida conformidade de campos obrigatórios e inicia SLA de rastreabilidade.'
  },
  {
    id: 'mama_exame',
    title: '2. Mama: Dia do Exame',
    subtitle: 'Porta de Entrada da Linha de Cuidado de Mama',
    category: 'mama',
    stepNumber: 2,
    description: 'No dia da realização do exame de imagem na carreta ou unidade fixa, vincular adequadamente à esteira técnica.',
    operationalRule: 'Vincular a mamografia e/ou ultrassonografia das mamas na etapa do processo "mamografia".',
    checklist: [
      'Identificar pedido de Mamografia bilateral ou USG mamária',
      'Encaminhar para a Fila de Atendimento "MAMOGRAFIA"',
      'Registrar Centro de Custo da Carreta (ex: UNIDADE MOVEL 21 - SUS)',
      'Confirmar que OCI vinculada está com status inicial liberado'
    ],
    systemDestination: 'Etapa do Processo: "MAMOGRAFIA"',
    highlightRule: 'Vincular exame estritamente na etapa do processo "mamografia"',
    iconName: 'Activity',
    crmAction: 'Move paciente para "Exames em Andamento" e dispara instruções pré-exame por WhatsApp.'
  },
  {
    id: 'mama_consulta',
    title: '3. Mama: Dia da Consulta ou Teleconsulta',
    subtitle: 'Avaliação Clínica / Especializada',
    category: 'mama',
    stepNumber: 3,
    description: 'No dia agendado para o atendimento médico, vincular a consulta ou teleconsulta especializada.',
    operationalRule: 'No dia da consulta, vincular a consulta ou teleconsulta na etapa do processo "médico-consulta".',
    checklist: [
      'Verificar disponibilidade dos laudos prévios',
      'Vincular na Fila de Atendimento "MÉDICO - CONSULTA"',
      'Conferir se o especialista está com CBO correto',
      'Garantir prontuário unificado aberto para evolução médica'
    ],
    systemDestination: 'Etapa do Processo: "MÉDICO - CONSULTA"',
    highlightRule: 'Vincular na etapa do processo "médico-consulta"',
    iconName: 'Stethoscope',
    crmAction: 'Notifica médico sobre chegada da paciente e envia link de acesso para teleconsulta ou senha do consultório.'
  },
  {
    id: 'duas_ocis',
    title: '4. Paciente com Duas OCIs (Unificação)',
    subtitle: 'Gestão Inteligente de Múltiplas Linhas de Cuidado',
    category: 'multi_oci',
    stepNumber: 4,
    description: 'Quando a paciente possui duas solicitações OCI abertas simultaneamente (ex: duas consultas especializadas).',
    operationalRule: 'Vincular as duas consultas às respectivas solicitações simultaneamente na etapa médico-consulta.',
    checklist: [
      'Localizar as duas solicitações OCI no histórico da paciente',
      'Vincular ambas à fila de atendimento "MÉDICO - CONSULTA"',
      'Garantir evolução clínica unificada pelo médico responsável',
      'Validar fechamento simultâneo das duas OCIs pelo faturamento'
    ],
    systemDestination: 'Fila "MÉDICO - CONSULTA" (Solicitações Vinculadas Simultâneas)',
    highlightRule: 'Vantagens: Uma única evolução · Efetivação simultânea · Fechamento das duas OCIs',
    iconName: 'CopyCheck',
    crmAction: 'Unifica as jornadas no CRM, evitando duplicidade de contatos e sincronizando o encerramento das guias no SUS.'
  },
  {
    id: 'colo_utero',
    title: '5. Investigação de Câncer de Colo do Útero',
    subtitle: 'Protocolo de Colposcopia / Rastreio Ginecológico',
    category: 'colo',
    stepNumber: 5,
    description: 'Fluxo para realização de colposcopia diagnóstica e controle em caso de alterações citopatológicas.',
    operationalRule: 'Para colposcopia, vincular OBRIGATORIAMENTE os 3 procedimentos na etapa "médico-consulta".',
    checklist: [
      'Procedimento 1: COLPOSCOPIA (DIAGNÓSTICO / CONTROLE)',
      'Procedimento 2: CONSULTA EM ONCOLOGIA',
      'Procedimento 3: OCI INVESTIGAÇÃO DIAGNÓSTICA DE CÂNCER COLO DO ÚTERO',
      'Garantir todos os 3 vinculados na mesma fila de "MÉDICO - CONSULTA"'
    ],
    systemDestination: 'Etapa do Processo: "MÉDICO - CONSULTA" (Combo de 3 Procedimentos)',
    highlightRule: 'Vincular os 3 procedimentos juntos na etapa "médico-consulta"!',
    iconName: 'Microscope',
    crmAction: 'Cria pacote unificado de investigação no CRM com checklist de biópsia e rastreio de anatomopatológico.'
  },
  {
    id: 'birads_critico',
    title: '6. Ponto de Atenção Operacional: BI-RADS 0, 4 ou 5',
    subtitle: 'Triagem Crítica SISCONCO & Busca Ativa pela Unidade Móvel',
    category: 'birads_critico',
    stepNumber: 6,
    description: 'Laudo de mamografia traz classificação BIRADS 0 (inconclusivo), 4 (suspeito) ou 5 (altamente suspeito de malignidade).',
    operationalRule: 'Obrigatório complementar a investigação! A ultrassonografia de complemento é agendada pela equipe da própria carreta, NÃO conta na cota de OCIs e exige busca ativa imediata.',
    checklist: [
      'Monitorar Painel Gerencial de Exames no SISCONCO diariamente',
      'Identificar laudos BI-RADS 0, 4 ou 5',
      'Agendar ultrassonografia mamária de complemento pela equipe da carreta',
      'NÃO contabilizar na cota de OCIs ofertadas (cota isenta/protegida)',
      'Responsabilidade obrigatória da equipe: telefonar/contatar a paciente'
    ],
    systemDestination: 'Painel SISCONCO & CRM - Fila de Investigação Complementar Prioritária',
    highlightRule: 'NÃO é contabilizada na quantidade de OCIs ofertadas! Agendamento pela equipe da carreta.',
    iconName: 'AlertTriangle',
    crmAction: 'Dispara alerta crítico para assistente social e enfermagem da carreta, abre chamado com SLA 48h e envia mensagem humanizada de apoio.'
  }
];

export const INITIAL_AUTOMATIONS: AutomationRule[] = [
  {
    id: 'auto_birads',
    name: 'Alerta Crítico BI-RADS 0, 4 ou 5 (Busca Ativa Carreta)',
    trigger: 'Laudo mamografia classificado como BIRADS 0, 4 ou 5 no SISCONCO',
    condition: 'Resultado em [0, 4, 5]',
    action: 'Cria tarefa prioritária de contato para a equipe da carreta, agenda USG complementar (sem debitar cota OCI) e envia acolhimento via WhatsApp.',
    active: true,
    targetCategory: 'birads_critico',
    timesTriggered: 18,
    lastTriggered: 'Há 12 minutos'
  },
  {
    id: 'auto_multi_oci',
    name: 'Unificação Automática de Dupla OCI',
    trigger: 'Detecção de 2 solicitações de OCI ativas para a mesma paciente',
    condition: 'Quantidade de OCIs ativas == 2',
    action: 'Vincula ambas as solicitações à etapa "médico-consulta", prepara template de evolução única e programa fechamento simultâneo.',
    active: true,
    targetCategory: 'multi_oci',
    timesTriggered: 14,
    lastTriggered: 'Há 45 minutos'
  },
  {
    id: 'auto_colpo_bundle',
    name: 'Agrupador de Colposcopia (3 Procedimentos)',
    trigger: 'Recepção de procedimento de Colposcopia',
    condition: 'Procedimento == Colposcopia Diagnóstico/Controle',
    action: 'Adiciona automaticamente Consulta Oncológica e OCI Colo do Útero na fila "médico-consulta" para evitar glosas SUS.',
    active: true,
    targetCategory: 'colo',
    timesTriggered: 9,
    lastTriggered: 'Há 2 horas'
  },
  {
    id: 'auto_cbo_guard',
    name: 'Guardião de Regra de Recepção (OCI & CBO Ginecologia)',
    trigger: 'Efetivação de procedimento na recepção',
    condition: 'OCI não é o 1º procedimento OU CBO != Ginecologista (225250)',
    action: 'Bloqueia envio com alerta sonoro/visual, sugere correção automática de CBO para 225250 e prioriza a OCI no topo.',
    active: true,
    targetCategory: 'geral',
    timesTriggered: 32,
    lastTriggered: 'Há 4 minutos'
  },
  {
    id: 'auto_patient_journey',
    name: 'Régua de Acolhimento e Lembrete Omnichannel',
    trigger: 'Mudança de etapa da paciente no CRM',
    condition: 'Paciente cadastrada com número de celular válido',
    action: 'Envia lembrete 48h antes do exame, orientação de não usar desodorante/talco no dia da mamografia e aviso de laudo pronto.',
    active: true,
    targetCategory: 'mama',
    timesTriggered: 112,
    lastTriggered: 'Há 5 minutos'
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: '4531822',
    susCard: '898.0012.4431.0019',
    name: 'MARIA TESTE BRUNINHO',
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
      'ATENÇÃO: Laudo BI-RADS 4 suspeito detectado!',
      'Obrigatório contato ativo pela equipe da Unidade Móvel 21',
      'Agendamento de USG de complemento NÃO desconta cota OCI'
    ],
    procedimentos: [
      {
        id: 'proc_1',
        code: '4291057',
        name: 'OCI AVALIAÇÃO DIAGNOSTICA INICIAL DE CANCER DE MAMA',
        type: 'oci',
        status: 'efetivado',
        convenio: 'OCI',
        date: '2026-07-31',
        filaDestino: 'mamografia'
      },
      {
        id: 'proc_2',
        code: '0204030188',
        name: 'MAMOGRAFIA BILATERAL PARA RASTREAMENTO',
        type: 'exame',
        status: 'pendente',
        convenio: 'SUS',
        date: '2026-07-31',
        filaDestino: 'mamografia'
      },
      {
        id: 'proc_3',
        code: '0205020097',
        name: 'ECOGRAFIA DE ESTR. SUPER. MAMAS (USG)',
        type: 'exame',
        status: 'pendente',
        convenio: 'SUS',
        date: '2026-07-31',
        filaDestino: 'mamografia'
      }
    ],
    messages: [
      {
        id: 'msg_1',
        timestamp: 'Ontem às 14:20',
        type: 'whatsapp',
        direction: 'outbound',
        sender: 'Carreta de Prevenção - Hospital de Amor',
        text: 'Olá Sra. Maria! Confirmamos seu agendamento de Mamografia na Unidade Móvel 21 em Barretos para 31/07. Por favor, leve seu Cartão SUS e documento com foto.',
        status: 'respondido'
      },
      {
        id: 'msg_2',
        timestamp: 'Ontem às 14:35',
        type: 'whatsapp',
        direction: 'inbound',
        sender: 'Maria Teste Bruninho',
        text: 'Obrigada! Estarei aí às 8h com certeza. Preciso de algum preparo especial?',
        status: 'lido'
      },
      {
        id: 'msg_3',
        timestamp: 'Ontem às 14:38',
        type: 'whatsapp',
        direction: 'outbound',
        sender: 'Carreta de Prevenção - Hospital de Amor',
        text: 'Recomendamos vir com blusa de botões ou saia/calça com blusa confortável e não aplicar desodorante, talco ou cremes na região axilar ou nas mamas.',
        status: 'lido'
      }
    ],
    timeline: [
      {
        id: 'tl_1',
        timestamp: '31/07/2026 08:15',
        title: 'Entrada na Recepção da Carreta',
        description: 'Recepção realizada. Regra de ouro aplicada: OCI efetivada como 1º procedimento com sucesso.',
        author: 'Paula Carvalho Ribeiro (Recepção)',
        category: 'recepcao'
      },
      {
        id: 'tl_2',
        timestamp: '31/07/2026 08:30',
        title: 'Verificação de RT e CBO',
        description: 'CBO ajustado para 225250 (Ginecologista) e RT Dra. Priscila Catelan validada.',
        author: 'Sistema OncoFluxo',
        category: 'automacao'
      },
      {
        id: 'tl_3',
        timestamp: '31/07/2026 14:49',
        title: 'Alerta Operacional BIRADS 4',
        description: 'Laudo importado do SISCONCO: BIRADS 4. Acionado protocolo de investigação obrigatória pela equipe da carreta.',
        author: 'Robô SISCONCO Integrado',
        category: 'laudo',
        highlight: true
      }
    ]
  },
  {
    id: '4535109',
    susCard: '741.9022.1154.0042',
    name: 'TEREZA DE JESUS ALBUQUERQUE',
    motherName: 'BENEDITA ALBUQUERQUE',
    birthDate: '1978-11-22',
    age: 47,
    gender: 'Feminino',
    phone: '(17) 98114-9902',
    cidade: 'Colina / SP',
    unidadeMovel: 'UNIDADE MÓVEL 21 - SUS',
    rtResponsavel: 'DRA. PRISCILA CATELAN SOUTO',
    cbo: '225250 - MÉDICO GINECOLOGISTA E OBSTETRA',
    cid: 'N64 - Outr Doenc da Mama / Rasto Ginecológico',
    pathway: 'multi_oci',
    stage: 'consulta_medica',
    hasDoubleOci: true,
    isColposcopyBundle: false,
    alerts: [
      'Paciente com 2 OCIs ativas: Realizada vinculação simultânea na etapa médico-consulta',
      'Evolução clínica unificada gerada com fechamento conjunto'
    ],
    procedimentos: [
      {
        id: 'proc_10',
        code: '45351063',
        name: 'CONSULTA EM ONCOLOGIA (OCI MAMA)',
        type: 'oci',
        status: 'efetivado',
        convenio: 'OCI',
        date: '2026-07-31',
        filaDestino: 'medico_consulta'
      },
      {
        id: 'proc_11',
        code: '45351212',
        name: 'CONSULTA EM ONCOLOGIA (OCI GINECOLOGIA)',
        type: 'oci',
        status: 'efetivado',
        convenio: 'OCI',
        date: '2026-07-31',
        filaDestino: 'medico_consulta'
      }
    ],
    messages: [
      {
        id: 'msg_20',
        timestamp: 'Hoje às 09:10',
        type: 'whatsapp',
        direction: 'outbound',
        sender: 'Central de Consultas Especializadas',
        text: 'Sra. Tereza, suas duas consultas foram agendadas juntas para hoje no ambulatório móvel. Um único médico fará a avaliação integral.',
        status: 'entregue'
      }
    ],
    timeline: [
      {
        id: 'tl_20',
        timestamp: '31/07/2026 09:00',
        title: 'Recepção: 2 OCIs Vinculadas',
        description: 'Vantagem operacional: Vinculadas as duas consultas à fila médico-consulta. Gerada 1 única evolução e fechamento duplo das OCIs.',
        author: 'Paula Carvalho Ribeiro',
        category: 'recepcao',
        highlight: true
      }
    ]
  },
  {
    id: '4536212',
    susCard: '883.3321.9011.0033',
    name: 'CLAUDIA REGINA MENDONÇA',
    motherName: 'HELENA MENDONÇA',
    birthDate: '1985-03-14',
    age: 41,
    gender: 'Feminino',
    phone: '(17) 99120-7764',
    cidade: 'Guaíra / SP',
    unidadeMovel: 'UNIDADE MÓVEL 21 - SUS',
    rtResponsavel: 'DRA. PRISCILA CATELAN SOUTO',
    cbo: '225250 - MÉDICO GINECOLOGISTA E OBSTETRA',
    cid: 'N87 - Displasia cervical uterina',
    pathway: 'colo',
    stage: 'consulta_medica',
    hasDoubleOci: false,
    isColposcopyBundle: true,
    alerts: [
      'Protocolo Colo do Útero: Os 3 procedimentos vinculados juntos na etapa médico-consulta!'
    ],
    procedimentos: [
      {
        id: 'p_c1',
        code: '45362128',
        name: 'COLPOSCOPIA (DIAGNÓSTICO / CONTROLE)',
        type: 'exame',
        status: 'efetivado',
        convenio: 'SUS',
        date: '2026-07-31',
        filaDestino: 'medico_consulta'
      },
      {
        id: 'p_c2',
        code: '45352129',
        name: 'CONSULTA EM ONCOLOGIA',
        type: 'consulta',
        status: 'efetivado',
        convenio: 'OCI',
        date: '2026-07-31',
        filaDestino: 'medico_consulta'
      },
      {
        id: 'p_c3',
        code: '45362130',
        name: 'OCI INVESTIGAÇÃO DIAGNÓSTICA DE CÂNCER COLO DO ÚTERO',
        type: 'oci',
        status: 'efetivado',
        convenio: 'OCI',
        date: '2026-07-31',
        filaDestino: 'medico_consulta'
      }
    ],
    messages: [
      {
        id: 'm_c1',
        timestamp: 'Hoje às 10:15',
        type: 'whatsapp',
        direction: 'outbound',
        sender: 'Carreta de Prevenção',
        text: 'Dona Claudia, seu procedimento de colposcopia e consulta já estão organizados com nossa equipe médica para hoje.',
        status: 'lido'
      }
    ],
    timeline: [
      {
        id: 'tl_c1',
        timestamp: '31/07/2026 10:00',
        title: 'Agrupamento dos 3 Procedimentos de Colo',
        description: 'Colposcopia + Consulta Oncológica + OCI vinculados simultaneamente na fila médico-consulta conforme regra geral.',
        author: 'Recepção Unidade Móvel',
        category: 'recepcao',
        highlight: true
      }
    ]
  },
  {
    id: '4537890',
    susCard: '901.4452.1287.0091',
    name: 'IVETE SANTOS FERREIRA',
    motherName: 'CLEUSA SANTOS',
    birthDate: '1972-08-19',
    age: 53,
    gender: 'Feminino',
    phone: '(17) 99655-1234',
    cidade: 'Bebedouro / SP',
    unidadeMovel: 'UNIDADE MÓVEL 21 - SUS',
    rtResponsavel: 'DRA. PRISCILA CATELAN SOUTO',
    cbo: '225250 - MÉDICO GINECOLOGISTA E OBSTETRA',
    cid: 'N64 - Outr Doenc da Mama',
    pathway: 'birads_critico',
    stage: 'complementacao_urgente',
    hasDoubleOci: false,
    isColposcopyBundle: false,
    biradsResult: '5',
    biradsComplementNeeded: true,
    biradsComplementScheduled: true,
    biradsComplementFreeQuota: true,
    slaHoursRemaining: 18,
    alerts: [
      'ALERTA CRÍTICO: Laudo BIRADS 5 (Altamente suspeito)',
      'USG Mamária de complemento agendada para amanhã pela equipe da carreta',
      'NÃO descontado da cota de OCIs ofertadas'
    ],
    procedimentos: [
      {
        id: 'p_iv1',
        code: '4291057',
        name: 'OCI AVALIAÇÃO DIAGNOSTICA INICIAL DE CANCER DE MAMA',
        type: 'oci',
        status: 'efetivado',
        convenio: 'OCI',
        date: '2026-07-30',
        filaDestino: 'mamografia'
      },
      {
        id: 'p_iv2',
        code: '0204030188',
        name: 'MAMOGRAFIA DIGITAL BILATERAL',
        type: 'exame',
        status: 'efetivado',
        convenio: 'SUS',
        date: '2026-07-30',
        filaDestino: 'mamografia'
      },
      {
        id: 'p_iv3',
        code: 'COMP_USG_01',
        name: 'ULTRASSONOGRAFIA MAMÁRIA COMPLEMENTAR (EQUIPE DA CARRETA)',
        type: 'exame',
        status: 'pendente',
        convenio: 'COTA ISENTA (NÃO DEBITA OCI)',
        date: '2026-08-01',
        filaDestino: 'mamografia'
      }
    ],
    messages: [
      {
        id: 'm_iv1',
        timestamp: 'Hoje às 11:30',
        type: 'ligacao',
        direction: 'outbound',
        sender: 'Enf. Juliana (Equipe da Carreta)',
        text: 'Contato telefônico realizado com a paciente Ivete. Explicada a necessidade de ultrassom complementar sem custos. Paciente acolhida e confirmada para amanhã às 09:30.',
        status: 'respondido'
      }
    ],
    timeline: [
      {
        id: 'tl_iv1',
        timestamp: '30/07/2026 15:00',
        title: 'Mamografia Realizada na Carreta',
        description: 'Exame executado com RT e CBO devidamente checados.',
        author: 'Técnica de Radiologia',
        category: 'recepcao'
      },
      {
        id: 'tl_iv2',
        timestamp: '31/07/2026 08:00',
        title: 'Laudo SISCONCO: BIRADS 5 Detectado',
        description: 'Disparada automação imediata de atenção redobrada.',
        author: 'SISCONCO Sync',
        category: 'laudo',
        highlight: true
      },
      {
        id: 'tl_iv3',
        timestamp: '31/07/2026 11:30',
        title: 'Busca Ativa e Agendamento Complementar',
        description: 'Equipe da carreta realizou contato direto com a Sra. Ivete. USG agendada na cota protegida (sem debitar OCI).',
        author: 'Enf. Juliana',
        category: 'contato',
        highlight: true
      }
    ]
  }
];

export const AVAILABLE_PROCEDURES: ExamProcedure[] = [
  { id: 'p_oci_mama', code: '4291057', name: 'OCI AVALIAÇÃO DIAGNOSTICA INICIAL DE CANCER DE MAMA', type: 'oci', convenio: 'OCI', status: 'pendente' },
  { id: 'p_mamografia', code: '0204030188', name: 'MAMOGRAFIA DIGITAL BILATERAL', type: 'exame', convenio: 'SUS', status: 'pendente' },
  { id: 'p_usg_mama', code: '0205020097', name: 'ECOGRAFIA DE ESTR. SUPER. MAMAS (USG)', type: 'exame', convenio: 'SUS', status: 'pendente' },
  { id: 'p_consulta_onco', code: '45351063', name: 'CONSULTA EM ONCOLOGIA', type: 'consulta', convenio: 'OCI', status: 'pendente' },
  { id: 'p_teleconsulta', code: '45361084', name: 'TELECONSULTA MEDICA NA ATENÇÃO ESPECIALIZADA', type: 'consulta', convenio: 'OCI', status: 'pendente' },
  { id: 'p_colposcopia', code: '45362128', name: 'COLPOSCOPIA (DIAGNÓSTICO / CONTROLE)', type: 'exame', convenio: 'SUS', status: 'pendente' },
  { id: 'p_oci_colo', code: '45362130', name: 'OCI INVESTIGAÇÃO DIAGNÓSTICA DE CÂNCER COLO DO ÚTERO', type: 'oci', convenio: 'OCI', status: 'pendente' }
];
