'use client';

import { useRef, useState, useEffect } from 'react';
import { Mic, MicOff, Paperclip, SendHorizonal, X } from 'lucide-react';

export default function InputBar({ onSend, isLoading }) {
  const [text,        setText]        = useState('');
  const [imageFile,   setImageFile]   = useState(null);
  const [imagePreview,setImagePreview]= useState(null);
  const [recording,   setRecording]   = useState(false);
  const [transcribing,setTranscribing]= useState(false);

  const textareaRef  = useRef(null);
  const fileRef      = useRef(null);
  const mediaRef     = useRef(null);
  const chunksRef    = useRef([]);

  /* Auto-grow textarea */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }, [text]);

  /* ── Send ──────────────────────────────────────────────────── */
  const handleSend = () => {
    if ((!text.trim() && !imageFile) || isLoading) return;
    onSend({ text: text.trim(), imageFile, imagePreview });
    setText('');
    setImageFile(null);
    setImagePreview(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* ── Image attachment ──────────────────────────────────────── */
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeImage = () => { setImageFile(null); setImagePreview(null); };

  /* ── Voice recording ───────────────────────────────────────── */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRef.current  = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await transcribe(blob);
      };

      recorder.start();
      setRecording(true);
    } catch {
      alert('Microphone access denied. Please allow microphone access to use voice input.');
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setRecording(false);
  };

  const transcribe = async (blob) => {
    setTranscribing(true);
    try {
      const fd = new FormData();
      fd.append('audio', blob, 'recording.webm');
      const res  = await fetch('/api/transcribe', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.text) setText(prev => (prev ? prev + ' ' : '') + data.text);
    } catch {
      console.error('Transcription failed');
    } finally {
      setTranscribing(false);
    }
  };

  const canSend = (text.trim() || imageFile) && !isLoading;

  return (
    <div className="flex-shrink-0 bg-white border-t border-warm-200 px-4 pt-3 pb-4" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)' }}>
      {/* Disclaimer */}
      <p className="text-center text-[11px] text-warm-600 mb-2">
        MAFE provides general health information only — not medical advice. Always consult a healthcare professional.
      </p>

      {/* Image preview */}
      {imagePreview && (
        <div className="relative inline-block mb-2">
          <img src={imagePreview} alt="Attachment" className="h-20 rounded-xl border border-warm-200 object-cover" />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 w-5 h-5 bg-warm-700 rounded-full flex items-center justify-center"
          >
            <X size={10} color="white" />
          </button>
        </div>
      )}

      {/* Input row */}
      <div className={`flex items-end gap-2 bg-warm-50 border rounded-2xl px-3 py-2 transition-colors
        ${recording ? 'border-red-400 bg-red-50' : 'border-warm-200 focus-within:border-brand'}`}
      >
        {/* Attach */}
        <button
          onClick={() => fileRef.current?.click()}
          className="flex-shrink-0 mb-1 p-1.5 rounded-lg text-warm-600 hover:text-brand hover:bg-warm-100 transition-colors"
          title="Attach photo"
        >
          <Paperclip size={18} />
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={recording ? 'Recording… tap mic to stop' : transcribing ? 'Transcribing…' : 'Describe your symptoms or ask a health question…'}
          rows={1}
          className="flex-1 bg-transparent resize-none outline-none text-[16px] sm:text-sm text-warm-900 placeholder-warm-400 py-1 leading-relaxed"
          disabled={recording || transcribing}
        />

        {/* Voice */}
        <button
          onClick={recording ? stopRecording : startRecording}
          disabled={transcribing || isLoading}
          className={`flex-shrink-0 mb-1 p-1.5 rounded-lg transition-colors ${
            recording
              ? 'text-red-500 bg-red-100 animate-pulse'
              : 'text-warm-600 hover:text-brand hover:bg-warm-100'
          }`}
          title={recording ? 'Stop recording' : 'Voice input'}
        >
          {recording ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`flex-shrink-0 mb-1 p-1.5 rounded-lg transition-all ${
            canSend
              ? 'bg-brand text-white hover:bg-brand-dark'
              : 'bg-warm-200 text-warm-400 cursor-not-allowed'
          }`}
          title="Send"
        >
          <SendHorizonal size={18} />
        </button>
      </div>
    </div>
  );
}
