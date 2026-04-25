const ActivityLog = require("../models/ActivityLog");
const Group = require("../models/Group");

exports.getActivities = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id });
    const groupIds = groups.map(g => g._id);

    const activities = await ActivityLog.find({ groupId: { $in: groupIds } })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(activities);
  } catch(err) {
    res.status(500).send("Server Error");
  }
};
