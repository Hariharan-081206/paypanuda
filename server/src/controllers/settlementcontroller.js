import createSettlement, {
    completeSettlement,
    getSettlementHistory
} from "../services/settlementservice.js";
export const createSettlementController = async (req, res) => {

    try {

        const {
            groupId,
            fromUserId,
            toUserId,
            amount,
            note
        } = req.body;

        const settlement = await createSettlement({
            groupId,
            fromUserId,
            toUserId,
            amount,
            note
        });

        res.status(201).json({
            success: true,
            message: "Settlement created successfully",
            settlement
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

export const completeSettlementController = async (req, res) => {

    try {

        const settlement =
            await completeSettlement({
                settlementId: req.params.settlementId,
                userId: req.user._id.toString()
            });

        res.status(200).json({
            success: true,
            message: "Settlement completed successfully",
            settlement
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


export const getSettlementHistoryController = async (req, res) => {

    try {

        const settlements = await getSettlementHistory(
            req.params.groupId
        );

        res.status(200).json({
            success: true,
            count: settlements.length,
            settlements
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};
