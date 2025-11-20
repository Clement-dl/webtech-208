const express = require("express")
const router = express.Router()
const db = require("../db")
const { v4: uuidv4 } = require("uuid")

// GET /articles/:articleId/comments
router.get("/:articleId/comments", (req, res) => {
  const comments = db.comments.filter(c => c.articleId === req.params.articleId)
  res.json(comments)
})

// POST /articles/:articleId/comments
router.post("/:articleId/comments", (req, res) => {
  const articleExists = db.articles.find(a => a.id === req.params.articleId)
  if (!articleExists) return res.status(404).json({ error: "Article not found" })

  const comment = {
    id: uuidv4(),
    timestamp: Date.now(),
    content: req.body.content,
    author: req.body.author,
    articleId: req.params.articleId
  }

  db.comments.push(comment)
  res.status(201).json(comment)
})

// GET /articles/:articleId/comments/:commentId
router.get("/:articleId/comments/:commentId", (req, res) => {
  const comment = db.comments.find(c =>
    c.id === req.params.commentId &&
    c.articleId === req.params.articleId
  )

  if (!comment) return res.status(404).json({ error: "Comment not found" })

  res.json(comment)
})

module.exports = router
