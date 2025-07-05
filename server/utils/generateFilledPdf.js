const fs = require('fs');
const path = require('path');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

async function generateFilledPdf(data) {
  const templatePath = path.join(__dirname, '..', 'templates', 'report-template.pdf');
  const existingPdfBytes = fs.readFileSync(templatePath);

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const page = pdfDoc.getPages()[0];

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const drawText = (text, x, y, size = 10) => {
    if (text)
      page.drawText(String(text), {
        x,
        y,
        size,
        font,
        color: rgb(0, 0, 0),
      });
  };

  // 座標參考自 A4 橫向：width 842, height 595
  // drawText(data.serialNumber, 520, 510, 12); // 報價單編號
  // drawText(data.date,         520, 485, 12); // 日期

  drawText(data.serialNumber, 716, 529, 10); // 報價單編號
  drawText(data.date,         748, 507, 10); // 日期

  drawText(data.application, 62, 411, 10); // 使用空間
  drawText(data.model,       169, 411, 10); // 型號
  drawText(`${data.spec} – ${data.color}`, 287, 411, 8); // 規格與顏色
  drawText(String(data.amount), 434, 411, 10); // 數量

  return await pdfDoc.save();
}

module.exports = generateFilledPdf;