const mailer = require('./mailer');
const transporter = mailer.transporter;
const { user } = require('./config');
const { options: Options } = mailer;

function sendMail() {
  let option = new Options();
  option.html = 'test';
  option.to = user.to;
  transporter.sendMail(option, (err) => {
    if (err) {
      console.log(err);
    }
    console.log('send mail');
    return null;
  });
}

sendMail();
return 0;
