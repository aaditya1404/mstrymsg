import mongoose from "mongoose";

// Since nextjs is a edge time framework so before connecting it to the database
// we should always check that the connection exsists or not.
// because if the connection exsists and we keep on connecting then we might choke the app.

type ConnectionObject = {
    isConnected?: number // used question mark because the value if optional
}

// we are able to keep the connection empty because we have marked it as optional.
const connection: ConnectionObject = {}

// Since we are going to recieve a promise therefore we have used the type promise
// void signifies that we does not care about what type of promise we are receving.
async function dbConnect(): Promise<void> {

    // first checking if the database connection already exsists.
    if (connection.isConnected) {
        console.log("Already connected to database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "");
        connection.isConnected = db.connections[0].readyState;
        console.log("Database connected Successfully");
    } catch (error) {
        console.log("Database connection failed", error);
        process.exit(1); // we are doing this because if the database connection fails
        // we know that the app won't run therefore we are gracefully exciting the process.
    }
}

export default dbConnect;