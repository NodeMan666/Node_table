import jwt from 'jsonwebtoken';
import { User, StaffAvailability } from '../models';
import config from 'config3';
import {welcomeMailerHandler} from '../mailers/welcome_mailer';
import {resetPasswordMailerHandler} from '../mailers/reset_password';
import {sendText} from '../common/sms';
import {stripe, plans, generateToken} from '../common/stripe';
import {generateForgotPasswordToken} from '../common/token';


async function login(req, res, next) {

  let {email, password} = req.body;
  if (!email || !password) {
    return res.error('Missing or invalid authentication credentials.', 401);
  }

  let user = await User.findOne({email: email});
  if (!user || !user.authenticate(password)) {
    return res.error('Missing or invalid authentication credentials.', 401);
  }

  user.hashed_password = undefined;
  let token = jwt.sign(user, config.LOCALTABLE_SECRET, {
    expiresInMinutes: 1440 // expires in 24 hours
  });

  res.success({user: user, api_token: token});

}

async function signup(req, res, next) {
  const {email, username, password, role} = req.body;
  if (!email || !password || !username) {
    return res.error('Missing or invalid authentication credentials.', 401);
  }

  if (role && (role != 'user' && role != 'manager' && role != 'admin')) {
    return res.error('Invalid user role.', 400);
  }

  let user = await User.findOne({email: email});
  if (user) {
    return res.error('Email already taken.', 401);
  }

  user = await User.findOne({username: username});
  if (user) {
    return res.error('Username already taken.', 401);
  }

  let newUser = new User(req.body);

  newUser.emailVerificationCode = Math.floor(Math.random() * 9000 + 1000).toString();
  await newUser.save();

  await welcomeMailerHandler(newUser, 'localtable-welcome', 'Welcome to LocalTable');
  newUser.hashed_password = undefined;

  const token = jwt.sign(newUser, config.LOCALTABLE_SECRET, {
    expiresInMinutes: 1440 // expires in 24 hours
  });

  return res.success({user: newUser, api_token: token});

}

function show(req, res, next) {
  res.success(req.user);
}

async function updateMe(req, res, next) {
  delete req.body._id;
  const user = await User.findById(req.user._id);
  await user.update(req.body);
  res.success({
    user: await User.findById(req.user._id).select("-hashed_password")
  });
}

async function verifyEmail(req, res, next) {
  const {code} = req.body;

  if(req.user.emailVerificationCode != code) {
    return res.error('Invalid verification code', 400);
  }

  req.user.emailVerified = true;
  await req.user.save();
  res.success();
}

async function verifyPhone(req, res, next) {
  const {code} = req.body;

  if(req.user.textVerificationCode != code) {
    return res.error('Invalid verification code', 400);
  }

  req.user.phoneVerified = true;
  await req.user.save();
  res.success();
}


async function sendVerificationText(req, res, next) {
  if (!req.user.primaryTelephone) {
    return res.error('You do not have primary phone number', 400);
  }

  req.user.textVerificationCode = Math.floor(Math.random() * 9000 + 1000).toString();
  await sendText({
    to: req.user.primaryTelephone,
    from: config.twilio.TWILIO_PHONE_NUMBER,
    body: `Your verification code for LocalTable is: ${req.user.textVerificationCode}`
  });
  await newUser.save();

  res.success();
}

async function sendForgotPasswordMail(req, res, next) {
  const {email} = req.body;
  const user = await User.findOne({email: email});
  if(!user) {
    return res.error('Invalid Email');
  }

  user.newPasswordKey = Math.floor(Math.random() * 9000 + 1000).toString();
  const token = generateForgotPasswordToken(user._id, user.newPasswordKey);

  const resetUrl = `${config.SITE_URL}/reset-pass/${token}`;
  await resetPasswordMailerHandler(user, 'forgot-password', 'Forgot Password Request', resetUrl);
  await user.save();
  res.success();
}

async function changePassword(req, res, next) {
  const {token, newPassword} = req.body;
  if(!token || !newPassword) {
    return res.error('Missing required fields');
  }

  jwt.verify(token, config.LOCALTABLE_SECRET, async function (err, decoded) {
    if(err) {
      return res.error(err.message || err);
    }
    const {id, code} = decoded;
    const user = await User.findOne({_id:id, newPasswordKey: code});
    if(!user) {
      return res.error('Invalid Token');
    }
    user.password = newPassword;
    await user.save();
    res.success();
  });
}

async function generateStripeToken(req, res, next) {
  generateToken(function(err, token){
    res.success({token: token});
  });
}

async function getStripePubKey(req, res, next) {
  res.success({ stripe_pub_key: config.stripe.STRIPE_PUBLISHABLE });
}



export default {
  login: login,
  signup: signup,
  show: show,
  updateMe: updateMe,
  verifyEmail: verifyEmail,
  verifyPhone: verifyPhone,
  sendVerificationText: sendVerificationText,
  sendForgotPasswordMail: sendForgotPasswordMail,
  changePassword: changePassword,
  getStripePubKey: getStripePubKey,
  generateToken: generateStripeToken,
}
