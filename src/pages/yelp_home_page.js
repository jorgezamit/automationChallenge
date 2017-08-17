'use strict';
const UtilsPage = require('../pages/utils_page.js');
const CONSTANTS = require('../constants.js');
const fs = require('fs');

class YelpHomePage {

	get findDescription()            { return browser.element('#find_desc'); }
	get buttonHeaderSearch()  		 { return browser.element('#header-search-submit'); }
	get suggestionsList()			 { return browser.elements('ul[class="suggestions-list"]'); }
	get paginationResults()  		 { return browser.element('.pagination-results-window'); }
	get buttonFilter()				 { return browser.element('.suggested-filters_filter-list > li:last-child'); }
	get neighborHoodMainFilter()     { return browser.element('.filter-set.place-filters > ul.main'); }
	get distanceFilter()			 { return browser.element('.filter-set.distance-filters > ul'); }
	get categoryFilter()			 { return browser.element('.filter-set.category-filters > ul'); }
	get priceFilter()			     { return browser.element('.filter-set.price-filters > ul'); }
	get restaurantsMainAttributes()  { return browser.elements('.main-attributes .media-story'); }
	get spinner() 					 { return browser.elements('.results-wrapper .throbber-container'); }
	get indexBusinessName() 		 { return browser.elements('.indexed-biz-name'); }


	setfindDescription(value){
        this.findDescription.waitForVisible();
        this.findDescription.setValue(value);
    }

	clickOnSuggestion(value){
		this.findDescription.waitForVisible();
		this.findDescription.click();
		this.suggestionsList.waitForVisible();
		var elements = this.suggestionsList.value;
		var firstList = elements[0];
		var items = firstList.elements('li').value;
		for(var i = 0; i < items.length; i++){
			if(items[i].getText() === value){
				items[i].click();
				break;
			}
		}
	}

	appendToSearch(text){
		this.findDescription.waitForVisible();
		var currentSearch = this.findDescription.getValue();
		this.setfindDescription(currentSearch + ' ' + text);
		this.buttonHeaderSearch.waitForVisible();
		this.buttonHeaderSearch.click();
	}

	reportTotalNumberOfSearchResults(){
		this.findDescription.waitForVisible();
		var currentSearch = this.findDescription.getValue();
		var isPrintedResults = false;
		isPrintedResults = this.printPaginationToConsole();
		return isPrintedResults;
	}

	reportWithFilterFields(filterText, filterField){
		this.buttonFilter.waitForVisible();
		if(!this.categoryFilter.isVisible()){
			this.buttonFilter.click();
		}
		var currentFieldItems;
		if(filterField && (filterField === CONSTANTS.CATEGORY)){
			this.categoryFilter.waitForVisible();
			currentFieldItems = this.categoryFilter.elements('li').value;

		}else if(filterField && (filterField === CONSTANTS.PRICE)){
			this.priceFilter.waitForVisible();
			currentFieldItems = this.priceFilter.elements('li').value;
		}
		var isPrintedResults = false;
		if(filterText){
			for(var i = 0; i < currentFieldItems.length; i++){
				if(currentFieldItems[i].element('label > span').getText().includes(filterText)){
					currentFieldItems[i].element('label > span').click();
					break;
				}
			}
			isPrintedResults = this.printPaginationToConsole();
		}
		return isPrintedResults;
	}

	reportStarsOfRestaurants(){
		
		//this.restaurantsMainAttributes.waitForVisible();
		var restaurantsMainAttributes = this.restaurantsMainAttributes.value;
		UtilsPage.waitForElementExists(restaurantsMainAttributes[0].element('.indexed-biz-name > a > span'), 1500);
		var isPrintedResults = false;
		var indexedBizName;
		var stars;
		UtilsPage.addLinesToReports(CONSTANTS.BIGGEST);
		console.log('Reports of stars per Restaurant:');
		for(var i = 0; i < restaurantsMainAttributes.length; i++){
			//restaurantsMainAttributes[i].element('.indexed-biz-name').waitForVisible();
			indexedBizName = (i+1) + '. '+ restaurantsMainAttributes[i].element('.indexed-biz-name > a > span').getText();
			stars = restaurantsMainAttributes[i].getAttribute('.i-stars','title');
			UtilsPage.addLinesToReports(CONSTANTS.MEDIUM);
			console.log(indexedBizName);
			console.log(stars);
			UtilsPage.addLinesToReports(CONSTANTS.MEDIUM);
			isPrintedResults = true;
		}
		UtilsPage.addLinesToReports(CONSTANTS.BIGGEST);
		return isPrintedResults;
	}

	clickAndExpandSpecificRestaurantInformation(specificRestaurant){
		this.restaurantsMainAttributes.waitForVisible();
		var restaurantsMainAttributes = this.restaurantsMainAttributes.value;
		if(specificRestaurant >= restaurantsMainAttributes.length){
			console.log('specificRestaurant value out of scope in reportCriticalRestaurantInformation()');
			return;
		}
		restaurantsMainAttributes[specificRestaurant].element(' a').click();
	}

	printPaginationToConsole(){
		UtilsPage.waitForElementToHide(this.spinner, 2000);
		var isPrintedResults = false;
		this.paginationResults.waitForVisible();
		if(!this.paginationResults.isVisible()){
			console.log('Some error Happen with pagination information');
			return isPrintedResults;
		}
		UtilsPage.addLinesToReports(CONSTANTS.BIGGEST);
		var pagination = this.paginationResults.getText();
		var totalResults;
		var resultsPerPage;
		if(pagination.includes('of')){
			totalResults = pagination.split('of')[1].replace(/\s/g,'');
			console.log('Total results: ' + totalResults);
			resultsPerPage = pagination.split('of')[0].split('-')[1].replace(/\s/g,'');
			console.log('Results per Page: ' + resultsPerPage);
			isPrintedResults = true;
		}
		UtilsPage.addLinesToReports(CONSTANTS.BIGGEST);
		return isPrintedResults;
	}

	isRestaurantsDisplayed(){
		this.paginationResults.waitForVisible();
		return this.paginationResults.isVisible();
	}

}
module.exports = new YelpHomePage();