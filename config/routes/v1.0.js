import tokenCtrl from '../../api/controllers/token';
import usersCtrl from '../../api/controllers/users';
import eventsCtrl from '../../api/controllers/events';
import shiftsCtrl from '../../api/controllers/shifts';
import staffsCtrl from '../../api/controllers/staffs';
import positionsCtrl from '../../api/controllers/positions';
import organizationsCtrl from '../../api/controllers/organizations';
import locationsCtrl from '../../api/controllers/locations';
import uniformsCtrl from '../../api/controllers/uniforms';
import availabilitiesCtrl from '../../api/controllers/availabilities';

import resError from '../../api/middlewares/res_error';
import resSuccess from '../../api/middlewares/res_success';
import modelMagic from '../../api/middlewares/model_magic';

import * as Models from '../../api/models';

import restify from 'express-restify-mongoose';
import multer from 'multer';

function outputFn(req, res) {
  const result = req.erm.result;
  res.success({data: result});
}

function onError(err, req, res, next) {
  const statusCode = req.erm.statusCode;
  return res.error(err.message, statusCode);
}

//middleware
import StripeWebhook from 'stripe-webhook-middleware';

export default function (router) {
  router.use(resError);
  router.use(resSuccess);


  router.post('/auth/register', usersCtrl.signup);
  router.post('/auth/signin', usersCtrl.login);
  router.post('/auth/forgot-password', usersCtrl.sendForgotPasswordMail);
  router.post('/auth/forgot-password/verify', usersCtrl.changePassword);

  router.use(tokenCtrl.ensureAuthenticated);

  router.post('/me/verify-email', usersCtrl.verifyEmail);
  router.post('/me/verify-phone', usersCtrl.verifyPhone);
  router.post('/me/send-verification-text', usersCtrl.sendVerificationText);

  router.get('/me', usersCtrl.show);
  router.put('/me', usersCtrl.updateMe);
  router.get('/me/availability', availabilitiesCtrl.getMyAvailability);
  router.put('/me/availability', availabilitiesCtrl.postMyAvailability);

  router.post('/organizations', organizationsCtrl.createOrganization);

  router.get('/me/stripe_pub_key', usersCtrl.getStripePubKey);

  // @todo should be removed in production
  router.get('/me/generateToken', usersCtrl.generateToken);

  //router.use(tokenCtrl.ensureManager);
  router.use('/organizations/:orgId/*', tokenCtrl.ensureOrganizationAdmin);

  router.get('/organizations/:orgId/events', eventsCtrl.getEventsForOrganization);
  router.get('/organizations/:orgId/events/:eventId', eventsCtrl.getEventByOrgIdAndEventId);
  router.delete('/organizations/:orgId/events/:eventId', eventsCtrl.deleteEventByOrgIdAndEventId);
  router.post('/organizations/:orgId/events', eventsCtrl.createEventWitOrgId);
  router.put('/organizations/:orgId/events/:eventId', eventsCtrl.updateEventByOrgIdAndEventId);

  router.get('/organizations/:orgId/shifts', shiftsCtrl.getShiftsForOrganization);
  router.get('/organizations/:orgId/shifts/:shiftId', shiftsCtrl.getShiftByOrgIdAndShiftId);
  router.delete('/organizations/:orgId/shifts/:shiftId', shiftsCtrl.deleteShiftByOrgIdAndShiftId);
  router.post('/organizations/:orgId/shifts', shiftsCtrl.createShiftWitOrgId);

  router.get('/organizations/:orgId/staffs', staffsCtrl.getStaffsForOrganization);
  router.get('/organizations/:orgId/staffs/:staffId', staffsCtrl.getStaffByOrgIdAndShiftId);
  router.delete('/organizations/:orgId/staffs/:staffId', staffsCtrl.deleteStaffByOrgIdAndShiftId);
  router.get('/organizations/:orgId/staffs/:staffId/availability', staffsCtrl.getStaffAvailability);
  router.post('/organizations/:orgId/staffs/:staffId/availability', staffsCtrl.postStaffAvailability);
  router.post('/organizations/:orgId/staffs', staffsCtrl.createStaffWitOrgId);
  router.post('/organizations/:orgId/staffs/:staffId/events/:eventId/position/:positionId/clockin', staffsCtrl.clockedIn);
  router.post('/organizations/:orgId/staffs/:staffId/events/:eventId/position/:positionId/clockout', staffsCtrl.clockedOut);


  router.get('/organizations/:orgId/positions', positionsCtrl.getPositionsForOrganization);
  router.get('/organizations/:orgId/positions/:positionId', positionsCtrl.getPositionByOrgIdAndPositionId);
  router.delete('/organizations/:orgId/positions/:positionId', positionsCtrl.deletePositionByOrgIdAndPositionId);
  router.post('/organizations/:orgId/positions', positionsCtrl.createPositionWitOrgId);
  router.put('/organizations/:orgId/positions/:positionId', positionsCtrl.updatePositionByOrgIdAndPositionId);

  router.get('/organizations/:orgId/locations', locationsCtrl.getLocationsForOrganization);
  router.get('/organizations/:orgId/locations/:locationId', locationsCtrl.getLocationByOrgIdAndLocationId);
  router.delete('/organizations/:orgId/locations/:locationId', locationsCtrl.deleteLocationByOrgIdAndLocationId);
  router.post('/organizations/:orgId/locations', locationsCtrl.createLocationWitOrgId);
  router.put('/organizations/:orgId/locations/:locationId', locationsCtrl.updateLocationByOrgIdAndLocationId);


  router.get('/organizations/:orgId/uniforms', uniformsCtrl.getUniformsForOrganization);
  router.get('/organizations/:orgId/uniforms/:uniformId', uniformsCtrl.getUniformByOrgIdAndLocationId);
  router.delete('/organizations/:orgId/uniforms/:uniformId', uniformsCtrl.deleteUniformByOrgIdAndLocationId);
  router.post('/organizations/:orgId/uniforms', uniformsCtrl.createUniformWitOrgId);
  router.put('/organizations/:orgId/uniforms/:uniformId', uniformsCtrl.updateUniformByOrgIdAndUniformId);


  router.get('/organizations/:orgId/company', organizationsCtrl.getOrganizationById);
  router.put('/organizations/:orgId/company', organizationsCtrl.updateOrganizationById);

  restify.serve(router, Models.Event, {name: 'events', version: '', prefix: '/crud', outputFn: outputFn, onError: onError});
  restify.serve(router, Models.Organization, {name: 'organizations', version: '', prefix: '/crud', outputFn: outputFn, onError: onError});
  restify.serve(router, Models.Location, {name: 'locations', version: '', prefix: '/crud', outputFn: outputFn, onError: onError});
  restify.serve(router, Models.Position, {name: 'positions', version: '', prefix: '/crud', outputFn: outputFn, onError: onError});
  restify.serve(router, Models.Shift, {name: 'shifts', version: '', prefix: '/crud', outputFn: outputFn, onError: onError});

  //router.get('/me', usersCtrl.show);
  //router.put('/me', usersCtrl.updateMe);
};
