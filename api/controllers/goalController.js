const db = require("../config/db");

const saveGoal = async (req, res) => {
  const {
    goalName,
    description,
    startDate,
    endDate,
    userId,
    isAchieved,
    milestones,
  } = req.body;

  if (!goalName || !userId){
        return res.status(400).json({ error: 'goalName and userId are required' });
  }

  const goalSql = `
    INSERT INTO goals (goalName, description, startDate, endDate, userId, isAchieved)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.execute(goalSql, [
      goalName,
      description,
      startDate,
      endDate,
      userId,
      isAchieved,
    ]);

    const insertedGoalId = result.insertId;

    // Insert milestones one by one
    for (const m of milestones) {
      await db.execute(
        `INSERT INTO milestones (goalId, milestoneName, description, targetDate, isCompleted)
         VALUES (?, ?, ?, ?, ?)`,
        [
          insertedGoalId,
          m.milestoneName,
          m.description,
          m.targetDate,
          m.isCompleted,
        ]
      );
    }

    res.status(201).json({
      message:
        milestones.length > 0
          ? "Goal and milestones saved successfully"
          : "Goal saved successfully (no milestones)",
    });
  } catch (err) {
    console.error("Error saving goal or milestones:", err);
    res.status(500).json({ error: "Failed to save goal or milestones" });
  }
};

const getGoalsByUserId = async (req, res) => {
  const { userId } = req.query;  

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    // Use await to handle the promise returned by the query
    const [goals] = await db.execute('SELECT * FROM goals WHERE userId = ?', [userId]);

    if (goals.length === 0) {
      return res.json([]);
    }

    const goalIds = goals.map((g) => g.goalId);
    const placeholders = goalIds.map(() => '?').join(',');

    // Query the milestones associated with the goals
    const [milestones] = await db.execute(
      `SELECT * FROM milestones WHERE goalId IN (${placeholders})`,
      goalIds
    );

    // Associate milestones with each goal
    const result = goals.map((goal) => ({
      ...goal,
      milestones: milestones.filter((m) => m.goalId === goal.goalId),
    }));

    return res.json(result);
  } catch (err) {
    console.error("Error fetching goals/milestones:", err);
    res.status(500).json({ error: "Database error" });
  }
};


const updateMilestone = async (req, res) => {
  const { milestoneId, milestoneName, description, targetDate, isCompleted } =
    req.body;

  if (!milestoneId) {
    return res.status(400).json({ error: "milestoneId is required" });
  }

  const sql = `
      UPDATE milestones
      SET milestoneName = ?, description = ?, targetDate = ?, isCompleted = ?
      WHERE milestoneId = ?
    `;

  try {
    await db.execute(sql, [
      milestoneName,
      description,
      targetDate,
      isCompleted,
      milestoneId,
    ]);

    // Check if all milestones for the associated goal are completed
    const [milestone] = await db.execute(
      `SELECT goalId FROM milestones WHERE milestoneId = ?`,
      [milestoneId]
    );

    if (milestone.length > 0) {
      const goalId = milestone[0].goalId;

      const [remainingMilestones] = await db.execute(
        `SELECT isCompleted FROM milestones WHERE goalId = ?`,
        [goalId]
      );

      const allCompleted = remainingMilestones.every(
        (m) => m.isCompleted === 1
      );

      if (allCompleted) {
        await db.execute(
          `UPDATE goals SET isAchieved = true WHERE goalId = ?`,
          [goalId]
        );
      }
      else{
        await db.execute(
          `UPDATE goals SET isAchieved = false WHERE goalId = ?`,
          [goalId]
        );
      }
    }

    res.json({ message: "Milestone updated successfully" });
  } catch (err) {
    console.error("Error updating milestone:", err);
    res.status(500).json({ error: "Failed to update milestone" });
  }
};


// delete goal
const deleteGoal = (req, res) => {
  const goalId = req.params.goalId;

  if (!goalId) {
    return res.status(400).json({ error: "goalId is required" });
  }

  // Step 1: Delete milestones first
  const deleteMilestonesSql = 'DELETE FROM milestones WHERE goalId = ?';
  db.query(deleteMilestonesSql, [goalId], (milestoneErr) => {
    if (milestoneErr) {
      console.error("Error deleting milestones:", milestoneErr);
      return res.status(500).json({ error: "Failed to delete milestones: " + milestoneErr });
    }

    // Step 2: Delete the goal
    const deleteGoalSql = 'DELETE FROM goals WHERE goalId = ?';
    db.query(deleteGoalSql, [goalId], (goalErr, result) => {
      if (goalErr) {
        console.error("Error deleting goal:", goalErr);
        return res.status(500).json({ error: "Failed to delete goal: " + goalErr });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Goal not found" });
      }

      res.json({ message: "Goal and its milestones deleted successfully" });
    });
  });
};


module.exports = {
  saveGoal,
  getGoalsByUserId,
  updateMilestone,
  deleteGoal,
};
