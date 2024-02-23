const db = require('../db/connection');
const data = require('../db/data/test-data/index');
const seed = require('../db/seeds/seed');
const { app } = require('../app');
const request = require('supertest');
const fs = require('fs/promises');


beforeEach(() => seed(data));
afterAll(() => db.end());


describe('CORE: GET /api/topics', () => {
    test('returns 200 status code', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
    });
    test('returns an object', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
            expect(typeof response.body).toBe('object');
        })
    })
    test('returns an array within the object of key "topics"', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response)=>{
            const topics = response.body.topics;
            expect(Array.isArray(topics)).toBe(true);
        })
    })
    test('returns an array of objects within the topics key', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response)=>{
            const topics = response.body.topics;
            expect(topics.length).not.toBe(0);

            topics.forEach((topic) => {
                expect(typeof topic).toBe('object');
            })
        })
    })
    test('all topic objects should have a property of "slug" and "description" both have values of type "string"', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response)=>{
            const topics = response.body.topics;
            expect(topics.length).not.toBe(0);
            
            topics.forEach((topic) => {
                expect(topic).toHaveProperty('slug') && expect(typeof topic.slug).toBe('string');
                expect(topic).toHaveProperty('description') && expect(typeof topic.description).toBe('string');
            })
        })
    })
    test('returns a 404 error when the database has no entries for a valid query', () => {
        return db.query('DELETE FROM comments;')
        .then(() => {
            return db.query('DELETE FROM articles;')
        })
        .then(() => {
            return db.query('DELETE FROM topics;')
        })
        .then(() => {
            return request(app)
            .get('/api/topics')
            .expect(404)
        })
    })
    test('returns a custom error object of {status:404, msg:"No Topics Found"} if the database has no entries for a valid query', ()=> {
        return db.query('DELETE FROM comments;')
        .then(() => {
            return db.query('DELETE FROM articles;')
        })
        .then(() => {
            return db.query('DELETE FROM topics;')
        })
        .then(() => {
            return request(app)
            .get('/api/topics')
            .expect(404)
        })
        .then((response) => {
            const error = response.body
            expect(error.msg).toBe('No Topics Found')
        })
    })
});


describe('CORE: GET /api', () => {
    test('returns 200 status code', () => {
        return request(app)
        .get('/api')
        .expect(200)
    })
    test('returns an object', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((response) => {
            const apiObj = response.body;
            expect(typeof apiObj).toBe('object');
        })
    })
    test('returns the correct representation (api:description) of all apis within endpoint.json file', () => {    
        return request(app)
        .get('/api')
        .expect(200)
        .then((response) => {
            const response_API_Obj = response.body;
            return fs.readFile(`${__dirname}/../endpoints.json`,'utf-8')
            .then((contents) => {
            const full_API_JSON_Obj = JSON.parse(contents);
            const expected = {
                all_APIs:{}
            }
            for(const api in full_API_JSON_Obj){
                expected.all_APIs[api] = full_API_JSON_Obj[api].description
            }
            
            expect(response_API_Obj).toEqual(expected);
            })
        })
    })
})


describe('CORE: GET /api/articles/:article_id', () => {
    test('returns a 200 status code and an object', () => {
        return request(app)
        .get('/api/articles/3')
        .expect(200)
        .then((response) => {
            const responseObj = response.body;
            expect(typeof responseObj).toBe('object');
        })
    })
    test('returns the correct article object with the correct keys and value types, all wrapped in an article object, when parsed a valid Id', () => {
        return request(app)
        .get('/api/articles/3')
        .expect(200)
        .then((response) => {
            const article = response.body.article;
            const exampleObj = {
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
                }

            expect(article).toMatchObject(exampleObj);
        })
    })
    test('returns a 404 error when the database has no entries for a valid id format but no id in the database', () => {
        return request(app)
        .get('/api/articles/100')
        .expect(404)
    })
    test('returns a custom error object of {status: 404, msg: "No Article Found"} if no entries in database', () => {
        return request(app)
        .get('/api/articles/100')
        .expect(404)
        .then((response) => {
            const error = response.body;
            expect(error.msg).toBe('No Article Found')
        })
    })
    test('returns a 400 status when given an invalid article_id', () => {
        return request(app)
        .get('/api/articles/zero')
        .expect(400)
    })
    test('returns a customer error object of {status:400, msg:"Invalid article_id"} when parsed an invalid article_id', () => {
        return request(app)
        .get('/api/articles/zero')
        .expect(400)
        .then((response) => {
            const error = response.body;
            expect(error.msg).toBe('Invalid article_id');
        })
    })
    test('returns a customer error object of {status:400, msg:"Invalid article_id"} when parsed an article_id of 0', () => {
        return request(app)
        .get('/api/articles/0')
        .expect(400)
        .then((response) => {
            const error = response.body;
            expect(error.msg).toBe('Invalid article_id');
        })
    })
})

