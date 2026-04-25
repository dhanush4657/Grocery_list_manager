const Group = require("../models/Group");
const List = require("../models/List");
const Item = require("../models/ListItem");

exports.search = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json({ groups: [], lists: [], items: [] });
  
  try {
    const regex = new RegExp(query, 'i');
    
    const groups = await Group.find({ members: req.user.id, groupName: regex });
    
    // get list IDs user has access to
    const allGroups = await Group.find({ members: req.user.id });
    const groupIds = allGroups.map(g => g._id);
    const lists = await List.find({ groupId: { $in: groupIds }, name: regex });
    
    const allLists = await List.find({ groupId: { $in: groupIds } });
    const listIds = allLists.map(l => l._id);
    const items = await Item.find({ listId: { $in: listIds }, name: regex });
    
    res.json({ groups, lists, items });
  } catch(err) {
    res.status(500).send("Server Error");
  }
};
