import flatIcons from '../../img/icons-flat.svg'

class ShoppingList {
	_select = document.querySelector('.sort-result')
	// _data
	render(data){
		this._data = data
		let markup = this._generateMakup()
		this._select.insertAdjacentHTML('afterend', markup)
	}
	_generateMakup(){
		return `
		 <div class="shopping">
          <ul class="shopping-list">
           ${this._data.map(ing => {
			return `<li>${ing.description}:  ${ing.quantity}${ing.unit}</li>`
		   })}
          </ul>
        </div>`
	}
}
export default new ShoppingList()