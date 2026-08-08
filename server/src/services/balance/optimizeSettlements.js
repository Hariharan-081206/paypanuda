const optimizeSettlements = (ledger) => {

    const creditors = ledger
        .filter(member => member.balance > 0)
        .map(member => ({ ...member }));

    const debtors = ledger
        .filter(member => member.balance < 0)
        .map(member => ({
            ...member,
            balance: Math.abs(member.balance)
        }));

    const settlements = [];

    let creditorIndex = 0;
    let debtorIndex = 0;

    while (
        creditorIndex < creditors.length &&
        debtorIndex < debtors.length
    ) {

        const creditor = creditors[creditorIndex];
        const debtor = debtors[debtorIndex];

        const amount = Math.min(
            creditor.balance,
            debtor.balance
        );

        settlements.push({

            fromUser: {

                id: debtor.userId.toString(),

                name: debtor.name,

                email: debtor.email

            },

            toUser: {

                id: creditor.userId.toString(),

                name: creditor.name,

                email: creditor.email

            },

            amount: Number(amount.toFixed(2))

        });

        creditor.balance -= amount;
        debtor.balance -= amount;

        if (creditor.balance === 0)
            creditorIndex++;

        if (debtor.balance === 0)
            debtorIndex++;

    }

    return settlements;

};

export default optimizeSettlements;