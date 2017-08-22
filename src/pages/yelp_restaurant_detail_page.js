
const UtilsPage = require('../pages/utils_page.js');
const CONSTANTS = require('../constants.js');
const globalData = require('../globalData.js');

const START_FROM_REAL_FIRST_REVIEW = 1;

class YelpRestaurantDetailPage {

  get nameRestaurant()  			{ return browser.element('.biz-page-title'); }
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
    const isPrintedResults = false;

    if (!numberOfReviews || numberOfReviews >= customerReviews.length) {
      console.log('numberOfReviews value out of scope in getCustomersReviews()');
      return isPrintedResults;
    }

    for (let i = START_FROM_REAL_FIRST_REVIEW; i < numberOfReviews + 1; i++) {
      const userInfo = {
      	name: customerReviews[i].element('#dropdown_user-name').getText(),
      	location: customerReviews[i].element('li.user-location').getText(),
      	review: {
      		date: customerReviews[i].element('.review-content span').getText(),
      		stars: customerReviews[i].getAttribute('.i-stars', 'title'),
      		content: customerReviews[i].element('.review-content>p').getText()
      	}
      };
      globalData.restaurantReviews.push(userInfo);
    }
    return globalData.restaurantReviews.length > 0;
  }
}

module.exports = new YelpRestaurantDetailPage();
