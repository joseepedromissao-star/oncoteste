export type PathwayType = 'mama' | 'colo' | 'multi_oci' | 'birads_critico' | 'geral';

export type BiradsCategory = '0' | '1' | '2' | '3' | '4' | '5' | '6';

export type PatientStage = 
  | 'recepcao' 
  | 'exames' 
  | 'triagem_laudo' 
  | 'complementacao_urgente' 
  | 'consulta_medica' 
  | 'fechamento_oci';

export interface ExamProcedure {
  id: string;
  code: string;
  name: string;
  type: 'exame' | 'consulta' | 'oci';
  date?: string;
  status: 'pendente' | 'efetivado' | 'cancelado';
  convenio: string; // e.g. "OCI", "SUS"
  filaDestino?: 'mamografia' | 'medico_consulta' | 'recepcao';
}

export interface Patient {
  id: string;
  susCard: string;
  name: string;
  motherName: string;
  birthDate: string;
  age: number;
  gender: 'Feminino' | 'Masculino';
  phone: string;
  cidade: string;
  unidadeMovel: string; // e.g. "UNIDADE MÓVEL 21 - SUS"
  rtResponsavel: string; // Responsável Técnico
  cbo: string; // e.g. "225250 - MÉDICO GINECOLOGISTA E OBSTETRA"
  cid: string; // e.g. "N64 - Outr Doenc da Mama"
  pathway: PathwayType;
  stage: PatientStage;
  
  // Specific indicators
  hasDoubleOci: boolean;
  isColposcopyBundle: boolean;
  biradsResult?: BiradsCategory;
  biradsComplementNeeded?: boolean;
  biradsComplementScheduled?: boolean;
  biradsComplementFreeQuota?: boolean; // Does NOT consume OCI quota
  
  // Procedures & OCIs
  procedimentos: ExamProcedure[];
  
  // CRM Communication & Journey
  messages: PatientMessage[];
  timeline: JourneyEvent[];
  slaHoursRemaining?: number;
  alerts: string[];
}

export interface PatientMessage {
  id: string;
  timestamp: string;
  type: 'whatsapp' | 'sms' | 'ligacao';
  direction: 'outbound' | 'inbound';
  sender: string;
  text: string;
  status: 'enviado' | 'entregue' | 'lido' | 'respondido';
}

export interface JourneyEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  author: string;
  category: 'recepcao' | 'laudo' | 'automacao' | 'clinico' | 'contato';
  highlight?: boolean;
}

export interface FlowNode {
  id: string;
  title: string;
  subtitle: string;
  category: PathwayType;
  stepNumber?: number;
  description: string;
  operationalRule: string;
  checklist: string[];
  systemDestination: string; // e.g., "Fila 'mamografia'", "Fila 'médico-consulta'"
  highlightRule?: string;
  iconName: string;
  crmAction?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  active: boolean;
  targetCategory: PathwayType;
  timesTriggered: number;
  lastTriggered?: string;
}
