'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/* ── Confidence config ──────────────────────────────────────── */
const CONFIDENCE = {
  high:   { dots: 3, label: 'High confidence',   color: 'text-teal-700',  bg: 'bg-teal-50',   border: 'border-teal-200' },
  medium: { dots: 2, label: 'Medium confidence', color: 'text-amber-700', bg: 'bg-amber-50',  border: 'border-amber-200' },
  low:    { dots: 1, label: 'Low confidence',    color: 'text-warm-600',  bg: 'bg-warm-100',  border: 'border-warm-200' },
};

/* ── Urgency config ─────────────────────────────────────────── */
const URGENCY = {
  self_care: { icon: '🏠', color: 'text-teal-700',    bg: 'bg-teal-50',   border: 'border-teal-200' },
  routine:   { icon: '📅', color: 'text-blue-700',    bg: 'bg-blue-50',   border: 'border-blue-200' },
  soon:      { icon: '🗓', color: 'text-amber-700',   bg: 'bg-amber-50',  border: 'border-amber-200' },
  today:     { icon: '⚡', color: 'text-orange-700',  bg: 'bg-orange-50', border: 'border-orange-200' },
  emergency: { icon: '🚨', color: 'text-red-700',     bg: 'bg-red-50',    border: 'border-red-200' },
};

function Dots({ count }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3].map(i => (
        <span
          key={i}
          className={`inline-block w-2 h-2 rounded-full ${i <= count ? 'bg-current' : 'bg-current opacity-20'}`}
        />
      ))}
    </span>
  );
}

export default function ResponseMetadata({ meta }) {
  const [open, setOpen] = useState(false);

  if (!meta) return null;

  const conf    = CONFIDENCE[meta.confidence] ?? CONFIDENCE.medium;
  const urgency = URGENCY[meta.urgency]       ?? URGENCY.routine;

  return (
    <div className="mt-2 text-xs">
      {/* ── Pill row (always visible) ── */}
      <div className="flex flex-wrap items-center gap-2">

        {/* Confidence pill */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-medium
          ${conf.color} ${conf.bg} ${conf.border}`}
        >
          <Dots count={conf.dots} />
          {conf.label}
        </span>

        {/* Urgency pill */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-medium
          ${urgency.color} ${urgency.bg} ${urgency.border}`}
        >
          <span>{urgency.icon}</span>
          {meta.urgency_label}
        </span>

        {/* Expand toggle */}
        <button
          onClick={() => setOpen(o => !o)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-warm-200
                     text-warm-600 bg-white hover:border-warm-300 hover:text-warm-800 transition-colors font-medium"
        >
          Sources & reasoning
          {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        </button>
      </div>

      {/* ── Expanded detail ── */}
      {open && (
        <div className="mt-2 p-3 rounded-xl bg-warm-50 border border-warm-200 space-y-2.5">

          {/* Reasoning */}
          {meta.reasoning && (
            <div>
              <p className="font-semibold text-warm-700 mb-0.5">Reasoning</p>
              <p className="text-warm-600 leading-relaxed">{meta.reasoning}</p>
            </div>
          )}

          {/* Sources */}
          {meta.sources?.length > 0 && (
            <div>
              <p className="font-semibold text-warm-700 mb-1">Sources</p>
              <div className="flex flex-wrap gap-1.5">
                {meta.sources.map(s => (
                  <span key={s} className="px-2 py-0.5 bg-white border border-warm-200 rounded-full text-warm-600">
                    {s}
                  </span>
                ))}
              </div>
              <p className="mt-1.5 text-warm-400 italic">
                Currently based on general medical knowledge. Specific study citations coming with our medical literature database.
              </p>
            </div>
          )}

          {/* Specialist */}
          {meta.specialist && (
            <div>
              <p className="font-semibold text-warm-700 mb-0.5">Recommended specialist</p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-warm-200 rounded-full text-warm-700">
                🩺 {meta.specialist}
              </span>
            </div>
          )}

          {/* Confidence note */}
          {meta.confidence_note && (
            <div>
              <p className="font-semibold text-warm-700 mb-0.5">Why this confidence level</p>
              <p className="text-warm-600 leading-relaxed">{meta.confidence_note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
