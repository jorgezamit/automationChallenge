'use strict';
var UtilsPage = require('../pages/utils_page.js');
const CONSTANTS = require('../constants.js');
var fs = require('fs');

class YelpHomePage {

	get find_desc()                  { return browser.element('#find_desc'); }
	get btnHeaderSearch()  			 { return browser.element('#header-search-submit'); }
	get suggestionsList()			 { return browser.elements('ul[class="suggestions-list"]'); }
	get paginationResults()  		 { return browser.element('.pagination-results-window'); }
	get btnFilter()					 { return browser.element('.suggested-filters_filter-list > li:last-child'); }
	get neighborHoodMainFilter()     { return browser.element('.filter-set.place-filters > ul.main'); }
	get distanceFilter()			 { return browser.element('.filter-set.distance-filters > ul'); }
	get restaurantsMainAttributes()  { return browser.elements('.main-attributes .media-story'); }
	get spinner() 					 { return browser.elements('.results-wrapper .throbber-container'); }


	setFind_desc(value){
        this.find_desc.waitForVisible();
        this.find_desc.setValue(value);
    }

	clickOnSuggestion(value){
		this.find_desc.waitForVisible();
		this.find_desc.click();
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
		this.find_desc.waitForVisible();
		var currentSearch = this.find_desc.getValue();
		this.setFind_desc(currentSearch + ' ' + text);
		this.btnHeaderSearch.waitForVisible();
		this.btnHeaderSearch.click();
	}

	reportTotalNumberOfSearchResults(){
		this.find_desc.waitForVisible();
		var currentSearch = this.find_desc.getValue();
		var isPrintedResults = false;
		isPrintedResults = this.printPaginationToConsole();
		return isPrintedResults;
	}

	reportWithFilterFields(filterText, filterField){
		this.btnFilter.waitForVisible();
		if(!this.neighborHoodMainFilter.isVisible()){
			this.btnFilter.click();
		}
		var currentFieldItems;
		if(filterField && (filterField === CONSTANTS.NEIGHBORHOODS)){
			this.neighborHoodMainFilter.waitForVisible();
			currentFieldItems = this.neighborHoodMainFilter.elements('li').value;

		}else if(filterField && (filterField === CONSTANTS.DISTANCE)){
			this.distanceFilter.waitForVisible();
			currentFieldItems = this.distanceFilter.elements('li').value;
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
		this.restaurantsMainAttributes.waitForVisible();
		var restaurantsMainAttributes = this.restaurantsMainAttributes.value;
		var isPrintedResults = false;
		var indexedBizName;
		var stars;
		UtilsPage.addLinesToReports(CONSTANTS.BIGGEST);
		console.log('Reports of stars per Restaurant:');
		for(var i = 0; i < restaurantsMainAttributes.length; i++){
			restaurantsMainAttributes[i].element(' .indexed-biz-name').waitForVisible();
			indexedBizName = restaurantsMainAttributes[i].element(' .indexed-biz-name').getText();
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