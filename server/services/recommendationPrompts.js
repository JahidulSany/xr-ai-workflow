function buildSystemPrompt() {
  return `You are an expert technical advisor for XR (VR/AR/MR) and immersive project planning.
You do deep research and recommend real, verifiable online tools and services (including AI-powered and traditional software) that help someone build the kind of project described.
You estimate realistic cost ranges in GBP for individuals or small teams, clearly stating assumptions.
You must respond with ONLY valid JSON (no markdown fences, no commentary) matching this exact shape:
{
  "title": "string",
  "executiveSummary": "string (2-4 sentences)",
  "sections": [
    {
      "heading": "string",
      "body": "string (paragraphs)",
      "tools": [
        {
          "name": "string",
          "url": "https://...",
          "pricingNotes": "string (free tier, subscription, one-time, etc.)",
          "role": "string (what it is used for in this workflow)"
        }
      ]
    }
  ],
  "costEstimate": {
    "currency": "GBP",
    "low": "string (e.g. £200)",
    "mid": "string",
    "high": "string",
    "assumptions": "string"
  },
  "references": [
    { "label": "string", "url": "https://..." }
  ]
}
Use https URLs only when you are confident they are official product pages; otherwise describe the tool without a URL and set url to empty string.
Keep tools arrays concise (typically 3-8 items per section across the whole report).`;
}

const LABELS = {
  'xr-type': 'XR modality',
  'object-creation': 'Object / asset creation',
  'environment-creation': 'Environment creation',
  'platform-creation': 'Target platform / delivery',
};

function buildUserPrompt(selections) {
  if (!Array.isArray(selections) || selections.length === 0) {
    return 'No selection data was provided.';
  }

  const lines = selections.map((s, i) => {
    const label = LABELS[s.key] || s.key || `Dimension ${i + 1}`;
    return `${label}:\n- Title: ${s.title}\n- Details: ${s.description}`;
  });

  return `The user is planning an XR-related project. They answered the workflow questionnaire as follows:

${lines.join('\n\n')}

Produce the JSON report: recommend tools, outline a sensible workflow, include indicative costs, and add a short list of useful reference links (documentation, learning resources, or vendor pricing pages).`;
}

module.exports = { buildSystemPrompt, buildUserPrompt };
