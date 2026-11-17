import View from './View.js';
import previewView from './previewView.js';
class SortResult extends View {
	_select = document.querySelector('#sort');
  _parentElement = document.querySelector('.results');
  _errorMessage = 'could not find recipe! please try again';
  query(){
	return this._select.value;
  }
  addHandlerSort(handler){
	this._select.addEventListener('change', (e)=> {
    let value = e.target.value; console.log(value);
		handler(value)
	})
  }
  _generateMarkup(){
	return this._data.map(result => previewView.render(result, false)).join('')
	  
  }
}
export default new SortResult();
