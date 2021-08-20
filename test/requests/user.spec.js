const request = require('supertest');
const sinon = require('sinon');
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const bcrypt = require('bcrypt');
const app = require('../../app');
const db = require('../../models');
const helpers = require('../../_helpers');

describe('#user request', () => {
    context('#go to login page', () => {
        describe('if user wants to log in', () => {
            before(async() => {
                await db.User.create({
                    name: 'Phoebe',
                    email: 'phoebe@example.com',
                    password: bcrypt.hashSync('Phoebe1234', bcrypt.genSaltSync(10))
                });
            });

            it('will render index', (done) => {
                request(app)
                    .get('/user/login')
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        res.text.should.include('Log In');
                        return done(err);
                    });
            });
            it('log in successfully', (done) => {
                request(app)
                    .post('/user/login')
                    .send('email=phoebe@example.com&password=Phoebe1234')
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/')
                    .end((err, res) => {
                        if (err) return done(err);
                        return done(err);
                    });
            });
            it('log in fail', (done) => {
                request(app)
                    .post('/user/login')
                    .send('email=phoebe@example.com&password=P1234&redirect=favorites')
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/user/login?redirect=favorites')
                    .end((err, res) => {
                        if (err) return done(err);
                        return done(err);
                    });
            });

            after(async() => {
                await db.User.destroy({where: {}, truncate: true});
            });
        });
    });

    context('#go to register page', () => {
        describe('if user wants to register', () => {
            it('will render index', (done) => {
                request(app)
                    .get('/user/register')
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            });
            it('register successfully', (done) => {
                request(app)
                    .post('/user/register')
                    .send('account=@phoebe&email=phoebe@example.com&password=Phoebe1234&confirmPassword=Phoebe1234')
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/user/login')
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            });
            it('duplicated email, register fail', (done) => {
                request(app)
                    .post('/user/register')
                    .send('account=@phoebe&email=phoebe@example.com&password=Phoebe1234&confirmPassword=Phoebe1234')
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/user/register')
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            });

            after(async() => {
                await db.User.destroy({where: {}, truncate: true});
            });
        });
    });

    context('#account index', () => {
        describe('go to user account page', () => {
            before(async() => {
                this.ensureAuthenticated = sinon.stub(
                    helpers, 'ensureAuthenticated'
                ).returns(true);
                this.getUser = sinon.stub(
                    helpers, 'getUser'
                ).returns({id: 1});
                await db.User.create({});
            });

            it('will render index', (done) => {
                request(app)
                    .get('/user/account')
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            });
            
            after(async() => {
                this.ensureAuthenticated.restore();
                this.getUser.restore();
                await db.User.destroy({where: {}, truncate: true});
            });
        });
    });

    context('#update account', () => {
        describe('update account password', () => {
            before(async() => {
                this.ensureAuthenticated = sinon.stub(
                    helpers, 'ensureAuthenticated'
                ).returns(true);
                this.getUser = sinon.stub(
                    helpers, 'getUser'
                ).returns({id: 1});
                await db.User.create({
                    name: 'Phoebe',
                    email: 'phoebe@example.com',
                    password: bcrypt.hashSync('Phoebe1234', bcrypt.genSaltSync(10))
                });
            });

            it('will redirect to index', (done) => {
                request(app)
                    .put('/user/account')
                    .send('email=phoebe@example.com&oldPassword=Phoebe1234&newPassword=P1234&&confirmPassword=P1234')
                    .set('Accept', 'application/json')
                    .expect(302)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            });
            it('can log in will new password', (done) => {
                request(app)
                    .post('/user/login')
                    .send('email=phoebe@example.com&password=P1234')
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/')
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            });

            after(async() => {
                this.ensureAuthenticated.restore();
                this.getUser.restore();
                await db.User.destroy({where: {}, truncate: true});
            });
        });
    });
});