const buildPrompt = (project) => {
  const { xrType, objectMethod, environmentMethod, platform } = project;

  const prompt = `You are an expert technical advisor specialising in ${xrType} and immersive experience development.
Your audience is small teams, students, or independent creators — people who may be new to XR but are motivated to build a real project.
Recommend tools that are currently available, actively maintained, and appropriate for this skill level.
Prefer tools with free tiers or accessible pricing where possible.

PROJECT BRIEF:
- XR Type: ${xrType}
- 3D Object Creation Method: ${objectMethod || 'not specified'}
- Environment Creation Method: ${environmentMethod || 'not specified'}
- Target Platform: ${platform || 'not specified'}

Based on this brief, produce a practical workflow report with the following sections in this order:
1. "${xrType} Workflow Overview" — explain the overall pipeline from asset creation to deployment for this specific combination of choices
2. "${objectMethod} Tools" — tools specifically for creating 3D objects using the ${objectMethod} method
3. "${environmentMethod} Tools" — tools specifically for creating or sourcing the XR environment using the ${environmentMethod} method
4. "XR Engine & Development Tools" — engines and frameworks for building the ${xrType} experience targeting ${platform} (e.g. Unity, Unreal, A-Frame, 8th Wall, Spark AR — whichever are appropriate)
5. "Publishing & Deployment" — how to get the finished experience onto ${platform}, including any platform-specific requirements or stores
6. "Learning Resources" — free or low-cost tutorials, documentation, and communities relevant to this exact workflow

For each section provide 3–6 specific, real tools. Each tool must have a name, its official URL, clear pricing notes (free/freemium/paid subscription/one-time purchase), and a one-sentence description of its role in this workflow.

You must respond with ONLY valid JSON (no markdown fences, no commentary) matching this exact shape:
{
  "title": "string",
  "executiveSummary": "string (2-4 sentences summarising the workflow for this specific combination of choices)",
  "sections": [
    {
      "heading": "string",
      "body": "string (1-2 paragraphs explaining this stage of the workflow and why these tools are appropriate)",
      "tools": [
        {
          "name": "string",
          "url": "string (official product URL — use empty string if unsure)",
          "pricingNotes": "string (e.g. Free, Free tier available, £X/month, One-time purchase)",
          "role": "string (one sentence: what this tool does in this specific workflow)"
        }
      ]
    }
  ],
  "costEstimate": {
    "currency": "GBP",
    "low": "string (e.g. £0–£50, using only free and open-source tools)",
    "mid": "string (e.g. £100–£300, using some paid tools or subscriptions)",
    "high": "string (e.g. £500+, using professional tools and hardware)",
    "assumptions": "string (state clearly what is included and excluded, e.g. hardware costs, developer time)"
  },
  "references": [
    { "label": "string", "url": "string" }
  ]
}`;

  return prompt;
};

module.exports = { buildPrompt };
