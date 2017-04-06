import later from 'later';
import 'colors';
import _ from 'lodash';
import kue from 'kue';
import EventEmitter from 'events';
import queue from './Queue';


'use strict';
/* IMPORTANT: Server local time should be EST */
later.date.localTime();

/**
 * Define Job Class
 */

export default class Job extends EventEmitter {
  constructor ({
    attempts = 1,
    data = {},
    name,
    removeOnComplete = false,
    backoff,
    ttl,
    description,
    process,
    concurrency = 1,
    runSchedule,
    delay,
    priority,
    silent = false
    }) {
    super();

    if (!name) { throw new TypeError('Job needs a name.'); }
    if (runSchedule) {
      const parseErrorIndex = later.parse.text(runSchedule).error;
      if (parseErrorIndex > -1) {
        console.log('Take a look at: ' + 'http://bunkat.github.io/later/parsers.html#text');
        throw new TypeError(`Failed to parse schedule for '${name}' job at '${runSchedule.slice(0, parseErrorIndex + 1)}<-`.red);
      }
    }

    this.name = name;
    this.runSchedule = runSchedule;
    this.process = process;
    this.concurrency = concurrency;
    this.backoff = backoff;
    this.delay = delay;
    this.priority = priority;
    this.ttl = ttl;
    this.description = description;
    this.removeOnComplete = removeOnComplete;
    this.attempts = attempts;
    this.data = data;
    this.listeners = [];
    this.silent = silent;

    if (!this.silent) this._addLoggingHandlers();
  }

  schedule (callback) {
    if (this.runSchedule) {
      later.setInterval( () => {
        this._makeAndActivateJob();
      }, later.parse.text(this.runSchedule) );

      if (_.isFunction(callback) ) process.nextTick(callback);
    }
    else {
      this._makeAndActivateJob(callback);
    }
    return this;
  }

  runWorkers () {
    queue.process(
      this.name,
      this.concurrency,
      this.process
    );

    return this;
  }

  /**
   * Creates the job based on the options set when making the job
   * ands places it on queue to be processed
   *  {Function} [cb] - the function to call when the job has been scheduled
   * @private
   */
  _makeAndActivateJob (cb) {
    this.job = queue.createJob(
      this.name, //Name
      Object.assign({
        title: this.description
      }, this.data)
      )
      .removeOnComplete(false) // false by default, because the removing operation exists in the remove event handler
      .attempts(this.attempts);

    if (this.backoff) this.job.backoff(this.backoff);
    if (this.ttl) this.job.ttl(this.ttl);
    if (this.delay) this.job.delay(this.delay);
    if (this.priority) this.job.priority(this.priority);

    // Attach any pending listeners
    for (const { event, callback } of this.listeners) {
      this.job.on(event, callback);
    }

    // Actually put job on queue;
    this.job.save((err) => {
      if (err) {
        console.error(`Could not save ${this.job.name} to redis queue: ${err}`);
        if ( _.isFunction(cb) ) cb(err);
        return;
      }
      if ( _.isFunction(cb) ) cb();
    });
  }

  /**
   *  Attaches logging event listeners to an array of given jobs
   *  @private
   */
  _addLoggingHandlers () {

    queue.jobEventEmitter
      .on(`job complete${':'}${this.name}`, (id, result) => {
        console.log(`Job '${this.name.cyan}' completed with data ` , result);
        kue.Job.get(id, (err, job) => {
          if (err) {
            console.log(err);
            return;
          }

          this.emit('complete', result);
          // we remove job here because we need to have a way to log 'remove' event
          if (this.removeOnComplete) {
            job.remove((err) => {
              if (err) throw err;
            });
          }
        });
      })
      .on(`job enqueue${':'}${this.name}`, () => {
        console.log(`Job '${this.name.cyan}' was enqueued`);
        this.emit('enqueue');
      })
      .on(`job failed${':'}${this.name}`, (errorMessage) => {
        console.log(`Job '${this.name.cyan} failed:`, errorMessage);
        this.emit('failed', errorMessage);
      })
      .on(`job progress${':'}${this.name}`, (progress, data) => {
        console.log(`job ${this.name.cyan} ${progress}% complete with data ${data}`);
        this.emit('progress', progress, data);
      })
      .on(`job remove${':'}${this.name}`, () => {
        console.log(`job ${this.name.cyan} was removed from queue.`);
        this.emit('remove');
      })
      .on(`job failed attempt${':'}${this.name}`, (errorMessage, doneAttempts) => {
        const statusString = [ `Job '${this.name}' attempt failed: ${errorMessage}` ];
        if (this.delay) statusString.push(`- Delay   => ${this.delay}`);
        if (this.backoff) statusString.push(`- Backoff => ${ JSON.stringify(this.backoff) }`);
        statusString.push(`- Attempt => ${doneAttempts + 1} of ${this.attempts}`);

        console.log(statusString.join('\n').yellow);
        this.emit('failed attempt', errorMessage, doneAttempts);
      });
  }

}
