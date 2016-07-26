'use strict';

var filterType = require('./filters-type');

/** @constant {number} */
var RECENT_REVIEWS_GAP = 4 * 24 * 60 * 60 * 1000;

/** @CONSTANT (number) */
var FILTER_GOOD_BAD_RATING_VALUE = 2;

/**
 * @param {Array.<Object>} reviews
 * @param {string} filter
 */
var getFilteredReviews = function(reviews, filter) {
  var reviewsToFilter = reviews.slice(0);

  switch (filter) {
    case filterType.ALL:
      reviewsToFilter = reviews.slice(0);
      break;

    case filterType.RECENT:
      reviewsToFilter = reviewsToFilter.filter(function(review) {
        return new Date(review.date).getTime() > new Date().getTime() - RECENT_REVIEWS_GAP;
      }).sort(function(a, b) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      break;

    case filterType.GOOD:
      reviewsToFilter = reviewsToFilter.filter(function(review) {
        return review.rating > FILTER_GOOD_BAD_RATING_VALUE;
      }).sort(function(a, b) {
        return b.rating - a.rating;
      });
      break;

    case filterType.BAD:
      reviewsToFilter = reviewsToFilter.filter(function(review) {
        return review.rating <= FILTER_GOOD_BAD_RATING_VALUE;
      }).sort(function(a, b) {
        return a.rating - b.rating;
      });
      break;

    case filterType.POPULAR:
      reviewsToFilter = reviewsToFilter.sort(function(a, b) {
        return a.review_usefulness - b.review_usefulness;
      });
      break;
  }

  localStorage.setItem('lastFilter', filter);
  return reviewsToFilter;
};

module.exports = getFilteredReviews;
