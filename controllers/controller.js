const { fetchAllTopics, fetch_APIs } = require('../models/model');


exports.getAllTopics = (request, response, next) => {
    fetchAllTopics()
    .then((topics) => {
        response.status(200).send(topics);
    })
    .catch((error) => {
        next(error);
    })
}

exports.getAll_APIs = async (request, response, next) => {
    const api_Obj = await fetch_APIs()
    response.status(200).send(api_Obj);
}