import config from 'config3';

import { Event, Bonusplay } from '../../models';
import Job from '../Job';

async function eventReminder (job, callback) {
  const events = await Event.find({});
  console.log(`event ReminderJob ${events.length}`);
  return callback(null, 'reminder job completed');
}


export default new Job({
  runSchedule: 'every 30 mins',
  name: 'reminder job',
  description: 'send reminder email to staffs.',
  removeOnComplete: false,
  ttl: 1000 * 60, // Should not take more than 5 seconds
  process: eventReminder
})
