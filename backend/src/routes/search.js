import express from "express";

const router = express.Router();

// ✅ THIS IS THE IMPORTANT PART
router.get("/", (req, res) => {
  const { city } = req.query;

  res.json({
    success: true,
    city: city || "Not provided",
    message: `Search results for ${city}`
  });
});

export default router;