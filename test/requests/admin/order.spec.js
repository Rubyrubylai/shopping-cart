const request = require('supertest');
const sinon = require('sinon');
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const app = require('../../../app');
const db = require('../../../models');
const helpers = require('../../../_helpers');

describe('#admin order request', () => {
    context('go to admin orders page', () => {
        describe('if normal user log in', () => {
            before(async() => {
                this.ensureAuthenticated = sinon.stub(
                    helpers, 'ensureAuthenticated'
                ).returns(true);
                this.getUser = sinon.stub(
                    helpers, 'getUser'
                ).returns({id: 1});
                await db.Order.create({});
            });
    
            it('will redirect to login page', (done) => {
                request(app)
                    .get('/admin/orders')
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/user/login')
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            });
    
            after(async() => {
                this.ensureAuthenticated.restore();
                this.getUser.restore();
                await db.Order.destroy({where: {}, truncate: true});
            });
        });

        describe('if admin user log in', () => {
            before(async() => {
                this.ensureAuthenticated = sinon.stub(
                    helpers, 'ensureAuthenticated'
                ).returns(true);
                this.getUser = sinon.stub(
                    helpers, 'getUser'
                ).returns({id: 1, role: 'admin'});
                await db.Order.create({shipping_status: -1});
            });
    
            it('will list all the orders', (done) => {
                request(app)
                    .get('/admin/orders')
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            });
            it('can update order', (done) => {
                request(app)
                    .put('/admin/order/1')
                    .send('shipping_status=-2')
                    .set('Accept', 'application/json')
                    .expect(302)
                    .end((err, res) => {
                        if (err) return done(err);
                        db.Order.findOne({
                            where: {id: 1}
                        }).then(order => {
                            expect(order.shipping_status).to.equal(-2);
                            return done();
                        }).catch(err => {
                            if (err) return done(err);
                        });
                    });
            });
    
            after(async() => {
                this.ensureAuthenticated.restore();
                this.getUser.restore();
                await db.Order.destroy({where: {}, truncate: true});
            });
        });
    });
});