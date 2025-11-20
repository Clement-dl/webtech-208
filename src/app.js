const express = require("express")
const app = express()

// Permet de lire le JSON dans les requêtes POST
app.use(express.json())

// Import des routers
const indexRoutes = require("./routes/index.routes")
const articleRoutes = require("./routes/articles.routes")
const commentRoutes = require("./routes/comments.routes")

app.use("/", indexRoutes)
app.use("/articles", articleRoutes)
app.use("/articles", commentRoutes)

module.exports = app
