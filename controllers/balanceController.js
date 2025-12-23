const Expense = require('../models/Expense');

exports.getGroupBalance = async (req, res) => {
    try {
        const expenses = await Expense.find({ group: req.params.groupId });
        let balances = {};

        // 1. Calculate Net Balances
        expenses.forEach(exp => {
            // Payer gets + (Creditor)
            balances[exp.payer] = (balances[exp.payer] || 0) + exp.amount;
            
            // Split users get - (Debtor)
            exp.splits.forEach(split => {
                balances[split.user] = (balances[split.user] || 0) - split.amountOwed;
            });
        });

        // 2. Separate Debtors and Creditors
        let debtors = [];
        let creditors = [];
        for (const [user, amount] of Object.entries(balances)) {
            if (amount < -0.01) debtors.push({ user, amount });
            if (amount > 0.01) creditors.push({ user, amount });
        }

        // 3. Greedy Matching Algorithm
        let transactions = [];
        let i = 0; // debtor index
        let j = 0; // creditor index

        while (i < debtors.length && j < creditors.length) {
            let debtor = debtors[i];
            let creditor = creditors[j];

            // Find min amount to settle
            let amount = Math.min(Math.abs(debtor.amount), creditor.amount);
            
            transactions.push({
                from: debtor.user,
                to: creditor.user,
                amount: parseFloat(amount.toFixed(2))
            });

            // Update internal values
            debtor.amount += amount;
            creditor.amount -= amount;

            if (Math.abs(debtor.amount) < 0.01) i++;
            if (creditor.amount < 0.01) j++;
        }

        res.json({ simplifiedTransactions: transactions });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};