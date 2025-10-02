import dbConnect from "@/lib/dbConnect"; // we require database connection in every route.
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

// In nextjs we write api's by there request because the route is managed by the folder name
export async function POST(request: Request) {
    await dbConnect();

    try {
        // whenever we are taking data from request.json we always have to use await in nextjs
        const { username, email, password } = await request.json()
    } catch (error) {
        console.error("Error registering user", error);
        return Response.json({
            success: false,
            message: "Error registering user"
        }, { status: 500 })
    }
}
