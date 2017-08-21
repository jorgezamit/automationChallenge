const YelpHomePage = require('../pages/yelp_home_page.js');
const YelpRestaurantDetailPage = require('../pages/yelp_restaurant_detail_page.js');
const UtilsPage = require('../pages/utils_page.js');
const CONSTANTS = require('../constants.js');


module.exports = function () {
  this.Given(/^I am on Yelp Homepage "([^"]*)"$/, (URL) => {
    UtilsPage.goTo(URL);
  });

  this.When(/^As a Yelp user I select "([^"]*)" in dropdown box in Find$/, (dropdownOption) => {
    YelpHomePage.clickOnSuggestion(dropdownOption);
  });

  this.When(/^Append "([^"]*)" to Restaurants and click search button$/, (text) => {
    YelpHomePage.appendToSearch(text);
  });

  this.When(/^Use the price filter "([^"]*)"$/, (price) => {
    YelpHomePage.reportWithFilterFields(price, CONSTANTS.PRICE);
  });

  this.When(/^Use the Category filter "([^"]*)"$/, (category) => {
    YelpHomePage.reportWithFilterFields(category, CONSTANTS.CATEGORY);
  });

  this.Then(/^A list of restaurants is displayed$/, () => {
  	YelpHomePage.printPaginationToConsole();
    const isRestaurantsDisplayed = YelpHomePage.isRestaurantsDisplayed();
    expect(isRestaurantsDisplayed).to.equal(true, 'Expected to have search results displayed.');
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

  this.When(/^Append "([^"]*)" to "([^"]*)" and search Restaurants Pizza with Price "([^"]*)" and Category "([^"]*)" filter in API and make report$/, (text, text2, price, category) => {
    const totalResults = UtilsPage.reportDataToConsole(`${text2} ${text}`, 'san francisco', price, category, CONSTANTS.YELP_BUSINESS_SEARCH_API_PATH);
  });

  this.When(/^Report the star rating of each of the results in the first result page in API$/, () => {
    UtilsPage.reportStarsRating('Restaurants', 'san francisco', '', '', CONSTANTS.YELP_BUSINESS_SEARCH_API_PATH);
  });

  this.When(/^Select the "([^"]*)" result from the search results in API and Log all critical information and first 3 customer reviews$/, (restaurantValue) => {
    UtilsPage.reportCriticalInformation(restaurantValue, 'Restaurants', 'san francisco', '', '', CONSTANTS.YELP_BUSINESS_SEARCH_API_PATH);
  });
};
