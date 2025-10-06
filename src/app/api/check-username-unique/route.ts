import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

// Below is the syntax for using zod for validation.
// Accept the parameters which should satisfy our defined validation.
const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {

    await dbConnect();

    try {
        // Our url would be 
        // localhost:3000/api/check-username-unique?username=one
        const { searchParams } = new URL(request.url); // this gives the whole url
        const queryParam = {
            username: searchParams.get("username") // we are extracting username from url
        }

        // validation with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        // The above result contains a lot a parameters
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [] // if result will not be true it will contain error so result.error and to format that error use result.error.result
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(", ") : "Invalid query parameters"
            }, { status: 400 })
        }

        const { username } = result.data;
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });
        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 });
        }
        return Response.json({
            success: true,
            message: "Username is unique"
        }, { status: 400 });
    } catch (error) {
        console.log("Error checking username", error);
        return Response.json({
            success: false,
            message: "Error checking username"
        }, { status: 500 })
    }
}