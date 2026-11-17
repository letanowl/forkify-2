class SearchView{
	_parentElement = document.querySelector('.search');
	
	getQuery(){
		return this._parentElement.querySelector('.search__field').value; // get inptunt search value
	}
	addhandlerSearch(handler){
		this._parentElement.addEventListener('submit',  (e)=>{
			e.preventDefault()
			handler();
			this._clear()
		})
	}
	_clear(){
		return this._parentElement.querySelector('.search__field').value = '';
	}
}
export default new SearchView();