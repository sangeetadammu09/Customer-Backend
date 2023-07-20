const nodemailer = require("nodemailer");

const sendEmail = async (reqEmail) => {
  try {
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      secure: true,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      }
    });

    var mailOptions = {
      from: process.env.FROM_EMAIL,
      to: reqEmail.email,

      subject: reqEmail.subject,
      html: `<h3>${reqEmail.subject}</h3>
              <p>${reqEmail.message} </p><br>`
    };

    // Send email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({ success: true, 'message': 'Email sent successfully' });
      }
    });

  } catch (err) {
    return res.status(500).json({ 'message': 'something went wrong', 'err': err.message })
  }
};


module.exports = sendEmail;