const fs = require('fs');
const path = require('path');
const utils = require('util');
const hb = require('handlebars');
const HTML5ToPDF = require('html5-to-pdf');

const readFile = utils.promisify(fs.readFile);

const getTemplateHtml = async (template) => {
  try {
    const invoicePath = path.resolve(template);
    return await readFile(invoicePath, 'utf8');
  } catch (err) {
    return Error.reject('Could not load html template');
  }
};
const generatePdf = async (data, template, output) => {
  try {
    const htmlTemplate = await getTemplateHtml(template);
    const dynamicTemplate = await hb.compile(htmlTemplate, { strict: true });
    const result = await dynamicTemplate(data, {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    });
    const html = result;
    const html5ToPDF = new HTML5ToPDF({
      inputBody: html,
      outputPath: output,
      options: {
        pageSize: 'A3',
        landscape: true,
        printBackground: true,
      },
      templatePath: path.join('src', 'template'),
      renderDelay: 1000,
      launchOptions: {
        headless: true,
        args: ['--no-sandbox'],
      },
    });
    await html5ToPDF.start();
    await html5ToPDF.build();
    await html5ToPDF.close();
  } catch (e) {
    console.error(e);
  }
};

module.exports = { generatePdf };
