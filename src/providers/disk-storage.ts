import fs from "node:fs";
import path from "node:path";

import uploadConfig from "@/configs/upload";

class DiskStorage {
    async saveFile(file: string) {
        const tmpPath = path.resolve(uploadConfig.TMP_FOLDER, file);
        const destPath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);

        // Verificando se o arquivo existe
        try {
            await fs.promises.access(tmpPath);
        } catch (error) {
            console.log(error);
            throw new Error(`Arquivo não encontrado: ${tmpPath}`);
        }

        // Verifica e garante que a pasta uploads exista
        await fs.promises.mkdir(uploadConfig.UPLOADS_FOLDER, {
            recursive: true,
        });

        // Move o arquivo para a pasta uploads
        await fs.promises.rename(tmpPath, destPath);

        return file;
    }

    async deleteFile(file: string, type: "tmp" | "upload") {
        const pathFile =
            type === "tmp"
                ? uploadConfig.TMP_FOLDER
                : uploadConfig.UPLOADS_FOLDER;

        const filePath = path.resolve(pathFile, file);

        try {
            // stat verifica se o arquivo está disponível ou não
            await fs.promises.stat(filePath);
        } catch {
            return;
        }

        // Deleta o arquivo
        await fs.promises.unlink(filePath);
    }
}

export { DiskStorage };
