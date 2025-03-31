import { Router } from "express";

import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { RefundsController } from "@/controllers/refunds-controller";

const refundsRoutes = Router();
const refundsController = new RefundsController();

refundsRoutes.post(
    "/",
    verifyUserAuthorization(["employee"]),
    refundsController.create
);

refundsRoutes.get(
    "/",
    verifyUserAuthorization(["manager"]),
    refundsController.index
);

export { refundsRoutes };
