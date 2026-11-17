import View from './View.js';
import previewView from './previewView.js';
class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'could not find recipe! please try again';
  _generateMarkup(){
	return this._data.map(result => previewView.render(result, false)).join('')
	  
  }
}
export default new ResultView();
