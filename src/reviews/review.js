'use strict';

var getReviewElement = require('./get-review-element');

/**
 * Вывод шаблонизированного отзыва
 * @param {Object} data
 * @param {Element} container
 * @param {boolean} dummyReview
 * @constructor
 */

var Review = function(data, container, dummyReview) {
  this.data = data;
  this.element = getReviewElement(this.data, dummyReview);

  container.appendChild(this.element);
};

Review.prototype.clickEvent = function() {
  this.element.addEventListener('click', this.onQuizClick.bind(this));
};

Review.prototype.onQuizClick = function() {
  if (this.element.classList.contains('review-quiz-answer')) {
    this.element.classList.add('review-quiz-answer-active');
  }
};

Review.prototype.remove = function() {
  this.element.removeEventListener('click', this.onQuizClick.bind(this));
  this.element.parentNode.removeChild(this.element);
};


module.exports = Review;
