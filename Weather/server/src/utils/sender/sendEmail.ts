import nodemailer from "nodemailer";

/**
 * Interface representing the options for sending an email.
 * @interface
 */
interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}

/**
 * Sends an email using the provided options.
 *
 * @param {EmailOptions} options - The email options.
 * @returns {Promise<void>} - A promise that resolves when the email is sent.
 * @throws {Error} - Throws an error if sending the email fails.
 */
const sendEmail = async (options: EmailOptions): Promise<void> => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Send the email
  try {
    let info = await transporter.sendMail({
      from: `"${options.from}" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendEmail;
