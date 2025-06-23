const express = require('express');
const router = express.Router();
const { saveGoal , getGoalsByUserId, updateMilestone, deleteGoal } = require('../controllers/goalController');

router.post('/', saveGoal);
router.get('/', getGoalsByUserId);
router.put('/milestone/:id', updateMilestone);
router.delete('/:goalId', deleteGoal);

module.exports = router;
