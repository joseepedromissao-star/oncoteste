import React, { useState } from 'react';
import { 
  Patient, 
  PatientStage, 
  PathwayType, 
  FlowNode, 
  AutomationRule 
} from './types';
import { 
  INITIAL_FLOW_NODES, 
  INITIAL_AUTOMATIONS, 
  INITIAL_PATIENTS 
} from './data/mockData';
import { TopNav, AppNavTab } from './components/TopNav';
import { SisOncoOracleForms } from './components/SisOncoOracleForms';
import { FlowchartView } from './components/FlowchartView';
import { ReceptionSimulator } from './components/ReceptionSimulator';
import { CrmPipelineView } from './components/CrmPipelineView';
import { SisconcoManager } from './components/SisconcoManager';
import { AutomationsCenter } from './components/AutomationsCenter';
import { PatientDetailModal } from './components/PatientDetailModal';
import { NewPatientModal } from './components/NewPatientModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppNavTab>('sis_onco');
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [activePatient, setActivePatient] = useState<Patient>(INITIAL_PATIENTS[0]);
  const [detailPatient, setDetailPatient] = useState<Patient | null>(null);
  const [automations, setAutomations] = useState<AutomationRule[]>(INITIAL_AUTOMATIONS);
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);

  // Critical alerts count for badge in TopNav
  const activeAlertsCount = patients.filter(
    p => p.biradsResult && ['0', '4', '5'].includes(p.biradsResult) && !p.biradsComplementScheduled
  ).length;

  // Move patient stage in CRM
  const handleMovePatientStage = (patientId: string, newStage: PatientStage) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const stageNames: Record<PatientStage, string> = {
          recepcao: 'Recepção Unidade Móvel',
          exames: 'Exames em Andamento',
          triagem_laudo: 'Triagem de Laudos SISCONCO',
          complementacao_urgente: 'Investigação Complementar',
          consulta_medica: 'Médico-Consulta / Teleconsulta',
          fechamento_oci: 'Fechamento de OCI'
        };

        const updated: Patient = {
          ...p,
          stage: newStage,
          timeline: [
            {
              id: `ev_move_${Date.now()}`,
              timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              title: `Avanço de Etapa: ${stageNames[newStage]}`,
              description: `Jornada da paciente avançada para a esteira "${stageNames[newStage]}" com sucesso.`,
              author: 'Operador CRM',
              category: 'automacao',
              highlight: true
            },
            ...p.timeline
          ]
        };

        if (activePatient.id === patientId) {
          setActivePatient(updated);
        }
        if (detailPatient && detailPatient.id === patientId) {
          setDetailPatient(updated);
        }
        return updated;
      }
      return p;
    }));
  };

  // Update existing patient data
  const handleUpdatePatient = (updated: Patient) => {
    setPatients(prev => prev.map(p => p.id === updated.id ? updated : p));
    if (activePatient.id === updated.id) {
      setActivePatient(updated);
    }
    if (detailPatient && detailPatient.id === updated.id) {
      setDetailPatient(updated);
    }
  };

  // Switch to Reception Simulator with specific scenario
  const handleOpenReceptionWithScenario = (scenarioType: PathwayType) => {
    const matchingPatient = patients.find(p => p.pathway === scenarioType) || patients[0];
    setActivePatient(matchingPatient);
    setActiveTab('reception');
  };

  // Toggle automation rule
  const handleToggleAutomation = (ruleId: string) => {
    setAutomations(prev => prev.map(r => r.id === ruleId ? { ...r, active: !r.active } : r));
  };

  // Trigger test execution of an automation
  const handleTriggerTestAutomation = (ruleId: string) => {
    setAutomations(prev => prev.map(r => {
      if (r.id === ruleId) {
        return {
          ...r,
          timesTriggered: r.timesTriggered + 1,
          lastTriggered: 'Agora mesmo'
        };
      }
      return r;
    }));
  };

  // Add new patient or preset
  const handleAddPatient = (newPatient: Patient) => {
    setPatients(prev => [newPatient, ...prev]);
    setActivePatient(newPatient);
    setActiveTab('sis_onco');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-500/30 selection:text-rose-200">
      {/* 3-Zone Clean Header */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewPatientModal={() => setIsNewPatientModalOpen(true)}
        activeAlertsCount={activeAlertsCount}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6">
        {/* SIS-ONCO ORACLE FORMS EXACT SIMULATOR FROM VIDEO */}
        {activeTab === 'sis_onco' && (
          <SisOncoOracleForms
            onSyncWithCrm={(updatedPatient) => {
              handleUpdatePatient(updatedPatient);
            }}
          />
        )}

        {activeTab === 'flowchart' && (
          <FlowchartView
            nodes={INITIAL_FLOW_NODES}
            onSelectNodeForSimulation={(node) => handleOpenReceptionWithScenario(node.category)}
            onOpenReceptionWithScenario={handleOpenReceptionWithScenario}
          />
        )}

        {activeTab === 'reception' && (
          <ReceptionSimulator
            patients={patients}
            activePatient={activePatient}
            onSelectPatient={setActivePatient}
            onUpdatePatient={handleUpdatePatient}
            onNavigateToCrm={() => setActiveTab('crm')}
            onNavigateToSisconco={() => setActiveTab('sisconco')}
          />
        )}

        {activeTab === 'crm' && (
          <CrmPipelineView
            patients={patients}
            onSelectPatient={setActivePatient}
            onMovePatientStage={handleMovePatientStage}
            onOpenPatientDetail={(patient) => setDetailPatient(patient)}
          />
        )}

        {activeTab === 'sisconco' && (
          <SisconcoManager
            patients={patients}
            onOpenPatientDetail={(patient) => setDetailPatient(patient)}
            onUpdatePatient={handleUpdatePatient}
          />
        )}

        {activeTab === 'automations' && (
          <AutomationsCenter
            automations={automations}
            onToggleAutomation={handleToggleAutomation}
            onTriggerTestAutomation={handleTriggerTestAutomation}
          />
        )}
      </main>

      {/* Patient Detail Modal */}
      {detailPatient && (
        <PatientDetailModal
          patient={detailPatient}
          onClose={() => setDetailPatient(null)}
          onUpdatePatient={handleUpdatePatient}
        />
      )}

      {/* New Patient / Scenario Preset Modal */}
      {isNewPatientModalOpen && (
        <NewPatientModal
          onClose={() => setIsNewPatientModalOpen(false)}
          onAddPatient={handleAddPatient}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 py-3.5 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>OncoFluxo & CRM · SIS-ONCO Treinamento Oficial das Unidades Móveis (Hospital de Amor)</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Oracle Forms Services v12c</span>
            <span>·</span>
            <span>POP-RECEP-01 / SISCONCO</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
