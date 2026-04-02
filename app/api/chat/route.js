import { streamText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { buildSystemPrompt } from '@/lib/prompt';

export const runtime = 'nodejs';
export const maxDuration = 60;

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req) {
  try {
    const { messages, userContext } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages' }), { status: 400 });
    }

    const result = streamText({
      model: anthropic('claude-sonnet-4-6'),
      system: buildSystemPrompt(userContext),
      messages,
      maxTokens: 1024,
    });

    return result.toDataStreamResponse();
  } catch (err) {
    console.error('[/api/chat]', err);
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again.' }), {
      status: 500,
    });
  }
}
