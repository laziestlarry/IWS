import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI:", err);
  }
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    aiAvailable: !!ai,
    timestamp: new Date().toISOString(),
  });
});

// Deep AI Workflow Bottleneck Analysis
app.post("/api/gemini/analyze-workflow", async (req, res) => {
  try {
    const intake = req.body;
    if (!intake) {
      return res.status(400).json({ error: "Missing intake payload" });
    }

    if (!ai) {
      return res.json({
        aiPowered: false,
        analysis: "Gemini API key is pending configuration in Settings > Secrets. Using deterministic scoring engine.",
      });
    }

    const prompt = `
You are the AI Commander for INTELLIWEALTH SOLUTIONS — OUTCOME OPERATING SYSTEM.
Analyze this business workflow bottleneck intake and produce a concise strategic diagnostic breakdown.

Business: ${intake.sectionA?.businessName || "Service Business"}
Category: ${intake.sectionA?.serviceCategory || "Professional Services"}
Workflow: ${intake.sectionC?.workflowName || "Workflow"}
Trigger: ${intake.sectionC?.trigger || "Manual"}
Current Steps: ${intake.sectionC?.currentSteps || "Unspecified"}
Occurrences/Mo: ${intake.sectionD?.occurrencesPerMonth || 10}
Minutes/Run: ${intake.sectionD?.minutesPerRun || 60}
Error/Rework Rate: ${intake.sectionD?.reworkErrorRatePct || 10}%
Most Expensive Failure: ${intake.sectionD?.mostExpensiveFailure || "Delays"}
Customer/Revenue Impact: ${intake.sectionD?.customerRevenueImpact || "High"}
Metric to Improve: ${intake.sectionE?.metricToImprove || "Turnaround Time"}
Current Baseline: ${intake.sectionE?.currentBaseline || "N/A"}
Desired Target: ${intake.sectionE?.desiredTarget || "N/A"}
Forbidden Systems: ${intake.sectionF?.forbiddenSystems || "None"}

Please evaluate and output JSON in the following schema:
{
  "bottleneckDiagnosis": "Short 2-sentence summary of the true root cause bottleneck",
  "estimatedMonthlyLaborCost": "Dollar cost based on rate and hours",
  "governanceRiskAssessment": "Key legal, compliance or operational risks",
  "recommendedSmallestFix": "Detailed title and description of the smallest credible automated fix",
  "suggestedAcceptanceCriteria": ["Criterion 1", "Criterion 2", "Criterion 3"]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    const parsed = JSON.parse(jsonText);

    res.json({
      aiPowered: true,
      analysis: parsed,
    });
  } catch (error: any) {
    console.error("Gemini Analyze Error:", error);
    res.status(500).json({
      error: "Failed to perform AI analysis",
      details: error.message,
    });
  }
});

// Interactive AI Commander Chat Endpoint
app.post("/api/gemini/commander-chat", async (req, res) => {
  try {
    const { message, contextHistory, activeMission } = req.body;

    if (!ai) {
      return res.json({
        reply: "AI Commander is operating in deterministic mode (API key pending in Settings > Secrets). For full AI reasoning, please configure GEMINI_API_KEY.",
      });
    }

    const systemInstruction = `
You are the Commander Coordination Layer for INTELLIWEALTH SOLUTIONS — OUTCOME OPERATING SYSTEM.
Your role:
1. Maintain the objective of finding costly business bottlenecks and scoping the smallest credible fix.
2. Provide direct, direct, evidence-led strategic guidance for solo operators and service businesses.
3. Help Kagan Dolek and operators analyze workflows, write acceptance criteria, surface risks, and refine scopes.
4. Always uphold Trust Principles:
   - Built around actual business reality
   - Human-controlled (operator approves consequential actions)
   - Evidence-led (separate claims E0 from tested evidence E2-E5)
   - Compliance-aware
   - No false revenue

Active Business Context:
- Business: ${activeMission?.intake?.sectionA?.businessName || "Apex Advisory"}
- Workflow: ${activeMission?.intake?.sectionC?.workflowName || "Client Onboarding"}
- Priority: ${activeMission?.intake?.sectionB?.priority || "reliable_operations"}
- Mission State: ${activeMission?.state || "RECOMMENDED"}
`;

    const contents = [
      { role: "user", parts: [{ text: `System Context: ${systemInstruction}` }] },
      ...(contextHistory || []).map((h: any) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.text }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
    });

    res.json({
      reply: response.text || "No reply generated.",
    });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({
      error: "Commander chat failed",
      details: error.message,
    });
  }
});

// Start Express Server with Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`IntelliWealth Outcome OS running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
