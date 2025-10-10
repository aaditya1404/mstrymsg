import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail", // or use your own SMTP config
  auth: {
    user: process.env.EMAIL_USER, // your email (e.g. Gmail)
    pass: process.env.EMAIL_PASS, // app password
  },
});
