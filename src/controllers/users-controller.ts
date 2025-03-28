import { Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { AppError } from "@/utils/AppError";
import { hash } from "bcrypt";

class UsersController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().trim().min(2, { message: "Nome é obrigatório" }),
            email: z
                .string()
                .trim()
                .email({ message: "E-mail inválido" })
                .toLowerCase(),
            password: z
                .string()
                .min(6, { message: "A senha deve ter pelo menos 6 dígitos" }),
            role: z
                .enum([UserRole.employee, UserRole.manager])
                .default(UserRole.employee),
        });

        const { name, email, password, role } = bodySchema.parse(request.body);

        // Verificando se o email já foi cadastrado, evitar igualdade de email entre usuário diferentes
        const userWithSameEmail = await prisma.user.findFirst({
            where: { email },
        });

        if (userWithSameEmail) {
            throw new AppError(
                "Já existe um usuário cadastrado com esse email"
            );
        }

        const hashedPassword = await hash(password, 8);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });

        response.status(201).json();
    }
}

export { UsersController };
