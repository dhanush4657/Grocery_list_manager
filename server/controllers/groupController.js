const Group = require("../models/Group");

exports.createGroup = async (req, res) => {
  try {
    const { groupName, description, icon } = req.body;
    const newGroup = new Group({
      groupName,
      description: description || "",
      icon: icon || "Home",
      createdBy: req.user.id,
      members: [req.user.id],
    });
    const group = await newGroup.save();
    res.json(group);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id }).populate('members', 'name email');
    res.json(groups);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.body.groupId);
    if (!group) return res.status(404).json({ msg: "Group not found" });

    // Check if user is already a member
    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ msg: "Already a member of this group" });
    }

    group.members.push(req.user.id);
    await group.save();

    res.json(group);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

const Item = require("../models/ListItem");
const List = require("../models/List");

exports.getDashboardStats = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id });
    const groupIds = groups.map(g => g._id);
    
    const lists = await List.find({ groupId: { $in: groupIds } });
    const listIds = lists.map(l => l._id);

    const items = await Item.find({ listId: { $in: listIds } });
    
    const activeGroups = groups.length;
    const totalLists = lists.length;
    const totalItems = items.length;
    const pendingItems = items.filter(i => !i.isPurchased).length;
    
    let fulfillment = 0;
    if (totalItems > 0) {
      fulfillment = Math.round(((totalItems - pendingItems) / totalItems) * 100);
    }
    
    res.json({
      activeGroups,
      totalLists,
      itemsPending: pendingItems,
      fulfillment: `${fulfillment}%`
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ msg: "Group not found" });

    // Ensure user is the creator before allowing deletion
    if (group.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized to delete this group" });
    }

    await Group.findByIdAndDelete(req.params.id);
    res.json({ msg: "Group removed" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
