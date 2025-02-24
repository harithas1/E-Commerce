const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "violahello2@gmail.com", // Replace with your Gmail
    pass: "pmpl itpa avug tnuw", // Replace with your Gmail App Password
  },
});

// Function to send emails
const sendEmail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: "violahello2@gmail.com",
    to,
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;

// -----------------------------------------

// const nodemailer = require("nodemailer");

// // Create a transporter object using SMTP transport
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com", // Replace with your email provider's SMTP host
//   port: 587, // Common SMTP port
//   secure: false, // Use true for 465, false for other ports
//   auth: {
//     user: "violahello2@gmail.com", // Replace with your email address
//     pass: "pmpl itpa avug tnuw", // Replace with your email password
//   },
// });

// const mailData = {
//   from: "violahello2@gmail.com",
//   to: "harithas_jtbb2@jtdfoundation.org",
//   subject: "Sending Email using Node.js",
//   text: "That was easy!",
//   html: "<b>That was easy!</b>",
// };

// transporter.sendMail(mailData, function (error, info) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Email sent: " + info.response);
//   }
// });

// const info = await transporter.sendMail({
//   from: "violahello2@gmail.com",
//   to: "harithas_jtbb2@jtdfoundation.org",
//   subject: "Sending Email using Node.js",
//   text: "That was easy!",
//   html: "<b>That was easy!</b>",
// });
