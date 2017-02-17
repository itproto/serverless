'use strict';

module.exports = {
  invokeFunction() {
    const project = this.serverless.service.provider.project;
    const region = this.options.region;
    const func = this.options.function;

    const params = {
      name: `projects/${project}/locations/${region}/functions/${func}`,
      //name: func,
    };

    return this.provider.request(
      'cloudfunctions',
      'projects',
      'locations',
      'functions',
      'call',
      params
    )
      .then(() => this.provider.request('logging', 'entries', 'list', { filter: func }))
      .then((logs) => {
        let log = {
          textPayload: `There's no log data for function "${func}" available right now...`,
        };

        if (logs.length) log = logs[0];

        this.serverless.cli.log(JSON.stringify(log, null, 2));
      });
  },
};
