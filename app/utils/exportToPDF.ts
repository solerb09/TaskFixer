import jsPDF from 'jspdf';

interface Message {
  role: "user" | "assistant";
  content: string;
  files?: { id: string; name: string }[];
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  threadId?: string;
}

/**
 * Remove conversational endings from content (PDF button reminders, etc.)
 */
const removeConversationalEndings = (content: string): string => {
  const lines = content.split('\n');
  const cleanedLines: string[] = [];

  for (const line of lines) {
    const lowerLine = line.toLowerCase().trim();

    // Skip lines that are conversational reminders about the PDF button
    if (lowerLine.includes('download') && lowerLine.includes('pdf') && lowerLine.includes('button')) {
      continue;
    }
    if (lowerLine.includes('you can download') || lowerLine.includes('use the "download pdf"')) {
      continue;
    }
    if (lowerLine.includes('your redesign is complete') && lowerLine.includes('download')) {
      continue;
    }
    if (lowerLine.includes('click the button above') || lowerLine.includes('button above')) {
      continue;
    }
    if (lowerLine.includes('let me know if you') && lowerLine.includes('further adjustments')) {
      continue;
    }
    if (lowerLine.includes('let me know if you need') && lowerLine.includes('changes')) {
      continue;
    }

    cleanedLines.push(line);
  }

  return cleanedLines.join('\n');
};

/**
 * Export the final assignment/redesign to PDF format (student-ready version)
 * @param chat - The chat object containing the assignment redesign
 */
