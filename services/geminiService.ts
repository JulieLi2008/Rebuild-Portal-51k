
import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { ProposalData, ExpandedProposalData, TranslatedProposalData, OrganizedContentData, DeepDiveData, FinalReportData, ProcessingLanguage, ReportSection, GeminiModel } from "../types";

// --- EXISTING SCHEMAS ---
// Fix: Removed deprecated Schema type annotation
const PROPOSAL_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    extraction: {
      type: Type.OBJECT,
      properties: {
        painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
        proposedSolution: { type: Type.STRING },
        scopeItems: { type: Type.ARRAY, items: { type: Type.STRING } },
        timelineParams: { type: Type.STRING },
        budgetParams: { type: Type.STRING }
      },
      required: ["painPoints", "proposedSolution", "scopeItems", "timelineParams", "budgetParams"]
    },
    transcriptSummary: { type: Type.STRING },
    transcript: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: { time: { type: Type.STRING }, text: { type: Type.STRING } },
        required: ["time", "text"]
      }
    },
    proposal: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        executiveSummary: { type: Type.STRING },
        problemStatement: { type: Type.STRING },
        proposedSolution: { type: Type.STRING },
        methodologyAndDeliverables: { type: Type.ARRAY, items: { type: Type.STRING } },
        timeline: { type: Type.STRING },
        investment: { type: Type.STRING },
        termsAndConditions: { type: Type.STRING }
      },
      required: ["title", "executiveSummary", "problemStatement", "proposedSolution", "methodologyAndDeliverables", "timeline", "investment", "termsAndConditions"]
    }
  },
  required: ["extraction", "proposal", "transcriptSummary", "transcript"],
  propertyOrdering: ["proposal", "extraction", "transcriptSummary", "transcript"]
};

// --- NEW SCHEMAS FOR UPDATED WORKFLOW ---

// Fix: Removed deprecated Schema type annotation
const ORGANIZED_CONTENT_SCHEMA = {
  type: Type.OBJECT,
  description: "Organized content with proper flow and structure",
  properties: {
    title: { type: Type.STRING, description: "Auto-generated professional filename/title based on content" },
    abstract: { type: Type.STRING, description: "A concise summary (Abstract) of the entire content" },
    mainContent: { type: Type.STRING, description: "The core content, reorganized for logical flow and readability. Remove fillers, fix grammar, but keep original meaning." },
    keyPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of critical takeaways or facts" },
    language: { type: Type.STRING, enum: ["CN", "EN"], description: "The language of the output" }
  },
  required: ["title", "abstract", "mainContent", "keyPoints", "language"]
};

// Fix: Removed deprecated Schema type annotation
const DEEP_DIVE_SCHEMA = {
  type: Type.OBJECT,
  description: "Results of selected next steps",
  properties: {
    expandedContent: { type: Type.STRING, description: "Detailed expansion of the content, adding depth and context." },
    businessPlan: { type: Type.STRING, description: "Formal Business Plan structure (Strategy, Operations, Financials)." },
    mindMap: { type: Type.STRING, description: "A hierarchical Mind Map in Markdown Tree format." }
  }
};

// Fix: Removed deprecated Schema type annotation
const FINAL_REPORT_SCHEMA = {
  type: Type.OBJECT,
  description: "A cohesive, professional final report.",
  properties: {
    title: { type: Type.STRING, description: "Final Report Title" },
    executiveSummary: { type: Type.STRING, description: "High-level summary of the entire report" },
    fullNarrative: { type: Type.STRING, description: "The complete, stitched document. It must contain the full content of the inputs provided." }
  },
  required: ["title", "executiveSummary", "fullNarrative"],
  propertyOrdering: ["title", "executiveSummary", "fullNarrative"]
};

const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

