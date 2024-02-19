const express = require('express');
const app = express();
app.use(express.json());

const { getAllTopics } = require('./controllers/controller');


app.get('/api/topics', getAllTopics);




// app.use((error, request, response, next) => {
//     if (error.status === 400){
//       response.status(400).send(error)
//     }
//     else{
//       next(error);
//     }
// })



module.exports = { app }