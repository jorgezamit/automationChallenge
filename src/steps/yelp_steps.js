const YelpHomePage = require('../pages/yelp_home_page.js');
const YelpRestaurantDetailPage = require('../pages/yelp_restaurant_detail_page.js');
const UtilsPage = require('../pages/utils_page.js');
const CONSTANTS = require('../constants.js');


module.exports = function () {
  this.Given(/^Go to Yelp Site "([^"]*)"$/, (URL) => {
    UtilsPage.goTo(URL);
  });

  this.When(/^Select "([^"]*)" in dropdown box in Find$/, (dropdownOption) => {
    YelpHomePage.clickOnSuggestion(dropdownOption);
  });

  this.When(/^Append Pizza to Restaurants and search Restaurants Pizza$/, () => {
    YelpHomePage.appendToSearch('pizza');
  });

  this.Then(/^Report total number of Search results with number of results in the current page$/, () => {
    const isPrintedResults = YelpHomePage.reportTotalNumberOfSearchResults();
    expect(isPrintedResults).to.equal(true, 'Expected to have the search results printed to console.');
  });

  this.When(/^Parameterize any 2 of the filtering parameters apply filter and report total no. of searchs results$/, () => {
    let isPrintedResults = YelpHomePage.reportWithFilterFields('Sandwiches', CONSTANTS.CATEGORY);
    expect(isPrintedResults).to.equal(true, 'Expected to have total number of search results with filter printed to console.');
    isPrintedResults = YelpHomePage.reportWithFilterFields('$', CONSTANTS.PRICE);
    expect(isPrintedResults).to.equal(true, 'Expected to have total number of search results with filter printed to console.');
  });

  this.When(/^Report the star rating of each of the results in the first result page$/, () => {
    const isPrintedResults = YelpHomePage.reportStarsOfRestaurants();
    expect(isPrintedResults).to.equal(true, 'Expected to have the star rating of each of the results printed to console.');
  });

  this.When(/^Click and expand the first result from the search results$/, () => {
    YelpHomePage.clickAndExpandSpecificRestaurantInformation(CONSTANTS.FIRST_RESTAURANT);
  });

  this.When(/^Log all critical information of the selected restaurant details$/, () => {
    YelpRestaurantDetailPage.getCriticalRestaurantInformation();
  });

  this.Then(/^Log first three customers reviews of the selected restaurant$/, () => {
    const isPrintedResults = YelpRestaurantDetailPage.getCustomersReviews(CONSTANTS.NUMBER_OF_CUSTOMERS_REVIEWS);
    expect(isPrintedResults).to.equal(true, 'Expected to have customer reviews printed to console.');
  });

  this.Then(/^No restaurants should be displayed$/, () => {
    const isRestaurantsDisplayed = YelpHomePage.isRestaurantsDisplayed();
    expect(isRestaurantsDisplayed).to.equal(false, 'Expected NO restaurants results displayed');
  });

	// API Related Steps
  this.When(/^Select "([^"]*)" in API and make report$/, (text) => {
    const totalResults = UtilsPage.reportDataToConsole(text, 'san francisco', '', '', CONSTANTS.YELP_BUSINESS_SEARCH_API_PATH);
    expect(totalResults.businesses.length > 0).to.equal(true, 'Expected positive total result number.');
  });

  this.When(/^Append "([^"]*)" to "([^"]*)" and search Restaurants Pizza in API and make report$/, (text, text2) => {
    const totalResults = UtilsPage.reportDataToConsole(`${text2} ${text}`, 'san francisco', '', '', CONSTANTS.YELP_BUSINESS_SEARCH_API_PATH);
    expect(totalResults.businesses.length > 0).to.equal(true, 'Expected positive total result number.');
  });

  this.When(/^Append "([^"]*)" to "([^"]*)" and search Restaurants Pizza with Price "([^"]*)" filter in API and make report$/, (text, text2, price) => {
    const totalResults = UtilsPage.reportDataToConsole(`${text2} ${text}`, 'san francisco', price, '', CONSTANTS.YELP_BUSINESS_SEARCH_API_PATH);
    expect(totalResults.businesses.length > 0).to.equal(true, 'Expected positive total result number.');
  });

  this.When(/^Append "([^"]*)" to "([^"]*)" and search Restaurants Pizza with Category "([^"]*)" filter in API and make report$/, (text, text2, category) => {
    const totalResults = UtilsPage.reportDataToConsole(`${text2} ${text}`, 'san francisco', '', category, CONSTANTS.YELP_BUSINESS_SEARCH_API_PATH);
  });

  this.When(/^Report the star rating of each of the results in the first result page in API$/, () => {
    UtilsPage.reportStarsRating('Restaurants', 'san francisco', '', '', CONSTANTS.YELP_BUSINESS_SEARCH_API_PATH);
  });

  this.When(/^Select the "([^"]*)" result from the search results in API and Log all critical information and first 3 customer reviews$/, (restaurantValue) => {
    UtilsPage.reportCriticalInformation(restaurantValue, 'Restaurants', 'san francisco', '', '', CONSTANTS.YELP_BUSINESS_SEARCH_API_PATH);
  });
};
