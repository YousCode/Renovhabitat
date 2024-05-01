const fs = require("fs");
const path = require("path");
const sanitizeHtml = require("sanitize-html");

function buildGenericTemplate({ title, message, cta_title, cta_link }) {
  const htmlEmail = fs.readFileSync(path.resolve(__dirname, "./generic.html")).toString();
  const htmlEmailWithRealValue = htmlEmail
    .replace(/{{TITLE}}/g, sanitizeHtml(title))
    .replace(/{{MESSAGE}}/g, sanitizeHtml(message).replace(/\n/g, "<br/>"))
    .replace(/{{CTA_TITLE}}/g, sanitizeHtml(cta_title))
    .replace(/{{CTA_LINK}}/g, sanitizeHtml(cta_link));

  return htmlEmailWithRealValue;
}

module.exports = { buildGenericTemplate };
