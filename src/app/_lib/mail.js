import nodemailer from "nodemailer";

const useEmail = async ({ email = "foobar@example.com", subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: { name: "Expense-tracker", address: email },
      to: email, // list of receivers
      subject: subject, // Subject line
      text: message, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail", err);
  }
};

export default useEmail;
