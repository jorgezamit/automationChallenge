
const UtilsPage = require('../pages/utils_page.js');
const CONSTANTS = require('../constants.js');
const fs = require('fs');

class YelpHomePage {

  get findDescription() { return browser.element('#find_desc'); }
  get buttonHeaderSearch()  		 { return browser.element('#header-search-submit'); }
  get suggestionsList()			 { return browser.elements('ul[class="suggestions-list"]'); }
  get paginationResults()  		 { return browser.element('.pagination-results-window'); }
  get buttonFilter()				 { return browser.element('.suggested-filters_filter-list > li:last-child'); }
  get neighborHoodMainFilter() { return browser.element('.filter-set.place-filters > ul.main'); }
  get distanceFilter()			 { return browser.element('.filter-set.distance-filters > ul'); }
  get categoryFilter()			 { return browser.element('.filter-set.category-filters > ul'); }
  get priceFilter()			     { return browser.element('.filter-set.price-filters > ul'); }
  get filterPanel() 				{ return browser.element('.filter-panel_filters'); }
  get restaurantsMainAttributes() { return browser.elements('.regular-search-result .main-attributes .media-story'); }
  get spinner() 					 { return browser.elements('.results-wrapper .throbber-container'); }
  get indexBusinessName() 		 { return browser.elements('.indexed-biz-name'); }


  setfindDescription(value) {
    this.findDescription.waitForVisible();
    this.findDescription.setValue(value);
  }

  clickOnSuggestion(value) {
    this.findDescription.waitForVisible();
    this.findDescription.click();
    this.suggestionsList.waitForVisible();
    const elements = this.suggestionsList.value;
    const firstList = elements[0];
    const items = firstList.elements('li').value;
    for (let i = 0; i < items.length; i++) {
      if (items[i].getText() === value) {
        items[i].click();
        break;
      }
    }
  }

  appendToSearch(text) {
    this.findDescription.waitForVisible();
    const currentSearch = this.findDescription.getValue();
    this.setfindDescription(`${currentSearch} ${text}`);
    this.buttonHeaderSearch.waitForVisible();
    this.buttonHeaderSearch.click();
  }

  reportTotalNumberOfSearchResults() {
    this.findDescription.waitForVisible();
    const currentSearch = this.findDescription.getValue();
    let isPrintedResults = false;
    console.log('Results for: Restaurants near san francisco');
    isPrintedResults = this.printPaginationToConsole();
    console.log('');
    return isPrintedResults;
  }

  reportWithFilterFields(filterText, filterField) {
  	UtilsPage.waitForElementBeVisible(this.filterPanel, 2000);
  	if (!this.filterPanel.isVisible()) {
  		this.buttonFilter.click();
  	}
    let currentFieldItems;
    if (filterField && (filterField === CONSTANTS.CATEGORY)) {
    	UtilsPage.waitForElementExists(this.categoryFilter, 2000);
      	currentFieldItems = this.categoryFilter.elements('li').value;
    } else if (filterField && (filterField === CONSTANTS.PRICE)) {
    	UtilsPage.waitForElementExists(this.priceFilter, 2000);
      	currentFieldItems = this.priceFilter.elements('li').value;
    }

    if (filterText) {
      for (let i = 0; i < currentFieldItems.length; i++) {
      	UtilsPage.waitForElementExists(currentFieldItems[i].element('label > span'), 5000);
        if (currentFieldItems[i].element('label > span').getText().includes(filterText)) {
          currentFieldItems[i].element('label > span').click();
          UtilsPage.waitForElementToHide(this.spinner, 5000);
          break;
        }
      }
    }
    if (filterField === CONSTANTS.CATEGORY) {
      console.log(`Category: ${filterText}`);
    } else if (filterField === CONSTANTS.PRICE) {
      console.log(`Price: ${filterText}`);
    }
  }

  reportStarsOfRestaurants() {
    UtilsPage.waitForElementExists(this.restaurantsMainAttributes, 2000);
    const restaurantsMainAttributes = this.restaurantsMainAttributes.value;
    let isPrintedResults = false;
    let indexedBizName;
    let stars;
    console.log('');
    console.log('Reports of stars per Restaurant:');
    for (let i = 0; i < restaurantsMainAttributes.length; i++) {
      indexedBizName = `${i + 1}. ${restaurantsMainAttributes[i].element('.indexed-biz-name > a > span').getText()}`;
      stars = restaurantsMainAttributes[i].getAttribute('.i-stars', 'title');
      console.log('');
      console.log(indexedBizName);
      console.log(stars);
      console.log('');
      isPrintedResults = true;
    }
    return isPrintedResults;
  }

  clickAndExpandSpecificRestaurantInformation(specificRestaurant) {
    const restaurantsMainAttributes = this.restaurantsMainAttributes.value;
    if (specificRestaurant >= restaurantsMainAttributes.length) {
      console.log('specificRestaurant value out of scope in reportCriticalRestaurantInformation()');
      return;
    }
    restaurantsMainAttributes[specificRestaurant].element(' a').click();
  }

  printPaginationToConsole() {
    UtilsPage.waitForElementToHide(this.spinner, 2000);
    let isPrintedResults = false;
    this.paginationResults.waitForVisible();
    if (!this.paginationResults.isVisible()) {
      console.log('Some error Happen with pagination information');
      return isPrintedResults;
    }
    const currentSearch = this.findDescription.getValue();
    console.log(`Current search: ${currentSearch}`);
    console.log('');
    const pagination = this.paginationResults.getText();
    let totalResults;
    let resultsPerPage;
    if (pagination.includes('of')) {
      totalResults = pagination.split('of')[1].replace(/\s/g, '');
      console.log(`Total results: ${totalResults}`);
      resultsPerPage = pagination.split('of')[0].split('-')[1].replace(/\s/g, '');
      console.log(`Results per Page: ${resultsPerPage}`);
      isPrintedResults = true;
    }
    console.log('');
    return isPrintedResults;
  }

  isRestaurantsDisplayed() {
    this.paginationResults.waitForVisible();
    return this.paginationResults.isVisible();
  }

}
module.exports = new YelpHomePage();
