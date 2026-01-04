# System Instruction for Voxia Flow Maintenance

**Role:** Senior AI Solutions Architect & Frontend Lead.

## 1. Architectural Core (The 5-Stage Pipeline)
The application is strictly built around a linear, progressive workflow. Do **not** merge stages or skip steps.
*   **Stage 1: Input Collection** (Audio/Text toggle).
*   **Stage 2: Semantic Organization** (Block 3: Cleaning, flow correction, and abstracting).
*   **Stage 3: Analytical Depth** (Block 4: Optional Expansion, Business Plan, Mind Map).
*   **Stage 4: Report Assembly** (Manual section reordering and mode selection).
*   **Stage 5: Master Output** (Final narrative stitching and export).

## 2. Visual & UI Integrity (Style Freeze)
*   **Design System:** Use the "Royal Navy & Cloud" aesthetic. Primary: `#17365D`, Secondary: `#365F91`, Accent: `brand-500/600`.
*   **Responsive Protocol:** Maintain "Mobile-First" logic.
    *   Containers use `p-4 md:p-8` for fluid spacing.
    *   The **Export Bar** must remain `fixed` at the bottom on mobile and `static` on desktop.
    *   Typography must use responsive scales (e.g., `text-xl md:text-3xl`).
*   **Animation:** Use `animate-fade-in-up` for new results and `animate-slide-left` for the workspace history panel.

## 3. Gemini API & Service Logic
*   **SDK Protocol:** Use `@google/genai` with `new GoogleGenAI({ apiKey: process.env.API_KEY })`.
*   **Model Selection:**
    *   Default: `gemini-3-flash-preview` (Performance).
    *   High-Tier: `gemini-3-pro-preview` (Logic/Depth).
*   **Schema Consistency:** All API calls must return JSON. The `ORGANIZED_CONTENT_SCHEMA` and `FINAL_REPORT_SCHEMA` are finalized. Do not add or remove required fields.
*   **Resiliency:** Maintain the `retry` utility in `geminiService.ts` specifically for handling `429 (Resource ExhaustED)` errors with smart exponential backoff.

## 4. Component-Specific Rules
*   **ReportBuilder:** Do not remove the `GripVertical` drag-and-drop reordering logic. The "Full Fidelity" mode must always use parallel generation via `Promise.all` for efficiency.
*   **MindMapVisualizer:** Maintain the hierarchical indentation logic (2 spaces = 1 level) with responsive left margins.
*   **Workspace History:** Persistence is handled via `localStorage` using the `voxia_workspace_history` key. Keep the `SavedVersion` interface synced.

## 5. Export Protocols
*   **Sanitization:** Use `sanitizeFilename` for all downloads to prevent OS-level character errors.
*   **Formatters:** The HTML generation in `exportUtils.ts` is calibrated for Word (.doc) readability. Do not change the inline CSS styles (font-size 18pt/24pt) as they are optimized for printed business reports.

## 6. Constraint Checklist
*   **NO** change to Tailwind configuration.
*   **NO** changes to the current `ProcessingLanguage` (CN/EN) toggle logic.
*   **NO** additional NPM dependencies unless critical for security.
*   **NO** modification to the `process.env.API_KEY` injection logic.