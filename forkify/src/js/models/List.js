import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        this.persistData();
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(elem => elem.id === id);
        this.items.splice(index, 1);
        this.persistData();
    }

    updateCount(id, newCount) {
        this.items.find(elem => elem.id === id).count = newCount;
        this.persistData();
    }

    deleteAll() {
        this.items = [];
        this.persistData();
    }

    persistData() {
        localStorage.setItem('list', JSON.stringify(this.items))
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('list'));
        if (storage) this.items = storage;
    }
}