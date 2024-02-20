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
    const reIdValidator = /^(?!0$)\d+$/;
    const reResult = reIdValidator.test(id);
    if(!reResult){
        return Promise.reject({status: 400, msg: 'Invalid article_id'})
    }
    return db.query(`
    SELECT * FROM articles
    WHERE article_id = $1;`, [id])
    .then(({rows}) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: 'No Article Found'})
        }
        return {article: rows[0]}
    })
}