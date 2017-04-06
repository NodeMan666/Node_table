import jwt from 'jsonwebtoken';
import config from 'config3';

export function generateForgotPasswordToken(userId, code) {
  return jwt.sign({id: userId, code: code}, config.LOCALTABLE_SECRET, {
    expiresInMinutes: 1440 // expires in 24 hours
  });
}
