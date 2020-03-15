const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const pug = require('pug');

//new Email(user, url).sendWelcome();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Manish Boro <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //Sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  //Send the actual email
  async send(template, subject) {
    //1)  Render the html based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    //2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    //3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the natours family!');
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Your password reset token is valid for 10 minutes!');
  }
};

// const sendEmail = async options => {
//   //1) Creates a transporter
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD
//     }
//     //to send email using gmail activate in gmail less secure option. but sending email through gmail is not advised because only 500 emails can be sent in a day and also gmail can list us as a spammer if we send too many emails
//   });

//   //2) Define the mail options
//   const mailOptions = {
//     from: 'Manish Boro <manish@boro.io>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message
//     //html:
//   };

//   //3) Actually send the email
//   await transporter.sendMail(mailOptions);
// };