describe('CORE: GET /api/articles' , () => {
    test('returns a 200 status code and an object', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
            const responseObj = response.body;
            expect(typeof responseObj).toBe('object');
        })
    })
    test('returns correct articles object with a key of "articles" and a value of type array', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
            const articles = response.body.articles;
            const isAnArray = Array.isArray(articles);
            expect(isAnArray).toBe(true);
        })
    })
    test('returns the correct articles objects with an object at every element of the array', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                const articles = response.body.articles;
                expect(articles.length).not.toBe(0)

                articles.forEach((article) => expect(typeof article).toBe('object'));

            })
    })
    test('returns an article array when each article has the correct keys and value types apart from comment_count', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
            const articles = response.body.articles;
            expect(articles.length).not.toBe(0);

            const exampleObj = {
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String)
            }
            articles.forEach((article) => {
                expect(article).toMatchObject(exampleObj)
            });

        })
    })
    test('returns an article array when each article has all the correct keys and value types', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
            const articles = response.body.articles;
            expect(articles.length).not.toBe(0);

            const exampleObj = {
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number)
            }
            articles.forEach((article) => {
                expect(article).toMatchObject(exampleObj)
            });
        })
    })
    test('In addition: the articles should be sorted by date in descending order. there should not be a body property present on any of the objects', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
            const articles = response.body.articles;
            const orderedArticles = [...articles];
            expect(articles.length).not.toBe(0);

            orderedArticles.sort((currArt, nextArt) => Date.parse(currArt.created_at) - Date.parse(nextArt.created_at))
            expect(orderedArticles).toEqual(articles);
        })
    })
    test('returns articles without a body property present on any of the article objects' , () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
            const articles = response.body.articles
            expect(articles.length).not.toBe(0);

            articles.forEach((article) => {
                expect(article).not.toHaveProperty('body');
            })
        })
    })
    test('returns a status of 404 and a custom error object of {status:404, msg:"No Articles Found"} if the database has no entries in articles table', ()=> {
        return db.query('DELETE FROM comments;')
        .then(() => {
            return db.query('DELETE FROM articles;')
        })
        .then(() => {
            return db.query('DELETE FROM topics;')
        })
        .then(() => {
            return request(app)
            .get('/api/articles')
            .expect(404)
        })
        .then((response) => {
            const error = response.body
            expect(error.msg).toBe('No Articles Found')
        })
    })
})

