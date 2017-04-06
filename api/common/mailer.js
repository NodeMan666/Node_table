import mandrill from 'mandrill-api/mandrill';
import P from 'bluebird';
import config from 'config3';

const mailer = new mandrill.Mandrill(config.MANDRILL_API_KEY);

export async function sendEmail (opts) {
  opts.message.from_email = 'autobot@localtable.co';
  opts.message.from_name = 'LocalTable';
  return sendEmailAsync(opts);
}

// Cannot be promisifyed return function doesnt have the signature promisify requires
async function sendEmailAsync (opts) {
  return new P((resolve, reject) =>
    mailer.messages.sendTemplate(opts, succ =>  resolve(succ), err => reject(err))
  );
}
