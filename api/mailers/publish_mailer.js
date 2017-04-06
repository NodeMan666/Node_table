import P from 'bluebird';
import _ from 'lodash';
import { sendEmail } from '../common/mailer';
import { User } from '../models';

export async function publishMailerHandler (user, shift, template, subject) {
  const obj = await createObjForMailer(user, shift, template, subject);

  return await sendPublishMailer(obj);
}

async function sendPublishMailer ({ email, global_merge_vars = [], subject = 'Shift Published', template_name = 'publish-shift' }) {
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
    { name: 'EVENT_NAME', content: 'Temp Name' },
  ];

  return obj;
}