// Helper to access API KEY safely in both local (process.env) and Vite production (import.meta.env)
const getApiKey = (customKey?: string): string => {
  // 1. Priority: User entered key
  if (customKey && customKey.trim().length > 0) return customKey;

  // 2. Priority: Vite Env Var
  // @ts-ignore
  const viteKey = import.meta.env?.VITE_API_KEY;
  if (viteKey) return viteKey;
  
  // 3. Priority: Process Env
  if (process.env.API_KEY) return process.env.API_KEY;
  
  throw new Error("API_KEY not found. Please enter a Custom API Key in the settings.");
};


// Helper to retry API calls with smart backoff for Quota limits
async function retry<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    if (retries === 0) throw err;
    
    let nextDelay = delay;
    const msg = err.message || JSON.stringify(err);
    
    // Smart detection for 429/Quota errors
    if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
       console.warn("Quota/Rate Limit hit. Backing off...");
       // Try to extract the requested retry delay from the error message (e.g., "retry in 21.90s")
       const match = msg.match(/retry in (\d+(\.\d+)?)s/);
       if (match) {
         // Wait the requested time + 1 second buffer
         nextDelay = Math.ceil(parseFloat(match[1]) * 1000) + 1000; 
       } else {
         // Default to 15s for generic quota issues
         nextDelay = 15000; 
       }
       
       // If the wait time is massive (> 60s), we might just want to fail or warn, 
       // but here we will try once more if we have retries.
    } else {
       nextDelay = delay * 2; // Exponential backoff for other errors
    }

    console.log(`Attempt failed. Retrying in ${nextDelay}ms... (Attempts left: ${retries})`);
    
    await new Promise(resolve => setTimeout(resolve, nextDelay));
    return retry(fn, retries - 1, nextDelay);
  }
}

// Helper for generic JSON parsing
const safeJsonParse = (text: string): any => {
  let cleanText = text.replace(/```json\n/g, '').replace(/\n```/g, '').replace(/```/g, '').trim();
  try {
    return JSON.parse(cleanText);
  } catch (e) {
    console.warn("JSON Parse Failed, attempting basic bracket recovery", e);
    // Basic bracket recovery
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
       try {
         return JSON.parse(cleanText.substring(firstBrace, lastBrace + 1));
       } catch (e2) {
         throw new Error(`Invalid JSON response: ${e.message}`);
       }
    }
    throw new Error(`Invalid JSON response: ${e.message}`);
  }
};

// Helper specifically for recovering truncated Final Reports
const recoverFinalReport = (text: string): FinalReportData => {
  console.warn("Recovering truncated Final Report...");
  let cleanText = text.replace(/```json\n?/g, '').replace(/```/g, '').trim();
  
  const result: FinalReportData = {
    title: "Report (Recovered)",
    executiveSummary: "Summary unavailable due to length.",
    fullNarrative: ""
  };

  const unescape = (s: string) => s
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
    .replace(/\\t/g, '\t');

  const extract = (key: string) => {
    const regex = new RegExp(`"${key}"\\s*:\\s*"`);
    const match = cleanText.match(regex);
    if (!match || match.index === undefined) return null;
    
    const start = match.index + match[0].length;
    let end = start;
    let isEscaped = false;
    
    while (end < cleanText.length) {
      const char = cleanText[end];
      if (char === '\\') {
        isEscaped = !isEscaped;
      } else if (char === '"' && !isEscaped) {
        return cleanText.substring(start, end);
      } else {
        isEscaped = false;
      }
      end++;
    }
    return cleanText.substring(start);
  };

  const title = extract('title');
  if (title) result.title = unescape(title);

  const summary = extract('executiveSummary');
  if (summary) result.executiveSummary = unescape(summary);

  const narrative = extract('fullNarrative');
  if (narrative) {
    result.fullNarrative = unescape(narrative) + "\n\n[System Note: Report was truncated due to output length limits. All generated content is preserved above.]";
  }

  return result;
};

// --- UTILS: ESTIMATION ---

