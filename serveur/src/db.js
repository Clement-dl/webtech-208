// serveur/src/db.js
const { randomUUID } = require('crypto');

const db = {
  articles: [
    {
      id: '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b',
      title: 'My article',
      content: 'Content of the article.',
      date: '04/10/2022',
      author: 'Liz Gringer',
    },
  ],
  comments: [
    {
      id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      timestamp: 1664835049,
      content: 'Content of the comment.',
      articleId: '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b',
      author: 'Bob McLaren',
    },
  ],
};

// utilitaires simples
function createArticle({ title, content, author }) {
  const article = {
    id: randomUUID(),
    title: String(title || '').trim(),
    content: String(content || '').trim(),
    author: String(author || 'anonymous').trim(),
    date: new Date().toISOString().slice(0, 10),
  };
  db.articles.push(article);
  return article;
}

function createComment({ articleId, content, author }) {
  const comment = {
    id: randomUUID(),
    articleId,
    content: String(content || '').trim(),
    author: String(author || 'anonymous').trim(),
    timestamp: Math.floor(Date.now() / 1000),
  };
  db.comments.push(comment);
  return comment;
}

module.exports = { db, createArticle, createComment };
