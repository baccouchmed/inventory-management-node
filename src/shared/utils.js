const _get = require('lodash/get');
const fs = require('fs');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

const errorCatch = (error, res) => {
  if (error && error.message) {
    console.error(error.response ? error.response : error);
    return res.status(error.response ? error.response.status : 500)
      .json({
        message:
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : error.message,
        tips: {
          url: _get(error, 'config.url', ''),
          method: _get(error, 'config.method', ''),
        },
      });
  }
  console.error(error);
  return res.status(500).json({
    message: 'Server Error',
  });
};
const pdfHeaderFooter = async (path) => {
  const content = await PDFDocument.load(fs.readFileSync(path));

  // Add a font to the doc
  const helveticaFont = await content.embedFont(StandardFonts.Helvetica);

  // Draw a number at the bottom of each page.
  // Note that the bottom of the page is `y = 0`, not the top
  const pages = await content.getPages();
  for (const page of pages) {
    page.drawText('Supplier', {
      x: 100,
      y: 80,
      size: 10,
      font: helveticaFont,
      weight: 'bold',
      color: rgb(0, 0, 1),
    });
    page.drawText('Client', {
      x: page.getWidth() - 140,
      y: 80,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 1),
    });
  }

  // Write the PDF to a file
  fs.writeFileSync(path, await content.save());
};
const zeroPad = (num, places) => String(num).padStart(places, '0');

module.exports = {
  errorCatch, pdfHeaderFooter, zeroPad,
};
