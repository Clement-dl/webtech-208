// serveur/src/routes/articles.js
const express = require('express');
const { db, createArticle, createComment } = require('../db');

const router = express.Router();

// GET /articles - lister tous les articles
router.get('/', (req, res) => {
  res.json(db.articles);
});

// POST /articles - ajouter un nouvel article
router.post('/', (req, res) => {
  const { title, content, author } = req.body || {};
  if (!title || !content) {
    return res.status(400).json({ error: 'title et content sont requis' });
  }
  const article = createArticle({ title, content, author });
  res.status(201).json(article);
});

// GET /articles/:articleId - obtenir un article par ID
router.get('/:articleId', (req, res) => {
  const { articleId } = req.params;
  const article = db.articles.find(a => a.id === articleId);
  if (!article) return res.status(404).json({ error: 'Article not found' });
  res.json(article);
});

// GET /articles/:articleId/comments - commentaires d’un article
router.get('/:articleId/comments', (req, res) => {
  const { articleId } = req.params;
  const article = db.articles.find(a => a.id === articleId);
  if (!article) return res.status(404).json({ error: 'Article not found' });

  const comments = db.comments.filter(c => c.articleId === articleId);
  res.json(comments);
});

// POST /articles/:articleId/comments - ajouter un commentaire
router.post('/:articleId/comments', (req, res) => {
  const { articleId } = req.params;
  const article = db.articles.find(a => a.id === articleId);
  if (!article) return res.status(404).json({ error: 'Article not found' });

  const { content, author } = req.body || {};
  if (!content) {
    return res.status(400).json({ error: 'content est requis' });
  }
  const comment = createComment({ articleId, content, author });
  res.status(201).json(comment);
});

// GET /articles/:articleId/comments/:commentId - commentaire précis
router.get('/:articleId/comments/:commentId', (req, res) => {
  const { articleId, commentId } = req.params;

  const article = db.articles.find(a => a.id === articleId);
  if (!article) return res.status(404).json({ error: 'Article not found' });

  const comment = db.comments.find(
    c => c.id === commentId && c.articleId === articleId
  );
  if (!comment) return res.status(404).json({ error: 'Comment not found' });

  res.json(comment);
});

module.exports = router;
