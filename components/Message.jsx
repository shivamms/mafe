'use client';

import { motion } from 'framer-motion';
import ResponseMetadata from './ResponseMetadata';

/* ── Parse <mafe-meta> block out of AI content ──────────────── */
function parseContent(raw) {
  if (!raw) return { text: '', meta: null };
  const match = raw.match(/<mafe-meta>\s*([\s\S]*?)\s*<\/mafe-meta>/);
  if (!match) return { text: raw.trim(), meta: null };
  const text = raw.slice(0, match.index).trim();
  try {
    const meta = JSON.parse(match[1]);
    return { text, meta };
  } catch {
    return { text, meta: null };
  }
}

/* ── Emergency banner ───────────────────────────────────────── */
function EmergencyBanner() {
  return (
    <div className="my-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-700">
      <span className="text-base">🚨</span>
      <span className="font-semibold">Emergency detected</span>
      <span className="text-red-500">— Call emergency services immediately</span>
    </div>
  );
}

/* ── Typing indicator ───────────────────────────────────────── */
export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-end gap-2 mb-4"
    >
      <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center flex-shrink-0">
        <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
          <path d="M9 2v14M2 9h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="bg-white border border-warm-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-warm-400 dot-1" />
          <div className="w-2 h-2 rounded-full bg-warm-400 dot-2" />
          <div className="w-2 h-2 rounded-full bg-warm-400 dot-3" />
        </div>
      </div>
    </motion.div>
  );
}

/* ── Image preview ──────────────────────────────────────────── */
function ImagePreview({ url, alt }) {
  return (
    <img
      src={url}
      alt={alt || 'Uploaded image'}
      className="max-w-[200px] rounded-xl mt-2 border border-warm-200"
    />
  );
}

/* ── MAFE message (left) ────────────────────────────────────── */
function MafeMessage({ content }) {
  const { text, meta } = parseContent(content);
  const isEmergency = /⚠️|emergency|call.*911|call.*108|call.*112|call.*192/i.test(text);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-start gap-2 mb-5"
    >
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
          <path d="M9 2v14M2 9h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </div>

      <div className="max-w-[85%] sm:max-w-[72%]">
        {isEmergency && <EmergencyBanner />}

        {/* Main response bubble */}
        <div className={`px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm text-sm leading-relaxed
          ${isEmergency
            ? 'bg-red-50 border border-red-200 text-red-900'
            : 'bg-white border border-warm-200 text-warm-900'
          }`}
        >
          <div
            className="prose-mafe"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
          />
        </div>

        {/* Metadata — only when streaming is complete (meta exists) */}
        {meta && <ResponseMetadata meta={meta} />}
      </div>
    </motion.div>
  );
}

/* ── User message (right) ───────────────────────────────────── */
function UserMessage({ content, imageUrl }) {
  // User messages may be an array (multimodal) — extract text
  const text = Array.isArray(content)
    ? content.find(c => c.type === 'text')?.text ?? ''
    : content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex justify-end mb-5"
    >
      <div className="max-w-[85%] sm:max-w-[70%]">
        {imageUrl && <ImagePreview url={imageUrl} alt="Your photo" />}
        {text && (
          <div className="px-4 py-3 bg-brand text-white rounded-2xl rounded-tr-sm text-sm leading-relaxed">
            {text}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ── Main export ────────────────────────────────────────────── */
export default function Message({ message }) {
  if (message.role === 'user') {
    return <UserMessage content={message.content} imageUrl={message.imageUrl} />;
  }
  return <MafeMessage content={message.content} />;
}

/* ── Minimal markdown renderer ──────────────────────────────── */
function renderMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-brand/30 pl-3 text-warm-600 italic my-1">$1</blockquote>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^[-•] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .split(/\n\n+/)
    .map(block => block.startsWith('<') ? block : `<p>${block.replace(/\n/g, '<br/>')}</p>`)
    .join('');
}
