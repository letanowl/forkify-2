import flatIcons from '../../img/icons-flat.svg';
import View from './View.js';

class MealPlanView extends View {
	_parentElement = document.querySelector('.weekly-plan')
	_errorMessage = 'could add meal plan';
	// _data
	
	_generateMarkup(){
		return this._data.map(entry => {
			return ` <div class="menu-grid">
			<div class="day-card">
			  <div class="day-title">${entry.day}</div>
			  <div class="date">${entry.date}</div>
			  <div class="dish-name">${entry.title}
			</div>
		  </div>`
		})
		
	  }
}
export default new MealPlanView()