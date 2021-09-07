const request = require('supertest');
const sinon = require('sinon');
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const app = require('../../app');
const db = require('../../models');
const helpers = require('../../_helpers');

describe('#order request', () => {
    context('#index', () => {
        describe('show orders', () => {
            before(async() => {
                this.ensureAuthenticated = sinon.stub(
                    helpers, 'ensureAuthenticated'
                ).returns(true);
                this.getUser = sinon.stub(
                    helpers, 'getUser'
                ).returns({id: 1});
            });

            it('#will render index', (done) => {
                request(app)
                    .get('/orders')
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        res.text.should.include('Order Number');
                        return done();
                    });
            });

            after(async() => {
                this.ensureAuthenticated.restore();
                this.getUser.restore();
            });
        });
    });

    context('#create', () => {
        describe('create order', () => {
            before(async() => {
                this.ensureAuthenticated = sinon.stub(
                    helpers, 'ensureAuthenticated'
                ).returns(true);
                this.getUser = sinon.stub(
                    helpers, 'getUser'
                ).returns({id: 1});
                await db.Cart.create({});
                await db.CartItem.create({CartId: 1, ProductId: 1, quantity: 1});
                await db.Product.create({price: 500});
            });

            it('will redirect to index', (done) => {
                request(app)
                    .post('/order')
                    .send('name=John&phone=0912123123&email=John@example.com&address=test street&amount=1000&cartId=1')
                    .set('Accept', 'application/json')
                    .expect(302)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            });
            it('will create order', (done) => {
                db.Order.findOne({
                    where: {id: 1}
                }).then(order => {
                    expect(order.name).to.equal('John');
                    expect(order.phone).to.equal('0912123123');
                    expect(order.email).to.equal('John@example.com');
                    expect(order.address).to.equal('test street');
                    expect(order.amount).to.equal(1000);
                    expect(order.payment_status).to.equal(0);
                    expect(order.shipping_status).to.equal(-1);
                    expect(order.UserId).to.equal(1);
                    return done();
                }).catch(err => {
                    return done(err);
                });
            });
            it('will create order items', (done) => {
                db.OrderItem.findAll({
                    where: {OrderId: 1},
                    raw: true,
                    nest: true
                }).then(orderItem => {
                    expect(orderItem[0].quantity).to.equal(1);
                    expect(orderItem[0].price).to.equal(500);
                    expect(orderItem[0].ProductId).to.equal(1);

                    return done();
                }).catch(err => {
                    return done(err);
                });
            });

            after(async() => {
                this.ensureAuthenticated.restore();
                this.getUser.restore();
                await db.Order.destroy({where: {}, truncate: true});
                await db.OrderItem.destroy({where: {}, truncate: true});
                await db.Product.destroy({where: {}, truncate: true});
                await db.Cart.destroy({where: {}, truncate: true});
                await db.CartItem.destroy({where: {}, truncate: true});
            });
        });
    });

    context('#delete', () => {
        describe('cancel order', () => {
            before(async() => {
                this.ensureAuthenticated = sinon.stub(
                    helpers, 'ensureAuthenticated'
                ).returns(true);
                await db.Order.create({});
            });

            it('will redirect to index', (done) => {
                request(app)
                    .delete('/order/1')
                    .set('Accept', 'application/json')
                    .expect(302)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            });
            it('will update payment_status and shipping_status of order', (done) => {
                db.Order.findOne({
                    where: {id: 1}
                }).then(order => {
                    expect(order.payment_status).to.equal(-1);
                    expect(order.shipping_status).to.equal(-2);
                    return done()
                }).catch(err => {
                    return done(err);
                })
            });

            after(async() => {
                this.ensureAuthenticated.restore();
                await db.Order.destroy({where: {}, truncate: true});
            });
        });
    });
});