describe('CORE: GET /api/articles/:article_id/comments', () => {
    test('returns a 200 status code and an object', () => {
        return request(app)
        .get('/api/articles/6/comments')
        .expect(200)
        .then((response) => {
            const object = response.body;
            expect(typeof object).toBe('object');
        })
    })
    test('returns an object with a key of "comments" and a value of an array of objects', () => {
        return request(app)
        .get('/api/articles/6/comments')
        .expect(200)
        .then((response) => {
            const comments = response.body.comments;
            expect(comments.length).toBe(1);
            expect(Array.isArray(comments)).toBe(true);
        })
    })
    test('the comments array has the correct keys and value types', () => {
        return request(app)
        .get('/api/articles/6/comments')
        .expect(200)
        .then((response) => {
            const comments = response.body.comments;
            expect(comments.length).not.toBe(0);
            const exampleCommentObj = {
                "comment_id": expect.any(Number),
                "votes": expect.any(Number),
                "created_at": expect.any(String),
                "author": expect.any(String),
                "body": expect.any(String),
                "article_id": expect.any(Number)
                }

            comments.forEach((comment) => {
            expect(comment).toMatchObject(exampleCommentObj)
            })
        })
    })
    test('the comments array is server in order of date created descending', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
            const comments = response.body.comments;
            expect(comments.length).not.toBe(0);

            const orderedComments = [...comments];

            orderedComments.sort((currCom, nextCom) => Date.parse(nextCom.created_at) - Date.parse(currCom.created_at))
            expect(comments).toEqual(orderedComments);
        })
    })
    test('returns a status of 404 and a custom error object of {status:404, msg:"No Comments Found"} if the database has no comments for a valid article_id', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(404)
        .then((response) => {
            const error = response.body;
            expect(error.msg).toBe('No Comments Found');
        })
    })
    test('returns a status of 404 and a custom error object of with a msg depending on which resolves first if the database has no comments for a valid non-existant article_id', () => {
        return request(app)
        .get('/api/articles/1000/comments')
        .expect(404)
        .then((response) => {
            const error = response.body;
            const errorMsgIsTrue = (error.msg === 'No Article Found' || error.msg === 'No Comments Found') ? true : false;
            expect(errorMsgIsTrue).toBe(true);
        })
    })
    test('returns a 400 status and a customer error object of { status:400, msg: "Invalid article_id"} when parsed an invalid article_id', () => {
        return request(app)
        .get('/api/articles/0/comments')
        .expect(400)
        .then((response) => {
            const error = response.body;
            expect(error.msg).toBe('Invalid article_id');
        })
        .then(() => {
            return request(app)
            .get('/api/articles/zero/comments')
            .expect(400)
            .then((response) => {
                const error = response.body;
                expect(error.msg).toBe('Invalid article_id');
            })
        })
    })
})

describe('CORE: POST /api/articles/:article_id/comments', () => {
    test('returns a status code of 201 and an object when given a correct id', () => {
        const newComment = { username: "icellusedkars", body:"Yes, if you stare at the wall like a cat, that means you're a cat"};
        return request(app)
        .post('/api/articles/11/comments')
        .send(newComment)
        .expect(201)
        .then((response) => {
            const bodyObj = response.body;
            expect(typeof bodyObj).toBe('object');
        })
    })
    test('returns a posted_comments object with the correct keys and value types when given the correct username and article_id', () => {
        const newComment = { username: "icellusedkars", body: "Yes, if you stare at the wall like a cat, that means you're a cat"};
        return request(app)
        .post('/api/articles/11/comments')
        .send(newComment)
        .expect(201)
        .then((response) => {
            const posted_comment = response.body.posted_comment;
            const exampleCommentObj = {
                "comment_id": expect.any(Number),
                "votes": expect.any(Number),
                "created_at": expect.any(String),
                "author": expect.any(String),
                "body": expect.any(String),
                "article_id": expect.any(Number)
                }
            
            expect(posted_comment).toMatchObject(exampleCommentObj);
        })
    })
    test('returns a status of 400 and a customer error object of {status: 400, msg: "Invalid article_id" } when using an article id that does not exist', () => {
        const newComment = { username: "icellusedkars", body: "Yes, if you stare at the wall like a cat, that means you're a cat"};
        return request(app)
        .post('/api/articles/0/comments')
        .send(newComment)
        .expect(400)
        .then((response) => {
            const error = response.body;
            expect(error.msg).toBe('Invalid article_id');
        })
    })
    test('returns a status of 400 and a customr error object when {status:400, msg: "Invalid Comment: <Reason>"} when no username key appears on the comment object', () => {
        const newComment = { no_username: "icellusedkars", body: "Yes, if you stare at the wall like a cat, that means you're a cat"};
        return request(app)
        .post('/api/articles/11/comments')
        .send(newComment)
        .expect(400)
        .then((response) => {
            const error = response.body;
            expect(error.msg).toBe('Invalid Comment: No username property');
        })
    })
    test('returns a status of 400 and a custom error object of {status:400, msg: "Invalid Comment: <Reason>"} when no body key appears on the comment object', () => {
        const newComment = { username: "icellusedkars", not_a_body: "Yes, if you stare at the wall like a cat, that means you're a cat"};
        return request(app)
        .post('/api/articles/11/comments')
        .send(newComment)
        .expect(400)
        .then((response) => {
            const error = response.body;
            expect(error.msg).toBe('Invalid Comment: No body property');
        })
    })
    test('returns a status of 404 and a custom error object of {status:404, msg: "No Article Found"} when provided an valid non-existant article_id', () => {
        const newComment = { username: "icellusedkars", not_a_body: "Yes, if you stare at the wall like a cat, that means you're a cat"};
        return request(app)
        .post('/api/articles/33/comments')
        .send(newComment)
        .expect(404)
        .then((response) => {
            const error = response.body;
            expect(error.msg).toBe('No Article Found');
        })
    })
    test('returns a status of 404 and a custom error object of {status:404, msg:"No Username Found"} if the database has no users with the provided username in requested comment object' ,() => {
        const newComment = { username: "not_a_username", body: "Yes, if you stare at the wall like a cat, that means you're a cat"};
        return request(app)
        .post('/api/articles/11/comments')
        .send(newComment)
        .expect(404)
        .then((response) => {
            const error = response.body;
            expect(error.msg).toBe('No Username Found');
        })
    })
})

