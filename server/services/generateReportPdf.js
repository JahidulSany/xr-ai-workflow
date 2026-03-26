const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

function resolvePublicImage(relativePath) {
  if (!relativePath || typeof relativePath !== 'string') {
    return null;
  }
  const clean = relativePath.replace(/^\//, '');
  const abs = path.join(__dirname, '../../client/public', clean);
  return fs.existsSync(abs) ? abs : null;
}

function writeRecommendationPdf({ outputPath, structured, meta }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    const title = structured.title || 'XR project recommendation report';
    doc.fontSize(20).text(title, { align: 'center' });
    doc.moveDown();
    doc
      .fontSize(10)
      .fillColor('#444444')
      .text(
        `User ID: ${users.userId}   Project ID: ${project.id}`,
        { align: 'center' },
      );
    doc.fillColor('#000000');
    doc.moveDown(2);

    const selections = Array.isArray(meta.selections) ? meta.selections : [];
    const images = selections
      .map((s) => s.image)
      .filter(Boolean)
      .slice(0, 4);

    if (images.length) {
      doc.fontSize(12).text('Selections from your form', { underline: true });
      doc.moveDown(0.5);
      let y = doc.y;
      images.forEach((imgPath) => {
        const abs = resolvePublicImage(imgPath);
        if (abs) {
          try {
            doc.image(abs, 50, y, { width: 130 });
            y += 115;
          } catch {
            y += 10;
          }
        }
      });
      doc.y = y;
      doc.moveDown();
    }

    doc.fontSize(11).text('Executive summary', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).text(structured.executiveSummary || '', {
      align: 'justify',
    });
    doc.moveDown();

    const sections = Array.isArray(structured.sections)
      ? structured.sections
      : [];
    sections.forEach((section) => {
      doc.addPage();
      doc.fontSize(14).text(section.heading || 'Section', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10).text(section.body || '', { align: 'justify' });
      doc.moveDown();

      const tools = Array.isArray(section.tools) ? section.tools : [];
      if (tools.length) {
        doc.fontSize(11).text('Suggested tools', { underline: true });
        doc.moveDown(0.5);
        tools.forEach((t) => {
          const name = t.name || 'Tool';
          const url = t.url || '';
          doc.fontSize(10).font('Helvetica-Bold').text(name);
          doc.font('Helvetica');
          if (url) {
            doc.fillColor('blue').text(url, { link: url, underline: true });
            doc.fillColor('#000000');
          }
          if (t.role) {
            doc.text(`Role: ${t.role}`);
          }
          if (t.pricingNotes) {
            doc.text(`Pricing: ${t.pricingNotes}`);
          }
          doc.moveDown(0.5);
        });
      }
    });

    doc.addPage();
    doc.fontSize(14).text('Cost estimate', { underline: true });
    doc.moveDown();
    const ce = structured.costEstimate || {};
    doc.fontSize(10);
    doc.text(`Currency: ${ce.currency || 'GBP'}`);
    doc.text(`Low: ${ce.low || 'n/a'}`);
    doc.text(`Mid: ${ce.mid || 'n/a'}`);
    doc.text(`High: ${ce.high || 'n/a'}`);
    doc.moveDown();
    doc.text(`Assumptions: ${ce.assumptions || 'n/a'}`, { align: 'justify' });

    const refs = Array.isArray(structured.references) ? structured.references : [];
    if (refs.length) {
      doc.moveDown(2);
      doc.fontSize(14).text('Links and references', { underline: true });
      doc.moveDown(0.5);
      refs.forEach((r) => {
        const label = r.label || 'Link';
        const url = r.url || '';
        doc.fontSize(10).font('Helvetica-Bold').text(label);
        doc.font('Helvetica');
        if (url) {
          doc.fillColor('blue').text(url, { link: url, underline: true });
          doc.fillColor('#000000');
        }
        doc.moveDown(0.5);
      });
    }

    doc.end();
    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
}

module.exports = { writeRecommendationPdf };
