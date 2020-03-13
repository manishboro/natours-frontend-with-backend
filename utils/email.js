const nodemailer = require('nodemailer');

const sendEmail = async options => {
  //1) Creates a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
    //to send email using gmail activate in gmail less secure option. but sending email through gmail is not advised because only 500 emails can be sent in a day and also gmail can list us as a spammer if we send too many emails
  });

  //2) Define the mail options
  const mailOptions = {
    from: 'Manish Boro <manish@boro.io>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  //3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
