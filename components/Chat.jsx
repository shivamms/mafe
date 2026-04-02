'use client';

import { useChat } from 'ai/react';
import { useEffect, useRef } from 'react';
import Header from './Header';
import Message, { TypingIndicator } from './Message';
import InputBar from './InputBar';
import Welcome from './Welcome';
import DisclaimerBanner from './DisclaimerBanner';

export default function Chat() {
  const bottomRef = useRef(null);

  const { messages, isLoading, error, append, setMessages } = useChat({
    api: '/api/chat',
  });

  /* Scroll to bottom on new messages */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  /* ── Send handler ──────────────────────────────────────────── */
  const handleSend = async ({ text, imageFile, imagePreview }) => {
    if (!text && !imageFile) return;

    if (imageFile) {
      const base64    = await fileToBase64(imageFile);
      const mimeType  = imageFile.type || 'image/jpeg';
      await append({
        role: 'user',
        content: [
          ...(text ? [{ type: 'text', text }] : []),
          { type: 'image', image: base64, mimeType },
        ],
        imageUrl: imagePreview,
      });
    } else {
      await append({ role: 'user', content: text });
    }
  };

  const handleSuggestion = (text) => append({ role: 'user', content: text });

  const handleNewChat = () => setMessages([]);

  const showWelcome = messages.length === 0;

  return (
    <div className="flex flex-col h-screen bg-warm-50">
      <DisclaimerBanner />
      <Header onNewChat={handleNewChat} hasMessages={messages.length > 0} />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {showWelcome ? (
          <Welcome onSuggestion={handleSuggestion} />
        ) : (
          <div className="max-w-2xl mx-auto px-4 py-6">
            {messages.map((msg) => (
              <Message key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}

            {/* Error state */}
            {error && (
              <div className="flex justify-center my-4">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  <span>⚠</span>
                  <span>Something went wrong. Please try again.</span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <InputBar onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
