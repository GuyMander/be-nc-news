const express = require('express');
const app = express();
app.use(express.json());

const { handleNoEndpoint, handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./error_handling/errors');
const { 
  getAllTopics,
  getAll_APIs,
  getArticleById,
  getAllArticles } = require('./controllers/controller');
  


app.get('/api/topics', getAllTopics);

app.get('/api', getAll_APIs);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getAllArticles);




app.get('/*', handleNoEndpoint);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors)

module.exports = { app }