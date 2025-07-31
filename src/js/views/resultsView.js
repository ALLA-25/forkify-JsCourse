import icons from 'url:../../img/icons.svg';
import View from './View.js';
import previewView from './previewView.js';
class resultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMsg = 'No recipes found for your query , Please try again!';
  _successMsg = '';
  _max = '';
  _genrateMarkupHtml() {
    return [
      `
      <div class=" sortBtn"> 
       <button class="sortByCookingTime ">
           
            <span>sort by cooking time</span>
          </button> <button class="sortByIngredients">
           
            <span>sort by ingredients</span>
          </button>
          
          </div>
          `,
      this._data
        .map(result => {
          return previewView.render(result, false);
        })
        .join(''),
    ];
  }
  addHandleSortResults(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const sortTimeBtn = e.target.closest('.sortByCookingTime ');
      const sortIngredientsBtn = e.target.closest('.sortByIngredients ');
      let sortType;
      if (sortTimeBtn && !sortIngredientsBtn) sortType = 'cookingTime';
      if (!sortTimeBtn && sortIngredientsBtn) sortType = 'ingredients';
      if (!sortTimeBtn && !sortIngredientsBtn) return;
      handler(sortType);
    });
  }
}
export default new resultsView();
