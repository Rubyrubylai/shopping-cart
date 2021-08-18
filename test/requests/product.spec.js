const request = require('supertest');
const sinon = require('sinon');
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const app = require('../../app');
const db = require('../../models');
const helpers = require('../../_helpers');

describe('#product request', () => {
    context('#index', () => {
        describe('go to products page', () => {
            it('will list all the products', (done) => {
                request(app)
                    .get('/products')
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        res.text.should.include('SHOP');
                        return done();
                    });
            });
        });
    });

    context('#favorite', () => {
        describe('like product', () => {
            before(async() => {
                this.ensureAuthenticated = sinon.stub(
                    helpers, 'ensureAuthenticated'
                ).returns(true);
                this.getUser = sinon.stub(
                    helpers, 'getUser'
                ).returns({id: 4});
                await db.User.create({id: 4});
                await db.Product.create({id: 21});
            });

            it ('will redirect index', (done) => {
                request(app)
                    .post('/favorite/21')
                    .set('Accept', 'application/json')
                    .expect(302)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            });
            it ('will save favorite', (done) => {
                db.Favorite.findOne({
                    where: {UserId: 4, ProductId: 21}
                }).then(favorite => {
                    expect(favorite).to.not.be.null;
                    return done();
                }).catch(err => {
                    return done(err);
                });
            });

            after(async() => {
                this.ensureAuthenticated.restore();
                this.getUser.restore();
                await db.User.destroy({where: {id: 4}});
                await db.Product.destroy({where: {id: 21}});
                await db.Favorite.destroy({where: {UserId: 4, ProductId: 21}});
            });
        });
    });

    context('#unfavorite', () => {
        describe('unfavorite product', () => {
            before(async() => {
                this.ensureAuthenticated = sinon.stub(
                    helpers, 'ensureAuthenticated'
                ).returns(true);
                this.getUser = sinon.stub(
                    helpers, 'getUser'
                ).returns({id: 4});
                await db.User.create({id: 4});
                await db.Product.create({id: 21});
                await db.Favorite.create({UserId: 4, ProductId: 21});
            });

            it('will redirect to index', (done) => {
                request(app)
                    .delete('/favorite/21')
                    .set('Accept', 'application/json')
                    .expect(302)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
            it('will remove favorite', (done) => {
                db.Favorite.findOne({
                    where: {UserId: 4, ProductId: 21}
                }).then(favorite => {
                    expect(favorite).to.be.null;
                    return done()
                }).catch(err => {
                    return done(err);
                });
            });

            after(async() => {
                this.ensureAuthenticated.restore();
                this.getUser.restore();
                await db.User.destroy({where: {id: 4}});
                await db.Product.destroy({where: {id: 21}});
            });
        });
    });
});