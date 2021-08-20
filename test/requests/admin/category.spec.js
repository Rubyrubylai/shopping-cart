const request = require('supertest');
const sinon = require('sinon');
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const app = require('../../../app');
const db = require('../../../models');
const helpers = require('../../../_helpers');

describe('#admin category request', () => {
    context('go to admin categories page', () => {
        describe('if normal user log in', () => {
            before(async() => {
                this.ensureAuthenticated = sinon.stub(
                    helpers, 'ensureAuthenticated'
                ).returns(true);
                this.getUser = sinon.stub(
                    helpers, 'getUser'
                ).returns({id: 1});
            });
    
            it('will redirect to login page', (done) => {
                request(app)
                    .get('/admin/categories')
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
                await db.Category.create({name: 'dress'});
            });
    
            it('will list all the categories', (done) => {
                request(app)
                    .get('/admin/categories')
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        res.text.should.include('dress');
                        return done();
                    });
            });
            it('can add category', (done) => {
                request(app)
                    .post('/admin/category')
                    .send('name=pants')
                    .set('Accept', 'application/json')
                    .expect(302)
                    .end((err, res) => {
                        if (err) return done(err);
                        db.Category.findOne({
                            where: {id: 2}
                        }).then(category => {
                            expect(category.name).to.equal('pants');
                            return done();
                        }).catch(err => {
                            if (err) return done(err);
                        });
                    });
            });
            it('can update category', (done) => {
                request(app)
                    .put('/admin/category/2')
                    .send('name=skirt')
                    .set('Accept', 'application/json')
                    .expect(302)
                    .end((err, res) => {
                        if (err) return done(err);
                        db.Category.findOne({
                            where: {id: 2}
                        }).then(category => {
                            expect(category.name).to.equal('skirt');
                            return done();
                        }).catch(err => {
                            if (err) return done(err);
                        });
                    });
            });
            it('can delete category', (done) => {
                request(app)
                    .delete('/admin/category/2')
                    .set('Accept', 'application/json')
                    .expect(302)
                    .end((err, res) => {
                        if (err) return done(err);
                        db.Category.findAll()
                        .then(category => {
                            expect(category[0].id).to.equal(1);
                            expect(category[1]).to.be.undefined;
                            return done();
                        }).catch(err => {
                            if (err) return done(err);
                        });
                    });
            });
    
            after(async() => {
                this.ensureAuthenticated.restore();
                this.getUser.restore();
                await db.Category.destroy({where: {}, truncate: true});
            });
        });
    });
});