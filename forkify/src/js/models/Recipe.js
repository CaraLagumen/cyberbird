import axios from 'axios';
import uniqid from 'uniqid';
import { key, proxy } from '../config';
//import { key1, key2, proxy } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const result = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = result.data.recipe.title;
            this.author = result.data.recipe.publisher;
            this.img = result.data.recipe.image_url;
            this.url = result.data.recipe.source_url;
            this.ingredients = result.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
            alert('getRecipe error');
        }
    }
    
    /*
    async getRecipe() {
        try {
            const result = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key1}&rId=${this.id}`);
            this.title = result.data.recipe.title;
            this.author = result.data.recipe.publisher;
            this.img = result.data.recipe.image_url;
            this.url = result.data.recipe.source_url;
            this.ingredients = result.data.recipe.ingredients;
        } catch (error) {
            try {
                const result = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key2}&rId=${this.id}`);
                this.title = result.data.recipe.title;
                this.author = result.data.recipe.publisher;
                this.img = result.data.recipe.image_url;
                this.url = result.data.recipe.source_url;
                this.ingredients = result.data.recipe.ingredients;
            } catch (error) {
                console.log(error);
                alert('getRecipe error');
            }
        }
    }
    */

    calcTime() {
        //ESTIMATE 15 MIN PER 3 INGREDIENTS
        const numIngredients = this.ingredients.length;
        const periods = Math.ceil(numIngredients / 3);
        this.time = periods * 15;
    }

    calcServings() {
        const countArr = this.ingredients.map(elem => elem.count);
        const avgCount = countArr.reduce((elem1, elem2) => elem1 + elem2) / this.ingredients.length;
        if (Math.round(avgCount) < 1) {
            this.servings = 1;
        } else {
            this.servings = Math.round(avgCount);
        }
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds', 'pound'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'lbs', 'lb', 'kg', 'g'];

        const newIngredients = this.ingredients.map(elem => {
            //1. UNIFORM UNITS
            let ingredient = elem.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });
            //2. REMOVE PARENTHESES
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
            //3. PARSE INGREDIENTS INTO COUNT, UNIT, INGREDIENT
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(elem2 => unitsShort.includes(elem2));
            let objIng;
            if (unitIndex > -1) {
                //THERE IS A UNIT
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+')); //EVAL CALCULATES FOR YOU
                }
                objIng = {
                    id: uniqid(),
                    count,
                    unit : arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }
            } else if (parseInt(arrIng[0], 10)) {
                //THERE IS NO UNIT, BUT 1ST ELEM IS A NUM
                objIng = {
                    id: uniqid(),
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                //THERE IS NO UNIT & NO NUM
                objIng = {
                    id: uniqid(),
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        //SERVINGS
        const newServings = type === 'decrease' ? this.servings - 1 : this.servings + 1;
        //INGREDIENTS
        this.ingredients.forEach(ingredient => {
            ingredient.count *= (newServings / this.servings);
        })
        this.servings = newServings;
    }
}