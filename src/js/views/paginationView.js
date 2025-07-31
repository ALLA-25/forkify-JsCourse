import icons from 'url:../../img/icons.svg';
import View from './View.js';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _v = [];

  addHandleClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.page');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      if (goToPage == 0) return;
      handler(goToPage);
    });
  }
  addHandlePaginationButtons(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.pagination__btn');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      if (goToPage == 0) return;
      handler(goToPage);
    });
  }
  _genrateMarkupHtml() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    if (!numPages) return '';
    return [
      this._PaginationPrevBtnMarkup(),
      `<div  class=" ">
            ${this._AllPagesBtnMarkup(numPages).join('')}
           
          </div>`,
      this._PaginationNextBtnMarkup(),
    ];
  }

  _AllPagesBtnMarkup(numPages) {
    const arr = [];
    for (let index = 1; index <= numPages; index++) {
      arr.push(
        `<span data-goto=" ${index}" class="page btn--inline">${index}</span>`
      );
    }

    return arr;
  }

  _PaginationPrevBtnMarkup() {
    if (this._data.page == 1) return;
    return `<button data-goto=" ${
      this._data.page - 1
    }" class="btn--inline  pagination__btn pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
           
          </button>`;
  }
  _PaginationNextBtnMarkup() {
    if (
      this._data.page ==
      Math.ceil(this._data.results.length / this._data.resultsPerPage)
    )
      return;
    return `<button data-goto=" ${
      this._data.page + 1
    }"  class="btn--inline pagination__btn pagination__btn--next">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
            
          </button>`;
  }
}
export default new PaginationView();
