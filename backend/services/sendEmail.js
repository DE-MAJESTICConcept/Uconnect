import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // you can change this if not using Gmail
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Mail options
    const mailOptions = {
      from: `"CampusConnect" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent: ", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email send error:", error.message);
    throw new Error("Failed to send email");
  }
};

export default sendEmail;
