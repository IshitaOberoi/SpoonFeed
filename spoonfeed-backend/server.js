import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Favorite Schema
const favoriteSchema = new mongoose.Schema({
  id: Number,        // spoonacular recipe id
  title: String,
  image: String
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

// Routes
app.get("/api/favorites", async (req, res) => {
  const favorites = await Favorite.find();
  res.json(favorites);
});

app.post("/api/favorites", async (req, res) => {
  const { id, title, image } = req.body;
  const exists = await Favorite.findOne({ id });
  if (exists) return res.status(400).json({ message: "Already in favorites" });
  const fav = new Favorite({ id, title, image });
  await fav.save();
  res.json(fav);
});

app.delete("/api/favorites/:id", async (req, res) => {
  await Favorite.deleteOne({ id: req.params.id });
  res.json({ message: "Removed from favorites" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/api/recipes", async (req, res) => {
  const { ingredients, ranking, number } = req.query;
  const apiKey = process.env.SPOON_API_KEY;

  if (!ingredients) {
    return res.status(400).json({ message: "No ingredients provided" });
  }

  try {
    const response = await axios.get(
      "https://api.spoonacular.com/recipes/findByIngredients",
      {
        params: {
          ingredients,
          number: number || 12,
          ranking: ranking || 1,
          apiKey
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching from Spoonacular:", err);
    res.status(500).json({ message: "Error fetching recipes" });
  }
});