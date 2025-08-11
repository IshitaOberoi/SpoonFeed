const Ingredient = require("../models/Ingredient");

const getIngredients = async (req, res) => {
  const ingredients = await Ingredient.find();
  res.json(ingredients);
};

const addIngredient = async (req, res) => {
  const ingredient = new Ingredient(req.body);
  const saved = await ingredient.save();
  res.status(201).json(saved);
};

module.exports = { getIngredients, addIngredient };
