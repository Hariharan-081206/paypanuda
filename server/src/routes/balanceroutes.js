import express from "express";
import protect from "../middleware/authmiddleware.js";
import ledger from "../services/balance/ledger.js";
import optimizeSettlements from "../services/balance/optimizeSettlements.js";

const router = express.Router();

router.get("/:groupId", protect, async (req, res) => {

    try {

        const ledgerData = await ledger(req.params.groupId);

        const settlements =
            optimizeSettlements(ledgerData);

        res.json({

            success: true,

            ledger: ledgerData,

            settlements

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

});

export default router;
