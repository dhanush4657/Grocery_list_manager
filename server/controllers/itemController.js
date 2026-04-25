const Item = require("../models/ListItem");
const List = require("../models/List");
const ActivityLog = require("../models/ActivityLog");

exports.addItem = async (req, res) => {
  try {
    const newItem = new Item({
      ...req.body,
      addedBy: req.user.id,
    });
    const item = await newItem.save();

    const list = await List.findById(item.listId);
    if(list) {
      const newActivity = await ActivityLog.create({
        action: "Added item",
        details: `${item.name} to ${list.name}`,
        userId: req.user.id,
        groupId: list.groupId,
        type: "info"
      });
      const io = req.app.get("io");
      if (io) io.to(list.groupId.toString()).emit("newActivity", newActivity);
    }

    res.json(item);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.getItems = async (req, res) => {
  try {
    const items = await Item.find({ listId: req.params.listId });
    res.json(items);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.toggleItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    item.isPurchased = !item.isPurchased;
    await item.save();

    const list = await List.findById(item.listId);
    if(list) {
      const newActivity = await ActivityLog.create({
        action: item.isPurchased ? "Completed item" : "Unchecked item",
        details: item.name,
        userId: req.user.id,
        groupId: list.groupId,
        type: item.isPurchased ? "success" : "warning"
      });
      const io = req.app.get("io");
      if (io) io.to(list.groupId.toString()).emit("newActivity", newActivity);
    }

    res.json(item);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity } = req.body;

    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ msg: "Item not found" });

    if (name) item.name = name;
    if (quantity) item.quantity = quantity;

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
