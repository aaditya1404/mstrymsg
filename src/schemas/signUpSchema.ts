// zod is a validation library for typescript.
import { z } from "zod";

// every validation must be exported 
// zod have different functions for validations.
// Since username has only one value so no need to check for an object.
export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast three characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character");

// Since now we are checking for signUp Schema which contains multiple values that is why we are creating object
export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, {message: "Password must be atleast six characters"})
})