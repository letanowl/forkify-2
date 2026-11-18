import * as model from './models.js';
import { MODAL_CLOSE_SEC } from './config.js';
import ReceipView from './views/receipView.js';
import SearchView from './views/searchView.js';
import ResultView from './views/resultView.js';
import PaginationView from './views/paginationView.js';
import BookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import receipView from './views/receipView.js';
import bookmarksView from './views/bookmarksView.js';
import sortResult from './views/sortResult.js';
import ShoppingList from './views/shoppingList.js';
import mealPlanView from './views/mealPlanView.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io
///////////////////////////////////////

const controllRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // Render spiner
    ReceipView.renderSpiner();
    //0 Update result view active selected
    ResultView.update(model.getSearchResultPage());

    //1 Load recipe
    await model.loadRecipe(id);
    console.log(model.state.recipe);
    //2 Render recipe
    ReceipView.render(model.state.recipe);
    //3 update bookmarks list
    BookmarksView.update(model.state.bookmarks);

    // nutri food
    let data = await model.nutrifood()
  } catch (error) {
    console.error(error);
    ReceipView.renderError();
  }
};
const controllSearchResults = async function () {
  try {
    ResultView.renderSpiner();
    // get value input search
    let query = SearchView.getQuery();
    if (!query) return;

    // render result search
    await model.loadSearchRecipe(query);
    // show result
    ResultView.render(model.getSearchResultPage(1));
    // render initial button pagination
    PaginationView.render(model.state.search);

    // Sort
    //await model.sortSearchRecipes(query)
  } catch (error) {
    console.error(error);
    ResultView.renderError();
  }
};
const controllPagination = function (gotoPage) {
  // show NEW result
  ResultView.render(model.getSearchResultPage(gotoPage));

  // render NEW button pagination
  PaginationView.render(model.state.search);
};
const controllServings = function (newServings) {
  // Update servings state
  model.updateServings(newServings);
  // Update servings render
  ReceipView.update(model.state.recipe);
  ReceipView.render(model.state.recipe);
};
const controlAddBookmarks = function () {
  // Add or Delete Bookmark
  if (!model.state.recipe.bookmarked) model.addBookmarks(model.state.recipe);
  else model.deleteBookmarks(model.state.recipe.id);
  // Update Receipe view
  ReceipView.update(model.state.recipe);
  // Render Bookmarks
  BookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  BookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    //render spiner
    addRecipeView.renderSpiner();

    //Upload new Recipe data
    await model.uploadRecipe(newRecipe);

    //Render recipe
    receipView.render(model.state.recipe);

    //Message success
    addRecipeView.renderMessage();

    //Render Bookmark
    bookmarksView.render(model.state.bookmarks);

    //change ID URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close Form
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const controlSortResult = async function (sorter) {
  let newResult = await model.sortSearchRecipes(sorter);
  sortResult.render(newResult);
};
const controlDeleteRecipe = async function () {
  const id = window.location.hash.slice(1);
  await model.deleteRecipe(id);
};
const controlShopping = function(){
  model.addShoppingList(model.state.recipe)
  ShoppingList.render(model.state.recipe.ingredients)
};
const controlPlanList = function(day){
  model.addMealPlan(day)
  mealPlanView.render(model.state.meal)
};
const newFeature = (params) => {
  console.log('wellcome');
}
const init = function () {
  BookmarksView.addHandlerRender(controlBookmarks);
  ReceipView.addHandlerender(controllRecipe);
  ReceipView.addHandlerUpdateServings(controllServings);
  SearchView.addhandlerSearch(controllSearchResults);
  PaginationView.addHandlerClick(controllPagination);
  ReceipView.addHandlerAddBookmarks(controlAddBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  addRecipeView.addFieldIngredients();
  sortResult.addHandlerSort(controlSortResult);
  receipView.deleteHandlerRecipe(controlDeleteRecipe);
  receipView.addShoppingList(controlShopping)
  receipView.showMealPlan()
  receipView.addMealPlan(controlPlanList)
  newFeature()
};
init();
