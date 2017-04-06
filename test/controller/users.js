import { app } from '../../server';
import supertest from 'supertest';
import chai from 'chai';
import {User} from '../../api/models'
import * as testHelper from '../helper/auth';
const expect = chai.expect;
const request = supertest(app);

const TEST_USER = 'testdemo', TEST_PASS = 'pass', TEST_EMAIL = 'testdemo@localtable.com';

describe('user routes', function () {
  let token, userId;

  before(async () => {
    const userData = await testHelper.getToken({username: TEST_USER, email: TEST_EMAIL, password: TEST_PASS, role: 'user'});
    token = userData.token;
    userId = userData.user;
  });

  after(async () => {
    await User.findOneAndRemove({'username': TEST_USER});
  });

  describe('get my details', function () {

    it('should return 401 without token', async function (done) {
      request
        .get('/api/v1.0/me')
        .set('Authorization', 'bearer ' + 'invalidtoken')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should return user details with valid token', async function (done) {
      request
        .get('/api/v1.0/me')
        .set('x-auth-token', token)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(true);
          expect(res.body._id).to.equal(userId);
          done();
        });
    });


  });

  describe('update my details', function () {

    it('should return 401 without token', async function (done) {
      request
        .put('/api/v1.0/me')
        .set('Authorization', 'bearer ' + 'invalidtoken')
        .send({})
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should return user details with valid token', async function (done) {
      request
        .put('/api/v1.0/me')
        .set('x-auth-token', token)
        .send({firstName: 'Tao', lastName: 'Wang'})
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(true);
          expect(res.body.user.firstName).to.equal('Tao');
          expect(res.body.user.lastName).to.equal('Wang');
          done();
        });
    });

  });
});

