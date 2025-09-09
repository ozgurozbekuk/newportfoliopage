// netlify/functions/chat.js
export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ message: "Only POST" }) };
  }

  try {
    const { message } = JSON.parse(event.body || "{}");
    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "message required" }),
      };
    }

    const STYLE = `
You are Özgür’s AI assistant, embedded in his portfolio website.
- Your purpose is to help the visitor learn about Özgür: his skills, projects, experience, and how to contact him.
- Always answer in English, clear and professional.
- Be concise: use short paragraphs or bullet points where suitable.
- For projects, direct users to explore the Projects page or Özgür’s GitHub profile (provided in PROFILE).
- Maintain a friendly, helpful, but professional tone.
- Never invent personal details not provided in PROFILE.
`;

   const PROFILE = `
Name: Özgür
Role: Full-stack Developer (React, Next.js, Node.js, TypeScript) with Python/AI focus
Experience: 
- 2+ years in front-end development, building MERN stack projects and focusing on becoming a strong full-stack developer
- 2 years freelancing: developed WordPress websites for small businesses
- 1 year freelancing with circulardesign.io, delivering web projects as part of their team
Core Skills:
- React, Next.js, TypeScript
- Node.js, Express
- MongoDB, PostgreSQL
- Python, AI/LLMs
Projects: For a full overview, please explore the Projects section of this portfolio.
Source Code: GitHub – https://github.com/ozgurozbekuk
`;


    // ---------- Call Gemini ----------
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "GEMINI_API_KEY missing" }),
      };
    }

    const endpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent";

    const payload = {
      contents: [
        {
          parts: [
            { text: `SYSTEM:\n${STYLE}\n\nPROFILE:\n${PROFILE}` },
            { text: message },
          ],
        },
      ],
    };

    const r = await fetch(`${endpoint}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await r.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Sorry, I couldn't generate a response.";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        // CORS (ok for local dev; tighten if needed)
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ reply }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server error", error: String(e) }),
    };
  }
};
