import { z } from "zod";

export const signInSchema = z.object({
    identifier: z.string(), // it is same as email, just a name can be called anything
    password: z.string()
})