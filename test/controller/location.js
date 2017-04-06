import { app } from '../../server';
import supertest from 'supertest';
import chai from 'chai';
import {User} from '../../api/models'
import * as testHelper from '../helper/auth';
const expect = chai.expect;
const request = supertest(app);

const TEST_USER = 'testdemo', TEST_PASS = 'pass', TEST_EMAIL = 'testdemo@localtable.com';

describe('locations routes', function () {
  let token, userId, orgId, locationId;

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

  describe('create new location', function () {

    const location = {
      name: 'Org Location',
      address: 'Addres1',
      addressLocality: 'Local',
      addressRegion: 'Region',
      addressPostcode: 123124,
      addressCountry: 'US',
      contact: 'tao@toptal.com',
      phone: '+123878237',
      email: 'tao@toptal.com',
      notes: 'note',
      directions: 'direction',
    };

    it('should return 401 without token', async function (done) {
      request
        .post(`/api/v1.0/organizations/${orgId}/locations`)
        .set('x-auth-token', 'invalidtoken')
        .send(location)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should create new position with valid token and orgId', async function (done) {
      request
        .post(`/api/v1.0/organizations/${orgId}/locations`)
        .set('x-auth-token', token)
        .send(location)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(true);
          expect(res.body.data.name).to.equal(location.name);
          locationId = res.body.data._id;
          done();
        });
    });
  });

  describe('get list of locations with orgnization id', function () {
    it('should return 401 without token', async function (done) {
      request
        .get(`/api/v1.0/organizations/${orgId}/locations`)
        .set('x-auth-token', 'invalidtoken')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should return location detail with valid token', async function (done) {
      request
        .get(`/api/v1.0/organizations/${orgId}/locations`)
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

  describe('get location detail with orgnization id and location id', function () {
    it('should return 401 without token', async function (done) {
      request
        .get(`/api/v1.0/organizations/${orgId}/locations/${locationId}`)
        .set('x-auth-token', 'invalidtoken')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should return location detail with valid token', async function (done) {
      request
        .get(`/api/v1.0/organizations/${orgId}/locations/${locationId}`)
        .set('x-auth-token', token)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(true);
          expect(res.body.data._id).to.equal(locationId);
          done();
        });
    });
  });

  describe('update location detail with orgnization id and position id', function () {
    const location = {
      name: 'Updated Location'
    };

    it('should return 401 without token', async function (done) {
      request
        .put(`/api/v1.0/organizations/${orgId}/locations/${locationId}`)
        .set('x-auth-token', 'invalidtoken')
        .send(location)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should update location detail with valid token', async function (done) {
      request
        .put(`/api/v1.0/organizations/${orgId}/locations/${locationId}`)
        .set('x-auth-token', token)
        .send(location)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(true);
          done();
        });
    });
  });

  describe('delete location detail with orgnization id and location id', function () {
    it('should return 401 without token', async function (done) {
      request
        .delete(`/api/v1.0/organizations/${orgId}/locations/${locationId}`)
        .set('x-auth-token', 'invalidtoken')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should delete location detail with valid token', async function (done) {
      request
        .delete(`/api/v1.0/organizations/${orgId}/locations/${locationId}`)
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

