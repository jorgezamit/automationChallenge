
const CONSTANTS = require('../constants.js');
const fs = require('fs');
const Client = require('node-rest-client').Client;

class UtilsPage {

  goTo(site) {
    browser.url(site);
  }

  getUrl() {
    return browser.getUrl();
  }

  waitAndClickForSelector(selector, timeout) {
    browser.waitForVisible(selector, timeout);
    browser.click(selector);
  }

  waitAndClickForElement(element, timeout) {
    element.waitForVisible(timeout);
    element.click();
  }

  clickOnElementWithTitle(all_elements, title) {
    let my_element;
    all_elements.waitForVisible(50000);
    all_elements.value.forEach((elem) => {
      console.log(`browser.elementIdText(elem.ELEMENT).value: ${browser.elementIdText(elem.ELEMENT).value}`);
      if (browser.elementIdText(elem.ELEMENT).value == title) {
        my_element = elem.ELEMENT;
      }
    });

    if (my_element != null) {
      browser.elementIdClick(my_element);
      return true;
    }
    return false;
  }

  clickOnElementWithTitleBySelector(selector, title) {
    browser.waitForExist(selector, 30000);
    const all_elements = browser.elements(selector);
    let my_element;
    
    all_elements.value.forEach((elem) => {
      console.log(`browser.elementIdText(elem.ELEMENT).value: ${browser.elementIdText(elem.ELEMENT).value}`);
      if (browser.elementIdText(elem.ELEMENT).value == title) {
      	my_element = elem.ELEMENT;
      }
    });

    if (my_element != null) {
      browser.elementIdClick(my_element);
      return true;
    }
    return false;
  }

  waitForElementExists(element, timeout) {
    let retries = 5;
    while (retries-- > 0 && !(element.isExisting())) {
      browser.pause(timeout);
    }
  }

  waitForElementBeVisible(element, timeout) {
    let retries = 5;
    while (retries-- > 0 && !(element.isVisible())) {
      browser.pause(timeout);
    }
  }

  waitForElementExistsWithText(text, element, timeout) {
    let retries = 5;
    let success = false;

    while (retries-- > 0 && !(success = element.isExisting()) && element.getText() === text) {
      browser.pause(timeout);
    }
  }

  waitForElementToHide(element, timeInMillisecs) {
    while (element.isVisible()) {
      browser.pause(timeInMillisecs);
    }
  }

  isElementPresent(element) {
    element.waitForVisible(10000);
    return element.isExisting();
  }

  _generateRandom(charset, length = 6) {
    let text;
    for (let i = 0; i < length; i++) {
      text += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return text;
  }
  generateRandomEmail(domain = 'random.io') {
    const charset = 'abcdefghijklmnopqrstuvwxyz';
    const email = this._generateRandom(charset);
    return `${email}@${domain}`;
  }

  generateRandomChars() {
    const charset = 'abcdefghijklmnopqrstuvwxyz1234567890';
    const text = this._generateRandom(charset);
    return text;
  }

  generateFutureDate(addDays, addMonth, addYear) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + addDays);
    const dd = targetDate.getDate();
    const mm = targetDate.getMonth() + 1 + addMonth; // 0 is January, so we must add 1
    const yyyy = targetDate.getFullYear() + addYear;
    const ddStr = dd >= 10 ? dd : (`0${dd}`);
    const mmStr = mm >= 10 ? mm : (`0${mm}`);
    const dateString = `${mmStr}/${ddStr}/${yyyy}`;

