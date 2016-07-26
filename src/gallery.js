'use strict';

var Gallery = function() {
  this.container = document.querySelector('.photogallery');
  this.overlay = document.querySelector('.overlay-gallery');
  this.photos = [];
  /**
   * Начальное значение активной картинки в галерее
   * @type {number}
   */
  this.galleryActivePicture = 0;

  /**
   * Сохраняем контекст
   * @type {Gallery}
   */
  var self = this;
  this.getElements();
  this.bindEvents();
  this.getPhotos(this.photosItem);

  this.container.addEventListener('click', this._onContainerClick);
  window.addEventListener('hashchange', this._onHashChange);

  /**
   * проверка хэша при загрузке страницы
   */
  window.onload = function() {
    self._onHashChange();
  };
};

/**
 * Синоним клавиатурных кодов
 * @type {{ESC: number, LEFT: number, RIGHT: number}}
 */
Gallery.prototype.keyCodes = {
  ESC: 27,
  LEFT: 37,
  RIGHT: 39
};

/**
 * @param  {Object} data
 * @return {Object}
 */
Gallery.prototype.getPhotos = function(data) {
  var loadedPhotos = data;

  for (var i = 0; i < loadedPhotos.length; i++) {

    this.photos.push(loadedPhotos[i].getAttribute('src'));
  }

  this.picTotal.innerHTML = this.photos.length;
  return this;
};

/** @param {String} picture}*/
Gallery.prototype.showGallery = function(picture) {


  if (this.overlay.classList.contains('invisible')) {
    this.overlay.classList.remove('invisible');
  }

  this.previousPicture = this.overlay.querySelector('.' + this.visiblePictureClass);

  if (this.previousPicture) {
    this.previewContainer.removeChild(this.previousPicture);
  }

  this.preview = new Image();
  this.preview.classList.add(this.visiblePictureClass);
  this.preview.src = picture;
  this.previewContainer.appendChild(this.preview);

  window.addEventListener('keydown', this._onDocumentKeyDown);
  this.controlRight.addEventListener('click', this._onControlRightClick);
  this.controlLeft.addEventListener('click', this._onControlLeftClick);
  this.overlay.addEventListener('click', this._onCloseClick);
};

/** @param {number}  pictureIndex*/
Gallery.prototype.showPicture = function(pictureIndex) {
  if (this.galleryActivePicture !== pictureIndex) {
    this.galleryActivePicture = pictureIndex;
  }

  this.showGallery(this.photos[pictureIndex]);
  this.pictureCurrentNumber.innerHTML = pictureIndex + 1;
};

/**
 * Переключение клавиатурных событий
 * @param {Event} evt
 */
Gallery.prototype._onDocumentKeyDown = function(evt) {
  switch (evt.keyCode) {
    case this.keyCodes.ESC:
      this.hideGallery();
      break;
    case this.keyCodes.RIGHT:
      this.changeHash(this.getPhotoSrc(this.galleryActivePicture + 1));
      break;
    case this.keyCodes.LEFT:
      this.changeHash(this.getPhotoSrc(this.galleryActivePicture - 1));
      break;
  }
};

/**
 * Получение адреса фото по индексу
 * @param {number} index
 */
Gallery.prototype.getPhotoSrc = function(index) {
  if (index < 0) {
    index = this.photos.length - 1;
  } else if (index > this.photos.length - 1) {
    index = 0;
  }
  return this.photosItem[index].getAttribute('src');
};

Gallery.prototype.hideGallery = function() {
  this.overlay.classList.add('invisible');
  window.removeEventListener('keydown', this._onDocumentKeyDown);
  this.controlRight.removeEventListener('click', this._onControlRightClick);
  this.controlLeft.removeEventListener('click', this._onControlLeftClick);
  this.overlay.removeEventListener('click', this._onCloseClick);
  window.location.hash = '';
};

Gallery.prototype.getElements = function() {
  this.photosItem = this.container.querySelectorAll('.photogallery-image img');
  this.pictureCurrentNumber = this.overlay.querySelector('.preview-number-current');
  this.picTotal = this.overlay.querySelector('.preview-number-total');
  this.previewContainer = this.overlay.querySelector('.overlay-gallery-preview');
  this.visiblePictureClass = 'overlay-gallery-preview-visible';
  this.controlLeft = this.overlay.querySelector('.overlay-gallery-control-left');
  this.controlRight = this.overlay.querySelector('.overlay-gallery-control-right');
};

/**
 * Закрепление событий за текущим конструктором
 */
Gallery.prototype.bindEvents = function() {
  this._onContainerClick = this._onContainerClick.bind(this);
  this._onControlRightClick = this._onControlRightClick.bind(this);
  this._onControlLeftClick = this._onControlLeftClick.bind(this);
  this._onCloseClick = this._onCloseClick.bind(this);
  this._onHashChange = this._onHashChange.bind(this);
  this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
};

/**
 * Установка события клика по галерее и
 * вызов функции смены хэша
 * @param {Object} evt
 */
Gallery.prototype._onContainerClick = function(evt) {
  evt.preventDefault();
  if (evt.target.src) {
    for (var i = 0; i < this.photos.length; i++) {

      if (this.photos[i] === evt.target.getAttribute('src')) {
        this.changeHash(this.photos[i]);
        break;
      }
    }
  }
};

Gallery.prototype._onControlLeftClick = function() {
  this.changeHash(this.getPhotoSrc(this.galleryActivePicture - 1));
};

Gallery.prototype._onControlRightClick = function() {
  this.changeHash(this.getPhotoSrc(this.galleryActivePicture + 1));
};

Gallery.prototype._onCloseClick = function(evt) {
  if (evt.target.classList.contains('overlay-gallery-close') || evt.target.classList.contains('overlay-gallery')) {
    this.hideGallery();
  }
};

/**
 * Выставляем хэш страницы
 * @param {String} photoSrc
 */
Gallery.prototype.changeHash = function(photoSrc) {
  if (photoSrc) {
    window.location.hash = 'photo/' + photoSrc;
  } else {
    if (window.location.hash !== '') {
      window.location.hash = '';
    }
  }
};

Gallery.prototype._onHashChange = function() {
  /**
   * Регулярное выражение для проверки хэша страницы
   * @type {RegExp}
   */
  this.hashRegMatch = /#photo\/(\S+)/;

  // Берем текущий хэш
  var hash = window.location.hash;

  // Поиск сопоставления регулярного выражения в хэше
  var getPhotoRegExp = this.hashRegMatch.exec(hash);

  var photoSrc;
  var getPhotoIndex;

  if (getPhotoRegExp) {
    photoSrc = getPhotoRegExp[1];
    getPhotoIndex = this.photos.indexOf(photoSrc);

    if (getPhotoIndex > -1) {
      this.showPicture(getPhotoIndex);
    }
  } else {
    this.hideGallery();
  }
};

module.exports = new Gallery();
