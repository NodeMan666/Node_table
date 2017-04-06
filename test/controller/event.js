import { app } from '../../server';
import supertest from 'supertest';
import chai from 'chai';
import {User} from '../../api/models'
import * as testHelper from '../helper/auth';
const expect = chai.expect;
const request = supertest(app);

const TEST_USER = 'testdemo', TEST_PASS = 'pass', TEST_EMAIL = 'testdemo@localtable.com';

describe('events routes', function () {
  let token, userId, orgId, eventId;

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

  describe('create new event', function () {

    const event = {
      eventNumber: 10200,
      eventName: 'event name',
      startUnix: new Date(),
      endUnix: new Date(),
      description: 'event description',
      adminNotes: 'admin note',
      budget: 300,
      allDay: true,
      timezone: 'PST',
      isRosterPublic: true,
    };

    it('should return 401 without token', async function (done) {
      request
        .post(`/api/v1.0/organizations/${orgId}/events`)
        .set('x-auth-token', 'invalidtoken')
        .send(event)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should create new event with valid token and orgId', async function (done) {
      request
        .post(`/api/v1.0/organizations/${orgId}/events`)
        .set('x-auth-token', token)
        .send(event)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(true);
          expect(res.body.data.eventName).to.equal(event.eventName);
          eventId = res.body.data._id;
          done();
        });
    });
  });

  describe('get list of events with orgnization id', function () {
    it('should return 401 without token', async function (done) {
      request
        .get(`/api/v1.0/organizations/${orgId}/events`)
        .set('x-auth-token', 'invalidtoken')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should return event detail with valid token', async function (done) {
      request
        .get(`/api/v1.0/organizations/${orgId}/events`)
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

  describe('get event detail with orgnization id and location id', function () {
    it('should return 401 without token', async function (done) {
      request
        .get(`/api/v1.0/organizations/${orgId}/events/${eventId}`)
        .set('x-auth-token', 'invalidtoken')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should return event detail with valid token', async function (done) {
      request
        .get(`/api/v1.0/organizations/${orgId}/events/${eventId}`)
        .set('x-auth-token', token)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(true);
          expect(res.body.data._id).to.equal(eventId);
          done();
        });
    });
  });

  describe('update event detail with orgnization id and position id', function () {
    const event = {
      eventName: 'Updated Location'
    };

    it('should return 401 without token', async function (done) {
      request
        .put(`/api/v1.0/organizations/${orgId}/events/${eventId}`)
        .set('x-auth-token', 'invalidtoken')
        .send(event)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should update event detail with valid token', async function (done) {
      request
        .put(`/api/v1.0/organizations/${orgId}/events/${eventId}`)
        .set('x-auth-token', token)
        .send(event)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(true);
          done();
        });
    });
  });

  describe('delete event detail with orgnization id and location id', function () {
    it('should return 401 without token', async function (done) {
      request
        .delete(`/api/v1.0/organizations/${orgId}/events/${eventId}`)
        .set('x-auth-token', 'invalidtoken')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should delete event detail with valid token', async function (done) {
      request
        .delete(`/api/v1.0/organizations/${orgId}/events/${eventId}`)
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

