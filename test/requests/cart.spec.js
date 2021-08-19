const request = require('supertest');
const sinon = require('sinon');
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const app = require('../../app');
const db = require('../../models');

describe('#cart request', () => {
    context('#index', () => {
        describe('show cart', () => {
            it('will list all the product in cart', (done) => {
                request(app)
                    .get('/cart')
                    .set('Accept', '/application/json')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        res.text.should.include('Check Order');
                        res.text.should.include('Price');
                        res.text.should.include('Quantity');
                        return done();
                    });
            });
        });
    });

    context('#update', () => {
        describe('#update cart', () => {
            before(async() => {
                await db.CartItem.create({ProductId: 1, CartId: 1, quantity: 1});
            });

            it('will send data', (done) => {
                const updateQty = {cartItemId: 1}
                request(app)
                    .put('/cart')
                    .send(updateQty)
                    .set('Accept', '/application/json')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            });
            it('will update cart', (done) => {
                db.CartItem.findOne({
                    where: {ProductId: 1, CartId: 1}
                }).then(cartItem => {
                    expect(cartItem.quantity).to.equal(2);
                    return done();
                }).catch(err => {
                    return done(err);
                });
            });

            after(async() => {
                await db.CartItem.destroy({where: {id: 1}, truncate: true});
            });
        });
    });
});