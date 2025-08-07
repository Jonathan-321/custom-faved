import z from "zod";

export const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    url: z.string().min(1, { message: "URL is required" }),
    description: z.any().optional(),
    comments: z.any().optional(),
    imageURL: z.any().optional(),
    tags: z.array(z.any()).optional(),
    updated_at: z.any().optional(),
    id: z.any().optional(),
})