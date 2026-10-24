import React from 'react';
import { TabType } from '../types';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'today' as TabType,
      label: 'Today',
      icon: 'favorite',
      ariaLabel: 'Today Dual Log',
    },
    {
      id: 'calendar' as TabType,
      label: 'Calendar',
      icon: 'calendar_today',
      ariaLabel: 'Shared Calendar & Milestones',
    },
    {
      id: 'albums' as TabType,
      label: 'Albums',
      icon: 'auto_stories',
      ariaLabel: 'Heirloom Photobooks & Albums',
    },
    {
      id: 'us' as TabType,
      label: 'Us',
      icon: 'diversity_1',
      ariaLabel: 'Our Sanctuary & Daily Sparks Vault',
    },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe pointer-events-none">
      <div className="max-w-md mx-auto px-4 pb-3">
        <div className="pointer-events-auto h-16 bg-[#ffffff]/90 backdrop-blur-xl rounded-full px-2 shadow-[0_12px_32px_-4px_rgba(42,36,33,0.12),0_2px_8px_rgba(42,36,33,0.04)] border border-[#dbc1b9]/40 flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-label={tab.ariaLabel}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onTabChange(tab.id)}
                className={`min-w-[56px] min-h-[46px] px-3.5 py-1 rounded-full flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
                  isActive
                    ? 'text-[#99462a] bg-[#ffdbd0]/60 font-semibold shadow-xs'
                    : 'text-[#55433d] hover:text-[#99462a] active:scale-95'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px] transition-transform duration-200"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {tab.icon}
                </span>
                <span className="text-[11px] leading-[14px] tracking-wide font-medium">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
