'use strict';

var utils = require('./utilities');

var browserCookies = require('browser-cookies');
var reviewForm = document.querySelector('.review-form');
var formContainer = document.querySelector('.overlay-container');
var formOpenButton = document.querySelector('.reviews-controls-new');
var formCloseButton = document.querySelector('.review-form-close');
var radioButtons = document.querySelector('.review-form')['review-mark'];
var reviewText = document.querySelector('#review-text');
var reviewName = document.querySelector('#review-name');
var reviewFieldName = document.querySelector('.review-fields-name');
var reviewFieldText = document.querySelector('.review-fields-text');
var reviewFields = document.querySelector('.review-fields');
var reviewButton = document.querySelector('.review-submit');
//переменные установки дня рождения для вычисления срока жизни Cookie
var BIRTHDAY_MONTH = 9;
var BIRTHDAY_DAY = 22;

//ФУНКЦИИ
//Вычисляет срок жизни cookie
function calculateExpireDate() {
  var currDate = new Date();
  var birthdayDate = new Date(currDate.getFullYear(), BIRTHDAY_MONTH - 1, BIRTHDAY_DAY);
  var expireDate = currDate;

  if (birthdayDate > currDate) {
    birthdayDate.setFullYear(birthdayDate.getFullYear() - 1);
  }
  expireDate.setDate(currDate.getDate() + ((currDate - birthdayDate) / 24 / 60 / 60 / 1000));
  return expireDate;
}

//валидация данных полей отзыва
function validationFunction() {
  var lowRating = radioButtons.value < 3;
  var reviewNameExists = reviewName.value !== '';
  var reviewTextExists = reviewText.value !== '';
  var reviewReadyToSend = ((lowRating && reviewTextExists) || !lowRating) && reviewNameExists;

  utils.toggleVisibility(reviewFieldName, reviewNameExists);
  utils.toggleVisibility(reviewFields, reviewReadyToSend);


  //Поле «Описание» становится обязательным, если поле «Оценка» ниже 3
  if (lowRating) {
    reviewText.setAttribute('required', '');
    //обрабатываем ввод текста Отзыва
    utils.toggleVisibility(reviewFieldText, reviewTextExists);
  } else {
    reviewText.removeAttribute('required');
    reviewFieldText.classList.add('invisible');
  }
  //Скрываем блок reviewFields и активируем кнопку Добавить отзыв, если всё ОК
  if (reviewReadyToSend) {
    reviewButton.disabled = false;
  } else {
    reviewButton.setAttribute('disabled', '');
  }
}

//НАВЕШИВАНИЕ СОБЫТИЙ
//Валидируем ввод имени
reviewName.oninput = function() {
  validationFunction();
};
//Валидируем ввод текста отзыва
reviewText.oninput = function() {
  validationFunction();
};
formOpenButton.onclick = function(evt) {
  evt.preventDefault();
  formContainer.classList.remove('invisible');
};

formCloseButton.onclick = function(evt) {
  evt.preventDefault();
  formContainer.classList.add('invisible');
};
reviewForm.onsubmit = function(evt) {
  var actualExpireDate = calculateExpireDate();
  evt.preventDefault();
  browserCookies.set('rate', radioButtons.value, {expires: actualExpireDate});
  browserCookies.set('name', reviewName.value, {expires: actualExpireDate});
  this.submit();
};

//Валидируем заполненность полей при изменении оценки отзыва
for (var i = 0; i < radioButtons.length; i++) {
  radioButtons[i].onchange = function() {
    validationFunction();
  };
}

//УСТАНОВКА НАЧАЛЬНЫХ ЗНАЧЕНИЙ ФОРМЫ
//получаем данные об отзывы из cookie или выставляем по умолчанию
radioButtons.value = browserCookies.get('rate') || 3;
reviewName.value = browserCookies.get('name') || '';

//устанавливаем параметры валидации для стартового состояния
validationFunction();

