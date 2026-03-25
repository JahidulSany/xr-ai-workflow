const buildPrompt = (project) => {
  const { xrType, objectMethod, environmentMethod, platform } = project;

  let prompt = `You are an expert technical advisor for ${xrType} and immersive project planning.
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

  if (objectMethod) {
    prompt += `You will be using the ${objectMethod} method for object creation. `;
  }

  if (environmentMethod) {
    prompt += `The environment will be created using the ${environmentMethod} method. `;
  }

  if (platform) {
    prompt += `The target platform for this project is ${platform}. `;
  }

  prompt += `Please provide a detailed plan for creating this experience, including the necessary steps, tools, and resources.`;

  return prompt;
};

module.exports = { buildPrompt };
