const AllureReporter = require('wdio-allure-reporter');

class CustomReporter extends AllureReporter {
  constructor(baseReporter, config, options = {}) {
    super(baseReporter, config, options);
    this.on('runner:extra', (command) => {
      this.dumpJSON(this.getAllure(command.cid), 'Response', command.body);
    });
  }
}

CustomReporter.reporterName = 'CustomReporter';

/**
 * Expose Custom Reporter
 */
exports = module.exports = CustomReporter;
