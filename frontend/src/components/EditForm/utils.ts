import z from "zod";

export const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    url: z.string().min(1, { message: "URL is required" }),
    description: z.string().optional(),
    comments: z.string().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    updated_at: z.string().optional(),
    id: z.string().optional(),
    created_at: z.string().optional(),
})