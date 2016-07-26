'use strict';

var utils = require('../utilities');

/** @constant {number} */
var IMAGE_LOAD_TIMEOUT = 10000;

/** @type {Array.<Object>} */
var ratingClasses = [
  'review-rating',
  'review-rating-two',
  'review-rating-three',
  'review-rating-four',
  'review-rating-five'
];

/**
 * @param {Object} data
 * @return {Object}
 */
var getReviewElement = function(data, dummyReview) {
  var templateElement = document.querySelector('template');
  var elementToClone = utils.getTemplate(templateElement, '.review');

  var element = elementToClone.cloneNode(true);
  if (dummyReview) {
    element.querySelector('.review-text').textContent = 'Ни один элемент из списка не подходит под выбранные критерии. Попробуйте другие фильтры.';
    utils.toggleVisibility(element.querySelector('.review-quiz'), true);
    utils.toggleVisibility(element.querySelector('.review-rating'), true);
    var imageForEmptyRequest = {
      author: {
        picture: 'img/wizard.gif'
      }
    };
    createImage(imageForEmptyRequest, element);
  } else {
    var elementRating = element.querySelector('.review-rating');
    elementRating.classList.add(ratingClasses[data.rating - 1]);
    element.querySelector('.review-text').textContent = data.description;

    createImage(data, element);
  }
  return element;
};

/**
 * @param {Object} data
 * @param {HTMLElement} element
 */
var createImage = function(data, element) {
  var authorPicture = new Image(124, 124);

  authorPicture.onload = function() {
    clearTimeout(imageLoadTimeout);
    var reviewAvatar = element.querySelector('.review-author');
    reviewAvatar.src = authorPicture.src;
    reviewAvatar.width = authorPicture.width;
    reviewAvatar.height = authorPicture.height;
  };

  authorPicture.onerror = function() {
    element.classList.add('review-load-failure');
  };

  authorPicture.src = data.author.picture;

  var imageLoadTimeout = setTimeout(function() {
    element.classList.add('review-load-failure');
  }, IMAGE_LOAD_TIMEOUT);
};

module.exports = getReviewElement;
