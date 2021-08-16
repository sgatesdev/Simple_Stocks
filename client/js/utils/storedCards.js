/**
 * StoredCards manages store of cards entered by user
 */

// stocks stored in JSON array 
export default class StoredCards {
    constructor() {
        // set storeName 
        this.storeName = 'sgates_stock_app';

        // if no cards in storage, insert empty JSON object
        if(!localStorage.getItem(this.storeName)) {
            localStorage.setItem(this.storeName, JSON.stringify({}));
        }

        // pull cards out of local storage
        this.cards = JSON.parse(localStorage.getItem(this.storeName));
    }

    numCards() {
        return Object.values(this.cards).length; 
    }

    getCard(symbol) {
        return this.cards[symbol];
    }

    // returns cards object
    getCards() {
        return this.cards;
    }

    getCardsArray() {
        return Object.values(this.cards);
    }

    addCard (symbol,shares) {
        this.cards[symbol] = { symbol, shares };

        this.updateStore();
    }

    updateCard(symbol, shares) {
        this.cards[symbol] = { ...this.cards[symbol], shares };

        this.updateStore();
    }

    deleteCard (symbol) {
        let newStore = {};

        // iterate through object, skipping one we want to delete
        for (const key in this.cards) {
            if(key !== symbol) {
                newStore[key] = { ...this.cards[key] };
            }
        }
    
        // be sure to update value of this.cards
        this.cards = { ...newStore };

        this.updateStore();
    }

    updateStore() {
        localStorage.setItem(this.storeName, JSON.stringify(this.cards));
        
        console.log('Store updated!');
    }
}