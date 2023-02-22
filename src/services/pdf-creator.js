const fs = require('fs');

const { generatePdf } = require('../shared/warped-pdf-creator');
const { errorCatch } = require('../shared/utils');

const createInvoice = async (
  data,
  templatePath,
  outputPath,
  folderPath,
) => {
  try {
    const folders = folderPath.split('/');
    let folderCreation = 'src';
    for await (const folder of folders) {
      if (!fs.existsSync(`${folderCreation}/${folder}`)) {
        fs.mkdirSync(`${folderCreation}/${folder}`);
      }
      folderCreation = `${folderCreation}/${folder}`;
    }

    await generatePdf(
      data, templatePath, outputPath,
    );

    return true;
  } catch (e) {
    return errorCatch(e);
  }
};
module.exports = { createInvoice };
