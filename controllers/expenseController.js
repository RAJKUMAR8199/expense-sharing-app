const Expense = require('../models/Expense');
const Group = require('../models/Group');

exports.addExpense = async (req, res) => {
    try {
        const { description, amount, groupId, payerId, splitType, splitDetails } = req.body;
        const group = await Group.findById(groupId);
        let finalSplits = [];

        // --- SPLIT STRATEGY LOGIC ---
        if (splitType === 'EQUAL') {
            const share = parseFloat((amount / group.members.length).toFixed(2));
            const remainder = amount - (share * group.members.length);
            
            finalSplits = group.members.map((memberId, index) => ({
                user: memberId,
                // Add penny remainder to the first person
                amountOwed: index === 0 ? share + remainder : share
            }));
        } 
        else if (splitType === 'EXACT') {
            // Validation: Sum must match total
            const sum = splitDetails.reduce((a, b) => a + b.amount, 0);
            if (sum !== amount) return res.status(400).json({ error: "Amounts don't match total" });
            finalSplits = splitDetails.map(s => ({ user: s.user, amountOwed: s.amount }));
        } 
        else if (splitType === 'PERCENT') {
             // Validation: Sum must be 100
            const totalPercent = splitDetails.reduce((a, b) => a + b.percent, 0);
            if (totalPercent !== 100) return res.status(400).json({ error: "Percents must equal 100" });
            
            finalSplits = splitDetails.map(s => ({
                user: s.user,
                amountOwed: parseFloat(((amount * s.percent) / 100).toFixed(2))
            }));
        }

        const expense = new Expense({
            description, amount, group: groupId, payer: payerId, splitType, splits: finalSplits
        });
        
        await expense.save();
        res.status(201).json(expense);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};