
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
    console.log(`Title: ${title}`);
    all_elements.value.forEach((elem) => {
      console.log(`browser.elementIdText(elem.ELEMENT).value: ${browser.elementIdText(elem.ELEMENT).value}`);
      if (browser.elementIdText(elem.ELEMENT).value == title) {
        my_element = elem.ELEMENT;
      }
    });

    if (my_element != null) {
      browser.elementIdClick(my_element);
      console.log(`Clicked: ${title}`);
      return true;
    }
    return false;
  }

  clickOnElementWithTitleBySelector(selector, title) {
    browser.waitForExist(selector, 30000);
    const all_elements = browser.elements(selector);
    let my_element;
    console.log(`Title: ${title}`);
    all_elements.value.forEach((elem) => {
      console.log(`browser.elementIdText(elem.ELEMENT).value: ${browser.elementIdText(elem.ELEMENT).value}`);
      if (browser.elementIdText(elem.ELEMENT).value == title) {
      	my_element = elem.ELEMENT;
      }
    });

    if (my_element != null) {
      browser.elementIdClick(my_element);
      console.log(`Clicked: ${title}`);
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
    console.log('element present?');
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
      body: `${srcPath + textWithoutSpaces + datetime}.png`
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
        // console.log(response.error.description);
      }
    }).on('error', (err) => {
      console.log('Something went wrong on the request', err.request.options);
    });
    // wait for async call to end.
    browser.pause(15000);
    return results;
  }

  reportDataToConsole(searchText, location, price, categories, apiPath) {
    const tempCategories = (categories !== undefined && categories !== '') ? categories.toLowerCase() : '';
    const data = this.searchFromApi('', searchText, location, price, tempCategories, apiPath);
    if (data !== undefined) {
      console.log(`Results for: ${searchText} near ${location}`);
      if (price && price !== '') {
        console.log(`Price selected: ${price}`);
      }
      if (categories && categories !== '') {
        console.log(`Categories selected: ${categories}`);
      }
      console.log(`Results per page: ${data.businesses.length}`);
      console.log(`Total results: ${data.total}`);
      console.log('');
      return data;
    }
    console.log('data is Undefined');
  }

  reportStarsRating(searchText, location, price, categories, apiPath) {
    if (!searchText || !location || !apiPath) {
      console.log('Error in method reportField()');
      return;
    }
    let data = this.searchFromApi('', searchText, location, price, categories, apiPath);
    data = data.businesses;
    let report = '';
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        report = `Restaurant: ${i + 1}. ${data[i].name} Star Rating: ${data[i].rating}`;
        console.log(report);
        console.log('');
      }
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
    const restaurantId = data.businesses[restaurantPosition].id;
    const restaurantName = data.businesses[restaurantPosition].name;
    const restaurantPhone = data.businesses[restaurantPosition].display_phone;
    const restaurantUrl = data.businesses[restaurantPosition].url;
    const restaurantAddress = `${data.businesses[restaurantPosition].location.address1}, ${data.businesses[restaurantPosition].location.city}`;
    console.log('');
    console.log(`Restaurant: ${restaurantName} - Address: ${restaurantAddress} - Phone: ${restaurantPhone}`);
    console.log(`Url: ${restaurantUrl}`);
    let restaurantReviews = this.searchFromApi(restaurantId, searchText, location, price, categories, `${CONSTANTS.YELP_BUSINESS_API_PATH + restaurantId}/reviews`);
    restaurantReviews = restaurantReviews.reviews;
    if (restaurantReviews && restaurantReviews.length > 0) {
      let clientReview = '';
      for (let i = 0; i < 3; i++) {
        console.log('');
        clientReview = `Client name: ${restaurantReviews[i].user.name} - Rating: ${restaurantReviews[i].rating}`;
        console.log(clientReview);
        clientReview = `Comments: ${restaurantReviews[i].text}`;
        console.log(clientReview);
        console.log('');
      }
    }
    console.log('End reports from API');
    browser.pause(15000);
  }
}

module.exports = new UtilsPage();
