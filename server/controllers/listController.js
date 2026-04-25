const List = require("../models/List");
const Group = require("../models/Group");
const Item = require("../models/ListItem");
const ActivityLog = require("../models/ActivityLog");

exports.createList = async (req, res) => {
  try {
    const { name, groupId } = req.body;
    
    // Verify group exists and user is a member
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ msg: "Group not found" });
    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({ msg: "Not authorized for this group" });
    }

    const newList = new List({
      name,
      groupId,
      createdBy: req.user.id,
    });
    
    const list = await newList.save();
    
    // Populate createdBy
    await list.populate('createdBy', 'name');

    // Log Activity
    const newActivity = await ActivityLog.create({
      action: "Created list",
      details: name,
      userId: req.user.id,
      groupId: groupId,
      type: "success"
    });
    
    const io = req.app.get("io");
    if (io) io.to(groupId.toString()).emit("newActivity", newActivity);
    
    res.json(list);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.getListsByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    
    // Verify group exists and user is a member
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ msg: "Group not found" });
    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({ msg: "Not authorized for this group" });
    }

    const lists = await List.find({ groupId }).populate('createdBy', 'name').sort({ createdAt: -1 }).lean();
    
    // Get item counts for each list
    const listsWithCounts = await Promise.all(lists.map(async (list) => {
      const totalItems = await Item.countDocuments({ listId: list._id });
      const completedItems = await Item.countDocuments({ listId: list._id, isPurchased: true });
      return {
        ...list,
        totalItems,
        completedItems
      };
    }));

    res.json(listsWithCounts);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.updateList = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, priority } = req.body;

    const list = await List.findById(id);
    if (!list) return res.status(404).json({ msg: "List not found" });

    // Verify user authorization via group membership
    const group = await Group.findById(list.groupId);
    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    if (name) list.name = name;
    if (priority) list.priority = priority;

    await list.save();
    
    const newActivity = await ActivityLog.create({
      action: "Updated list",
      details: list.name,
      userId: req.user.id,
      groupId: list.groupId,
      type: "info"
    });
    
    const io = req.app.get("io");
    if (io) io.to(list.groupId.toString()).emit("newActivity", newActivity);

    res.json(list);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.deleteList = async (req, res) => {
  try {
    const { id } = req.params;
    const list = await List.findById(id);
    
    if (!list) return res.status(404).json({ msg: "List not found" });
    
    // Verify user is authorized
    const group = await Group.findById(list.groupId);
    if (!group.members.includes(req.user.id)) {
        return res.status(403).json({ msg: "Not authorized" });
    }

    const listName = list.name;
    const groupId = list.groupId;

    await List.findByIdAndDelete(id);
    // Delete all items in this list
    await Item.deleteMany({ listId: id });

    const newActivity = await ActivityLog.create({
      action: "Deleted list",
      details: listName,
      userId: req.user.id,
      groupId: groupId,
      type: "warning"
    });
    
    const io = req.app.get("io");
    if (io) io.to(groupId.toString()).emit("newActivity", newActivity);

    res.json({ msg: "List removed" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