    return dateString;
  }

  generateScreenshotTimestamp(text, srcPath) {
    const currentdate = new Date();
    const datetime = `${currentdate.getDate()}-${currentdate.getMonth() + 1}-${currentdate.getFullYear()}@${
                +currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`;
    const screenshot = browser.saveScreenshot();
    const textWithoutSpaces = `${text.replace(/\s/g, '')}-`;
    fs.writeFileSync(`${srcPath + textWithoutSpaces + datetime}.png`, screenshot);
    process.send({
      event: 'runner:extra',
      body: `${srcPath + textWithoutSpaces + datetime}.png`,
    });
  }

  refreshPage() {
    browser.refresh();
  }

  // Method related to API calls
  searchFromApi(id, searchText, location, price, categories, apiPath) {
    let results;
    const client = new Client();
    const args = {
      parameters: {
        location,
        term: searchText,
        price,
        categories,
      },
      headers: {
        Authorization: CONSTANTS.TOKEN,
      },
      requestConfig: {
        timeout: 10000, //request timeout in milliseconds
      },
      responseConfig: {
        timeout: 10000, // response timeout
      },
    };
    client.get(apiPath, args, (data, response) => {
      if (response.statusCode === CONSTANTS.HTTP_STATUS_CODE_OK) {
        results = data;
      } else {
        console.log(response);
      }
    }).on('error', (err) => {
      console.log('Something went wrong on the request', err.request.options);
    });
    // wait for async call to end.
    browser.pause(15000);
    return results;
  }

  reportData(searchText, location, price, categories, apiPath) {
    const tempCategories = (categories !== undefined && categories !== '') ? categories.toLowerCase() : '';
    const data = this.searchFromApi('', searchText, location, price, tempCategories, apiPath);
    if (data !== undefined) {
      let report = {
        totalResults: data.total,
        resultsPerPage: data.businesses.length
      };
      if (price && price !== '') {
        report.priceFilter = price;
      }
      if (categories && categories !== '') {
        report.categoryFilter = categories;
      }
      this.sendDataToCustomReport(report);
      return data;
    }else{
      console.log('data is Undefined');
    }
    
  }

  reportStarsRating(searchText, location, price, categories, apiPath) {
    if (!searchText || !location || !apiPath) {
      console.log('Error in method reportField()');
      return;
    }
    let data = this.searchFromApi('', searchText, location, price, categories, apiPath);
    data = data.businesses;
    
    if (data && data.length > 0) {
      let reports = [];
      for (let i = 0; i < data.length; i++) {
        const report = `Restaurant: ${i + 1}. ${data[i].name} Star Rating: ${data[i].rating}`;
        reports.push(report);
      }
      this.sendDataToCustomReport(reports);
    }
    browser.pause(15000);
  }

  reportCriticalInformation(restaurantValue, searchText, location, price, categories, apiPath) {
    if (!restaurantValue || !searchText || !location || !apiPath) {
      console.log('Error in method reportCriticalInformation()');
      return;
    }
    let restaurantPosition;
    if (restaurantValue && restaurantValue === CONSTANTS.FIRST) {
      restaurantPosition = 0;
    }
    const data = this.searchFromApi('', searchText, location, price, categories, apiPath);
    if(data !== undefined){
      let restaurant = {
        restaurantId: data.businesses[restaurantPosition].id,
        restaurantName: data.businesses[restaurantPosition].name,
        restaurantPhone: data.businesses[restaurantPosition].display_phone,
        restaurantUrl: data.businesses[restaurantPosition].url,
        restaurantAddress: data.businesses[restaurantPosition].location.address1 + ' city: ' + data.businesses[restaurantPosition].location.city,
        reviews: []
      };
      let restaurantReviews = this.searchFromApi(restaurant.restaurantId, searchText, location, price, categories, `${CONSTANTS.YELP_BUSINESS_API_PATH + restaurant.restaurantId}/reviews`);
      if(restaurantReviews !== undefined && restaurantReviews.reviews !== undefined){
        restaurantReviews = restaurantReviews.reviews;
        console.log(restaurantReviews);
        console.log('its here!');
        for (let i = 0; i < 3; i++) {
          const clientReview = {
            name: restaurantReviews[i].user.name,
            rating: restaurantReviews[i].rating,
            text: restaurantReviews[i].text
          };
          restaurant.reviews.push(clientReview);
        }
      }
      this.sendDataToCustomReport(restaurant);
    }else{
      console.log('Data is undefined, error in method reportCriticalInformation()');
    }
    
    browser.pause(15000);
  }

  sendDataToCustomReport(data){
    process.send({
      event: 'runner:extra',
      body: data
    });
  }

}

module.exports = new UtilsPage();
