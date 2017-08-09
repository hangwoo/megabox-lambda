const nodemailer = require('nodemailer');
const { user } = require('./config');
const smtpConfig = {
  service: 'gmail',
  auth: {
    user: user.id,
    pass: user.pass,
  },
};

const transporter = nodemailer.createTransport('SMTP', (smtpConfig));

function options (html, to) {
  this.from = user.id;
  this.subject = '메가찬스 신작 업데이트!!';
  this.text = '';
  this.html = '';
  this.makeHtml = (name) => {
    this.html = ``
  }
}

exports.transporter = transporter;
exports.options = options;
