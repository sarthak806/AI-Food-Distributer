const axios = require("axios");

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

const unavailable = (reason) => ({
  status: "unavailable",
  reason,
  isFood: null,
  appearsAiGenerated: null,
  freshness: "unknown",
  confidence: null,
  notes: [],
});

const analyzeFoodImage = async (base64Image) => {
  if (!process.env.GEMINI_API_KEY) {
    return unavailable("AI image analysis is not configured.");
  }

  const match = base64Image.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/i);
  if (!match) {
    throw new Error("Unsupported image format for AI analysis");
  }

  const [, mimeType, data] = match;
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`,
    {
      contents: [{
        parts: [
          {
            text: `Analyze this uploaded donation photo. Return JSON only with this exact shape:
{
  "isFood": true,
  "appearsAiGenerated": false,
  "freshness": "appears_fresh",
  "confidence": 0.0,
  "notes": ["short observation"]
}
Rules:
- isFood: whether the image visibly contains food.
- appearsAiGenerated: only a visual suspicion, never a certainty.
- freshness: one of "appears_fresh", "questionable", "spoiled_looking", or "unknown".
- confidence: number from 0 to 1.
- Do not claim that a photo proves food safety, freshness, temperature, contamination, or edibility.
- If the image is unclear, use false/unknown and explain why in notes.`,
          },
          { inline_data: { mime_type: mimeType, data } },
        ],
      }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    },
    { timeout: 30000 },
  );

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned no image analysis");

  let result;
  try {
    result = JSON.parse(text);
  } catch {
    throw new Error("Gemini returned invalid image analysis JSON");
  }

  const allowedFreshness = ["appears_fresh", "questionable", "spoiled_looking", "unknown"];
  return {
    status: "complete",
    isFood: result.isFood === true,
    appearsAiGenerated: result.appearsAiGenerated === true,
    freshness: allowedFreshness.includes(result.freshness) ? result.freshness : "unknown",
    confidence: typeof result.confidence === "number"
      ? Math.min(1, Math.max(0, result.confidence))
      : null,
    notes: Array.isArray(result.notes)
      ? result.notes.filter((note) => typeof note === "string").slice(0, 3)
      : [],
  };
};

module.exports = { analyzeFoodImage };
