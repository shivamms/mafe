import OpenAI from 'openai';

export const runtime = 'nodejs';

let _openai;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const audio = formData.get('audio');

    if (!audio) {
      return new Response(JSON.stringify({ error: 'No audio file provided' }), { status: 400 });
    }

    const transcription = await getOpenAI().audio.transcriptions.create({
      file:  audio,
      model: 'whisper-1',
      // No language hint — Whisper auto-detects
    });

    return new Response(JSON.stringify({ text: transcription.text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[/api/transcribe]', err);
    return new Response(JSON.stringify({ error: 'Transcription failed' }), { status: 500 });
  }
}
