const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

function addSectionTitle(doc, text) {
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').fontSize(14).text(text);
  doc.moveDown(0.3);
  doc.font('Helvetica').fontSize(11);
}

function safeText(value, fallback = 'N/A') {
  if (value === undefined || value === null || value === '') return fallback;
  return String(value);
}

async function writeRecommendationPdf({ outputPath, structured, meta = {} }) {
  await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(outputPath);

    stream.on('finish', resolve);
    stream.on('error', reject);
    doc.on('error', reject);

    doc.pipe(stream);

    doc.font('Helvetica-Bold').fontSize(20).text(safeText(structured.title, 'XR Recommendation Report'));
    doc.moveDown(0.5);

    doc.font('Helvetica').fontSize(10).fillColor('#555555');
    doc.text(`User ID: ${safeText(meta.userId)}`);
    doc.text(`Project ID: ${safeText(meta.projectId)}`);
    doc.text(`Generated: ${new Date().toLocaleString()}`);
    doc.fillColor('#000000');
    doc.moveDown();

    addSectionTitle(doc, 'Executive Summary');
    doc.text(safeText(structured.executiveSummary, 'No executive summary provided.'));

    if (Array.isArray(meta.selections) && meta.selections.length > 0) {
      addSectionTitle(doc, 'Project Inputs');
      meta.selections.forEach((item) => {
        doc.font('Helvetica-Bold').text(`${safeText(item.key)}: `, { continued: true });
        doc.font('Helvetica').text(safeText(item.title));
        if (item.description) {
          doc.text(`- ${item.description}`);
        }
        doc.moveDown(0.2);
      });
    }

    if (Array.isArray(structured.sections) && structured.sections.length > 0) {
      structured.sections.forEach((section) => {
        addSectionTitle(doc, safeText(section.heading, 'Section'));
        doc.text(safeText(section.body, 'No details provided.'));
        if (Array.isArray(section.tools) && section.tools.length > 0) {
          doc.moveDown(0.3);
          doc.font('Helvetica-Bold').text('Suggested tools:');
          doc.font('Helvetica');
          section.tools.forEach((tool) => doc.text(`• ${tool}`));
        }
      });
    }

    if (structured.costEstimate) {
      addSectionTitle(doc, 'Cost Estimate');
      const cost = structured.costEstimate;
      doc.text(`Currency: ${safeText(cost.currency)}`);
      doc.text(`Low: ${safeText(cost.low)}`);
      doc.text(`Mid: ${safeText(cost.mid)}`);
      doc.text(`High: ${safeText(cost.high)}`);
      doc.moveDown(0.3);
      doc.text(`Assumptions: ${safeText(cost.assumptions)}`);
    }

    if (Array.isArray(structured.references) && structured.references.length > 0) {
      addSectionTitle(doc, 'References');
      structured.references.forEach((ref) => doc.text(`• ${ref}`));
    }

    doc.end();
  });
}

module.exports = { writeRecommendationPdf };