const db = require('../db/connection')
const data = require('../db/data/test-data/index')
 const seed = require('../db/seeds/seed')
 const { app } = require('../app')
 const request = require('supertest')
const { response } = require('express')

beforeEach(() => seed(data));
afterAll(() => db.end());


describe('CORE: GET /api/topics', () => {
    test('returns 200 status code', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
    });
    test('returns an array', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response)=>{
            const topics = response.body;
            expect(Array.isArray(topics)).toBe(true);
        })
    });
    test('returns an array of objects', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response)=>{
            const topics = response.body;
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
            const topics = response.body;
            topics.forEach((topic) => {
                expect(topic).toHaveProperty('slug') && expect(typeof topic.slug).toBe('string');
                expect(topic).toHaveProperty('description') && expect(typeof topic.description).toBe('string');
            })
        });
    });
});

describe('Error Handling', () => {
    describe('ERROR: 404 Not Found', () => {
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

         test('Returns a 404 status for an endpoint that does not exist', () => {
            return request(app)
            .get('/api/does-not-exist')
            .expect(404).then((response) => {
                
            })
        })
        test('returns a customer error object of {status: 404, msg:"Endpoint Does Not Exist"', () => {
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