import { transporter } from "./email.config.js";
import { Verification_Email_Template, Welcome_Email_Template } from "./email.temp.js";

export const sendVerificationCode =async (email,verificationCode) => {
    try {
        const response = await transporter.sendMail({
          from: '"VidVibe" <abhishekkumar.v1.05@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "Verify your Email ✔", // Subject line
          text: "Verify your Email ✔", // plain text body
          html: Verification_Email_Template.replace("{verificationCode}",verificationCode), // html body
        });
        console.log(response)
    } catch (error) {   
        console.error("Error sending email:", error);  
    }

}

export const welcomeEmail = async (email, name) => {
  try {
    const response = await transporter.sendMail({
      from: '"VidVibe" <abhishekkumar.v1.05@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Welcome VidVibe", // Subject line
      text: "Welcome to VidVibe", // plain text body
      html: Welcome_Email_Template.replace("{name}", name),
    });
    console.log(response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};