export const getCostEstimate = (sections: ReportSection[], model: string) => {
  const totalChars = sections.filter(s => s.included).reduce((acc, s) => acc + s.content.length, 0);
  const inputTokens = Math.ceil(totalChars / 4);
  
  // Pricing Estimates (Based on Gemini Flash rates vs Pro rates)
  let inputRate = 0.0000001; // Flash ~$0.10/1M
  let outputRate = 0.0000004; // Flash ~$0.40/1M

  if (model.includes('pro')) {
     inputRate = 0.00000125; // Pro Preview (Estimated at 1.5 Pro levels) ~$1.25/1M
     outputRate = 0.000005;  // Pro Preview ~$5.00/1M
  }

  const standardCost = (inputTokens * inputRate) + (Math.min(inputTokens, 8192) * outputRate);
  
  // Full mode overhead
  const baseOverhead = model.includes('pro') ? 0.01 : 0.001;
  const fullCost = (inputTokens * 1.2 * inputRate) + (inputTokens * 1.1 * outputRate) + baseOverhead; 

  return {
    standard: Math.max(0.0001, standardCost), 
    full: Math.max(0.0002, fullCost), 
    tokenCount: inputTokens
  };
};


// --- BLOCK 3: ORGANIZE & FLOW ---
export const generateOrganizedContent = async (
  input: string[] | { data: string; mimeType: string }[],
  inputType: 'text' | 'audio',
  targetLanguage: ProcessingLanguage,
  // Fix: Updated default model name
  model: string = "gemini-3-flash-preview",
  apiKey?: string
): Promise<OrganizedContentData> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey(apiKey) });

  return retry(async () => {
    const modelId = model; 
    const parts = [];
    
    if (inputType === 'text' && Array.isArray(input)) {
       (input as string[]).forEach((segment, idx) => {
          parts.push({ text: `[Source Text Segment ${idx + 1}]:\n${segment}\n` });
       });
    } 
    else if (inputType === 'audio' && Array.isArray(input)) {
      (input as { data: string; mimeType: string }[]).forEach((file) => {
        parts.push({ inlineData: { data: file.data, mimeType: file.mimeType } });
      });
    }

    const langInstruction = targetLanguage === 'CN' 
      ? "Output Language: Simplified Chinese (简体中文). Do NOT translate to English. The Abstract, Title, and Main Content MUST be in Chinese."
      : "Output Language: English.";

    const prompt = `
      You are a professional editor and content organizer.
      1. Analyze the input(s) provided above. If there are multiple segments/files, treat them as part of a single project or meeting.
      2. **Organize and Fix Flow**: Transform the raw input into a well-structured, easy-to-read document. Remove fillers (uh, um), fix circular logic, and group related topics together.
      3. **Summarize**: Create a concise Abstract.
      4. **Title**: Generate a professional file name/title.
      5. ${langInstruction}
      
      Return JSON matching the schema.
    `;

    parts.push({ text: prompt });

    try {
      const response = await ai.models.generateContent({
        model: modelId,
        contents: { parts },
        config: {
          systemInstruction: "You are an expert content organizer. Return clean, structured data in JSON.",
          responseMimeType: "application/json",
          responseSchema: ORGANIZED_CONTENT_SCHEMA,
          temperature: 0.2,
          maxOutputTokens: 8192,
          safetySettings: SAFETY_SETTINGS,
        }
      });

      if (!response.text) throw new Error("No response generated.");
      return safeJsonParse(response.text);
    } catch (error) {
      console.error("Organize Content Error:", error);
      throw error;
    }
  }, 3, 2000); // Retry logic handles 429 inside
};

