const express = require('express');
const app = express();
app.use(express.json());

const { getAllTopics } = require('./controllers/controller');


app.get('/api/topics', getAllTopics);


app.use((request, response, next) => {
    const error = {
        status:404,
        msg:'Endpoint Does Not Exist'
    }
    next(error);
});

app.use((error, request, response, next) => {
    if (error.status === 404){
      response.status(404).send(error)
    }
    else{
      next(error);
    }
})



module.exports = { app }