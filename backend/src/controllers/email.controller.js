import { sendEmail } from "../services/email.service.js";
import {
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function sendCustomEmail(req, res) {
  const { email, subject, message } = req.body;

  try {
    const info = await sendEmail(email, subject, message, `<p>${message}</p>`);

    handleSuccess(res, 200, "Correo enviado con éxito", info);
  } catch (error) {
    handleErrorServer(
      res,
      500,
      "Error durante el envia del correo.",
      error.message,
    );
  }
}

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
