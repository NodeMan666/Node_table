import jwt from 'jsonwebtoken';
import config from 'config3';
import { User, Admin } from '../models';


function ensureAuthenticated(req, res, next) {
  // check header or url parameters or post parameters for token
  const token = req.body.token || req.query.token || req.headers['x-auth-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.LOCALTABLE_SECRET, async function (err, decoded) {
      if (err) {
        return res.error('Failed to authenticate token.', 401);
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        req.user = await User.findById(req.decoded._id);
        if (!req.user) {
          return res.error('Failed to authenticate token.', 401);
        }
        req.user.hashed_password = undefined;
        next();
      }
    });
  } else {
    // if there is no token return an error
    return res.error('No token provided', 401);
  }
}

function ensureAdmin(req, res, next) {
  if (!req.user.role == 'admin') {
    return res.error('You are not approved to do this action', 401);
  }
  next();
}

function ensureManager(req, res, next) {
  if (!req.user.role == 'admin' && !req.user.role == 'manager' ) {
    return res.error('You are not approved to do this action', 401);
  }
  next();
}

async function ensureOrganizationAdmin(req, res, next) {
  const {orgId} = req.params;
  if(!orgId) {
    return res.error('You are not approved to do this action', 401);
  }
  const admin = await Admin.findOne({user: req.user._id, organization: orgId});
  if(!orgId) {
    return res.error('You are not approved to do this action', 401);
  }
  next();
}

export default {
  ensureAuthenticated: ensureAuthenticated,
  ensureAdmin: ensureAdmin,
  ensureManager: ensureManager,
  ensureOrganizationAdmin: ensureOrganizationAdmin,
}
