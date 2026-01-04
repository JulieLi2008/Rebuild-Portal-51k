
import { ProposalData, ExpandedProposalData, TranslatedProposalData, ProposalTheme } from '../types';

// --- Helper: Filenames ---
export const sanitizeFilename = (title: string, suffix: string = ''): string => {
  if (!title) return `Document${suffix}`;
  // Remove illegal characters for file systems
  let safeTitle = title.replace(/[<>:"/\\|?*]/g, '');
  // Remove control characters
  safeTitle = safeTitle.replace(/[\x00-\x1f\x80-\x9f]/g, '');
  // Replace spaces with underscores
  safeTitle = safeTitle.trim().replace(/\s+/g, '_');
  // Truncate length
  if (safeTitle.length > 80) safeTitle = safeTitle.substring(0, 80);
  if (safeTitle.length === 0) return `Document${suffix}`;
  return `${safeTitle}${suffix}`;
};

// --- Helper: Formatters ---
export const formatMarkdownToHtml = (text: string): string => {
  if (!text) return '';
  // Basic markdown-to-html converter for the preview/export
  // This handles Headers, Bold, Italic, and Lists
  return text
    .replace(/^### (.*$)/gim, '<h3 style="font-size:14pt; margin-top:10px;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="font-size:16pt; margin-top:15px; border-bottom:1px solid #ccc;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="font-size:20pt; text-align:center;">$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>')
    .replace(/\*(.*?)\*/gim, '<i>$1</i>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/\n/gim, '<br />');
};

// --- Helper: HTML Generator ---
const generateFullHtml = (title: string, bodyContent: string, theme?: ProposalTheme) => {
    const primary = theme?.primaryColor || '#17365D';
    const secondary = theme?.secondaryColor || '#365F91';
    const font = theme?.fontFamily || 'sans-serif';
    
    // Logo HTML
    let logoHtml = '';
    if (theme?.logoUrl) {
        logoHtml = `<div style="text-align:center; margin-bottom:20px;"><img src="${theme.logoUrl}" style="max-height:80px;" /></div>`;
    }

    return `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { font-family: ${font}, sans-serif; line-height: 1.5; color: #333; }
          h1 { color: ${primary}; font-size: 24pt; text-transform: uppercase; text-align: center; margin-bottom: 24px; }
          h2 { color: ${secondary}; font-size: 18pt; border-bottom: 1px solid #eee; padding-bottom: 6px; margin-top: 24px; margin-bottom: 12px; }
          h3 { color: ${primary}; font-size: 14pt; margin-top: 18px; margin-bottom: 8px; }
          h4 { color: ${secondary}; font-size: 12pt; font-weight: bold; margin-top: 12px; margin-bottom: 4px; }
          p { margin-bottom: 12px; }
          ul { margin-bottom: 12px; }
          li { margin-bottom: 4px; }
          .page-break { page-break-after: always; }
          pre { background: #f5f5f5; padding: 10px; font-family: monospace; white-space: pre-wrap; border-radius: 4px; border: 1px solid #ddd; }
          blockquote { border-left: 4px solid ${primary}; padding-left: 10px; color: #555; font-style: italic; }
        </style>
      </head>
      <body>
        ${logoHtml}
        ${bodyContent}
      </body>
      </html>
    `;
};

// --- Generator Helpers for Specific Views ---

export const generateProposalHtml = (data: ProposalData, theme?: ProposalTheme): string => {
    const { proposal } = data;
    let html = `<h1>${proposal.title}</h1>`;
    html += `<h2>Executive Summary</h2><p>${proposal.executiveSummary.replace(/\n/g, '<br>')}</p>`;
    html += `<h2>Problem Statement</h2><p>${proposal.problemStatement.replace(/\n/g, '<br>')}</p>`;
    html += `<h2>Proposed Solution</h2><p>${proposal.proposedSolution.replace(/\n/g, '<br>')}</p>`;
    html += `<h2>Methodology</h2><ul>${proposal.methodologyAndDeliverables.map(m => `<li>${m}</li>`).join('')}</ul>`;
    html += `<h2>Timeline</h2><p>${proposal.timeline.replace(/\n/g, '<br>')}</p>`;
    html += `<h2>Investment</h2><p>${proposal.investment.replace(/\n/g, '<br>')}</p>`;
    html += `<h2>Terms</h2><p>${proposal.termsAndConditions.replace(/\n/g, '<br>')}</p>`;
    return html;
};

export const generateExpansionHtml = (data: ExpandedProposalData | TranslatedProposalData | any, title: string, subtitle: string): string => {
    let html = `<h1>${title}</h1>`;
    html += `<p style="text-align:center; font-style:italic; margin-bottom:30px;">${subtitle}</p>`;
    
    if (data.abstract) html += `<h3>Abstract</h3><p>${data.abstract}</p>`;
    if (data.coreBusiness) html += `<h3>1. Core Business</h3><div style="white-space: pre-wrap;">${formatMarkdownToHtml(data.coreBusiness)}</div>`;
    if (data.coalitionOpportunities) html += `<h3>2. Coalition</h3><div style="white-space: pre-wrap;">${formatMarkdownToHtml(data.coalitionOpportunities)}</div>`;
    if (data.strategiesAndMembership) html += `<h3>3. Strategy</h3><div style="white-space: pre-wrap;">${formatMarkdownToHtml(data.strategiesAndMembership)}</div>`;
    if (data.insuranceAndCrossBusiness) html += `<h3>4. Cross-Industry</h3><div style="white-space: pre-wrap;">${formatMarkdownToHtml(data.insuranceAndCrossBusiness)}</div>`;
    if (data.equityStructure) html += `<h3>5. Equity</h3><div style="white-space: pre-wrap;">${formatMarkdownToHtml(data.equityStructure)}</div>`;
    if (data.financialRisk) html += `<h3>6. Risk</h3><div style="white-space: pre-wrap;">${formatMarkdownToHtml(data.financialRisk)}</div>`;
    if (data.marketingProposal) html += `<h3>7. Marketing</h3><div style="white-space: pre-wrap;">${formatMarkdownToHtml(data.marketingProposal)}</div>`;
    if (data.mindMap) html += `<h3>Appendix: Mind Map</h3><pre>${data.mindMap}</pre>`;
    
    return html;
};

// --- Export Functions ---

export const exportToWord = (filename: string, title: string, htmlContent: string, theme?: ProposalTheme) => {
    const fullHtml = generateFullHtml(title, htmlContent, theme);
    // Use HTML-based .doc format which Word opens natively
    const blob = new Blob(['\ufeff', fullHtml], {
        type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.doc') ? filename : `${filename}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportToPdf = (title: string, htmlContent: string, theme?: ProposalTheme) => {
    const fullHtml = generateFullHtml(title, htmlContent, theme);
    // Open print window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(fullHtml);
        printWindow.document.close();
        printWindow.focus();
        // Allow images/styles to load before printing
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    }
};

export const exportToText = (filename: string, textContent: string) => {
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.txt') ? filename : `${filename}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportToMarkdown = (filename: string, textContent: string) => {
    const blob = new Blob([textContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.md') ? filename : `${filename}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
    