import { ChannelType } from "@prisma/client";
import {z} from "zod"

export const FormSchema = z.object({
    name: z.string().min(1, {
        message: "El nombre del servidor es requerido"
    }),
    imageUrl: z.string().min(1, {
        message: "La imagen del servidor es requerida"
    })
});

export const ChannelFormSchema = z.object({
    name: z.string().min(1, {
        message: "El nombre del canal es requerido"
    }).refine(
        name => name !== "general", {message: "El nombre del canal no puede ser 'general'"}
    ),
    type: z.nativeEnum(ChannelType)
});

export const FormSchemaMessageFile = z.object({
    fileUrl: z.string().min(1, {
        message: "El archivo es requerido para poder enviarlo"
    })
});


export type FormSchemaType = z.infer<typeof FormSchema>;
export type FormSchemaMessageFileType = z.infer<typeof FormSchemaMessageFile>;
export type ChannelFormSchemaType = z.infer<typeof ChannelFormSchema>;
