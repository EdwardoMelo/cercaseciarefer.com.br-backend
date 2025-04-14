const nodemailer = require("nodemailer");
require("dotenv").config();

class EmailController {
  constructor() {
    // Configuração do transporte do Nodemailer para Gmail
    this.transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      auth: {
        user: "contato@melotechconsulting.com", // E-mail do remetente
        pass: "Maneka261085*", // Senha ou senha de aplicativo
      },
    });
  }

  sendContact = async (req, res) => {
    console.log("email");
    console.log("req body: ", req.body);
    try {
      const { name, email, phone, subject, message } = req.body;
      // Validação básica
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes." });
      }
      const result = await this.sendEmail({
        name,
        email,
        phone,
        subject,
        message,
      });
      return res.status(200).json(result);
    } catch (error) {
      console.log("erro: ", error);
      return res.status(500).json({ error: error.message });
    }
  };

  async sendEmail({ name, email, phone, subject, message }) {
    try {
      // Configuração do e-mail
      const mailOptions = {
        from: "contato@melotechconsulting.com", // Remetente
        to: 'eduardo017melo@gmail.com', // Destinatário (mesmo e-mail para contato)
        subject: `Nova Mensagem de Contato: ${subject}`, // Assunto do e-mail
        html: `
          <h2>Nova Mensagem de Contato</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Telefone:</strong> ${phone || "Não informado"}</p>
          <p><strong>Assunto:</strong> ${subject}</p>
          <p><strong>Mensagem:</strong> ${message}</p>
        `, // Corpo do e-mail em HTML
      };

      // Enviar o e-mail
      const info = await this.transporter.sendMail(mailOptions);
      console.log("E-mail enviado: ", info.messageId);
      return { success: true, message: "E-mail enviado com sucesso!" };
    } catch (error) {
      console.error("Erro ao enviar e-mail: ", error);
      throw new Error("Erro ao enviar e-mail. Tente novamente.");
    }
  }
}

module.exports = new EmailController();
