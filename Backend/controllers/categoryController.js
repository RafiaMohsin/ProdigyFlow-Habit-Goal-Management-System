const Category = require('../models/Category');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { CategoryName } = req.body;
    if (!CategoryName) {
      return res.status(400).json({ error: 'CategoryName is required.' });
    }
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.createCategorySP = async (req, res) => {
  try {
    const { CategoryName } = req.body;
    if (!CategoryName) {
      return res.status(400).json({ error: 'CategoryName is required.' });
    }
    await Category.createWithSP({ CategoryName });
    res.status(201).json({ message: 'Category added via stored procedure.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCategorySP = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'CategoryID is required.' });
    }
    const result = await Category.deleteWithSP(id);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    res.status(200).json({ message: 'Category deleted via stored procedure.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
