import { AppError } from "@/utils/AppError";
import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandling: ErrorRequestHandler = (
    error,
    request,
    response,
    next,
) => {
    // Erro padrão dentro da classe
    if (error instanceof AppError) {
        response.status(error.statusCode).json({ message: error.message });
        return;
    }

    // Erro para resposta
    if (error instanceof ZodError) {
        response.status(400).json({
            message: "validation error",
            issues: error.format(),
        });
        return;
    }

    response.status(500).json({ message: error.message });
};
