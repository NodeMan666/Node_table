import P from 'bluebird';
import _ from 'lodash';
import { sendEmail } from '../common/mailer';
import { User } from '../models';

export async function welcomeMailerHandler (user, template, subject) {
  const obj = await createObjForMailer(user, template, subject);

  return await sendWelcomeMailer(obj);
}

async function sendWelcomeMailer ({ email, global_merge_vars = [], subject = 'Welcome to LocalTable', template_name = 'localtable-welcome' }) {
  return sendEmail({
    template_name,
    template_content: [],
    message: { to: [{ email }], subject, global_merge_vars },
    async : true
  });
}

async function createObjForMailer (user, template, subject) {
  const obj = { email: user.email, template_name: template, subject: subject };

  obj.global_merge_vars = [
    { name: 'VERIFICATION_CODE', content: user.emailVerificationCode },
  ];

  return obj;
}

