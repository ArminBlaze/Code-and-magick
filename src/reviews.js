'use strict';

var utils = require('./utilities');
var filterType = require('./filter/filters-type');
var filter = require('./filter/filter');
var Review = require('./reviews/review');

var Reviews = function() {
  this.reviewsBlock = document.querySelector('.reviews');
  this.getElements();
  this.setInitialParameters();
  this.hideFilters();

  this.getReviews(function(loadedReviews) {
    this.reviews = loadedReviews;
    this.setFiltersEnabled();
    this.setFilterEnabled(this.DEFAULT_FILTER);
    this.setPressShowMoreButton();
  }.bind(this));
  this.showFilters();
};

Reviews.prototype.getElements = function() {
  this.reviewsFilter = this.reviewsBlock.querySelector('.reviews-filter');
  this.showMoreButton = this.reviewsBlock.querySelector('.reviews-controls-more');
  this.reviewContainer = this.reviewsBlock.querySelector('.reviews-list');
};

Reviews.prototype.setInitialParameters = function() {

  /** @type {Array.<Object>} */
  this.reviews = [];

  /** @constant {number} */
  this.PAGE_SIZE = 3;

  /** @constant {Filter} */
  this.DEFAULT_FILTER = localStorage.getItem('lastFilter') || filterType.ALL;

  /** @constant {number} */
  this.REVIEW_LOAD_TIMEOUT = 10000;

  /** @constant {string} */
  this.REVIEWS_LOAD_URL = '//o0.github.io/assets/json/reviews.json';

  /** @type {number} */
  this.pageNumber = 0;

  /** @type {Array.<Object>} */
  this.filteredReviews = [];

  /** @type {boolean} */
  this.hideElement = true;

  /** @type {Array.<Object>} */
  this.renderedReviews = [];
};

Reviews.prototype.hideFilters = function() {
  //Прячем блок с фильтрами .reviews-filter, добавляя ему класс invisible.
  utils.toggleVisibility(this.reviewsFilter, this.hideElement);
};

Reviews.prototype.showFilters = function() {
  //Отображать блок с фильтрами.
  utils.toggleVisibility(this.reviewsFilter, !this.hideElement);
};


/**
 * @param {number} page
 * @return {boolean}
 */
Reviews.prototype.isNextPageAvailable = function(page) {
  return page + 1 < Math.ceil(this.filteredReviews.length / this.PAGE_SIZE);
};

Reviews.prototype.hideShowMoreButton = function() {
  return this.showMoreButton.classList.toggle('invisible', !this.isNextPageAvailable(this.pageNumber));
};

Reviews.prototype.setPressShowMoreButton = function() {
  if (!this.hideShowMoreButton()) {
    this.showMoreButton.addEventListener('click', function() {
      this.pageNumber++;
      this.renderReviews(this.filteredReviews, this.pageNumber);
    }.bind(this));
  }
};
Reviews.prototype.hidePreloader = function() {
  this.reviewsBlock.classList.remove('reviews-list-loading');
};

/** @param {function(Array.<Object>)} callback */
Reviews.prototype.getReviews = function(callback) {
  var xhr = new XMLHttpRequest();

  //прячем прелоадер
  this.hidePreloader();
  //Если загрузка закончится неудачно (ошибкой сервера или таймаутом), покажите предупреждение об ошибке
  var reviewsLoadFailure = function() {
    this.reviewsBlock.classList.add('reviews-load-failure');
    this.hidePreloader();
  }.bind(this);

  /** @param {Event} evt*/
  xhr.onload = function(evt) {
    clearTimeout(this.reviewLoadTimeout);
    this.loadedData = JSON.parse(evt.target.response);
    this.hidePreloader();
    callback(this.loadedData);
  }.bind(this);

  xhr.onerror = function() {
    reviewsLoadFailure();
  };

  this.reviewsBlock.classList.add('reviews-list-loading');
  xhr.open('GET', this.REVIEWS_LOAD_URL);
  xhr.send();

  this.reviewLoadTimeout = setTimeout(function() {
    reviewsLoadFailure();
  }, this.REVIEW_LOAD_TIMEOUT);
};

//Создаём для каждой записи массива reviews блок отзыва на основе шаблона #review-template
/** @param {Array.<Object>} reviewList
 *  @param {number} page*/
Reviews.prototype.renderReviews = function(reviewList, page) {
  if (!page) {
    page = 0;

    this.renderedReviews.forEach(function(review) {
      review.remove();
    });

    this.renderedReviews = [];
  }

  var from = page * this.PAGE_SIZE;
  var to = from + this.PAGE_SIZE;

  if (reviewList.length) {
    reviewList.slice(from, to).forEach(function(data) {
      this.renderedReviews.push(new Review(data, this.reviewContainer));
    }.bind(this));
  } else {
    /** @type {boolean} */
    this.dummyReview = true;
    this.renderedReviews.push(new Review(reviewList, this.reviewContainer, this.dummyReview));
  }
  this.hideShowMoreButton();
};


/** @param {String} filterValue */
Reviews.prototype.setFilterEnabled = function(filterValue) {
  this.filterName = this.reviewsFilter.elements['reviews'];

  if (this.filterName.value !== filterValue) {
    this.filterName.value = filterValue;
  }

  this.filteredReviews = filter(this.reviews, filterValue);
  this.pageNumber = 0;
  this.renderReviews(this.filteredReviews, this.pageNumber);
};

Reviews.prototype.setFiltersEnabled = function() {
  this.reviewsFilter.addEventListener('click', function(event) {
    this.target = event.target;
    if (this.target.tagName === 'INPUT') {
      this.setFilterEnabled(this.target.id);
    }
  }.bind(this), false);
};

(function() {
  return new Reviews();
})();
