import icons from 'url:../../img/icons.svg';
import View from './View.js';
import previewView from './previewView.js';
class bookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMsg = ' No bookmarks yet. Find a nice recipe and bookmark it ';
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _genrateMarkupHtml() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }

  // _genrateMarkupPreview(recipe) {
  //   console.log(recipe);
  //   return `<li class="preview">
  //                   <a class="preview__link" href="#23456">
  //                     <figure class="preview__fig">
  //                       <img src="${recipe.image}" alt="Test" />
  //                     </figure>
  //                     <div class="preview__data">
  //                       <h4 class="preview__name">
  //                         ${recipe.title}
  //                       </h4>
  //                       <p class="preview__publisher">The Pioneer Woman</p>
  //                     </div>
  //                   </a>
  //                 </li>`;
  // }
}
export default new bookmarkView();
