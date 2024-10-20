import sendEmail from "../utils/sender/sendEmail";

/**
 * Sends an alert email.
 *
 * @param {string} city - The city for the alert.
 * @param {string} condition - The condition for the alert.
 * @param {number} times - The number of times the condition has been met.
 * @param {string} email - The email to send the alert to.
 * @returns {Promise<void>} - Returns a promise that resolves when the email is sent.
 */
const sendAlert = async (
  city: string,
  condition: string,
  times: number,
  email: string
) => {
  try {
    const subject = `Alert for ${city}`;
    const message = `${condition} for ${times} consecutive times.`;

    await sendEmail({
      from: "Weather App",
      to: email,
      subject,
      text: message,
    });
  } catch (error: any) {
    console.error("Error sending alert:", error.message);
  }
};

export default sendAlert;
