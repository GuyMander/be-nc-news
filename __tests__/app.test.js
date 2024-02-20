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
    });
    test('returns an array of objects within the topics key', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response)=>{
            const topics = response.body.topics;
            topics.forEach((topic) => {
                expect(typeof topic).toBe('object');
            });
        });
    });
    test('all topic objects should have a property of "slug" and "description" both have values of type "string"', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response)=>{
            const topics = response.body.topics;
            topics.forEach((topic) => {
                expect(topic).toHaveProperty('slug') && expect(typeof topic.slug).toBe('string');
                expect(topic).toHaveProperty('description') && expect(typeof topic.description).toBe('string');
            })
        });
    });
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

            expect(article).toHaveProperty('author') && expect(typeof topic.slug).toBe('string')
            expect(article).toHaveProperty('title') && expect(typeof topic.slug).toBe('string')
            expect(article).toHaveProperty('article_id') && expect(typeof topic.slug).toBe('number')
            expect(article).toHaveProperty('body') && expect(typeof topic.slug).toBe('string')
            expect(article).toHaveProperty('topic') && expect(typeof topic.slug).toBe('string')
            expect(article).toHaveProperty('created_at') && expect(typeof topic.slug).toBe('string')
            expect(article).toHaveProperty('votes') && expect(typeof topic.slug).toBe('number')
            expect(article).toHaveProperty('article_img_url') && expect(typeof topic.slug).toBe('string')

        })
    })
})



describe('Error Handling', () => {
    describe('ERROR: 404 Not Found', () => {
        describe('Get topics', () => {
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
        })

        describe('Get articlebyID', () => {
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
        })
        
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

    describe('ERROR: 400 Bad Request', () => {
        describe('Get articleById', () => {
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
    })
})