describe('CORE: PATCH /api/articles/:article_id', () => {
    test('returns a status code of 201 and a article object', () => {
        const voteObj = { inc_votes: 3 };

        return request(app)
        .patch('/api/articles/1')
        .send(voteObj)
        .expect(201)
        .then((response) => {
            const updated_article = response.body.updated_article;
            expect(typeof updated_article).toBe('object');
        })
    })
    test('returns an article object with the correct key-values', () => {
        const voteObj = { inc_votes: 3 };

        return request(app)
        .patch('/api/articles/1')
        .send(voteObj)
        .expect(201)
        .then((response) => {
            const updated_article = response.body.updated_article;
            const exampleArticleObj = {
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
            }
            expect(updated_article).toMatchObject(exampleArticleObj)
        })
    })
    test('returns an updated_article object with votes having correctly been increased by the desired amount from the requested vote object', () => {
        let originalVotes;
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response) => {
            originalVotes = response.body.article.votes
            return
        })
        .then(() => {
            const voteObj = { inc_votes: 3 };
            return request(app)
            .patch('/api/articles/1')
            .send(voteObj)
            .expect(201)    
        })
        .then((response) => {
            const updated_article = response.body.updated_article;
            expect(updated_article.votes).not.toEqual(originalVotes)
            expect(updated_article.votes).toEqual(originalVotes + 3)
        })

    })
    test('does not change any of the other values for the article object', () => {
        let originalArticle;
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response) => {
            originalArticle = response.body.article
            return
        })
        .then(() => {
            const voteObj = { inc_votes: 3 };
            return request(app)
            .patch('/api/articles/1')
            .send(voteObj)
            .expect(201)    
        })
        .then((response) => {
            const updated_article = response.body.updated_article;
            expect(updated_article.votes).not.toEqual(originalArticle.votes)
            expect(updated_article.votes).toEqual(originalArticle.votes + 3)
            //votes has now been increased so, remove the keys from both objects and compare the remaining objects for sameness
            delete updated_article.votes;
            delete originalArticle.votes;
            delete originalArticle.comment_count;
            expect(updated_article).toMatchObject(originalArticle);
        })
    })
    test('allows negative votes in the vote object', () => {
        let originalVotes;
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response) => {
            originalVotes = response.body.article.votes
            return
        })
        .then(() => {
            const voteObj = { inc_votes: -3 };
            return request(app)
            .patch('/api/articles/1')
            .send(voteObj)
            .expect(201)    
        })
        .then((response) => {
            const updated_article = response.body.updated_article;
            expect(updated_article.votes).not.toEqual(originalVotes)
            expect(updated_article.votes).toEqual(originalVotes - 3)
        })
    })
    test('Invalid article_id gives 400 status and custom error of {status:404, msg: "Invalid article_id"}', () => {
        const voteObj = { inc_votes: 3 };
        return request(app)
        .patch('/api/articles/0')
        .send(voteObj)
        .expect(400)    
        .then((response) => { 
            const error = response.body
            expect(error.msg).toBe('Invalid article_id')  
        })
    })
    test('Returns a 400 status for an invalid vote object with a custom error object of {status: 400, msg: "Invalid Vote Object"}', () => {
        const voteObj = { not_a_vote_key: 3 };
        return request(app)
        .patch('/api/articles/1')
        .send(voteObj)
        .expect(400)    
        .then((response) => { 
            const error = response.body
            expect(error.msg).toBe('Invalid Vote Object')  
        })
    })
    test('returns 404 status for a valid article_id that is not found with custom error object of {status: 404, msg: "No Article Found"}', () => {
        const voteObj = { inc_votes: 3 };
        return request(app)
        .patch('/api/articles/33')
        .send(voteObj)
        .expect(404)    
        .then((response) => { 
            const error = response.body
            expect(error.msg).toBe('No Article Found')  
        })
    })
})

