const UtilsPage = require('../pages/utils_page.js');

module.exports = function () {
  this.When(/^I pause for (\d+)ms$/, (intMs) => {
	    browser.pause(intMs);
  });

  this.Given(/^I open the url "([^"]*)"$/, (site) => {
    UtilsPage.goTo(site);
  });
};
