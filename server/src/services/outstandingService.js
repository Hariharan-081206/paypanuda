import Settlement from "../models/settlement.js";
import calculateBalances from "./balance/calculateDebts.js";
import simplifyBalances from "./balance/simplifyBalances.js";

const getOutstandingBalances = async (groupId) => {

    // 1. Get the same optimized settlements
    //    that /api/balance/:groupId uses

    const rawBalances = await calculateBalances(groupId);

    const optimizedSettlements =
        simplifyBalances(rawBalances);


    // 2. Get completed settlements only

    const completedSettlements =
        await Settlement.find({
            group: groupId,
            status: "completed"
        });


    // 3. Make a copy so we don't modify
    //    the optimizer's original result

    const outstanding = optimizedSettlements.map(
        settlement => ({
            fromUser: {
                ...settlement.fromUser,
                id: settlement.fromUser.id.toString()
            },

            toUser: {
                ...settlement.toUser,
                id: settlement.toUser.id.toString()
            },

            amount: Number(settlement.amount)
        })
    );


    // 4. Subtract completed payments

    for (const payment of completedSettlements) {

        let remainingPayment =
            Number(payment.amount);

        const paymentFrom =
            payment.fromUser.toString();

        const paymentTo =
            payment.toUser.toString();


        for (const debt of outstanding) {

            if (remainingPayment <= 0) {
                break;
            }


            const sameFrom =
                debt.fromUser.id === paymentFrom;

            const sameTo =
                debt.toUser.id === paymentTo;


            if (sameFrom && sameTo) {

                const deduction = Math.min(
                    debt.amount,
                    remainingPayment
                );

                debt.amount -= deduction;

                remainingPayment -= deduction;
            }
        }
    }


    // 5. Remove completely paid debts

    return outstanding.filter(
        debt => debt.amount > 0
    );
};

export default getOutstandingBalances;