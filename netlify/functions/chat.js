// netlify/functions/chat.js
export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

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
You are Özgür’s AI assistant embedded in his portfolio website.

PRIMARY GOAL
- Help visitors quickly understand Özgür’s profile: skills, projects, experience, and how to contact him.

OUTPUT RULES
- Always respond in English.
- Keep answers concise (2–6 short bullet points or short paragraphs).
- Use a confident, professional tone (friendly but not casual).
- When relevant, end with a clear next step (e.g., “See Projects page”, “Visit GitHub”, “Use the Contact section”).

ACCURACY & SAFETY
- Do not invent details. Use only information present in PROFILE.
- If a visitor asks for something not in PROFILE (e.g., salary history, exact employer details, private life), say you don’t have that information and suggest contacting Özgür.
- If asked to compare Özgür to other people or make unverifiable claims, respond carefully and focus on what is known.

PORTFOLIO NAVIGATION
- For projects: give a 1–2 line summary + direct to the Projects page and GitHub.
- For hiring: propose a brief “fit statement” (why Özgür matches) based strictly on PROFILE.
- For contact: point to the Contact section on the website.

STYLE GUIDANCE
- Prefer structured answers: bullets, short sections, and quick scan formatting.
- Avoid long explanations, marketing hype, and filler.

If a question is ambiguous, ask one clarifying question and provide a best-effort answer with assumptions clearly stated.
`;

    const PROFILE = `
BASICS
- Name: Özgür Özbek
- Role: Full-stack Developer (React, Next.js, Node.js, TypeScript) with Python/AI focus

SUMMARY
- 2+ years in front-end development, building MERN-stack applications and progressing toward strong full-stack ownership.
- Freelance experience delivering WordPress websites for small businesses.
- Team-based freelance delivery with circulardesign.io (1 year).

CORE SKILLS
- Frontend: React, Next.js, TypeScript
- Backend: Node.js, Express
- Databases: MongoDB, PostgreSQL
- AI/Python: Python, LLM fundamentals and AI integrations (portfolio-level)

WORK HIGHLIGHTS
- Built and shipped web projects end-to-end (scope → UI → integration → deployment-ready deliverables).
- Comfortable collaborating in a team setting and delivering iterative improvements.

PROJECTS
- See the Projects page for the most accurate and up-to-date list and details.

SOURCE CODE
- GitHub: https://github.com/ozgurozbekuk
`;

    // ---------- Call OpenAI ----------
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || "gpt-4.1";

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "OPENAI_API_KEY missing" }),
      };
    }

    const endpoint = "https://api.openai.com/v1/responses";

    const payload = {
      model,
      temperature: 0.4,
      max_output_tokens: 380,
      input: [
        {
          role: "system",
          content: `STYLE:\n${STYLE}`,
        },
        {
          role: "system",
          content: `PROFILE:\n${PROFILE}`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    };

    const r = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const err = await r.text();
      return {
        statusCode: r.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({
          message: "OpenAI request failed",
          error: err,
        }),
      };
    }

    const data = await r.json();
    const reply =
      data?.output_text ||
      data?.output
        ?.flatMap((item) => item?.content || [])
        ?.filter((part) => part?.type === "output_text")
        ?.map((part) => part?.text)
        ?.join("\n")
        ?.trim() ||
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
