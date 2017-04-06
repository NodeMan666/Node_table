import kue from 'kue';
import _ from 'lodash';

/**
 * A job that cleans all completed jobs
 */
export async function removeCompleted (maxJobsToRemove = 1000, expiryThreshold = 2 * 24 * 60 * 1000) {
  kue.Job.rangeByState('complete', 0, maxJobsToRemove, 'asc', function (err, jobs) {
    if ( err ) return console.error(err);
    console.log(`There are  ${jobs.length} completed jobs.`);

    const oldJobs = _.filter(jobs, (job) => {
      return (Date.now() - job.updated_at) > expiryThreshold;
    });

    console.log(`Cleaning ${oldJobs.length} completed jobs.`);

    oldJobs.forEach(function (job) {
      job.remove();
    });

  });
}