'use strict';


module.exports = {

  /**
   * Проверка виден ли элемент на экране
   * @param {object} element
   * @return {boolean}
   */
  isElementVisible: function(element) {
    return element.getBoundingClientRect().bottom > 0;
  },

  /**
   * Переключение видимости элемента
   * @param  {Object} element
   * @param  {boolean} showFlag
   */
  toggleVisibility: function(element, showFlag) {
    element.classList.toggle('invisible', showFlag);
  },

  /**
   * Проверка поддерживается ли элемент <template> браузером
   * и возвращение соответствующего объекта
   * @param {object} template
   * @param {string} selector
   * @return {object}
   */
  getTemplate: function(template, selector) {
    if ('content' in template) {
      return template.content.querySelector(selector);
    } else {
      return template.querySelector(selector);
    }
  }

};
