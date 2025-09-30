import mongoose, { Schema, Document } from "mongoose";

// In typescript for defining the schema we need to specify its type.
// And for specifying the type we need and interface.
// extends Document actually states that our message is a type of document.
export interface Message extends Document {
    content: string;
    createdAt: Date;
}

// Below we are defining a schema.
// we have used a new Schema object to define the Message Schema.
// Since type script is used we need to define the type.
// In Schema the type of the Schema is Schema and it's interface is Message.
const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

// Below for defining the user Schema we are defining an interface of the user Schema.
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[]
};

// Below we are creating the user schema using new keyword and Schema object.
const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"], // we can also pass mutiple options as an array.
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, "Please give a valid email"] // using a regex expression for valid email.
    },
    password: {
        type: String,
        required: true
    },
    verifyCode: {
        type: String,
        required: true
    },
    verifyCodeExpiry: {
        type: Date,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        required: true,
    },
    messages: [MessageSchema]
});

// Since in Nextjs everything happens in edge time.
// Which means that Nextjs does not know that the app is booted first or have been booted earlier.
// So we have to check while creating the model that
// If the model exists then does not create a model and if it does not exists then create a model
// So for that first by using models we are checking if the model exsits and then if does not then create the model.
const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema));

export default UserModel;