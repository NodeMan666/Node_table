import { app } from '../../server';
import supertest from 'supertest';
import chai from 'chai';
import {User} from '../../api/models'
import * as testHelper from '../helper/auth';
const expect = chai.expect;
const request = supertest(app);

const TEST_USER = 'testdemo', TEST_PASS = 'pass', TEST_EMAIL = 'testdemo@localtable.com';

describe('uniforms routes', function () {
  let token, userId, orgId, uniformId;

  before(async () => {
    const userData = await testHelper.getToken({username: TEST_USER, email: TEST_EMAIL, password: TEST_PASS, role: 'user'});
    token = userData.token;
    userId = userData.user;
    const orgData = await testHelper.createTestOrganization({token: token});
    orgId = orgData.orgId;
  });

  after(async () => {
    await User.findOneAndRemove({'username': TEST_USER});
  });

  describe('create new uniform', function () {

    const uniform = {
      uniformName: 'uniform name',
    };

    it('should return 401 without token', async function (done) {
      request
        .post(`/api/v1.0/organizations/${orgId}/uniforms`)
        .set('x-auth-token', 'invalidtoken')
        .send(uniform)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should create new uniform with valid token and orgId', async function (done) {
      request
        .post(`/api/v1.0/organizations/${orgId}/uniforms`)
        .set('x-auth-token', token)
        .send(uniform)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(true);
          expect(res.body.data.uniformName).to.equal(uniform.uniformName);
          uniformId = res.body.data._id;
          done();
        });
    });
  });

  describe('get list of uniform with orgnization id', function () {
    it('should return 401 without token', async function (done) {
      request
        .get(`/api/v1.0/organizations/${orgId}/uniforms`)
        .set('x-auth-token', 'invalidtoken')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should return uniform detail with valid token', async function (done) {
      request
        .get(`/api/v1.0/organizations/${orgId}/uniforms`)
        .set('x-auth-token', token)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(true);
          expect(res.body.data).to.be.an('array');
          done();
        });
    });
  });

  describe('get uniform detail with orgnization id and uniform id', function () {
    it('should return 401 without token', async function (done) {
      request
        .get(`/api/v1.0/organizations/${orgId}/uniforms/${uniformId}`)
        .set('x-auth-token', 'invalidtoken')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should return uniform detail with valid token', async function (done) {
      request
        .get(`/api/v1.0/organizations/${orgId}/uniforms/${uniformId}`)
        .set('x-auth-token', token)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(true);
          expect(res.body.data._id).to.equal(uniformId);
          done();
        });
    });
  });

  describe('update uniform detail with orgnization id and uniform id', function () {
    const uniform = {
      uniformName: 'Updated uniform'
    };

    it('should return 401 without token', async function (done) {
      request
        .put(`/api/v1.0/organizations/${orgId}/uniforms/${uniformId}`)
        .set('x-auth-token', 'invalidtoken')
        .send(uniform)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should update uniform detail with valid token', async function (done) {
      request
        .put(`/api/v1.0/organizations/${orgId}/uniforms/${uniformId}`)
        .set('x-auth-token', token)
        .send(uniform)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(true);
          done();
        });
    });
  });

  describe('delete uniform detail with orgnization id and uniform id', function () {
    it('should return 401 without token', async function (done) {
      request
        .delete(`/api/v1.0/organizations/${orgId}/uniforms/${uniformId}`)
        .set('x-auth-token', 'invalidtoken')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should delete uniform detail with valid token', async function (done) {
      request
        .delete(`/api/v1.0/organizations/${orgId}/uniforms/${uniformId}`)
        .set('x-auth-token', token)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(true);
          done();
        });
    });
  });
});

