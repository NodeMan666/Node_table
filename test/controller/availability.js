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

  describe('post my availability', function () {

    const availability = {

    }

    it('should return 401 without token', async function (done) {
      request
        .put('/api/v1.0/me/availability')
        .set('x-auth-token', 'invalidtoken')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

  });
});

