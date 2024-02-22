const { fetchAllTopics, fetchArticleById, fetchAllArticles, fetchAllCommentsByArticleId, createCommentByArticleId,
    updateArticleById, removeCommentById, fetchAllUsers } = require('../models/model');
const fs = require('fs/promises');


exports.getAllTopics = (request, response, next) => {
    fetchAllTopics()
    .then((topics) => {
        return response.status(200).send({topics});
    })
    .catch((error) => {
        next(error);
    })
}

exports.getAll_APIs = (request, response, next) => {
    return fs.readFile(`${__dirname}/../endpoints.json`,'utf-8')
    .then((contents) => {
        const full_API_JSON_Obj = JSON.parse(contents);
        const output = {
            all_APIs:{}
        }
            for(const key in full_API_JSON_Obj){
                output.all_APIs[key] = full_API_JSON_Obj[key].description
            }
        return response.status(200).send(output);
    })
}

exports.getArticleById = (request, response, next) => {
    const articleId = request.params.article_id;
    fetchArticleById(articleId)
    .then((article) => {
        return response.status(200).send({article});
    })
    .catch((error) => {
        next(error);
    })
}

exports.getAllArticles = (request, response, next) => {
    const topic = request.query.topic === undefined || request.query.topic === "" ? undefined : request.query.topic;

    fetchAllArticles(topic)
    .then((articles) => {
        return response.status(200).send({articles});
    })
    .catch((error) => {
        next(error);
    })
}

exports.getAllCommentsByArticleId = (request, response, next) => {
    const articleId = request.params.article_id;
    const promises = [fetchArticleById(articleId), fetchAllCommentsByArticleId(articleId)]
    Promise.all(promises)
    .then((promises) => {
        const comments = promises[1];
        return response.status(200).send({comments});
    })
    .catch((error) => {
        next(error);
    })
}

exports.postCommentByArticleId = (request, response, next) => {
    const articleId = request.params.article_id;
    return fetchArticleById(articleId)
    .then((article)=> {
        const comment = request.body;
        return createCommentByArticleId(article.article_id, comment)
    })
    .then((posted_comment) => {
        return response.status(201).send({posted_comment});
    })
    .catch((error) => {
        next(error);
    })
}

exports.patchArticleById = (request, response, next) => {
    const article_id = request.params.article_id;
    const voteObj = request.body;
    const promises = [updateArticleById(article_id, voteObj), fetchArticleById(article_id)]
    Promise.all(promises)
    .then((promises) => {
        const updated_article = promises[0];
        return response.status(201).send({updated_article})
    })
    .catch((error) => {
        next(error);
    })
}

exports.deleteCommentById = (request, response, next) => {
    const comment_id = request.params.comment_id;
    removeCommentById(comment_id)
    .then((confirmation) => {
        if(confirmation){
            return response.status(204).send()
        }
        else {
            return Promise.reject({status: 400, msg: 'something went wrong'})
        }
    })
    .catch((error) => {
        next(error);
    })
}

exports.getAllUsers = (request, response, next) => {
    fetchAllUsers()
    .then((users) => {
        return response.status(200).send({users});
    })
    .catch((error) => {
        next(error);
    })
}