const simplifyBalances = (balances) => {

    const balanceMap = new Map();

    for (const balance of balances) {

        const from = balance.fromUser.id.toString();
        const to = balance.toUser.id.toString();

        const key = `${from}-${to}`;
        const reverseKey = `${to}-${from}`;

        if (balanceMap.has(reverseKey)) {

            const reverse = balanceMap.get(reverseKey);

            if (reverse.amount > balance.amount) {

                reverse.amount -= balance.amount;

            } else if (reverse.amount < balance.amount) {

                balanceMap.delete(reverseKey);

                balanceMap.set(key, {
                    ...balance,
                    amount: balance.amount - reverse.amount
                });

            } else {

                balanceMap.delete(reverseKey);

            }

        } else {

            if (balanceMap.has(key)) {

                balanceMap.get(key).amount += balance.amount;

            } else {

                balanceMap.set(key, {
                    ...balance
                });

            }

        }

    }

    return [...balanceMap.values()];

};

export default simplifyBalances;