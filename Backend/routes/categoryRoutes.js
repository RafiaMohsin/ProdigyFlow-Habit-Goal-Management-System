const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// GET all categories
router.get('/', categoryController.getAllCategories);

// POST create category
router.post('/sp', categoryController.createCategorySP);
router.post('/', categoryController.createCategory);
// DELETE category using SP
router.delete('/:id/sp', categoryController.deleteCategorySP);


module.exports = router;
