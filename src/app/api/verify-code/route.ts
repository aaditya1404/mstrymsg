import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request: Request) {
    await dbConnect();

    try {
        // Since in express we used request.body in the same way request.json() works.
        const { username, code } = await request.json();

        // Sometimes while sending the data through the url it does not gets encoded properly.
        // So we use decodeURIComponent() to decode the url from the frontend properly.
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 500 });
        }

        // checking if the code in the user data equals the code send by the frontend to backend
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();

            return Response.json({
                success: true,
                message: "Account Verified successfully"
            }, { status: 200 });
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code has expired, please signup again to get a new code"
            }, { status: 400 });
        } else {
            return Response.json({
                success: false,
                message: "Incorrect verification code"
            }, { status: 500 });
        }

    } catch (error) {
        console.log("Error verifying user", error);
        return Response.json({
            success: false,
            message: "Error verifying user"
        }, { status: 500 });
    }
}