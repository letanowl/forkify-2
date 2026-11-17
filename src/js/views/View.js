import { mark } from 'regenerator-runtime';
import icons from '../../img/icons.svg';
export default class View {
  _data;

  /**
   * Render the recived Object to DOM
   * @param {Object | Object[]} the data can be rendered 
   * @param {boolean | [render = true]} if false create markup string instead 
   * @returns 
   */



  render(data, render = true) {
    this._data = data;
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    this._data = data;
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    const Newmarkup = this._generateMarkup();
    let newDOM = document.createRange().createContextualFragment(Newmarkup); // create fragment contain new makrup
    let newElement = Array.from(newDOM.querySelectorAll('*'));
    let curElement = Array.from(this._parentElement.querySelectorAll('*'));
    newElement.forEach((el, i) => {
      let curEl = curElement[i];
      // Update value
      if (!el.isEqualNode(curEl) && el.firstChild?.nodeValue.trim() !== '') {
        curEl.textContent = el.textContent;
      }
      // Update attribute
      if (!el.isEqualNode(curEl)) {
        Array.from(el.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }
  renderError(error = this._errorMessage) {
    this._clear();
    const markup = this._markupError(error);
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(mess = this._Message) {
    this._clear();
    const markup = this._markupMessage(mess);
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderSpiner() {
    this._clear();
    const markup = this._markupSpiner();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
  _markupError(error) {
    return `
     <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${error} </br> ${error.message}</p>
          </div>`;
  }
  _markupMessage(mess) {
    return `
     <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${mess} </br> ${mess.message}</p>
          </div>`;
  }
  _markupSpiner() {
    return `
				<div class="spinner">
				  <svg>
					<use href="${icons}#icon-loader"></use>
				  </svg>
				</div>`;
  }
}
