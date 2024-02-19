const fs = require('fs/promises');
const db = require('../db/connection');

exports.fetchAllTopics = () => {        
   return db.query(`
   SELECT slug, description
   FROM topics
   ;`)
   .then(({rows})=>{
    if(rows.length === 0) {
        return Promise.reject({status: 404, msg: 'No Topics Found'})
    }
    return {topics:rows};
   })
}

exports.fetch_APIs = async () => {
    return fs.readFile(`${__dirname}/../endpoints.json`,'utf-8')
    .then((contents) => {
        return JSON.parse(contents);
    })
  }