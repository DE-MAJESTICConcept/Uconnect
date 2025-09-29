import Item from "../models/item.model.js";

// =============================
// Get items (all, or by status)
// =============================
export const getItems = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const items = await Item.find(query).sort({ dateReported: -1 });

    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    console.error("Get items error:", error);
    res.status(500).json({ success: false, message: "Error fetching items", error: error.message });
  }
};

// =============================
// Get single item by ID
// =============================
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    res.json({ success: true, data: item });
  } catch (error) {
    console.error("Get item by ID error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================
// Create a new item
// =============================
export const createItem = async (req, res) => {
  try {
    const {
      itemName,
      dateFound, timeFound, foundLocation,
      dateLost, timeLost, lastLocation,
      itemDescription,
      fullName, matricNumber, phoneNumber, email,
      shareInfo, adminContact,
      status,
    } = req.body;

    const newItem = new Item({
      itemName,
      itemDescription,
      status,
      image: req.file ? `/uploads/${req.file.filename}` : "",
      shareInfo: shareInfo === "true" || shareInfo === true,
      adminContact: adminContact === "true" || adminContact === true,
      finderInfo: { fullName, matricNumber, phoneNumber, email },
    });

    // Status-specific fields
    if (status === "found") {
      newItem.dateFound = dateFound;
      newItem.timeFound = timeFound;
      newItem.foundLocation = foundLocation;
    } else if (status === "lost") {
      newItem.dateLost = dateLost;
      newItem.timeLost = timeLost;
      newItem.lastLocation = lastLocation;
    }

    await newItem.save();
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    console.error("Create item error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================
// Update item status
// =============================
export const updateItemStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    item.status = status;
    await item.save();
    res.json({ success: true, data: item });
  } catch (error) {
    console.error("Update item status error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================
// Delete an item
// =============================
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    await item.deleteOne();
    res.json({ success: true, message: "Item deleted" });
  } catch (error) {
    console.error("Delete item error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================
// Search items
// =============================
export const searchItems = async (req, res) => {
  try {
    const { q, status } = req.query;
    if (!q) return res.status(400).json({ success: false, message: "Query required" });

    const regex = new RegExp(q, "i");
    const query = {
      $or: [
        { itemName: regex },
        { itemDescription: regex },
        { "finderInfo.fullName": regex },
        { "finderInfo.matricNumber": regex },
      ],
    };
    if (status) query.status = status;

    const items = await Item.find(query).sort({ dateReported: -1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    console.error("Search items error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================
// Get recent items
// =============================
export const getRecentItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ dateReported: -1 }).limit(10);
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================
// Get all items (no filter)
// =============================
export const getAllItem = async (req, res) => {
  try {
    const items = await Item.find().sort({ dateReported: -1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    console.error("Get all items error:", error);
    res.status(500).json({ success: false, message: "Error fetching all items", error: error.message });
  }
};
