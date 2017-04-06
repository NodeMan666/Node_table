import { app } from '../../server';
import supertest from 'supertest';
import chai from 'chai';
import {User} from '../../api/models'
import * as testHelper from '../helper/auth';
const expect = chai.expect;
const request = supertest(app);

const TEST_USER = 'testdemo', TEST_PASS = 'pass', TEST_EMAIL = 'testdemo@localtable.com';

describe('organization routes', function () {
  let token, userId, orgId;

  before(async () => {
    const userData = await testHelper.getToken({username: TEST_USER, email: TEST_EMAIL, password: TEST_PASS, role: 'user'});
    token = userData.token;
    userId = userData.user;
  });

  after(async () => {
    await User.findOneAndRemove({'username': TEST_USER});
  });

  describe('create new organization', function () {

    const organization = {
      name: 'test organization',
      welcomeText: 'welcome to localtable',
      timezone: 'PST',
      isRosterPublic: false,
      isPersonPublic: true,
    };

    it('should return 401 without token', async function (done) {
      request
        .post('/api/v1.0/organizations')
        .set('x-auth-token', 'invalidtoken')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should create new organization with valid token', async function (done) {
      request
        .post('/api/v1.0/organizations')
        .set('x-auth-token', token)
        .send(organization)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(true);
          expect(res.body.data.name).to.equal(organization.name);
          expect(res.body.data.welcomeText).to.equal(organization.welcomeText);
          expect(res.body.data.timezone).to.equal(organization.timezone);
          orgId = res.body.data._id;
          done();
        });
    });
  });

  describe('get organization details with orgnization id', function () {
    it('should return 401 without token', async function (done) {
      request
        .get(`/api/v1.0/organizations/${orgId}/company`)
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
        .get(`/api/v1.0/organizations/${orgId}/company`)
        .set('x-auth-token', token)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(true);
          expect(res.body.data._id).to.equal(orgId);

          done();
        });
    });
  });


  describe('update organization details with orgnization id', function () {

    const organization = {
      name: 'updated organization',
      welcomeText: 'updated welcome text',
      timezone: 'PST',
      isRosterPublic: false,
      isPersonPublic: true,
    };

    it('should return 401 without token', async function (done) {
      request
        .put(`/api/v1.0/organizations/${orgId}/company`)
        .set('x-auth-token', 'invalidtoken')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should update organization details with valid token', async function (done) {
      request
        .put(`/api/v1.0/organizations/${orgId}/company`)
        .set('x-auth-token', token)
        .send(organization)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(true);
          expect(res.body.data.name).to.equal(organization.name);
          expect(res.body.data.welcomeText).to.equal(organization.welcomeText);
          expect(res.body.data.timezone).to.equal(organization.timezone);
          expect(res.body.data._id).to.equal(orgId);
          done();
        });
    });
  });
});

