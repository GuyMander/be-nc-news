const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());
app.use(express.json());

const { handleNoEndpoint, handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./error_handling/errors');
const { getAllTopics, getAll_APIs, getArticleById, getAllArticles, getAllCommentsByArticleId,
   postCommentByArticleId, patchArticleById, deleteCommentById, getAllUsers } = require('./controllers/controller');
  


app.get('/api/topics', getAllTopics);

app.get('/api', getAll_APIs);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getAllArticles);

app.get('/api/articles/:article_id/comments', getAllCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postCommentByArticleId);

app.patch('/api/articles/:article_id', patchArticleById);

app.delete('/api/comments/:comment_id', deleteCommentById);

app.get('/api/users', getAllUsers);



app.get('/*', handleNoEndpoint);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors)

module.exports = app