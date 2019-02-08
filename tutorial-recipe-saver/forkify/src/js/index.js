//GLOBAL APP CONTROLLER

/*
//TEST
import str from './models/Search';

//import { add as a, multiply as m, ID } from './views/searchView';
//console.log(`using imported functions ${a(ID, 2)} and ${m(4, 8)} ${str}`);

//IMPORT EVERYTHING
import * as searchView from './views/searchView';
console.log(`using imported functions ${searchView.add(searchView.ID, 2)} and ${searchView.multiply(4, 8)} ${searchView.str}`);

//API CALL ON MAIN JS

//FOOD2FORK API KEY 048df5b48d7d93369e1b092ca5d58725
//SEARCH https://www.food2fork.com/api/search

import axios from 'axios'; //IMPORT FROM A DEPENDENCY

async function getResults(query) {
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const key = '048df5b48d7d93369e1b092ca5d58725';
    try {
        //USE AXIOS TO FETCH BETTER
        const result = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${query}`); //?= TO ADD PARAMETERS'
        const recipes = result.data.recipes;
        console.log(recipes);
    } catch(error) {
        alert(error);
    }  
}
getResults('steak and shrimp');

*/

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

//GLOBAL STATE OF APP
// SEARCH OBJ
// CURRENT RECIPE OBJ
// SHOPPING LIST OBJ
// LIKED RECIPES

//SEARCH CONTROLLER
/////////////////////////////////////////////////////////////////////////////
const state = {};
window.state = state;

const controlSearch = async () => {
    //1. GET QUERY FROM VIEW
    const query = searchView.getInput();
    
    if (query) {
        //2. IF QUERY => NEW SEARCH OBJ & ADD TO STATE
        state.search = new Search(query);
        //3. PREPARE UI FOR RESULTS
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResult);
        try {
            //4. SEARCH FOR RECIPES
            await state.search.getResults();
            //5. RENDER RESULTS ON UI
            clearLoader();
            searchView.renderResults(state.search.results);
        } catch (error) {
            alert('controlSearch error');
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    controlSearch();
});

elements.searchResultsPages.addEventListener('click', event => {
    const button = event.target.closest('.btn-inline'); //CLICK PROXIMITY
    if (button) {
        const goToPage = parseInt(button.dataset.goto, 10); //data-goto IN HTML
        searchView.clearResults();
        searchView.renderResults(state.search.results, goToPage);
    }
});

//RECIPE CONTROLLER
/////////////////////////////////////////////////////////////////////////////
const controlRecipe = async () =>  {
    //GET ID FROM URL
    const id = window.location.hash.replace('#', ''); //WINDOW LOCATION IS ENTIRE URL

    if (id) {
        //PREPARE UI FOR CHANGES
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        //HIGHLIGHT SELECTED
        if (state.search) searchView.higlightSelected(id);
        //CREATE NEW RECIPE OBJ
        state.recipe = new Recipe(id);
        try {
            //GET RECIPE DATA AND PARSE INGREDIENTS
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //CALCULATE SERVINGS AND TIME
            state.recipe.calcTime();
            state.recipe.calcServings();
            //RENDER RECIPE
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );
        } catch (error) {
            alert('controlRecipe error');
        }
    }
};

//window.addEventListener('hashchange', controlRecipe); //WHEN URL HASH CHANGES
//window.addEventListener('load', controlRecipe); //WHEN PAGE LOADS
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe)); //ONE LINE

//HANDLING RECIPE BUTTON CLICKS
elements.recipe.addEventListener('click', event => {
    if (event.target.matches('.btn-decrease, .btn-decrease *')) { //* MEANS ANY CHILD ELEM
        //DECREASE BUTTON IS CLICKED
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('decrease');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (event.target.matches('.btn-increase, .btn-increase *')) {
        //INCREASE BUTTON IS CLICKED
        state.recipe.updateServings('increase');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //ADD INGREDIENTS TO SHOPPING LIST
        controlList();
    } else if (event.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
});

//CHALLENGE: ADD INGREDIENTS INDIVIDUALLY
elements.recipe.addEventListener('click', event => {
    //FIND ID OF INDIVIDUAL INGREDIENT
    const id = event.target.closest('.recipe__item').dataset.itemid;
    const index = state.recipe.ingredients.findIndex(elem => elem.id === id);
    if (!state.list) state.list = new List();
    if (event.target.matches('.recipe__item, .recipe__item *')) {
        const elem = state.recipe.ingredients[index];
        const item = state.list.addItem(elem.count, elem.unit, elem.ingredient);
        listView.renderItem(item);
    }
});

//LIST CONTROLLER
/////////////////////////////////////////////////////////////////////////////
const controlList = () => {
    //CREATE NEW LIST IF NONE EXISTING
    if (!state.list) state.list = new List();
    //ADD EACH INGREDIENT TO THE LIST & UI
    state.recipe.ingredients.forEach(elem => {
        const item = state.list.addItem(elem.count, elem.unit, elem.ingredient);
        listView.renderItem(item);
    });
};

//HANDLE DELETE AND UPDATE LIST ITEM EVENTS
elements.shoppingList.addEventListener('click', event => {
    const id = event.target.closest('.shopping__item').dataset.itemid;
    //HANDLE DELETE BUTTON
    if (event.target.matches('.shopping__delete, .shopping__delete *')) {
        //DELETE FROM STATE
        state.list.deleteItem(id);
        //DELETE FROM UI
        listView.deleteItem(id);
    } else if (event.target.matches('.shopping__count-value')) {
        const value = parseFloat(event.target.value, 10);
        state.list.updateCount(id, value);
    }
});

//CHALLENGE: DELETE WHOLE LIST
elements.shopping.addEventListener('click', event => {
    if (!state.list) state.list = new List();
    if (state.list.items.length > 0) if (event.target.matches('.shopping__delete-all, .shopping__delete-all *')) {
    state.list.deleteAll();
    listView.deleteAll();
    }
});

//CHALLENGE: RESTORE LIST ON PAGE LOAD
window.addEventListener('load', () => {
    state.list = new List();
    //RESTORE LIST
    state.list.readStorage();
    //RENDER THE EXISTING LIST
    state.list.items.forEach(item => listView.renderItem(item));
});

//LIKES CONTROLLER
/////////////////////////////////////////////////////////////////////////////
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    //USER HAS NOT YET LIKED CURRENT RECIPE
    if (!state.likes.isLiked(currentID)) {
        //ADD LIKE TO STATE
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        //TOGGLE LIKE BUTTON
        likesView.toggleLikeBtn(true);
        //ADD LIKE TO UI LIST
        likesView.renderLike(newLike);
    //USER HAS LIKED CURRENT RECIPE
    } else {
        //REMOVE LIKE FROM STATE
        state.likes.deleteLike(currentID);
        //TOGGLE LIKE BUTTON
        likesView.toggleLikeBtn(false);
        //REMOVE LIKE FROM UI LIST
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//RESTORE LIKED RECIPES ON PAGE LOAD
window.addEventListener('load', () => {
    state.likes = new Likes();
    //RESTORE LIKES
    state.likes.readStorage();
    //TOGGLE LIKE MENU BUTTON
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    //RENDER THE EXISTING LIKES
    state.likes.likes.forEach(like => likesView.renderLike(like));
});