import { z } from "zod";

export const FormSchema = z.object({
    content: z.string().min(1, {
        message: "El mensaje es requerido"
    })
})

export type FormSchemaTypeChat = z.infer<typeof FormSchema>;
