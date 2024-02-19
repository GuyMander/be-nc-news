const { fetchAllTopics } = require('../models/model');
const fs = require('fs/promises');


exports.getAllTopics = (request, response, next) => {
    fetchAllTopics()
    .then((topics) => {
        response.status(200).send(topics);
    })
    .catch((error) => {
        next(error);
    })
}

exports.getAll_APIs = (request, response, next) => {
    return fs.readFile(`${__dirname}/../endpoints.json`,'utf-8')
    .then((contents) => {
        const full_API_JSON_Obj = JSON.parse(contents);
        const output = {}
            for(const key in full_API_JSON_Obj){
                output[key] = full_API_JSON_Obj[key].description
            }
        return response.status(200).send(output);
    })
}