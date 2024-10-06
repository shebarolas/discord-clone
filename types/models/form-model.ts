import {z} from "zod"

export const FormSchema = z.object({
    name: z.string().min(1, {
        message: "El nombre del servidor es requerido"
    }),
    imageUrl: z.string().min(1, {
        message: "La imagen del servidor es requerida"
    })
});

export type FormSchemaType = z.infer<typeof FormSchema>;