describe('CORE: DELETE /api/comments/:comment_id', () => {
    test('Responds with 204 and no content when given a valid & existing comment_id' , () => {
        return request(app)
        .delete('/api/comments/18')
        .expect(204)
        .then((response) => {
            response.body === undefined;
        })
    })
    test('Deletes the comment from the database based on the comment_id given', () => {
        let originalComments;
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
            originalComments = response.body.comments;
            return request(app)
            .delete('/api/comments/18')
            .expect(204)
        })
        .then(() => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
        })
        .then((response) => {
            const commentsAfterDeleted = response.body.comments;
            expect(commentsAfterDeleted).not.toEqual(originalComments);
            expect(commentsAfterDeleted.length).toBe(originalComments.length -1);
            expect(commentsAfterDeleted[10]).toBe(undefined);
        })
    })
    test('When parsed an invalid comment_id, returns a 400 status and custom error object {status: 400, msg:"Invalid comment_id"}', () => {
        return request(app)
        .delete('/api/comments/0')
        .expect(400)
        .then((response) => {
            const error = response.body;
            expect(error.msg).toBe('Invalid comment_id');
            return request(app)
            .delete('/api/comments/zero')
            .expect(400)
            .then((response) => {
                const error = response.body;
                expect(error.msg).toBe('Invalid comment_id');
            })
        })
    })
    test('When parsed a non existant valid comment_id, returns a 404 status with custom error object {status:404, msg:"No Comment Found"}', () => {
        return request(app)
        .delete('/api/comments/33')
        .expect(404)
        .then((response) => {
            const error = response.body;
            expect(error.msg).toBe('No Comment Found');
        })
    })
})

describe('CORE: GET /api/users', () => {
    test('Responds with a status code of 200 and a user object with an array of objects', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then((response) => {
            const users = response.body.users;
            expect(Array.isArray(users)).toBe(true);
        })
    })
    test('Responds with the correct key-values on the users object for all array elements', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then((response) => {
            const users = response.body.users;
            expect(users.length).not.toBe(0);
            const exampleUserObj = {
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String)
            }

            users.forEach((user) => {
                expect(user).toMatchObject(exampleUserObj);
            })
        })
    })
    test('Responds with a 404 status error and a customer error object of {status:400, msg:"No Users Found"} when there are no users in the database', () => {
        return db.query(`DELETE FROM comments;`)
        .then(() => {
            return db.query(`DELETE FROM articles;`);
        })
        .then(() => {
            return db.query('DELETE FROM users');
        })
        .then(() => {
            return request(app)
            .get('/api/users')
            .expect(404)
        })
        .then((response) => {
            const error = response.body;
            expect(error.msg).toBe('No Users Found');
        })
    })
})

