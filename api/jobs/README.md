## Jobs Definition Schema
##### Used with the scheduler

This library merges scheduling from later.js with jobs from the Kue project
(see [The Kue Documentation](https://github.com/Automattic/kue#queue-events))

Here is a full example with explanations of options

```javascript
import Job from './Job';

const someJob =  new Job({
  // How often should this job run? http://bunkat.github.io/later/parsers.html#text
  // OPTIONAL- not providing skips the scheduler
  schedule: 'every 30 seconds',

  // Name for this job. Used in web interface. Make it short and sweet
  name: 'encode video',

  // OPTIONAL- A human readable description of what this job does. Please be clear. equivalent to { data: title } in Kue
  description: 'Reset any inventory item with status ON_HOLD back to AVAILABLE',

  // OPTIONAL- MAXIMUM run time for job (ms). Anything longer is considered stuck and is removed
  ttl: 4 * 1000, // Shouldn't take longer than 4 seconds

  // OPTIONAL - How to prioritize this job. Use one of the strings below or a number
  /* {
      low: 10
    , normal: 0
    , medium: -5
    , high: -10
    , critical: -15
  }; */
  priority: 'high',

  // OPTIONAL - How much to delay each execution , a number in ms or a Date()
  delay: 1000,

  // OPTIONAL - boolean - should this job skip the `complete` queue? Default false
  removeOnComplete: false,

  // OPTIONAL - object - any data you want to pass to the job in the job.data oject
  data: { any: 'thing' },

  // Backoff strategy
  /* backoff: true  - Honor job's original delay (if set) at each attempt, defaults to fixed backoff */
  /* backoff( {delay: 60*1000, type:'fixed'} ) - Override delay value, fixed backoff */
  /* backoff( {type:'exponential'} ) - Enable exponential backoff using original delay (if set) */

  // Use a function to get a customized next attempt delay value
  /* backoff( function( attempts, delay ){
   *    return my_customized_calculated_delay;
   *  })
   */
  backoff: { type: 'fixed', delay: 5000 },

  // How many jobs of this type should be processed from the queue in parallel. This is NOT forking.
  // Use a higher concurrency when you have slow running jobs that come in more often than can be processed
  // by a single thread waiting on a promise or a callback
  concurrency: 4,

  // OPTIONAL - Number of times to attempt to do this job (and failing) before giving up
  attempts: 4,

  // OPTIONAL - Default false - if silent is true, job wont print logging for events
  silent: true,

  // The function that does the actual processing. Callback is node style and MANDATORY
  // job argument has some useful properties like
  //  job.log -> Logging for this specific job
  //  job.data -> an object of any data passed to this job
  //  job.progress(12) -> progress notifier for web UI
  process: async function(job, callback) {
    try {
      job.log('Doing something');
      await lib.doSomething(job.data.foo);
      job.progress(50);
      const result = await lib.doSomethingElse();
      callback(null, result);
    }
    catch (error) {
      callback(error);
    }
  }

});


// Example of scheduling, chaining, and processing a job
someJob
// Running .schedule() puts it on the queue to be processed
// If a runSchedule is provided, it recurs using later, otherwise it's immediately put on the queue
  .schedule()
// running runWorkers() kicks off the workers to run the function defined in Job.process above
  .runWorkers();
```

You can also listen for the events and run your own logic:
```
/*
Available events are:
- `enqueue` the job is now queued
- `promotion` the job is promoted from delayed state to queued
- `progress` the job's progress ranging from 0-100
- `failed attempt` the job has failed, but has remaining attempts yet
- `failed` the job has failed and has no remaining attempts
- `complete` the job has completed
- `remove` the job has been removed
*/

 job.on('complete', () => { dosomething(); });
```
