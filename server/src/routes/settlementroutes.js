import express from "express";
import protect from "../middleware/authmiddleware.js";

import {
    createSettlementController,
    completeSettlementController,
    getSettlementHistoryController
} from "../controllers/settlementcontroller.js";

const router = express.Router();

router.post(
    "/",
    protect,
    createSettlementController
);

router.patch(
    "/:settlementId/complete",
    protect,
    completeSettlementController
);
router.get(
    "/group/:groupId",
    protect,
    getSettlementHistoryController
);

export default router;