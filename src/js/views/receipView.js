import icons from '../../img/icons.svg';
import flatIcons from '../../img/icons-flat.svg';
import Fraction from 'fraction.js';
import View from './View.js';

class Recipeview extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'could not find recipe';
  _windowWeeklyPlan = document.querySelector('.weekly-plan');
  _btnAddSelect = document.querySelector('.addMeal')
  // _data

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', e => {
      let btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      let { update } = btn.dataset;
      if (+update > 0) handler(+update);
    });
  }
  addHandlerender(handler) {
    ['load', 'hashchange'].forEach(ev => window.addEventListener(ev, handler));
  }
  addHandlerAddBookmarks(handler) {
    this._parentElement.addEventListener('click', e => {
      let btn = e.target.closest('.btn--bookmarks');
      if (!btn) return;
      handler();
    });
  }

  deleteHandlerRecipe(handler) {
    this._parentElement.addEventListener('click', e => {
      let btn = e.target.closest('.btn--delete');
      if (!btn) return;
      handler();
    });
  }
  addShoppingList(handler) {
    this._parentElement.addEventListener('click', e => {
      let btn = e.target.closest('.btn--shopping');
      if (!btn) return;

      handler();
    });
  }
  addMealPlan(handler) {
    this._parentElement.addEventListener('click', e =>{
      let btn = e.target.closest('.addMeal')
      if(!btn) return
      let vl = document.querySelector('.select-date').value;
      handler(+vl)
    })
  }
  showMealPlan() {
    this._parentElement.addEventListener('click', e => {
      let btn = e.target.closest('.show-shopping');
      if (!btn) return;
    this._windowWeeklyPlan.classList.toggle('hidden')
    });

  }
  _generateMarkup() {
    return `
      <figure class="recipe__fig">
          <img src=${this._data.imageUrl} alt=${this._data.title} class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookTime}</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button data-update="${this._data.servings - 1}" class="btn--tiny btn--update-servings">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button data-update="${this._data.servings + 1}" class="btn--tiny btn--update-servings">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}-user"></use>
            </svg>
          </div>
          <button class="btn--round btn--bookmarks">
            <svg class="">
              <use href="${icons}#icon-bookmark${this._data.bookmarked ? '-fill' : ''}"></use>
            </svg>
          </button>
          <button class="btn--round btn--shopping">
            <svg class="">
              <use href="${flatIcons}#list"></use>
            </svg>
          </button>

          <button class="btn--round btn--delete">
            <svg class="">
              <use href="${flatIcons}#delete_database"></use>
            </svg>
          </button>
        </div>
        <label for="lb_plan">Add to weekly meal plan</label>
         <select name="selectDate" class="select-date">
         <option value="0">Sunday</option>
          <option value="1">Monday</option>
          <option value="2">Tueday</option>
          <option value="3">Wednesday</option>
          <option value="4">Thursday</option>
          <option value="5">Friday</option>
          <option value="6">Satuday</option>
        </select>
        <button class="btn--round addMeal">
         <svg class="">
            <use href="${flatIcons}#add_column"></use>
            </svg>
        <button class="btn--round show-shopping">
         <svg class="">
              <use href="${flatIcons}#planner"></use>
            </svg>
        </button>
      ${this._markupIngredients()}
        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href=${this._data.sourceUrl}
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="src/img/tick.svg"></use>
            </svg>
          </a>
        </div>
        `;
  }

  _markupIngredients() {
    const toFract = function (num) {
      // Convert Decimal to Fraction
      let x = new Fraction(num);
      return x.simplify(0.001).toFraction();
    };
    const list = this._data.ingredients
      .map(entry => {
        return `<li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}_icon-check"></use>
              </svg>
              <div class="recipe__quantity">${toFract(entry.quantity)}</div>
              <div class="recipe__description">
                <span class="recipe__unit">${entry.unit}</span>
                ${entry.description}
              </div>
            </li>`;
      })
      .join('');
    return `
              <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
            ${list}
          </ul>
        </div>`;
  }
}

export default new Recipeview();
