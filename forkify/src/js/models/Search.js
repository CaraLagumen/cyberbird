//API CALL

//FOOD2FORK API KEY 048df5b48d7d93369e1b092ca5d58725
//SEARCH https://www.food2fork.com/api/search

import axios from 'axios'; //IMPORT FROM A DEPENDENCY
import { key, proxy } from '../config';
//import { key1, key2, proxy } from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults(query) {
        try {
            //USE AXIOS TO FETCH BETTER
            const result = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`); //?= TO ADD PARAMETERS'
            this.results = result.data.recipes;
            //console.log(this.results);
        } catch(error) {
            alert('getResults error');
        }  
    }
}

/*
export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults(query) {
        try {
            //USE AXIOS TO FETCH BETTER
            const result = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key1}&q=${this.query}`); //?= TO ADD PARAMETERS'
            this.results = result.data.recipes;
            //console.log(this.results);
        } catch(error) {
            try {
                const result = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key2}&q=${this.query}`);
                this.results = result.data.recipes;
            } catch(error) {
                alert('getResults error');
            }
        }  
    }
}
*/