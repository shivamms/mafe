'use client';

import { SquarePen } from 'lucide-react';

export default function Header({ onNewChat, hasMessages }) {
  return (
    <header className="flex-shrink-0 bg-white border-b border-warm-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2v14M2 9h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <span className="font-bold text-warm-900 tracking-tight">MAFE</span>
          <span className="hidden sm:inline text-xs text-warm-600 ml-2">Medical Assistance For Everyone</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {hasMessages && (
          <button
            onClick={onNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-warm-600 hover:text-brand
                       hover:bg-warm-100 rounded-lg transition-colors"
            title="New conversation"
          >
            <SquarePen size={15} />
            <span className="hidden sm:inline">New chat</span>
          </button>
        )}
        <button className="text-sm font-medium text-brand hover:text-brand-dark transition-colors px-2 py-1.5">
          Sign in
        </button>
      </div>
    </header>
  );
}
