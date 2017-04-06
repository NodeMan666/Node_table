import { app } from '../../server';
import supertest from 'supertest';
import chai from 'chai';
import {User} from '../../api/models'
const expect = chai.expect;
const request = supertest(app);


export async function getToken({username, email, role,  password}) {
  const response = await request
    .post('/api/v1.0/auth/register')
    .send({username: username, email: email, password: password, role: role});
  return {token: response.body.api_token, user: response.body.user._id};
}

export async function createTestOrganization({token}) {
  const organization = {
    name: 'test organization',
    welcomeText: 'welcome to localtable',
    timezone: 'PST',
    isRosterPublic: false,
    isPersonPublic: true,
  };

  const response = await request
    .post('/api/v1.0/organizations')
    .set('x-auth-token', token)
    .send(organization);

  return {orgId: response.body.data._id};
}

