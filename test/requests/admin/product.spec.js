const request = require('supertest');
const sinon = require('sinon');
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const app = require('../../../app');
const db = require('../../../models');
const helpers = require('../../../_helpers');
const upload = require('../../../config/multer');

describe('#admin product request', () => {
    context('go to admin products page', () => {
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
                    .get('/admin/products')
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
                this.upload = sinon.stub(
                  upload, 'upload'
                ).callsFake(() => {
                  return {
                    single() {
                      return (req, res, next) => {
                        req.file = {
                          fieldname: 'image',
                          originalname: 'skirt.PNG',
                          encoding: '7bit',
                          mimetype: 'image/png',
                          destination: 'temp/',
                          filename: 'd63da171a353650c4bafadc13a3dd8e2',
                          path: 'temp\\d63da171a353650c4bafadc13a3dd8e2',
                          size: 97840
                        };
                        return next()
                      };
                    }
                  };
                });
                await db.Product.create({name: 'dress'});
            });
    
            it('will list all the products', (done) => {
                request(app)
                    .get('/admin/products')
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        res.text.should.include('dress');
                        return done();
                    });
            });
            it('can create product', (done) => {
              request(app)
                  .post('/admin/newProduct')
                  .send('name=skirt&price=500&description=pretty skirt&CategoryId=1')
                  .set('Accept', 'application/json')
                  .expect(302)
                  .end((err, res) => {
                      if (err) return done(err);
                      db.Product.findOne({
                          where: {id: 2}
                      }).then(product => {
                          expect(product.name).to.equal('skirt');
                          return done();
                      }).catch(err => {
                          if (err) return done(err);
                      });
                  });
            });
            it('can update product', (done) => {
                request(app)
                    .put('/admin/product/2')
                    .send('name=pants&price=500&description=pretty skirt&CategoryId=1')
                    .set('Accept', 'application/json')
                    .expect(302)
                    .end((err, res) => {
                        if (err) return done(err);
                        db.Product.findOne({
                            where: {id: 2}
                        }).then(product => {
                            expect(product.name).to.equal('pants');
                            return done();
                        }).catch(err => {
                            if (err) return done(err);
                        });
                    });
            });
            it('can delete product', (done) => {
              request(app)
                  .delete('/admin/product/2')
                  .set('Accept', 'application/json')
                  .expect(302)
                  .end((err, res) => {
                      if (err) return done(err);
                      db.Product.findAll()
                      .then(product => {
                          expect(product[0].id).to.equal(1);
                          expect(product[1]).to.be.undefined;
                          return done();
                      }).catch(err => {
                          if (err) return done(err);
                      });
                  });
            });
    
            after(async() => {
                this.ensureAuthenticated.restore();
                this.getUser.restore();
                await db.Product.destroy({where: {}, truncate: true});
            });
        });
    });
});