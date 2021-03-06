const YelpHomePage = require('../pages/yelp_home_page.js');
const YelpRestaurantDetailPage = require('../pages/yelp_restaurant_detail_page.js');
const UtilsPage = require('../pages/utils_page.js');
const globalData = require('../globalData.js');
const CONSTANTS = require('../constants.js');


module.exports = function () {
  this.Given(/^I am on Yelp Homepage "([^"]*)"$/, (URL) => {
    UtilsPage.goTo(URL);
  });

  this.When(/^I click search input and select "([^"]*)" in dropdown box in Find$/, (dropdownOption) => {
    YelpHomePage.clickOnSuggestion(dropdownOption);
  });

  this.When(/^Append "([^"]*)" to Restaurants and click search button$/, (text) => {
    YelpHomePage.appendToSearch(text);
  });

  this.When(/^I filter the results by "([^"]*)"$/, (price) => {
    YelpHomePage.reportWithFilterFields(price, CONSTANTS.PRICE);
  });

  this.When(/^I apply the filter "([^"]*)"$/, (category) => {
    YelpHomePage.reportWithFilterFields(category, CONSTANTS.CATEGORY);
  });

  this.Then(/^I should see a list of restaurants displayed$/, () => {
  	const isRestaurantsDisplayed = YelpHomePage.isRestaurantsDisplayed();
    expect(isRestaurantsDisplayed).to.equal(true, 'Expected to see restaurants displayed.');
  	UtilsPage.sendDataToCustomReport(globalData.restaurantsResults);
  });

  this.Then(/^Restaurants Stars report should be generated$/, () => {
    const isReportGenerated = YelpHomePage.reportStarsOfRestaurants();
    expect(isReportGenerated).to.equal(true, 'Expected Restaurants Stars report generated.');
    UtilsPage.sendDataToCustomReport(globalData.starsResults);
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
    UtilsPage.sendDataToCustomReport(globalData.specificRestaurant);
  });

  this.Then(/^Log first three customers reviews of the selected restaurant$/, () => {
    const isLoggedCustomerReviews = YelpRestaurantDetailPage.getCustomersReviews(CONSTANTS.NUMBER_OF_CUSTOMERS_REVIEWS);
    expect(isLoggedCustomerReviews).to.equal(true, 'Expected to be logged first three customers reviews.');
    UtilsPage.sendDataToCustomReport(globalData.restaurantReviews);
  });

  this.Then(/^No restaurants should be displayed$/, () => {
    const isRestaurantsDisplayed = YelpHomePage.isRestaurantsDisplayed();
    expect(isRestaurantsDisplayed).to.equal(false, 'Expected NO restaurants results displayed');
  });
};
