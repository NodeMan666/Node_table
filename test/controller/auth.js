import { app } from '../../server';
import supertest from 'supertest';
import chai from 'chai';
import {User} from '../../api/models'
const expect = chai.expect;
const request = supertest(app);
import {generateForgotPasswordToken} from '../../api/common/token';

describe('authentication routes', function () {
  const TEST_USER = 'testdemo', TEST_PASS = 'pass', TEST_EMAIL = 'testdemo@localtable.com';
  let code = '', userid='';

  after(async function (done) {
    await User.findOneAndRemove({'username': TEST_USER});
    done();
  });

  describe('register', function () {

    it('should return a token and user object', async function (done) {
      request
        .post('/api/v1.0/auth/register')
        .send({email: TEST_EMAIL, username: TEST_USER, password: TEST_PASS})
        .expect(200)
        .end((err, res) => {
          //check the if the old token is different from the new token
          if (err) return done(err);
          expect(res.body).to.have.deep.property('api_token');
          expect(res.body).to.have.deep.property('user');
          done();
        });
    });

    it('should be failed for duplicate user name', async function (done) {
      request
        .post('/api/v1.0/auth/register')
        .send({email: TEST_EMAIL, username: TEST_USER, password: TEST_PASS})
        .expect(401)
        .end((err, res) => {
          //check the if the old token is different from the new token
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });
  });


  describe('login', function () {

    it('should return a token and user object', async function (done) {
      request
        .post('/api/v1.0/auth/signin')
        .send({email: TEST_EMAIL, password: TEST_PASS})
        .expect(200)
        .end((err, res) => {
          //check the if the old token is different from the new token
          if (err) return done(err);
          expect(res.body).to.have.deep.property('api_token');
          expect(res.body).to.have.deep.property('user');
          done();
        });
    });

    it('should be failed without email', async function (done) {
      request
        .post('/api/v1.0/auth/signin')
        .send({password: TEST_PASS})
        .expect(401)
        .end((err, res) => {
          //check the if the old token is different from the new token
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });
  });

  describe('forgot password', function () {

    it('should send forgotpassword email to user', async function (done) {
      request
        .post('/api/v1.0/auth/forgot-password')
        .send({email: TEST_EMAIL})
        .expect(200)
        .end(async (err, res) => {
          //check the if the old token is different from the new token
          if (err) return done(err);
          expect(res.body.success).to.equal(true);
          try {
            const user = await User.findOne({email: TEST_EMAIL});
            code = user.newPasswordKey;
            userid = user._id;
            expect(code).to.be.a('string');
            done();
          }
          catch(error) {
            return done(error);
          }
        });
    });

    it('should update user password with valid token', async function (done) {
      request
        .post('/api/v1.0/auth/forgot-password/verify')
        .send({token: generateForgotPasswordToken(userid, code), newPassword: 'newpass'})
        .expect(200)
        .end(async (err, res) => {
          //check the if the old token is different from the new token
          if (err) return done(err);
          expect(res.body.success).to.equal(true);
          done();
        });
    });
  });
});
