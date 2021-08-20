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

    context('#create', () => {
        describe('#create cart', () => {
            it('will redirect to index', (done) => {
                request(app)
                    .post('/cart/1')
                    .send('num=2')
                    .set('Accept', 'application/json')
                    .expect(302)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            });
            it('will create cart', (done) => {
                db.Cart.findByPk(1)
                .then(cart => {
                    expect(cart).to.not.be.null;
                }).catch(err => {
                    return done(err);
                });

                db.CartItem.findOne({
                    where: {CartId: 1, ProductId: 1}
                }).then(cartItem => {
                    expect(cartItem.quantity).to.equal(2);
                    return done();
                }).catch(err => {
                    return done(err);
                });
            });

            after(async() => {
                await db.CartItem.destroy({where: {id: 1}, truncate: true});
                await db.Cart.destroy({where: {id: 1}, truncate: true});
            });
        });
    });

    context('#update', () => {
        describe('#update cart item', () => {
            before(async() => {
                await db.CartItem.create({ProductId: 1, CartId: 1, quantity: 1});
            });

            it('will render index', (done) => {
                request(app)
                    .put('/cart')
                    .send('cartItemId=1&num=2')
                    .set('Accept', '/application/json')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            });
            it('will update cart item', (done) => {
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

    context('#delete', () => {
        describe('#delete cart item', () => {
            before(async() => {
                await db.CartItem.create({});
            });

            it('will render index', (done) => {
                request(app)
                    .delete('/cart')
                    .send('cartItemId=1')
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            });
            it('will delete cart item', (done) => {
                db.CartItem.findOne({
                    where: {id: 1}
                }).then(cartItem => {
                    expect(cartItem).to.be.null;
                    return done();
                }).catch(err => {
                    return done(err);
                })
            });
        });
    });
});