import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Initialize Gemini AI Client securely on the server
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      firm: "Apex & Associates, Chartered Accountants",
      version: "2.4.0",
      geminiConfigured: !!process.env.GEMINI_API_KEY,
    });
  });

  // AI Assistant Endpoint: Task Summary, Email Drafting, Risk Detection, SOP Generation
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { type, prompt, context } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        // Fallback intelligent responses tailored for CA firm tasks if API key not present
        return res.json({
          result: generateDeterministicCAResponse(type, prompt, context),
          isFallback: true,
        });
      }

      let systemInstruction = `You are an expert Chartered Accountant (FCA), Senior Partner, and Audit Quality Reviewer in a premier Big-4 / Top-tier Accounting firm. 
You specialize in Indian & International Auditing Standards (SAs, ISAs), Companies Act 2013, Indian Accounting Standards (Ind AS / IFRS), Income Tax Act 1961, GST Acts, Insolvency and Bankruptcy Code (IBC 2016), RBI Prudential Norms, and Forensic Audit Standards.
Your output must be professional, meticulous, legally precise, and formatted in clear Markdown with appropriate headers, bullet points, and statutory references.`;

      let userPrompt = "";

      if (type === "task-summary") {
        userPrompt = `Please analyze and generate a high-level executive audit summary for the following assignment and pending tasks:
Assignment Details: ${JSON.stringify(context?.assignment || {})}
Pending Tasks: ${JSON.stringify(context?.tasks || [])}
Specific Focus: ${prompt || "Summarize bottlenecks, pending working paper reviews, and immediate action items for the Partner."}`;
      } else if (type === "email-draft") {
        userPrompt = `Draft a formal, professional communication email for a CA firm client.
Client: ${context?.clientName || "Client"}
Assignment: ${context?.assignmentTitle || "Statutory Compliance & Audit"}
Purpose / Tone: ${prompt}
Context / Outstanding Requirements: ${JSON.stringify(context?.requirements || [])}
Include clear subject line, polite yet firm professional tone, reference to statutory timelines, itemized requirements table/list, and formal partner sign-off signature block.`;
      } else if (type === "risk-detection") {
        userPrompt = `Perform an Audit & Compliance Risk Assessment based on the current assignment status, deadlines, and working papers:
Assignment & Compliance Data: ${JSON.stringify(context || {})}
User Query: ${prompt || "Identify key audit risks, going concern indicators, missing statutory compliances, and document deficiencies."}
Provide:
1. Critical High-Risk Areas (with statutory section/clause reference)
2. Immediate Partner Escalations
3. Recommended Audit Procedures / Safeguards`;
      } else if (type === "sop-generator") {
        userPrompt = `Generate a comprehensive Standard Operating Procedure (SOP) and Audit Quality Checklist for the following CA firm assignment:
Assignment Type: ${prompt}
Industry Context: ${context?.industry || "Corporate / Manufacturing / Banking"}
Key Standard: ${context?.standard || "Standard on Auditing (SA) / IBC Regulations / Income Tax"}
Structure the SOP with:
- Objective & Scope
- Pre-engagement & KYC / Independence checks (SA 210, SA 220)
- Execution Phase & Sampling Procedures
- Multi-tier Review Checkpoints (Article -> Manager -> Partner)
- Final Deliverables & Reporting Documentation`;
      } else {
        userPrompt = `As a Senior Chartered Accountant advisor, address the following query:
Prompt: ${prompt}
Context: ${JSON.stringify(context || {})}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      res.json({
        result: response.text || "No response generated.",
        isFallback: false,
      });
    } catch (error: any) {
      console.error("Gemini AI error:", error);
      res.status(500).json({
        error: error.message || "Failed to generate AI response",
        fallback: generateDeterministicCAResponse(
          req.body.type,
          req.body.prompt,
          req.body.context
        ),
      });
    }
  });

  // Helper for deterministic fallback responses
  function generateDeterministicCAResponse(
    type: string,
    prompt: string,
    context: any
  ): string {
    const client = context?.clientName || context?.assignment?.clientName || "ABC Industries Ltd.";
    const asgName = context?.assignmentTitle || context?.assignment?.title || "Statutory Audit FY 2024-25";

    if (type === "email-draft") {
      return `**Subject: URGENT: Outstanding Audit Requisitions & Pending Documentation for ${asgName} - ${client}**

Dear Finance Team / Chief Financial Officer,
**${client}**

**Ref: Engagement for ${asgName}**

We trust this email finds you well.

As we progress towards the finalization of the audit milestones and upcoming regulatory submission deadlines, our review team has noted several pending requisitions that are critical for completing the working paper verifications in compliance with Standards on Auditing (SA 500 - Audit Evidence).

### 📋 Outstanding Documents & Requisitions:
1. **Audited Trial Balance & Grouping Schedules** with detailed sub-ledger mapping.
2. **Fixed Asset Register (FAR)** reconciled with Physical Verification Report as on year-end.
3. **Statutory Dues Reconciliation:** GSTR-2B vs. Books ITC reconciliation and 26AS/AIS Tax Credit matching.
4. **Direct Confirmation Balances:** Top 10 Debtors and Creditors circularization confirmation copies.
5. **Actuarial Valuation Report** for Gratuity and Leave Encashment liabilities (Ind AS 19 / AS 15).

To ensure timely partner sign-off and avoid statutory penalty implications under the Companies Act and Income Tax provisions, kindly provide these documents on or before **Friday, 5:00 PM**.

Should you require any clarification on the above items, please feel free to reach out to our Audit Manager (*audit.manager@apexcafirm.com*).

Warm regards,

**CA Rajeshwar Singhania, FCA**  
*Senior Partner - Audit & Assurance Services*  
**Apex & Associates, Chartered Accountants**  
*ICAI Firm Registration No.: 104522W*  
*Direct: +91 22 6789 4400 | www.apexcafirm.com*`;
    }

    if (type === "task-summary") {
      return `### 📊 Executive Audit & Task Summary Report

**Client:** ${client}  
**Engagement:** ${asgName}  
**Review Status:** Partner Sign-off Pending

#### 1. Executive Status
- **Total Work Papers Assigned:** 14 Modules
- **Completed & Senior Reviewed:** 11 Modules (78.5%)
- **Critical Under-Review:** 2 Modules (Revenue Recognition SA 240 & Related Party Disclosures SA 550)
- **Bottlenecks:** Awaiting Bank Balance Confirmation for 2 foreign currency escrow accounts.

#### 2. Key Action Items for Partner
1. **Going Concern & Subsequent Events (SA 560):** Inquire into post-balance sheet restructuring loan covenants.
2. **Internal Financial Controls (IFC):** Review management response on IT General Controls (ITGC) segregation of duties exception.
3. **Tax Audit Form 3CD:** Verify Section 43B(h) compliance regarding MSME payment delays.

#### 3. Recommended Next Step
Release preliminary draft observations to Audit Committee and schedule pre-signoff Partner clearance meeting for tomorrow at 3:00 PM.`;
    }

    if (type === "risk-detection") {
      return `### ⚠️ Audit & Compliance Risk Assessment Report

**Identified Risk Level:** <span style="color:#e11d48;font-weight:bold;">MODERATE TO HIGH</span>

#### 1. Statutory Compliance & Filing Risks
- **Section 43B(h) MSME Disallowances:** Outstanding dues over 45 days to micro/small enterprises require explicit interest calculation and disallowance under Income Tax Form 3CD Clause 22.
- **GST Input Tax Credit (Rule 37A):** Variance noted between GSTR-3B claimed and supplier GSTR-1 filings exceeding permissible tolerance thresholds.
- **TDS Compliance (Sec 194Q / 206C(1H)):** Verification pending for high-value scrap purchases and contract vendor threshold deduction proofs.

#### 2. Audit Quality & SA Compliance Deficiencies
- **SA 505 External Confirmations:** Third-party vendor balance confirmations received stand at only 42% of total material exposure. Alternate audit procedures (subsequent clearance testing) must be documented in working papers immediately.
- **Inventory Valuation (SA 501):** Physical verification roll-back reconciliation not signed off by Senior Assistant.

#### 3. Partner Safeguard Recommendation
Mandate Article assistant to obtain signed Management Representation Letter (MRL) under SA 580 covering contingent liabilities and litigation disclosures prior to audit report issuance.`;
    }

    return `### 📘 Standard Operating Procedure (SOP): ${prompt || "Audit & Assurance Engagement"}

**Category:** Quality Control Framework (SQC 1 & SA 220)  
**Applicable Standard:** Standards on Auditing issued by ICAI

#### Phase 1: Pre-Engagement & KYC
1. **Client Acceptance & Independence:** Confirm absence of statutory disqualification under Section 141(3) of Companies Act 2013.
2. **Engagement Letter (SA 210):** Issue formal engagement letter detailing management responsibility for financial statements and auditor's scope.
3. **Communication with Preceding Auditor (Code of Ethics):** Send mandatory written communication under Clause 8 of Part I of First Schedule to CA Act 1949.

#### Phase 2: Audit Planning & Materiality (SA 300, 315, 320)
1. Determine Overall Financial Statement Materiality and Performance Materiality (usually 0.5% - 2% of Turnover or 5% of PBT).
2. Document Understanding of Internal Financial Controls (IFCoFR) and Process Walkthroughs.
3. Formulate Audit Sampling Plan (SA 530) across high-risk ledgers.

#### Phase 3: Fieldwork & Working Paper Hierarchy
- **Article Assistant / Executive:** Performs substantive vouching, ledger scrutiny, 3-way matching of PO/GRN/Invoice, and populates Standard Working Paper Templates (WPT-01 to WPT-15).
- **Senior / Manager:** Performs substantive review, notes review queries in Audit Log, tests cut-off procedures, and verifies statutory registers.
- **Partner Review:** Evaluates significant judgment areas, accounting estimates (SA 540), key audit matters (SA 701), and approves draft financial statements.

#### Phase 4: Final Sign-Off & Documentation Archival
1. Obtain signed Financial Statements, Directors' Report, and Management Representation Letter (SA 580).
2. Generate UDIN (Unique Document Identification Number) on ICAI portal within prescribed timeframe.
3. Archive audit documentation file within 60 days of audit report date pursuant to SQC 1.`;
  }

  // Vite middleware for development
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
    console.log(`CA Firm Management Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
