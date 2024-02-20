const db = require('../db/connection');
const format = require('pg-format');

exports.fetchAllTopics = () => {        
   return db.query(`
   SELECT slug, description
   FROM topics
   ;`)
   .then(({rows})=>{
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: 'No Topics Found'})
        }
        return {topics: rows};
   })
}

exports.fetchArticleById = (id) => {
    
    return db.query(`
    SELECT * FROM articles
    WHERE article_id = $1;`, [id])
    .then(({rows}) => {
        return {article: rows[0]}
    })
}