export const exportChatToPDF = (chat: Chat) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Find the last assistant message (the final redesign)
  const assistantMessages = chat.messages.filter(msg => msg.role === 'assistant');
  const finalResponse = assistantMessages.length > 0
    ? assistantMessages[assistantMessages.length - 1].content
    : 'No assignment content available.';

  // Extract the assignment title from the AI's response content
  let assignmentTitle = 'Assignment';
  let contentWithoutTitle = finalResponse;

  const lines = finalResponse.split('\n');
  let contentStartIndex = 0;
  let foundTitle = false;

  // Always try to extract title from the AI's response content
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineLower = line.toLowerCase();

    // Look for "Assignment Title:" pattern first
    if (!foundTitle && lineLower.includes('assignment title:')) {
      const titleMatch = line.match(/assignment title:\s*(.+)/i);
      if (titleMatch) {
        assignmentTitle = titleMatch[1].trim().replace(/\*\*/g, '').replace(/\*/g, '');
        foundTitle = true;
        continue;
      }
    }

    // Look for "Project:" pattern (common in responses)
    if (!foundTitle && (lineLower.startsWith('project:') || lineLower.includes('**project:**'))) {
      const projectMatch = line.match(/\*?\*?project:\s*(.+)/i);
      if (projectMatch) {
        assignmentTitle = projectMatch[1].trim().replace(/\*\*/g, '').replace(/\*/g, '');
        foundTitle = true;
        continue;
      }
    }

    // Find the first real heading (title) if not found yet
    if (!foundTitle && line.startsWith('# ') && !line.startsWith('## ')) {
      const extractedTitle = line.replace(/^#\s*/, '').replace(/\*\*/g, '').replace(/\*/g, '');
      // Only use this as title if it's not generic
      if (!extractedTitle.toLowerCase().includes('redesigned') &&
          !extractedTitle.toLowerCase().includes('assignment redesign')) {
        assignmentTitle = extractedTitle;
        foundTitle = true;
      }
      continue;
    }

    // Look for "Project Overview" or similar section to start content
    if (lineLower.includes('project overview') ||
        lineLower.includes('## overview') ||
        (line.startsWith('## ') && foundTitle)) {
      contentStartIndex = i;
      break;
    }
  }

  // If we didn't find a good starting point, just remove conversational intro
  if (contentStartIndex === 0) {
    for (let i = 0; i < lines.length; i++) {
      const lineLower = lines[i].trim().toLowerCase();
      if (lineLower.startsWith('sure') ||
          lineLower.startsWith('i\'ll') ||
          lineLower.startsWith('let me') ||
          lineLower.startsWith('here\'s') ||
          lineLower.startsWith('here is') ||
          lineLower.includes('let\'s create') ||
          lineLower.includes('i can help') ||
          lineLower.includes('assignment title:')) {
        continue;
      }
      contentStartIndex = i;
      break;
    }
  }

  // Get content from Project Overview onward
  contentWithoutTitle = lines.slice(contentStartIndex).join('\n');

  // Remove conversational endings (PDF button reminders, etc.)
  contentWithoutTitle = removeConversationalEndings(contentWithoutTitle);

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin - 15) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to add text with word wrap
  const addText = (text: string, fontSize: number, fontStyle: string, color: string = '#000000', leftIndent: number = 0) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', fontStyle);
    pdf.setTextColor(color);

    const effectiveWidth = maxWidth - leftIndent;
    const lines = pdf.splitTextToSize(text, effectiveWidth);
    const lineHeight = fontSize * 0.45;

    for (let i = 0; i < lines.length; i++) {
      checkPageBreak(lineHeight + 2);
      pdf.text(lines[i], margin + leftIndent, yPosition);
      yPosition += lineHeight;
    }

    return lines.length * lineHeight;
  };

  // Helper function to render a table
  const renderTable = (tableLines: string[]) => {
    if (tableLines.length < 2) return;

    // Parse table headers
    const headers = tableLines[0]
      .split('|')
      .map(h => h.trim())
      .filter(h => h.length > 0);

    // Parse table rows (skip separator line)
    const rows: string[][] = [];
    for (let i = 2; i < tableLines.length; i++) {
      const cells = tableLines[i]
        .split('|')
        .map(c => c.trim())
        .filter(c => c.length > 0);
      if (cells.length > 0) {
        rows.push(cells);
      }
    }

    const numCols = headers.length;
    const colWidth = maxWidth / numCols;
    const cellPadding = 2;
    const fontSize = 8;
    const lineHeight = fontSize * 0.45;

    yPosition += 3;

    // Draw header row with dynamic height
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', 'bold');

    // Calculate header row height
    let headerRowHeight = 7;
    const headerWrappedTexts: string[][] = [];
    for (let col = 0; col < numCols; col++) {
      const maxCellWidth = colWidth - (cellPadding * 2);
      const wrappedText = pdf.splitTextToSize(headers[col], maxCellWidth);
      headerWrappedTexts.push(wrappedText);
      const cellHeight = (wrappedText.length * lineHeight) + (cellPadding * 2);
      headerRowHeight = Math.max(headerRowHeight, cellHeight);
    }

    // Check if table header fits on page
    checkPageBreak(headerRowHeight + 10);

    // Draw header background and borders
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin, yPosition, maxWidth, headerRowHeight, 'F');
    pdf.setDrawColor(180, 180, 180);
    pdf.setLineWidth(0.3);

    // Draw header cells with wrapped text
    for (let col = 0; col < numCols; col++) {
      const x = margin + (col * colWidth);
      pdf.rect(x, yPosition, colWidth, headerRowHeight);

      // Header text (centered)
      pdf.setTextColor(0, 0, 0);
      const wrappedText = headerWrappedTexts[col];
      const textStartY = yPosition + cellPadding + lineHeight;

      for (let lineIdx = 0; lineIdx < wrappedText.length; lineIdx++) {
        const textWidth = pdf.getTextWidth(wrappedText[lineIdx]);
        const textX = x + (colWidth - textWidth) / 2;
        pdf.text(wrappedText[lineIdx], textX, textStartY + (lineIdx * lineHeight));
      }
    }

    yPosition += headerRowHeight;

    // Draw data rows with dynamic heights
    pdf.setFont('helvetica', 'normal');
    for (let row = 0; row < rows.length; row++) {
      const cells = rows[row];

      // Calculate row height based on cell content
      let currentRowHeight = 7;
      const cellWrappedTexts: string[][] = [];

      for (let col = 0; col < numCols && col < cells.length; col++) {
        const maxCellWidth = colWidth - (cellPadding * 2);
        const wrappedText = pdf.splitTextToSize(cells[col], maxCellWidth);
        cellWrappedTexts.push(wrappedText);
        const cellHeight = (wrappedText.length * lineHeight) + (cellPadding * 2);
        currentRowHeight = Math.max(currentRowHeight, cellHeight);
      }

      // Check if row fits on current page
      checkPageBreak(currentRowHeight + 5);

      // Alternate row colors for better readability
      if (row % 2 === 1) {
        pdf.setFillColor(250, 250, 250);
        pdf.rect(margin, yPosition, maxWidth, currentRowHeight, 'F');
      }

      // Draw cells with wrapped text
      for (let col = 0; col < numCols && col < cells.length; col++) {
        const x = margin + (col * colWidth);

        // Cell border
        pdf.setDrawColor(180, 180, 180);
        pdf.rect(x, yPosition, colWidth, currentRowHeight);

        // Cell text
        pdf.setFontSize(fontSize);
        pdf.setTextColor(0, 0, 0);
        const wrappedText = cellWrappedTexts[col];
        const textX = x + cellPadding;
        const textStartY = yPosition + cellPadding + lineHeight;

        // Draw all lines of wrapped text
        for (let lineIdx = 0; lineIdx < wrappedText.length; lineIdx++) {
          pdf.text(wrappedText[lineIdx], textX, textStartY + (lineIdx * lineHeight));
        }
      }

      yPosition += currentRowHeight;
    }

    yPosition += 5;
  };

  // Parse and render the content with formatting
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    let inCodeBlock = false;
    let inTable = false;
    let tableLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Detect table start/end
      if (trimmedLine.match(/^\|.*\|$/)) {
        if (!inTable) {
          inTable = true;
          tableLines = [];
        }
        tableLines.push(line);
        continue;
      } else if (inTable) {
        // End of table
        renderTable(tableLines);
        inTable = false;
        tableLines = [];
      }

      // Skip horizontal rules (dashes between sections)
      if (trimmedLine.match(/^[-=_*]{3,}$/)) {
        continue;
      }

      // Skip empty lines but add spacing
      if (!trimmedLine) {
        yPosition += 3;
        continue;
      }

      // Code blocks
      if (trimmedLine.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        if (!inCodeBlock) yPosition += 3;
        continue;
      }

      if (inCodeBlock) {
        checkPageBreak(6);
        pdf.setFillColor(245, 245, 245);
        const codeHeight = 5;
        pdf.rect(margin + 5, yPosition - 3, maxWidth - 10, codeHeight, 'F');
        addText(line, 9, 'normal', '#333333', 7);
        continue;
      }

      // Headers (remove hashtags and asterisks) - check from most specific to least specific
      if (trimmedLine.startsWith('#####')) {
        yPosition += 3;
        checkPageBreak(6);
        const cleanHeader = trimmedLine.replace(/^#####\s*/, '').replace(/\*\*/g, '').replace(/\*/g, '');
        addText(cleanHeader, 10, 'bold', '#000000');
        yPosition += 1;
      } else if (trimmedLine.startsWith('####')) {
        yPosition += 3;
        checkPageBreak(7);
        const cleanHeader = trimmedLine.replace(/^####\s*/, '').replace(/\*\*/g, '').replace(/\*/g, '');
        addText(cleanHeader, 11, 'bold', '#000000');
        yPosition += 1.5;
      } else if (trimmedLine.startsWith('###')) {
        yPosition += 4;
        checkPageBreak(8);
        const cleanHeader = trimmedLine.replace(/^###\s*/, '').replace(/\*\*/g, '').replace(/\*/g, '');
        addText(cleanHeader, 12, 'bold', '#000000');
        yPosition += 2;
      } else if (trimmedLine.startsWith('##')) {
        yPosition += 5;
        checkPageBreak(10);
        const cleanHeader = trimmedLine.replace(/^##\s*/, '').replace(/\*\*/g, '').replace(/\*/g, '');
        addText(cleanHeader, 14, 'bold', '#000000');
        yPosition += 3;
      } else if (trimmedLine.startsWith('#')) {
        yPosition += 6;
        checkPageBreak(12);
        const cleanHeader = trimmedLine.replace(/^#\s*/, '').replace(/\*\*/g, '').replace(/\*/g, '');
        addText(cleanHeader, 16, 'bold', '#000000');
        yPosition += 4;
      }
      // Bullet points
      else if (trimmedLine.match(/^[-*]\s/)) {
        checkPageBreak(6);
        const bulletText = trimmedLine
          .replace(/^[-*]\s*/, '')
          .replace(/\*\*/g, '');  // Remove bold markers
        pdf.setFontSize(10);
        pdf.text('•', margin + 5, yPosition);
        addText(bulletText, 10, 'normal', '#000000', 10);
      }
      // Numbered lists
      else if (trimmedLine.match(/^\d+\.\s/)) {
        checkPageBreak(6);
        const match = trimmedLine.match(/^(\d+\.)\s*(.+)/);
        if (match) {
          const cleanText = match[2].replace(/\*\*/g, '');  // Remove bold markers
          pdf.setFontSize(10);
          pdf.text(match[1], margin + 5, yPosition);
          addText(cleanText, 10, 'normal', '#000000', 15);
        }
      }
      // Regular paragraphs
      else {
        checkPageBreak(6);
        const cleanLine = trimmedLine
          .replace(/^#+\.?\s*/, '')  // Remove all leading hashtags (with optional period)
          .replace(/\*\*/g, '')  // Remove all bold markers
          .replace(/\*/g, '')    // Remove all italic markers
          .replace(/`([^`]+)`/g, '$1');  // Inline code
        if (cleanLine) {  // Only add non-empty lines
          addText(cleanLine, 10, 'normal', '#000000');
          yPosition += 1.5;
        }
      }
    }

    // Handle any remaining table at the end
    if (inTable && tableLines.length > 0) {
      renderTable(tableLines);
    }
  };

  // Add header with assignment title
  yPosition = margin;

  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text(assignmentTitle, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 8;

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'italic');
  pdf.setTextColor(100, 100, 100);
  pdf.text('Redesigned with TaskFixerAI', pageWidth / 2, yPosition, { align: 'center' });

  // Add separator line
  yPosition += 5;
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.3);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);

  yPosition += 8;

  // Render the final assignment content
  renderContent(contentWithoutTitle);

  // Add footer on each page
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);

    // Footer line
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

    // Footer text
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      `Page ${i} of ${totalPages}`,
      margin,
      pageHeight - 10
    );
    pdf.text(
      'Created with TaskFixerAI by Creative Transformations Consulting',
      pageWidth - margin,
      pageHeight - 10,
      { align: 'right' }
    );
  }

  // Generate filename and save
  const filename = `${assignmentTitle.replace(/[^a-z0-9]/gi, '_')}.pdf`;
  pdf.save(filename);
};

