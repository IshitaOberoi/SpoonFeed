const express = require("express");
const router = express.Router();
const { getIngredients, addIngredient } = require("../controllers/ingredientController");

router.get("/", getIngredients);
router.post("/", addIngredient);

module.exports = router;
