
const UtilsPage = require('../pages/utils_page.js');
const CONSTANTS = require('../constants.js');

class YelpRestaurantDetailPage {

  get nameRestaurant()  				{ return browser.element('.biz-page-title'); }
  get address()               		{ return browser.element('.street-address>address'); }
  get businessPhone()      			{ return browser.element('.biz-phone'); }
  get businessWebsite()				{ return browser.element('.biz-website > a'); }
  get customerReviews()				{ return browser.elements('.ylist.ylist-bordered.reviews > li'); }


  getCriticalRestaurantInformation() {
    this.nameRestaurant.waitForVisible();
    console.log(`Restaurant: ${this.nameRestaurant.getText()} - Address: ${this.address.getText()} - Website: ${this.businessWebsite.getText()
				 } - Phone: ${this.businessPhone.getText()}`);
  }

  getCustomersReviews(numberOfReviews) {
    UtilsPage.waitForElementExists(this.customerReviews, 1000);
    const customerReviews = this.customerReviews.value;
    let isPrintedResults = false;

    if (!numberOfReviews || numberOfReviews >= customerReviews.length) {
      console.log('numberOfReviews value out of scope in getCustomersReviews()');
      return isPrintedResults;
    }
    const startFromRealFirstReview = 1;
    const userInfo = {};
    userInfo.review = {};
    for (let i = startFromRealFirstReview; i < numberOfReviews + 1; i++) {
      console.log('');
      userInfo.name = customerReviews[i].element('#dropdown_user-name').getText();
      userInfo.location = customerReviews[i].element('li.user-location').getText();
      userInfo.review.date = customerReviews[i].element('.review-content span').getText();
      userInfo.review.stars = customerReviews[i].getAttribute('.i-stars', 'title');
      userInfo.review.content = customerReviews[i].element('.review-content>p').getText();
      console.log(`Customer name: ${userInfo.name} - Customer location: ${userInfo.location}`);
      console.log('Customer Review Info:');
      console.log(`Date: ${userInfo.review.date} - Stars given: ${userInfo.review.stars}`);
      console.log(`Content: ${userInfo.review.content}`);
      isPrintedResults = true;
      console.log('');
    }
    console.log('End reports from UI');
    console.log('');
    return isPrintedResults;
  }
}

module.exports = new YelpRestaurantDetailPage();
