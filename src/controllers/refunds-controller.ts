import { Request, Response } from "express";
import { z } from "zod";

const CategoriesEnum = z.enum([
    "food",
    "others",
    "services",
    "transport",
    "accommodation",
]);

class RefundsController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z
                .string()
                .trim()
                .min(1, { message: "Informe o nome da solicitação" }),
            category: CategoriesEnum,
            amount: z
                .number()
                .positive({ message: "O valor precisa ser positivo" }),
            filename: z.string().min(20),
        });

        const { name, category, amount, filename } = bodySchema.parse(
            request.body
        );

        response.json({ message: "ok" });
    }
}

export { RefundsController };
