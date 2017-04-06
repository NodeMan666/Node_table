import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import _ from 'lodash';


const UserRole = {
  Admin: 'admin',
  Manager: 'manager',
  User: 'user'

};


/**
 * User Schema
 */

const User = new Schema({
  email: {
    type: String,
    index: true,
    unique: true,
    required: 'Email address is required. ',
  },
  username: {
    type: String,
    index: true,
    unique: true,
    required: 'Username is required. ',
  },
  emailVerified: {type: Boolean, default: false},
  phoneVerified: {type: Boolean, default: false},
  firstName: String,
  lastName: String,
  primaryTelephone: String,
  secondaryTelephone: String,
  birthDate: Date,
  photo: String,
  address: String,
  addressLocality: String,
  addressRegion: String,
  addressPostcode: String,
  addressCountry: String,
  socialProfiles: String,
  role: {
    type: String,
    enum: _.values(UserRole),
    default: UserRole.User
  },
  isAdmin: {type: Boolean, default: false},
  isActive: {type: Boolean, default: false},
  emailReminder: Boolean,
  lastLogin: Date,
  updatedBy: String,
  createdBy: String,
  hashed_password: {
    type: String,
    required: 'Password cannot be blank. '
  },
  newPasswordKey: String,
  newPasswordRequested: Date,
  newEmail: String,
  newEmailKey: String,
  emailVerificationCode: String,
  textVerificationCode: String,
  isOnline: {type: Boolean, default: false},
});

User.plugin(timestamps);
User.plugin(update, ['email', 'username', 'firstName', 'lastName', 'primaryTelephone', 'secondaryTelephone', 'birthDate',
  'photo', 'address', 'addressLocality', 'addressRegion', 'addressCountry', 'socialProfiles', 'createdBy', 'updatedBy',
  'emailReminder', 'isAdmin', 'isActive']);

/**
 * Virtuals
 */

User
  .virtual('password')
  .set(function (password) {
    this._password = password
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function () {
    return this._password
  });

/**
 * Validations
 */

const validatePresenceOf = function (value) {
  return value && value.length
}


// the below 4 validations only apply if you are signing up traditionally

User.path('email').validate(function (email) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}, 'Please fill a valid email address. ');

/**
 * Pre-save hook
 */

User.pre('save', function (next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.password))
    next(new Error('Invalid password'));
  else
    next()
});

/**
 * Methods
 */



/**
 * Authenticate - check if the passwords are the same
 *
 * @param {String} plainText
 * @return {Boolean}
 * @api public
 */
User.methods.authenticate = function (plainText) {
  return bcrypt.compareSync(plainText, this.hashed_password);
}

/**
 * Encrypt password
 *
 * @param {String} password
 * @return {String}
 * @api public
 */

User.methods.encryptPassword = function (password) {
  if (!password) return '';
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}


export default mongoose.model('user', User);
