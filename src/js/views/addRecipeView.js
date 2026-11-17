import { compileString } from 'sass';
import icons from '../../img/icons.svg';
import View from './View';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnClose = document.querySelector('.btn--close-modal');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _ingredientsField = document.querySelector('.upload__column');
  _btnMoreIngredient = document.querySelector('.add--ingredients-field');
  _Message = 'Add Recipe success';

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
  }
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      let dataAr = [...new FormData(this)];
      let data = Object.fromEntries(dataAr);
      handler(data);
    });
  }
  addFieldIngredients() {
    this._btnMoreIngredient.addEventListener('click', e => {
      e.preventDefault();
      let markup = this._addIngredientsFieldMarkup();
      this._ingredientsField.insertAdjacentHTML('beforeend', markup);
    });
  }
  _addIngredientsFieldMarkup() {
    return `
    <label>Ingredient 3</label>
          <input
            value="1.5"
            type="text"
            name="ingredient-3_quantity"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <input
            value="kg"
            type="text"
            name="ingredient-3_unit"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <input
            value="Sugar"
            type="text"
            name="ingredient-3_description"
            placeholder="Format: 'Quantity,Unit,Description'"
          />`;
  }
}
export default new AddRecipeView();
