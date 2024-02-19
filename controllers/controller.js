const { fetchAllTopics } = require('../models/model');

exports.getAllTopics = (request, response, next) => {
    fetchAllTopics()
    .then((topics) => {
        response.status(200).send(topics);
    })
    .catch((error) => {
        next(error);
    })
}