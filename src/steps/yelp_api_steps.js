const UtilsPage = require('../pages/utils_page.js');
const globalData = require('../globalData.js');
const CONSTANTS = require('../constants.js');


module.exports = function () {
  this.When(/^Select "([^"]*)" in API and make report$/, (text) => {
    const totalResults = UtilsPage.reportData(text, 'san francisco', '', '', CONSTANTS.YELP_BUSINESS_SEARCH_API_PATH);
    expect(totalResults.businesses.length > 0).to.equal(true, 'Expected positive total result number.');
  });

  this.When(/^Append "([^"]*)" to "([^"]*)" and search Restaurants Pizza in API and make report$/, (text, text2) => {
    const totalResults = UtilsPage.reportData(`${text2} ${text}`, 'san francisco', '', '', CONSTANTS.YELP_BUSINESS_SEARCH_API_PATH);
    expect(totalResults.businesses.length > 0).to.equal(true, 'Expected positive total result number.');
  });

  this.When(/^Append "([^"]*)" to "([^"]*)" and search Restaurants Pizza with filtered by Price "([^"]*)" in API and make report$/, (text, text2, price) => {
    const totalResults = UtilsPage.reportData(`${text2} ${text}`, 'san francisco', price, '', CONSTANTS.YELP_BUSINESS_SEARCH_API_PATH);
    expect(totalResults.businesses.length > 0).to.equal(true, 'Expected positive total result number.');
  });

  this.When(/^Append "([^"]*)" to "([^"]*)" and search Restaurants Pizza with filtered by Price "([^"]*)" and Category "([^"]*)" in API and make report$/, (text, text2, price, category) => {
    const totalResults = UtilsPage.reportData(`${text2} ${text}`, 'san francisco', price, category, CONSTANTS.YELP_BUSINESS_SEARCH_API_PATH);
  });

  this.Then(/^Report the star rating of "([^"]*)" with filtered by Price "([^"]*)" and Category "([^"]*)" in API and make reportin API$/, (text, price, category) => {
    UtilsPage.reportStarsRating(text, 'san francisco', price, category, CONSTANTS.YELP_BUSINESS_SEARCH_API_PATH);
  });

  this.Then(/^Select the "([^"]*)" result from the latest search results in API and Log all critical information and first 3 customer reviews$/, (restaurantValue) => {
    UtilsPage.reportCriticalInformation(restaurantValue, 'Restaurants pizza', 'san francisco', '1', 'sandwiches', CONSTANTS.YELP_BUSINESS_SEARCH_API_PATH);
  });
};
