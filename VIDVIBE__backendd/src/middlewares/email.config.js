import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: "abhishekkumar.v1.05@gmail.com",
    pass: "nlpe ysdn lhrl zook",
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: '"VidVibe" <abhishekkumar.v1.05@gmail.com>', 
      to: "bar@example.com, baz@example.com", 
      subject: "Hello ✔", 
      text: "Hello world?",
      html: "<b>Hello world?</b>",
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
 sendEmail()