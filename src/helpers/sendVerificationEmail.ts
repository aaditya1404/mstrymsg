// import { resend } from "@/lib/resend";
// import VerificationEmail from "../../emails/VerificationEmail";
// import { transporter } from "@/lib/nodemailer";
// import { ApiResponse } from "@/types/ApiResponse";

// export async function sendVerificationEmail(
//     email: string,
//     username: string,
//     verifyCode: string
// ): Promise<ApiResponse> {
//     try {
//         await resend.emails.send({
//             from: 'onboarding@resend.dev', // this is because I have a free account in resend.
//             to: email,
//             subject: 'Verification Code',
//             react: VerificationEmail({ username, otp: verifyCode }),
//         });
//         return { success: true, message: "Verification email send successfully" };
//     } catch (emailError) {
//         console.log("Error sending verification email", emailError);
//         return { success: false, message: "Failed to send verification email" };
//     }
// }

import { render } from "@react-email/render";
import VerificationEmail from "../../emails/VerificationEmail";
import { transporter } from "@/lib/nodemailer";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        // Convert your React Email component into HTML string
        const emailHtml =await render(VerificationEmail({ username, otp: verifyCode }));
        // const emailHtml = await render(React.createElement(VerificationEmail, { username, otp: verifyCode }));
        // Send email using Nodemailer
        await transporter.sendMail({
            from: `"My App" <${process.env.EMAIL_USER}>`, // sender address
            to: email,
            subject: "Verification Code",
            html: emailHtml,
        });

        return { success: true, message: "Verification email sent successfully" };
    } catch (emailError) {
        console.error("Error sending verification email", emailError);
        return { success: false, message: "Failed to send verification email" };
    }
}
