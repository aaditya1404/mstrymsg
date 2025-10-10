import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User; // aserting as User
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 });
    }
    const userId = new mongoose.Types.ObjectId(user._id); // this will convert the user from string to mongodb object id

    try {
        // Using mongodb aggregation pipeline
        const userAgg = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: { path: '$messages', preserveNullAndEmptyArrays: true } },
            // { $unwind: '$messages'},
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },
        ]).exec();

        if (!userAgg || userAgg.length === 0) {
            return Response.json({
                success: false,
                message: "User not found 23154353"
            }, { status: 401 });
        }

        return Response.json({
            success: true,
            messages: userAgg[0].messages // we recive an array from mongodb aggregation pipeline
        }, { status: 200 });
    } catch (error) {
        console.log("An unexpected error has occured", error);
        return Response.json({
            success: false,
            message: "An unexpected error has occured"
        }, { status: 500 });
    }
}