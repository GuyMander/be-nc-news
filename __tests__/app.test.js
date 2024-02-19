const db = require('../db/connection')
const data = require('../db/data/test-data/index')
 const seed = require('../db/seeds/seed')
 const { app } = require('../app')
 const request = require('supertest')
const { string } = require('pg-format')

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