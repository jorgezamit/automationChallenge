
const UtilsPage = require('../pages/utils_page.js');
const CONSTANTS = require('../constants.js');
const globalData = require('../globalData.js');

class YelpRestaurantDetailPage {

  get nameRestaurant()  				{ return browser.element('.biz-page-title'); }
  get address()               		{ return browser.element('.street-address>address'); }
  get businessPhone()      			{ return browser.element('.biz-phone'); }
  get businessWebsite()				{ return browser.element('.biz-website > a'); }
  get customerReviews()				{ return browser.elements('.ylist.ylist-bordered.reviews > li'); }


  getCriticalRestaurantInformation() {
    this.nameRestaurant.waitForVisible();
    globalData.specificRestaurant.name = this.nameRestaurant.getText();
    globalData.specificRestaurant.address = this.address.getText();
    globalData.specificRestaurant.website = this.businessWebsite.getText();
    globalData.specificRestaurant.phone = this.businessPhone.getText();
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
    let userInfo = {};
    userInfo.review = {};
    
    for (let i = startFromRealFirstReview; i < numberOfReviews + 1; i++) {
      userInfo.name = customerReviews[i].element('#dropdown_user-name').getText();
      userInfo.location = customerReviews[i].element('li.user-location').getText();
      userInfo.review.date = customerReviews[i].element('.review-content span').getText();
      userInfo.review.stars = customerReviews[i].getAttribute('.i-stars', 'title');
      userInfo.review.content = customerReviews[i].element('.review-content>p').getText();
      console.log(userInfo);
      globalData.restaurantReviews.push(userInfo);
    }
    return globalData.restaurantReviews.length > 0;
  }
}

module.exports = new YelpRestaurantDetailPage();
