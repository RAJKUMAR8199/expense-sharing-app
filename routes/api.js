const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Group = require('../models/Group');
const expenseController = require('../controllers/expenseController');
const balanceController = require('../controllers/balanceController');

// --- Helper Routes to set up data ---
router.post('/users', async (req, res) => {
    const user = await User.create(req.body);
    res.json(user);
});

router.post('/groups', async (req, res) => {
    const group = await Group.create(req.body);
    res.json(group);
});

// --- Assignment Routes ---
router.post('/expenses', expenseController.addExpense);
router.get('/groups/:groupId/balance', balanceController.getGroupBalance);

module.exports = router;