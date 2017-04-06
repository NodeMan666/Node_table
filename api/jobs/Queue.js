import redis from '../../config/redis';
import kue from 'kue';
import EventEmitter from 'events';

/***
 * Define Queue
 */

const { host, port, password } = redis.connector.options;

console.log(`Kue attempting to connect to Redis on ${host}:${port}`);

const queue = kue.createQueue({
  redis: {
    host,
    port,
    auth: password,
    no_ready_check : true
  }
});

/* Queue level Events */
queue
  .on('remove', (id) => console.log(`Job #${id} removed from queue`) )
  .on( 'error', function ( err ) { console.error( 'Kue Error: ', err ); });

process.once( 'SIGTERM', function ( sig ) {
  queue.shutdown( 5000, function (err) {
    console.log( 'Kue shutdown: ', err||'' );
    process.exit( 0 );
  });
});

// extend queue object by our job emitter to emit job's specific events
queue.jobEventEmitter = new EventEmitter();

queue
  .on('job enqueue', function(id, type) {
    queue.jobEventEmitter.emit(`job enqueue${':'}${type}`);
  })
    .on('job complete', function(id, result) {
    kue.Job.get(id, function(err, job) {
      if (err) return;

      queue.jobEventEmitter.emit(`job complete${':'}${job.type}`, id, result);
    });
  })
  .on('job failed', (id, errorMessage) => {
    kue.Job.get(id, function(err, job) {
      if (err) return;

      queue.jobEventEmitter.emit(`job failed${':'}${job.type}`, errorMessage);
    });
  })
  .on('job progress', (id, progress, data) => {
    kue.Job.get(id, function(err, job) {
      if (err) return;

      queue.jobEventEmitter.emit(`job progress${':'}${job.type}`, progress, data);
    });
  })
  .on('job remove', (id, type) => {
    queue.jobEventEmitter.emit(`job remove${':'}${type}`, id);
  })
  .on('job promote', (id, type) => {
    queue.jobEventEmitter.emit(`job promote${':'}${type}`, id);
  })
  .on('job failed attempt', (id, errorMessage, doneAttempts) => {
    kue.Job.get(id, function(err, job) {
      if (err) return;

      queue.jobEventEmitter.emit(`job failed attempt${':'}${job.type}`, errorMessage, doneAttempts);
    });
  });

/**
 * Kue currently uses client side job state management and when redis crashes in the middle of that operations,
 * some stuck jobs or index inconsistencies will happen. The consequence is that certain number of jobs will be stuck,
 * and be pulled out by worker only when new jobs are created, if no more new jobs are created, they stuck forever.
 * Calling this will track and unstuck those jobs.
 */
queue.watchStuckJobs();

export default queue;