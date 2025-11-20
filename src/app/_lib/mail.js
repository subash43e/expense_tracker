import nodemailer from "nodemailer";

const useEmail = async ({ username, email }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });
};

try {
  const info = await transporter.sendMail({
    from: { name: "Майлер, Ноде", address: "foobar@example.com" },
    to: email, // list of receivers
    subject: `Hello ${username}`, // Subject line
    text: "Hello ${}", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
} catch (err) {
  console.error("Error while sending mail", err);
}

export default useEmail;
