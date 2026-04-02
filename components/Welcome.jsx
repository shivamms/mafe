'use client';

const SUGGESTIONS = [
  { emoji: '🤒', text: 'I have a fever and headache' },
  { emoji: '💊', text: 'What is ibuprofen used for?' },
  { emoji: '❤️', text: 'What are signs of high blood pressure?' },
  { emoji: '🤧', text: 'How long does a cold usually last?' },
];

export default function Welcome({ onSuggestion }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
      {/* Logo */}
      <div className="w-16 h-16 rounded-2xl bg-brand flex items-center justify-center mb-5 shadow-lg shadow-brand/20">
        <svg width="28" height="28" viewBox="0 0 18 18" fill="none">
          <path d="M9 2v14M2 9h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-warm-900 mb-2">Medical Assistance For Everyone</h1>
      <p className="text-warm-600 text-sm max-w-sm mb-2">
        Ask about symptoms, conditions, or when to see a doctor — in any language.
        Free, private, and always available.
      </p>
      <p className="text-xs text-warm-400 mb-8">
        Supports English · Español · Português · தமிழ் · తెలుగు · ಕನ್ನಡ · മലയാളം
      </p>

      {/* Suggestions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-sm">
        {SUGGESTIONS.map(({ emoji, text }) => (
          <button
            key={text}
            onClick={() => onSuggestion(text)}
            className="flex items-center gap-3 px-4 py-3 bg-white border border-warm-200 rounded-xl text-left
                       text-sm text-warm-700 hover:border-brand hover:text-brand hover:bg-brand/5
                       transition-all duration-200 shadow-sm"
          >
            <span className="text-lg">{emoji}</span>
            <span>{text}</span>
          </button>
        ))}
      </div>

      <p className="text-[11px] text-warm-400 mt-8 max-w-xs">
        MAFE provides general health information only. It does not diagnose conditions or replace professional medical care.
      </p>
    </div>
  );
}
