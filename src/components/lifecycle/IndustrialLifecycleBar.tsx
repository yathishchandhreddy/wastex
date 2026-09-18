import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { WasteLifecycleStep } from '@/src/types';

export type LifecycleStepProp =
  | WasteLifecycleStep
  | 'Identify'
  | 'Analyze'
  | 'Valorize'
  | 'Match'
  | 'Exchange'
  | 'Recover'
  | 'Disposal';

interface IndustrialLifecycleBarProps {
  currentStep: LifecycleStepProp;
  isRecoverable?: boolean;
  onToggleRecoverable?: (recoverable: boolean) => void;
  showToggle?: boolean;
  isAnalysisComplete?: boolean;
  className?: string;
  defaultExpanded?: boolean;
}

interface StepDefinition {
  id: WasteLifecycleStep;
  number: number;
  label: string;
  sublabel: string;
  icon: string;
  link?: string;
}

export const IndustrialLifecycleBar: React.FC<IndustrialLifecycleBarProps> = ({
  currentStep,
  isRecoverable = true,
  onToggleRecoverable,
  showToggle = false,
  isAnalysisComplete = false,
  className = '',
  defaultExpanded = false,
}) => {
  const [showDetailedProcess, setShowDetailedProcess] = useState(defaultExpanded);
  const normalizedStep = currentStep.toLowerCase() as WasteLifecycleStep;

  // Simple 5-Step Customer Friendly Status
  const getSimpleStepStatus = () => {
    switch (normalizedStep) {
      case 'identify':
        return { activeIndex: 0, statusLabel: 'Waste stream intake registered' };
      case 'analyze':
        return {
          activeIndex: isAnalysisComplete ? 1 : 1,
          statusLabel: isAnalysisComplete ? 'AI Characterization Complete' : 'AI Analyzing Material...',
        };
      case 'valorize':
        return {
          activeIndex: 2,
          statusLabel: isRecoverable
            ? 'Valorization Complete: Circular Recovery Recommended'
            : 'Valorization Complete: Regulated Disposal Recommended',
        };
      case 'match':
        return { activeIndex: 3, statusLabel: 'Marketplace Buyer Matching' };
      case 'exchange':
        return { activeIndex: 3, statusLabel: 'Trade Inquiries & Offers' };
      case 'recover':
        return { activeIndex: 4, statusLabel: 'Secondary Material Recovery Complete' };
      case 'disposal':
        return { activeIndex: 3, statusLabel: 'Authorized Disposal Guidance Verified' };
      default:
        return { activeIndex: 0, statusLabel: 'Active' };
    }
  };

  const simpleStatus = getSimpleStepStatus();

  const simpleSteps = isRecoverable
    ? [
        { label: 'Intake Registered', icon: 'check_circle' },
        { label: 'AI Analyzed', icon: 'smart_toy' },
        { label: 'Valorized', icon: 'alt_route' },
        { label: 'Market Match', icon: 'groups' },
        { label: 'Recovered', icon: 'verified' },
      ]
    : [
        { label: 'Intake Registered', icon: 'check_circle' },
        { label: 'AI Analyzed', icon: 'smart_toy' },
        { label: 'Valorized', icon: 'alt_route' },
        { label: 'Disposal Track', icon: 'warning' },
        { label: 'Safely Handled', icon: 'verified' },
      ];

  const recoverableSteps: StepDefinition[] = [
    {
      id: 'identify',
      number: 1,
      label: 'Identify',
      sublabel: 'Waste Intake Manifest',
      icon: 'format_list_bulleted',
      link: '/app/sell',
    },
    {
      id: 'analyze',
      number: 2,
      label: 'Analyze',
      sublabel: 'AI Characterization',
      icon: 'document_scanner',
      link: '/app/analyze',
    },
    {
      id: 'valorize',
      number: 3,
      label: 'Valorize',
      sublabel: 'Pathway Decision',
      icon: 'alt_route',
      link: '/app/valorize',
    },
    {
      id: 'match',
      number: 4,
      label: 'Match',
      sublabel: 'AI Buyer Compatibility',
      icon: 'hub',
      link: '/app/buy',
    },
    {
      id: 'exchange',
      number: 5,
      label: 'Exchange',
      sublabel: 'B2B Trade Order',
      icon: 'swap_horiz',
      link: '/app/my-listings',
    },
    {
      id: 'recover',
      number: 6,
      label: 'Recover',
      sublabel: 'Secondary Circular Feedstock',
      icon: 'recycling',
      link: '/app/analytics',
    },
  ];

  const nonRecoverableSteps: StepDefinition[] = [
    {
      id: 'identify',
      number: 1,
      label: 'Identify',
      sublabel: 'Waste Intake Manifest',
      icon: 'format_list_bulleted',
      link: '/app/sell',
    },
    {
      id: 'analyze',
      number: 2,
      label: 'Analyze',
      sublabel: 'AI Characterization',
      icon: 'document_scanner',
      link: '/app/analyze',
    },
    {
      id: 'valorize',
      number: 3,
      label: 'Valorize',
      sublabel: 'Limitation Assessment',
      icon: 'alt_route',
      link: '/app/valorize',
    },
    {
      id: 'disposal',
      number: 4,
      label: 'Disposal',
      sublabel: 'Regulated Treatment Pathway',
      icon: 'warning',
      link: '/app/valorize',
    },
  ];

  const activeSteps = isRecoverable ? recoverableSteps : nonRecoverableSteps;
  const currentStepIndex = activeSteps.findIndex((s) => s.id === normalizedStep);

  return (
    <div
      id="industrial-lifecycle-container"
      className={`bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs flex flex-col gap-3.5 ${className}`}
    >
      {/* Header with Simple Status & Process Details Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="material-symbols-outlined text-[19px] text-emerald-700">timeline</span>
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Lifecycle Status
          </span>
          <span className="text-xs font-semibold text-slate-500">
            • {simpleStatus.statusLabel}
          </span>
        </div>

        <button
          id="btn-toggle-process-details"
          type="button"
          onClick={() => setShowDetailedProcess(!showDetailedProcess)}
          className="self-start sm:self-auto text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>{showDetailedProcess ? 'Hide Technical Process' : 'View Process Details'}</span>
          <span className="material-symbols-outlined text-[16px]">
            {showDetailedProcess ? 'expand_less' : 'tune'}
          </span>
        </button>
      </div>

      {/* 1. Amazon-Style Simple Progress Bar for Everyday Users (Section 11) */}
      <div className="py-1">
        <div className="grid grid-cols-5 gap-1 sm:gap-2">
          {simpleSteps.map((step, idx) => {
            const isDone = idx < simpleStatus.activeIndex || (idx === simpleStatus.activeIndex && isAnalysisComplete && idx === 1);
            const isCurrent = idx === simpleStatus.activeIndex && !isDone;

            return (
              <div key={step.label} className="flex flex-col items-center text-center gap-1.5">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-600 font-bold'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
                    {isDone ? 'check' : step.icon}
                  </span>
                </div>
                <span
                  className={`text-[11px] sm:text-xs leading-tight ${
                    isDone || isCurrent ? 'font-bold text-slate-900' : 'font-medium text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Detailed Technical Process Matrix (Preserved for advanced operators / judges) */}
      {showDetailedProcess && (
        <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Technical Engineering Track:
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                  isRecoverable
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {isRecoverable ? 'Circular Recovery Track' : 'Regulated Disposal Track'}
              </span>
            </div>

            {showToggle && onToggleRecoverable && (
              <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => onToggleRecoverable(true)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                    isRecoverable ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Recoverable
                </button>
                <button
                  type="button"
                  onClick={() => onToggleRecoverable(false)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                    !isRecoverable ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Special Disposal
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {activeSteps.map((step, idx) => {
              const isPassed = currentStepIndex > idx;
              const isCurrent = currentStepIndex === idx;

              let stepBg = 'bg-slate-50 border-slate-200 text-slate-500';
              let numberBg = 'bg-slate-200 text-slate-600';
              let iconColor = 'text-slate-400';

              const isAnalyzePage = normalizedStep === 'analyze';
              const isValorizeStep = step.id === 'valorize' || step.id === 'disposal';
              const isValorizeLocked = isAnalyzePage && isValorizeStep && !isAnalysisComplete;

              if (isCurrent) {
                stepBg = 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20 text-emerald-900';
                numberBg = 'bg-emerald-600 text-white';
                iconColor = 'text-emerald-700';
              } else if (isPassed) {
                stepBg = 'bg-emerald-50/40 border-emerald-200 text-emerald-950';
                numberBg = 'bg-emerald-700 text-white';
                iconColor = 'text-emerald-700';
              } else if (isAnalyzePage && isValorizeStep && isAnalysisComplete) {
                stepBg = 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/20 text-emerald-950';
                numberBg = 'bg-emerald-600 text-white';
                iconColor = 'text-emerald-700';
              } else if (isValorizeLocked) {
                stepBg = 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-75';
                numberBg = 'bg-slate-200 text-slate-400';
                iconColor = 'text-slate-300';
              }

              const cardContent = (
                <div
                  className={`relative p-2.5 rounded-lg border transition-all flex flex-col justify-between h-full ${stepBg}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${numberBg}`}
                    >
                      {step.number}
                    </span>
                    <span className={`material-symbols-outlined text-[17px] ${iconColor}`}>
                      {isValorizeLocked ? 'lock' : step.icon}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-bold truncate leading-tight">{step.label}</div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">{step.sublabel}</div>
                  </div>
                </div>
              );

              return step.link && !isValorizeLocked ? (
                <Link key={step.id} to={step.link} className="block group">
                  {cardContent}
                </Link>
              ) : (
                <div key={step.id}>{cardContent}</div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