// --- BLOCK 4: NEXT STEPS ---
export const generateNextSteps = async (
  organizedData: OrganizedContentData,
  options: { expand: boolean; businessPlan: boolean; mindMap: boolean },
  targetLanguage: ProcessingLanguage,
  // Fix: Updated default model name
  model: string = "gemini-3-flash-preview",
  apiKey?: string
): Promise<DeepDiveData> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey(apiKey) });
  
  // Dynamic Schema Construction based on selection
  const properties: any = {};
  const required: string[] = [];

  if (options.expand) {
    properties.expandedContent = { type: Type.STRING, description: "Detailed expansion of the content, adding depth and context." };
    required.push("expandedContent");
  }
  if (options.businessPlan) {
    properties.businessPlan = { type: Type.STRING, description: "A formal Business Plan (Executive Summary, Market Analysis, Strategy, Operations, Financials)." };
    required.push("businessPlan");
  }
  if (options.mindMap) {
    properties.mindMap = { type: Type.STRING, description: "A hierarchical Mind Map in Markdown Tree format." };
    required.push("mindMap");
  }

  if (required.length === 0) return {};

  const DYNAMIC_SCHEMA = {
    type: Type.OBJECT,
    properties: properties,
    required: required
  };

  return retry(async () => {
    const modelId = model;
    const langInstruction = targetLanguage === 'CN' 
      ? "CRITICAL: The Output Language MUST be Simplified Chinese (简体中文). All contents, including Business Plan and Mind Map, must be written in Chinese."
      : "Output Language: English.";

    const prompt = `
      Based on the following organized content:
      Title: ${organizedData.title}
      Content: ${organizedData.mainContent}

      Please perform the following actions:
      ${options.expand ? "- EXPAND the content significantly, adding professional depth." : ""}
      ${options.businessPlan ? "- Generate a Formal BUSINESS PLAN." : ""}
      ${options.mindMap ? "- Create a MIND MAP (Markdown)." : ""}
      
      ${langInstruction}
      
      Output JSON.
    `;

    try {
      const response = await ai.models.generateContent({
        model: modelId,
        contents: { parts: [{ text: prompt }] },
        config: {
          responseMimeType: "application/json",
          responseSchema: DYNAMIC_SCHEMA,
          temperature: 0.4,
          maxOutputTokens: 8192,
          safetySettings: SAFETY_SETTINGS,
        }
      });

      if (!response.text) throw new Error("No next-step response generated.");
      return safeJsonParse(response.text);
    } catch (error) {
      console.error("Next Steps Error:", error);
      throw error;
    }
  });
};

