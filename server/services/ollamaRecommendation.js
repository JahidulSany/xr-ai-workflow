const DEFAULT_BASE = 'http://127.0.0.1:11434';
const DEFAULT_MODEL = 'qwen3:8b';

function extractJsonFromText(text) {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) {
    return fence[1].trim();
  }
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    return trimmed.slice(start, end + 1);
  }
  return trimmed;
}

function fallbackFromRawText(rawText) {
  return {
    title: 'XR tooling and cost overview',
    executiveSummary:
      'The model returned non-JSON output. Below is the raw recommendation text.',
    sections: [
      {
        heading: 'Recommendations',
        body: rawText,
        tools: [],
      },
    ],
    costEstimate: {
      currency: 'GBP',
      low: 'See narrative',
      mid: 'See narrative',
      high: 'See narrative',
      assumptions: 'Could not parse structured cost block from model output.',
    },
    references: [],
  };
}

async function generateWithOllama({ systemPrompt, userPrompt }) {
  const base = process.env.OLLAMA_BASE_URL || DEFAULT_BASE;
  const model = process.env.OLLAMA_MODEL || DEFAULT_MODEL;

  const res = await fetch(`${base.replace(/\/$/, '')}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      options: { temperature: 0.35 },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(
      `Ollama request failed (${res.status}): ${errText.slice(0, 500)}`,
    );
  }

  const data = await res.json();
  const raw =
    data?.message?.content ||
    data?.response ||
    (typeof data === 'string' ? data : JSON.stringify(data));

  if (!raw || typeof raw !== 'string') {
    throw new Error('Unexpected Ollama response shape');
  }

  const jsonStr = extractJsonFromText(raw);
  try {
    const parsed = JSON.parse(jsonStr);
    return parsed;
  } catch {
    return fallbackFromRawText(raw);
  }
}

module.exports = { generateWithOllama };
