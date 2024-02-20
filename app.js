const express = require('express');
const app = express();
app.use(express.json());

const { getAllTopics, getAll_APIs, getArticleById } = require('./controllers/controller');
const { handleNoEndpoint, handleCustomErrors, handlePsqlErrors, handleServerErrors} = require('./error_handling/errors');


app.get('/api/topics', getAllTopics);

app.get('/api', getAll_APIs);

app.get('/api/articles/:article_id', getArticleById);




app.get('/*', handleNoEndpoint);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors)

module.exports = { app }