// --- BLOCK 5: FINAL REPORT SYNTHESIS (UPDATED) ---
export const generateFinalReport = async (
  sections: ReportSection[],
  targetLanguage: ProcessingLanguage,
  mode: 'standard' | 'full' = 'standard',
  // Fix: Updated default model name
  model: string = "gemini-3-flash-preview",
  apiKey?: string
): Promise<FinalReportData> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey(apiKey) });

  // Filter only included sections
  const sectionsToProcess = sections.filter(s => s.included);
  if (sectionsToProcess.length === 0) throw new Error("No sections selected for report.");

  const modelId = model;
  const langInstruction = targetLanguage === 'CN' 
    ? "Language: Simplified Chinese (简体中文). The Title, Summary, and Narrative MUST be in Chinese."
    : "Language: English.";

  // --- FULL MODE: Parallel Generation (Optimized for Speed) ---
  if (mode === 'full') {
      try {
        // Step 1: Meta Data (Title & Summary) - can run first or parallel, but context needed
        // We use the first 20k chars as context for the summary to keep it efficient
        let allContentPreview = "";
        sectionsToProcess.forEach((s, i) => allContentPreview += `Section ${i+1} (${s.title}): ${s.content.substring(0, 10000)}...\n`); 
        
        const metaPrompt = `
          Analyze the following document sections.
          Generate a professional Title and Executive Summary for the final report.
          ${langInstruction}
          Output JSON: { "title": "...", "executiveSummary": "..." }
        `;
        
        // Start Meta Generation
        const metaPromise = ai.models.generateContent({
          model: modelId,
          contents: { parts: [{ text: metaPrompt + "\n\nContent:\n" + allContentPreview }] },
          config: { 
            responseMimeType: "application/json", 
            responseSchema: { 
              type: Type.OBJECT, 
              properties: { 
                title: {type: Type.STRING}, 
                executiveSummary: {type: Type.STRING} 
              },
              required: ["title", "executiveSummary"]
            } 
          }
        });

        // Step 2: Parallel Section Formatting
        const sectionPromises = sectionsToProcess.map(async (section) => {
          const sectionPrompt = `
            You are a professional editor.
            Format the following content section for insertion into the Final Report.
            
            Section Title: ${section.title}
            Content:
            ${section.content}
            
            Instructions:
            1. Use Markdown formatting (headers, lists, bold).
            2. Improve flow and readability suitable for a formal report.
            3. DO NOT summarize. KEEP ALL DETAILS. This is critical.
            4. ${langInstruction}
            5. Output only the formatted text content (Markdown). Do not output JSON.
          `;
          
          try {
            const secResp = await ai.models.generateContent({
              model: modelId,
              contents: { parts: [{ text: sectionPrompt }] },
            });
            return {
              title: section.title,
              content: secResp.text || ""
            };
          } catch (e) {
            console.error(`Error processing section ${section.title}:`, e);
            return {
              title: section.title,
              content: `[Error processing section: ${e.message}]`
            };
          }
        });

        // Wait for all parts to finish
        const [metaResp, ...formattedSections] = await Promise.all([metaPromise, ...sectionPromises]);
        const metaData = safeJsonParse(metaResp.text);

        // Reconstruct full narrative in correct order
        let fullNarrative = "";
        formattedSections.forEach(sec => {
            fullNarrative += `\n\n## ${sec.title}\n\n${sec.content}`;
        });
        
        return {
          title: metaData.title || "Final Report",
          executiveSummary: metaData.executiveSummary || "Summary generated.",
          fullNarrative: fullNarrative.trim()
        };
      } catch (error) {
        console.error("Full Generation Error:", error);
        throw error;
      }
  }

  // --- STANDARD MODE: Single Shot (Fast, Risk of Truncation) ---
  return retry(async () => {
    let contentToProcess = "";
    sectionsToProcess.forEach((sec, index) => {
      contentToProcess += `SECTION ${index + 1}: ${sec.title}\n`;
      contentToProcess += `${sec.content}\n`;
      contentToProcess += `--- END OF SECTION ${index + 1} ---\n\n`;
    });

    const prompt = `
      You are a Professional Document Formatter and Editor.
      I have a list of content sections that I want to merge into a single, professional Final Report.
      
      **CRITICAL INSTRUCTIONS:**
      1. **NO SUMMARIZATION**: Do NOT shorten the content. The user wants the FULL CONTENT of these sections preserved.
      2. **STITCH & SMOOTH**: Your job is to connect these sections so they read like one continuous document. Add smooth transition sentences between sections.
      3. **FORMATTING**: Use markdown headers, bullet points, and bold text to make it readable.
      4. **ORDER**: Strictly follow the order of sections provided below.
      5. ${langInstruction}

      **INPUT SECTIONS:**
      ${contentToProcess}

      Output valid JSON.
    `;

    try {
      const response = await ai.models.generateContent({
        model: modelId,
        contents: { parts: [{ text: prompt }] },
        config: {
          responseMimeType: "application/json",
          responseSchema: FINAL_REPORT_SCHEMA,
          temperature: 0.2, // Low temperature for high fidelity to input
          maxOutputTokens: 8192,
          safetySettings: SAFETY_SETTINGS,
        }
      });

      if (!response.text) throw new Error("No final report generated.");
      
      try {
        return safeJsonParse(response.text);
      } catch (jsonError) {
        // Fallback to recovery if JSON is incomplete (truncated)
        return recoverFinalReport(response.text);
      }

    } catch (error) {
      console.error("Final Report Error:", error);
      throw error;
    }
  });
};

// --- LEGACY FUNCTIONS (Kept for compatibility if needed, but not used in new flow) ---
export const generateProposal = async (input: any, inputType: any, segment: any = 'full') => { return {} as any; };
export const synthesizeMergedProposal = async (part1: any, part2: any) => { return {} as any; };
export const generateExpansion = async (blueprint: any) => { return {} as any; };
export const generateTranslation = async (expansionData: any) => { return {} as any; };
