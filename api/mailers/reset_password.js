import P from 'bluebird';
import _ from 'lodash';
import { sendEmail } from '../common/mailer';
import { User } from '../models';

export async function resetPasswordMailerHandler (user, template, subject, resetLink) {
  const obj = await createObjForMailer(user, template, subject, resetLink);

  return await senResetPPasswordMailer(obj);
}

async function senResetPPasswordMailer ({ email, global_merge_vars = [], subject = 'Reset Password Request', template_name = 'reset-password' }) {
  return sendEmail({
    template_name,
    template_content: [],
    message: { to: [{ email }], subject, global_merge_vars },
    async : true
  });
}

async function createObjForMailer (user, template, subject, resetLink) {
  const obj = { email: user.email, template_name: template, subject: subject };

  obj.global_merge_vars = [
    { name: 'PASSWORD_RESET_LINK', content: resetLink },
  ];

  return obj;
}

