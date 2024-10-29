import nodemailer from "nodemailer";
import { emailConfig } from "../config/configEnv.js";

export async function sendEmail(to, subject, text, html) {
  try {
    const transporter = nodemailer.createTransport({
      service: emailConfig.service,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });

    const mailOptions = {
      from: `"Avisos Liceos" <${emailConfig.user}>`,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    await transporter.sendMail(mailOptions);

    return mailOptions;
  } catch (error) {
    console.error("Error al enviar el correo: %s", error.message);
    throw new Error("Error enviando el correo:" + error.message);
  }
}
