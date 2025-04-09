import { transporter } from "./email.config.js";
import {
  Verification_Email_Template,
  Welcome_Email_Template,
} from "./email.temp.js";

export const sendVerificationCode = async (email, verificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: '"VidVibe" <abhishekkumar.v1.05@gmail.com>',
      to: email,
      subject: "Verify your Email ✔",
      text: "Verify your Email ✔",
      html: Verification_Email_Template.replace(
        "{verificationCode}",
        verificationCode
      ),
    });
    console.log(response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const welcomeEmail = async (email, name) => {
  try {
    const response = await transporter.sendMail({
      from: '"VidVibe" <abhishekkumar.v1.05@gmail.com>', 
      to: email,
      subject: "Welcome To VidVibe", 
      text: "Welcome To VidVibe", 
      html: Welcome_Email_Template.replace("{name}", name),
    });
    console.log(response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
