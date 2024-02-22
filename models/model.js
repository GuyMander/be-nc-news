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

exports.fetchAllCommentsByArticleId = (id) => {
    return db.query(`
    SELECT
    comment_id,votes,created_at,author,body,article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
    ;`, [id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: 'No Comments Found'})
        }
        return rows;
    })
}

exports.createCommentByArticleId = (id, comment) => {
    if(!comment.username){
        return Promise.reject({status: 400, msg: 'Invalid Comment: No username property'})
    }
    if(!comment.body){
        return Promise.reject({status:400, msg: 'Invalid Comment: No body property'})
    }
    const formattedComment = [[id, comment.username, comment.body]];
    const formattedQuery = format(`
    INSERT INTO comments
    (article_id, author, body)
    VALUES
    %L
    RETURNING *
    ;`, formattedComment);
    return db.query(formattedQuery)
    .then(({rows}) => {
        return rows[0];
    })
    .catch((error) => {
        if(error.code === '23503'){
            const customError = {status:404, msg: 'No Username Found'};
            return Promise.reject(customError);
        }
        else{
            return Promise.reject(error)
        }
    });
}

exports.updateArticleById = (id, voteObj) => {
    const votes_to_add = voteObj.inc_votes;
    if (typeof votes_to_add !== 'number'){
        return Promise.reject({status: 400, msg: 'Invalid Vote Object'});
    }
    return db.query(`
    UPDATE articles
    SET
    votes = votes + $2
    WHERE
    article_id = $1
    RETURNING *
    ;`, [id, votes_to_add])
    .then(({rows}) => {
        return rows[0]
    })
    .catch((error) => {
        return Promise.reject(error)
    })
}

exports.removeCommentById = (id) => {
    const reIdValidator = /^(?!0$)\d+$/;
    const reResult = reIdValidator.test(id);
    if(!reResult){
        return Promise.reject({status: 400, msg: 'Invalid comment_id'})
    }

    return db.query(`
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *
    ;`, [id])
    .then(({rows}) => {
        if(rows.length !== 0){
            return rows;
        }
        else {
            return Promise.reject({status:404, msg:'No Comments Found'})
        }
    })
    .catch((error) => {
        return Promise.reject(error)
    })
}