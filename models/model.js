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
        return rows;
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
        return rows[0];
    })
}

exports.fetchAllArticles = () => {

    return db.query(`
    SELECT
    articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    INNER JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at ASC
    ;`)
    .then(({rows}) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: 'No Articles Found'})
        }
        return rows;
    })
}