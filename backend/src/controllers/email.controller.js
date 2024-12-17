import { sendEmail } from "../services/email.service.js";
import {
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function sendEmailDefault(req) {
  const { email, subject, message } = req.body;

  try {
    const info = await sendEmail(email, subject, message, `<p>${message}</p>`);

    return {
      sucess: true,
      data: info,
    };
  } catch (error) {
    return {
      sucess: false,
      error: error.message,
    };
  }
}