describe('FEATURE: GET /api/articles (topic query)', () => {
    test('Responds with all articles when topic is omitted in the query', () => {
        const arrOfAllArticles = require('../db/data/test-data/articles_array');
        arrOfAllArticles.sort((curr,next) => curr.article_id - next.article_id);
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
            const articles = response.body.articles;
            articles.sort((curr,next) => curr.article_id - next.article_id);
            expect(articles.length).toBe(arrOfAllArticles.length);
            expect(articles).toEqual(arrOfAllArticles);
        })
    })
    test('Responds with all articles when the topic query is misspelt', () => {
        const arrOfAllArticles = require('../db/data/test-data/articles_array');
        arrOfAllArticles.sort((curr,next) => curr.article_id - next.article_id);
        return request(app)
        .get('/api/articles?topc=')
        .expect(200)
        .then((response) => {
            const articles = response.body.articles;
            articles.sort((curr,next) => curr.article_id - next.article_id);
            expect(articles.length).toBe(arrOfAllArticles.length);
            expect(articles).toEqual(arrOfAllArticles);
        })
    })
    test('Responds with all articles when the value is omitted in the topic query', () => {
        const arrOfAllArticles = require('../db/data/test-data/articles_array');
        arrOfAllArticles.sort((curr,next) => curr.article_id - next.article_id);
        return request(app)
        .get('/api/articles?topic=')
        .expect(200)
        .then((response) => {
            const articles = response.body.articles;
            articles.sort((curr,next) => curr.article_id - next.article_id);
            expect(articles.length).toBe(arrOfAllArticles.length);
            expect(articles).toEqual(arrOfAllArticles);
        })
    })
    test('Responds with all articles (1) when the value is included in the topic query', () => {
        const arrOfAllArticles = require('../db/data/test-data/articles_array');
        const articles_with_cats = arrOfAllArticles.filter((article) => article.topic === 'cats' ? article: false);
        return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then((response) => {
            const catArticles = response.body.articles;

            expect(catArticles[0]).toEqual(articles_with_cats[0]);
        })
    })
    test('Responds with all articles (12) when the value is included in the topic query', () => {
        const arrOfAllArticles = require('../db/data/test-data/articles_array');
        const articles_with_mitch = arrOfAllArticles.filter((article) => article.topic === 'mitch' ? article: false);
        articles_with_mitch.sort((curr, next) => curr.article_id - next.article_id);

        return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then((response) => {
            const mitchArticles = response.body.articles.sort((curr,next) => curr.article_id - next.article_id);
            expect(mitchArticles).toEqual(articles_with_mitch);
        })
    })
    test('Responds with status 404 and custom error if parsed a topic value that does not exist', () => {
        return request(app)
        .get('/api/articles?topic=not_a_topic')
        .expect(404)
        .then((response) => {
            const error = response.body
            expect(error.msg).toBe('No Articles Found')
        })
    })
})

describe('CORE: GET /api/articles/:article_id (comment_count)', () => {
    test('responds with the extra property of comment_count', () => {
        const example_article = {
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number)
              }

        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response) => {
            const article = response.body.article;
            expect(article).toMatchObject(example_article);
        })
    })
    test('Returns the correct value for the comment_count property', () => {
        const articles = require('../db/data/test-data/articles_array')
        articles.sort((curr, next) => curr.article_id - next.article_id);
        const first_article = articles[0];
        first_article.comment_count = 11;

        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response) => {
            const article = response.body.article;
            expect(article).toMatchObject(first_article);
        }) 
    })
    test('Returns zero when there are no comments for the article', () => {
        const articles = require('../db/data/test-data/articles_array')
        articles.sort((curr, next) => curr.article_id - next.article_id);
        const first_article = articles[1];
        first_article.comment_count = 0;

        return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then((response) => {
            const article = response.body.article;
            expect(article).toMatchObject(first_article);
        }) 
    })
})

describe('Error Handling', () => {
    describe('None existant endpoints', () => {
        test('Returns a 404 status for an endpoint that does not exist', () => {
            return request(app)
            .get('/api/does-not-exist')
            .expect(404)
        })
        test('returns a customer error object of {status: 404, msg:"Endpoint Does Not Exist"}', () => {
            return request(app)
            .get('/api/does-not-exist')
            .expect(404)
            .then((response) => {
                const error = response.body;
                expect(error.msg).toBe('Endpoint Does Not Exist');
            })
        })
    })

})