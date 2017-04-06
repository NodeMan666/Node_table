import { app } from '../../server';
import supertest from 'supertest';
import chai from 'chai';
import {User} from '../../api/models'
import * as testHelper from '../helper/auth';
const expect = chai.expect;
const request = supertest(app);

const TEST_USER = 'testdemo', TEST_PASS = 'pass', TEST_EMAIL = 'testdemo@localtable.com';

describe('positions routes', function () {
  let token, userId, orgId, positionId;

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

  describe('create new position', function () {

    const position = {
      positionName: 'Event Manager'
    };

    it('should return 401 without token', async function (done) {
      request
        .post(`/api/v1.0/organizations/${orgId}/positions`)
        .set('x-auth-token', 'invalidtoken')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should create new position with valid token and orgId', async function (done) {
      request
        .post(`/api/v1.0/organizations/${orgId}/positions`)
        .set('x-auth-token', token)
        .send(position)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(true);
          expect(res.body.data.positionName).to.equal(position.positionName);
          positionId = res.body.data._id;
          done();
        });
    });
  });

  describe('get list of positions with orgnization id', function () {
    it('should return 401 without token', async function (done) {
      request
        .get(`/api/v1.0/organizations/${orgId}/positions`)
        .set('x-auth-token', 'invalidtoken')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should return organization detail with valid token', async function (done) {
      request
        .get(`/api/v1.0/organizations/${orgId}/positions`)
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

  describe('get position detail with orgnization id and position id', function () {
    it('should return 401 without token', async function (done) {
      request
        .get(`/api/v1.0/organizations/${orgId}/positions/${positionId}`)
        .set('x-auth-token', 'invalidtoken')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should return organization detail with valid token', async function (done) {
      request
        .get(`/api/v1.0/organizations/${orgId}/positions/${positionId}`)
        .set('x-auth-token', token)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(true);
          expect(res.body.data._id).to.equal(positionId);
          done();
        });
    });
  });

  describe('update position detail with orgnization id and position id', function () {
    const position = {
      positionName: 'Updated Manager'
    };

    it('should return 401 without token', async function (done) {
      request
        .put(`/api/v1.0/organizations/${orgId}/positions/${positionId}`)
        .set('x-auth-token', 'invalidtoken')
        .send(position)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should update organization detail with valid token', async function (done) {
      request
        .put(`/api/v1.0/organizations/${orgId}/positions/${positionId}`)
        .set('x-auth-token', token)
        .send(position)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(true);
          done();
        });
    });
  });

  describe('delete position detail with orgnization id and position id', function () {
    it('should return 401 without token', async function (done) {
      request
        .delete(`/api/v1.0/organizations/${orgId}/positions/${positionId}`)
        .set('x-auth-token', 'invalidtoken')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should return organization detail with valid token', async function (done) {
      request
        .delete(`/api/v1.0/organizations/${orgId}/positions/${positionId}`)
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

