const express = require("express");
const router = express.Router();
const {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/articles");
const authMiddleware = require("../middlewares/auth");
const checkPermission = require("../middlewares/rbac");

// Routes pour les articles
router.get(
  "/",
  authMiddleware,
  checkPermission(["manage_articles", "perform_transactions"]),
  getAllArticles
);

router.get(
  "/:id",
  authMiddleware,
  checkPermission(["manage_articles", "perform_transactions"]),
  getArticleById
);

router.post(
  "/",
  // authMiddleware,
  // checkPermission(["manage_articles"]), // Création = besoin de "manage_articles"
  createArticle
);

router.put(
  "/:id",
  // authMiddleware,
  // checkPermission(["manage_articles"]), // Modification = besoin de "manage_articles"
  updateArticle
);

router.delete(
  "/:id",
  authMiddleware,
  checkPermission(["manage_articles"]), // Suppression = besoin de "manage_articles"
  deleteArticle
);

module.exports = router;
