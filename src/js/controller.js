import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODEL_CLOSE_SEC } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

///////////////////////////////////////
if (module.hot) {
  module.hot.accept();
}
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();
    if (model.state.search.results.length != 0)
      // 0) Update results view to mark selected search result
      resultsView.update(model.getSearchResultPage());

    bookmarkView.update(model.state.bookmarks);
    //1-loading Recipe

    await model.loadRecipe(id);

    //2-Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.log(error);
    recipeView.renderErrorMsg();
  }
};

const controlSearchResults = async function (sortType = undefined) {
  resultsView.renderSpinner();
  if (!sortType) {
    // 1- Get query from user
    const query = searchView.getQuery();
    if (!query) return;
    //2- loading search results

    await model.loadSearchResults(query);
  }
  // 3- Rendering search results
  if (sortType) {
    await controlSorting(sortType);
  }

  resultsView.render(model.getSearchResultPage(1));
  // 4- Render initial pagination buttons

  paginationView.render(model.state.search);
};
/**
 * Handles sorting of recipe search results by the specified type
 * @param {'ingredients'||'cookingTime'} sortType The type of sorting to apply.
 * @returns {Promise<Array>} a list of sorted recipe
 */
const controlSorting = async function (sortType) {
  try {
    const results = model.state.search.results;
    for (let recipe of results) {
      if (!recipe.extraLoaded) {
        const fullData = await model.loadRecipe(recipe.id, false);
        recipe.cookingTime = fullData.cookingTime;
        recipe.ingredients = fullData.ingredients;
        recipe.extraLoaded = true;
      }
    }
    if (sortType == 'ingredients')
      results.sort((a, b) => a[sortType].length - b[sortType].length);
    else results.sort((a, b) => a[sortType] - b[sortType]);
    model.state.search.results = results;
    return results;
  } catch (err) {
    throw err;
  }
};
const controlPaginationPages = function (goToPage) {
  model.state.search.page = goToPage;
  //1- Rendering search results

  resultsView.render(model.getSearchResultPage(goToPage));

  // 2- Render initial pagination buttons
  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  model.updataServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1-Add/remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmarks(model.state.recipe);
  else model.removeBookmarks(model.state.recipe.id);
  //2-Update recipe view
  recipeView.update(model.state.recipe);
  //3-Render bookmarks
  bookmarkView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.UploadRecipe(newRecipe);

    addRecipeView.renderSucessMsg();
    recipeView.render(model.state.recipe);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
    bookmarkView.render(model.state.bookmarks);
  } catch (err) {
    addRecipeView.renderErrorMsg(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandleRecipe(controlRecipes);
  recipeView.addhandlerUpdataServings(controlServings);
  recipeView.addHandleAddBookmark(controlAddBookmark);
  searchView.addHandleSearch(controlSearchResults);
  resultsView.addHandleSortResults(controlSearchResults);
  paginationView.addHandleClick(controlPaginationPages);
  paginationView.addHandlePaginationButtons(controlPaginationPages);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
