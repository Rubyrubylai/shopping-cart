const request = require('supertest');
const sinon = require('sinon');
const chai = require('chai');
const should = chai.should();
const app = require('../../app');

describe('#cart request', () => {
    context('#index', () => {
        describe('show carts', () => {
            it('will list all the product in carts', (done) => {
                request(app)
                    .get('/cart')
                    .set('Accept', '/application/json')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        res.text.should.include('Check Order');
                        return done();
                    })
            })
        })
    });
});