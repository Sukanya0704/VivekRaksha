const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/scam', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Payload requires a text field' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'GEMINI_API_KEY not configured in backend' });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-8b",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
You are a cybersecurity fraud analyst for an app named "Vivek Rakhsha".
Analyze this text to determine if it is a SCAM or SAFE. Look for phishing tactics, fake urgency, unofficial links, and requests for OTP/PINs.

Text to analyze:
"${text}"

Respond EXACTLY in this JSON format:
{
  "status": "SCAM" or "SAFE",
  "confidence": <number 0-100 indicating confidence>,
  "reasoning": "<A brief one or two sentence explanation>"
}
`;

    const result = await model.generateContent(prompt);
    let output = result.response.text();

    // Fallback cleanup just in case
    output = output.replace(/```json/g, '').replace(/```/g, '').trim();

    let analysis;
    try {
      analysis = JSON.parse(output);
    } catch (e) {
      analysis = {
        status: 'ERROR',
        confidence: 0,
        reasoning: 'Failed to parse AI response. Try again.'
      };
    }

    res.json(analysis);

  } catch (error) {
    console.error('AI Analysis Error:', error);
    res.status(500).json({
      status: 'ERROR',
      reasoning: 'Error analyzing content: ' + error.message
    });
  }
});

module.exports = router;
