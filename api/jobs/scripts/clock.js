import kue from 'kue';
import config from 'config3';

import { removeCompleted } from '../scripts/jobs_cleanup';
import * as reminderJobs from '../reminder/index';

if (config.NODE_ENV === 'development') {
  const kueUiPort = config.KUE_UI_PORT || 4000;
  kue.app.listen(kueUiPort, () => { console.log(`Kue web UI listening on port ${kueUiPort}`); });
}

/* automatically Schedule jobs that don't require special care */
// Make a mega json of all the jobs to automatically schedule
const allJobs = Object.assign({}, reminderJobs);
// Go over the keys of the mega json (exported from the index files above) and schedule them
for (const key of Object.keys(allJobs)) {
  const job = allJobs[key];
  job.schedule();
}

/* Delete old completed jobs every half hour */
setTimeout(removeCompleted, 30 * 60 * 1000);
