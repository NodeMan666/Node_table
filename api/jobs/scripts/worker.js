import config from 'config3';
import 'colors';

import './clock';
import * as reminderJobs from '../reminder/index';


const allJobs = Object.assign({}, reminderJobs);

for (const key of Object.keys(allJobs)) {
  const job = allJobs[key];
  job.runWorkers();
  console.log(`New worker listening for ${job.name.yellow} jobs.`);
}

process.on('uncaughtException', (err) => {
  console.log(`Uncaught exception: ${err.stack}`);
  process.exit(-1);
});

process.on('unhandledRejection', (e) => {
  console.log(`Unhandled Rejection: ${e.stack}`);
  process.exit(-1);
});
