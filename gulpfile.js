import { readFileSync, writeFileSync } from 'fs';
import gulp from 'gulp';
import { minify } from 'html-minifier-terser';
import axios from './axios.js';
import { config } from 'dotenv';
config();

async function minifyHTML(cb) {
  try {
    const file = readFileSync('./src/index.html', 'utf8');

    var result = await minify(file, {
      removeAttributeQuotes: true,
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true,
      minifyCSS: true,
      conservativeCollapse: true,
      removeTagWhitespace: true,
    });

    writeFileSync('./src/minified.html', result.replace(/"/g, "'"));
    cb();
  } catch (e) {
    console.log('Error at minifying HTML:', e);
  }
}

async function updateEmailTemplate(cb) {
  try {
    const minifiedHTML = readFileSync('./src/minified.html', 'utf8');

    const emailTemplateObj = {
      name: process.env.TARGET_EMAIL_TEMPLATE,
      subject: 'Your Requested Patient Savings Cards',
      text: 'Dear Healthcare Provider,\n\nAttached are the patients savings offers you requested. Each offer has a unique identification number, so please make sure you give it out to only one patient.\n\nPlease visit the product website or https://www.pfizerpro.com/ if you need additional resources for your patients.\n\nThank you!\nPfizer for Professionals\n\n\nTo make sure you receive e-mail from Pfizer, please add noreply@grv.pfizer.com to your address book.\n\nIf you have received this e-mail in error or need assistance, please contact PfizerPro customer experience team toll-free: 1-800-505-4426, Weekdays, 8:30 a.m to 9:00 p.m EST.\n\nPlease do not reply as this is an unattended e-mail box. If you wish to contact Pfizer, go to https://www.pfizer.com/contact\n\nThe information provided is intended only for health care professionals in the United States.\n\nTerms of Use: http://www.pfizer.com/general/terms\nPrivacy Policy: http://www.pfizer.com/general/privacy\n\nPP-MCL-USA-0398\n\nCopyright (c) 2022 Pfizer Inc. All rights reserved.',
      html: minifiedHTML,
    };

    await axios.put(process.env.EMAIL_ENDPOINT, emailTemplateObj);

    cb();
  } catch (e) {
    console.log('Error at updating Email Template:', e);
  }
}

async function submitForm(cb) {
  try {
    const { data: getForm } = await axios.get(process.env.FORM_ENDPOINT, {
      headers: {
        'x-config-token': process.env.TARGET_FORM_CONFIG,
      },
    });

    const { csrfToken } = getForm.data;

    await axios.post(
      process.env.FORM_ENDPOINT,
      {
        csrfToken,
      },
      { headers: { 'x-config-token': process.env.TARGET_FORM_CONFIG } }
    );

    cb();
  } catch (e) {
    console.log('Error while submitting form', e);
  }
}

export default function () {
  gulp.watch(
    './src/index.html',
    gulp.series(minifyHTML, updateEmailTemplate, submitForm)
  );
}
