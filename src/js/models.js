import 'core-js/stable';
import { async } from 'regenerator-runtime/runtime';
import {
  API_URL,
  RES_PER_PAGE,
  KEY,
} from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
  meal: [],
};
const presistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
const createRecipeObject = function (data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    imageUrl: recipe.image_url,
    cookTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}`);
    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      imageUrl: recipe.image_url,
      cookTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      servings: recipe.servings,
    };
    if (state.bookmarks.some(boomark => boomark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    throw error;
    console.error(error);
  }
};

export const loadSearchRecipe = async function (key) {
  try {
    const data = await AJAX(`${API_URL}?search=${key}&key=${KEY}`);
    const search = data.data.recipes;

    state.search.results = search.map(entry => {
      return {
        id: entry.id,
        title: entry.title,
        publisher: entry.publisher,
        imageUrl: entry.image_url,
        ...(entry.key && { key: entry.key }),
      };
    });
  } catch (error) {
    console.error(error);
  }
  state.search.page = 1;
};
export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage; //0
  const end = page * state.search.resultPerPage; //9

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServing) {
  state.recipe.ingredients.forEach(ing => {
    return (ing.quantity = (ing.quantity * newServing) / state.recipe.servings);
  });
  state.recipe.servings = newServing;
};
export const addBookmarks = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  presistBookmarks();
};
export const deleteBookmarks = function (id) {
  let index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);
  state.recipe.bookmarked = false;
  presistBookmarks();
};
export const uploadRecipe = async function (newRecipe) {
  try {
    let dataForm = Object.entries(newRecipe);
    let ingredientsAr = dataForm.filter(entry =>
      entry[0].startsWith('ingredient'),
    ); //&& entry[1] !== '')
    let ingredients = [];
    for (let i = 1; i <= ingredientsAr.length / 3; i++) {
      let [quantity, unit, description] = [
        newRecipe[`ingredient-${i}_quantity`],
        newRecipe[`ingredient-${i}_unit`],
        newRecipe[`ingredient-${i}_description`],
      ];
      if ([quantity, unit, description].every(x => x !== ''))
        ingredients.push({
          quantity: quantity ? +quantity : null,
          unit,
          description,
        });
      else throw new Error('Ingredients must not Emty');
    }
    let recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmarks(state.recipe);

    // check emty ingredients
    //let emtyCheck = ingredients.map(ing => ing.some(i => i ===''))
    //if(emtyCheck.some(i => i === true)){
    //  throw new Error('Ingredients must not Emty')
    //}
    //else{
    //   ingredients = ingredients.map(ing => {
    //    let ingArr = ing[1]
    //      .replaceAll(' ', '')
    //      .split(',')
    //      .map(el =>el.trim());

    //    let [quantity, unit, description] = ingArr;
    //    if(!Number.isNaN(quantity) && typeof unit === 'string' && typeof description === 'string')
    //      return { quantity: quantity ? +quantity : null, unit, description };
    //    else{
    //      throw new Error('Ingredients wrong format');
    //    }
    //  });
    ////let recipe = {
    ////  title: newRecipe.title,
    ////  source_url: newRecipe.sourceUrl,
    ////  image_url: newRecipe.image,
    ////  publisher: newRecipe.publisher,
    ////  cooking_time: +newRecipe.cookingTime,
    ////  servings: +newRecipe.servings,
    ////  ingredients,
    ////};
    ////console.log(ingredients);
    ////const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    ////state.recipe = createRecipeObject(data);
    ////addBookmarks(state.recipe);
    //}
  } catch (error) {
    throw error;
  }
};
export const sortSearchRecipes = async function (sorter) {
  let results = await Promise.all(
    state.search.results.map(async rs => {
      const data = await AJAX(`${API_URL}/${rs.id}`);
      const { recipe } = data.data;
      return {
        ...rs,
        duration: recipe.cooking_time,
        numberIngredients: recipe.ingredients.length,
      };
    }),
  );
  if (sorter === 'duration') {
    results.sort((a, b) => a.duration - b.duration);
    return results;
  }
  if (sorter === 'ingredients') {
    results.sort((a, b) => a.numberIngredients - b.numberIngredients);
    return results;
  }
};
export const deleteRecipe = async function (id) {
  await fetch(`https://forkify-api.jonas.io/api/v2/recipes/${id}?key=${KEY}`, {
    method: 'DELETE',
  });
};
export const addShoppingList = function (recipe) {
  let ing = recipe.ingredients;
  console.log(ing);
};
export const addMealPlan = function (day) {
  const date = new Date();
  const currDay = date.getDay();
  let diff = day - currDay;
  if (diff < 0) diff += 7;

  const dateSelect = new Date();
  dateSelect.setDate(date.getDate() + diff);

  let lastMeal = state.meal.findLast(en => en);
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Satuday',
    'Sunday',
  ];
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  state.meal.push({
    id: lastMeal ? lastMeal : 1,
    day: dayNames[day],
    date: dateSelect.getDate(),
    month: monthNames[dateSelect.getMonth()],
    ...state.recipe,
  });
  console.log(state.meal);
};

export const nutrifood = async function () {
  try {
    let ingArr = state.recipe.ingredients.map(ing => {
      return `${ing.quantity} ${ing.unit} ${ing.description}`
    })
    const response = await fetch(
      'https://api.spoonacular.com/recipes/analyze?includeNutrition=true',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '07d719cb9fa2485f9f8ef91fbeca6be2'

        },
        body: JSON.stringify({
            title: state.recipe.title,
            servings: 2,
            ingredients:  ingArr,
            instructions:
              'Bring a large pot of water to a boil and season generously with salt. Add the pasta to the water once boiling and cook until al dente. Reserve 2 cups of cooking water and drain the pasta. ',
          })
      },
    );
    let res = await response.json()
    let data = await res
    return data
    
  } catch (error) {
    console.error(error);
  }
};
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();
