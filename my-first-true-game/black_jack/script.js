var blackJack = (function() {
    
    var data = {
        decks: [],
        bank: {
            total: 0,
            bet: 0,
            chipTotal: 0
        },
        hand: [[], []],
        handValue: [0, 0],
        winCondition: ''
    }
    
    //CREATE DECK OF CARDS
    var cards = {
        value: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10],
        card: ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'],
        suit: ['_of_diamonds', '_of_hearts', '_of_clubs', '_of_spades'],
        deck: [],
        getDeck: function(){
            this.card.forEach(elem1 => this.suit.forEach(elem2 => this.deck.push(elem1 + elem2)))
        }
    }; cards.getDeck();
    
    //ADD MORE DECKS
    var addDeck = function() {
        data.decks.push(cards.deck);
        data.decks = data.decks.flat();
        if (data.decks.length > 1) {
            data.decks = data.decks.flat();
        }
        //UI
        UI.displayDeckCount();
    }
    
    //ADD CHIPS TO BET & SUBTRACT FROM BANK
    var calcBet = function(chip) {
        data.bank.chipTotal += chip;
        if (data.bank.chipTotal <= data.bank.total) {
            data.bank.bet += data.bank.chipTotal;
            data.bank.total -= data.bank.chipTotal;
            UI.displayChipsBet(chip);
        }
        data.bank.chipTotal = 0;
        //UI
        UI.displayBet();
        UI.displayBank();
    }
    
    //RESET
    var clearBet = function() {
        data.bank.total += data.bank.bet;
        data.bank.bet = 0;
        //UI
        UI.displayBet();
        UI.displayBank();
    }
    
    //ALL IN
    var betAll = function() {
        if (data.bank.total > 0) {
            data.bank.bet += data.bank.total;
            data.bank.total = 0;
            //UI
            UI.displayBet();
            UI.displayBank();
        }
    }
    
    var drawCard = function(player) {
        //DRAW CARD
        var cardDrawn = data.decks[Math.floor(Math.random() * data.decks.length)];
        for (let i = 0; i < data.decks.length; i++) {
            if (cardDrawn === data.decks[i]) {
                data.decks.splice(i, 1);
            }
        }
        //GET VALUE OF HAND
        var matchedValue = cards.card.indexOf(cardDrawn.charAt(0));
        data.handValue[player] = parseInt(data.handValue[player]); //INT TO OVERRIDE STRING SCORE
        if (cardDrawn.charAt(0) === 'a') {
            data.handValue[player] += 1;
        } else if (cards.value[matchedValue] === undefined) {
            data.handValue[player] += 10;
        } else {
            data.handValue[player] += cards.value[matchedValue];
        }
        data.hand[player].push(cardDrawn);
        //UI
        UI.displayDeckCount();
        UI.displayScore(player);
        if (data.hand[player].length > 2) {
            UI.displayCard(player, cardDrawn);
        }
    }
    
    //CALC WINNINGS & LOSSES
    var calcBank = function(condition, bet) {
        if (condition === 'push') {
            data.bank.total;
        } else if (condition === 'win') {
            data.bank.total += bet * 2;
        } else if (condition === 'lose') {
            data.bank.total -= bet;
        }
        clearBet();
        //UI
        UI.displayBet();
        UI.displayBank();
    }
    
    return {
        data, cards, addDeck, calcBet, clearBet, betAll, drawCard, calcBank
    };
})();




var UI = (function() {
    
    var DOMstrings = {
        newGame: "new__game",
        deckCount: "deck__count",
        dealerScore: "dealer__score",
        playerScore: "player__score",
        win: "win",
        dealerCard1: "dealer__card1",
        dealerCard2: "dealer__card2",
        playerCard1: "player__card1",
        playerCard2: "player__card2",
        dealerCardContainer: "dealer__card__container",
        playerCardContainer: "player__card__container",
        dealerCard: "dealer__card",
        playerCard: "player__card",
        hit: "hit__btn",
        stand: "stand__btn",
        bank: "bank",
        allIn: "all__in__btn",
        deal: "deal__btn",
        reset: "reset__btn",
        chips: ".chips",
        chip1: "chip1",
        chip5: "chip5",
        chip25: "chip25",
        chip50: "chip50",
        chip100: "chip100",
        chip500: "chip500",
        chip1000: "chip1000",
        chipsBet: "chips__bet",
        betTotal: "bet__total"
    }
    
    var displayDeckCount = function() {
        document.getElementById(DOMstrings.deckCount).textContent = blackJack.data.decks.length;
    }
    
    var displayBet = function() {
        document.getElementById(DOMstrings.betTotal).textContent = blackJack.data.bank.bet;
    }
    
    var displayBank = function() {
        document.getElementById(DOMstrings.bank).textContent = blackJack.data.bank.total;
    }
    
    var displayChipsBet = function(chip) {
        document.getElementById(DOMstrings.chipsBet).src = 'chips/chip_' + chip + '.png';
    }
    
    var displayScore = function(player) {
        var playerHandValue = blackJack.data.handValue;
        playerHandValue[player] < 10 ? playerHandValue[player] = '0' + playerHandValue[player] : playerHandValue[player];
        if (player === 0) {
            document.getElementById(DOMstrings.playerScore).textContent = playerHandValue[0];
        } else {
            document.getElementById(DOMstrings.dealerScore).textContent = playerHandValue[1];
        }        
    }
    
    var displayHand = function(player) {
        var card1 = blackJack.data.hand[player][0];
        var card2 = blackJack.data.hand[player][1];
        if (player === 0) {
            document.getElementById(DOMstrings.playerCard1).src = 'cards/' + card1 + '.png';
            document.getElementById(DOMstrings.playerCard2).src = 'cards/' + card2 + '.png';
        } else {
            document.getElementById(DOMstrings.dealerCard1).src = 'cards/' +card1 + '.png';
            document.getElementById(DOMstrings.dealerCard2).src = 'cards/undefined.png';
        }
    }
    
    var displayCard = function(player, card) {
        var html, newHtml, elem, proximity, containerAdjust;
        if (player === 0) {
            elem = DOMstrings.playerCardContainer;
            html = '<img class="cards" id="player__card%id%" src="cards/%card%.png">';
        } else {
            elem = DOMstrings.dealerCardContainer;
            html = '<img class="cards" id="dealer__card%id%" src="cards/%card%.png">';
        }
        newHtml = html.replace('%card%', card);
        newHtml = newHtml.replace('%id%', blackJack.data.hand[player].length);
        document.getElementById(elem).insertAdjacentHTML('beforeend', newHtml);
        //MOVE THEM CLOSER
        proximity = -60 + (blackJack.data.hand[player].length - 2) * -100;
        containerAdjust = blackJack.data.hand[player].length * 23;
        if (player === 0) {
            document.getElementById('player__card__container').style.left = containerAdjust + 'px';
            document.getElementById('player__card' + blackJack.data.hand[player].length).style.left = proximity + 'px';
        } else {
            document.getElementById('dealer__card__container').style.left = containerAdjust + 'px';
            document.getElementById('dealer__card' + blackJack.data.hand[player].length).style.left = proximity + 'px';
        }
    }
    
    var resetCards = function() {
        var playerDiv = '<div id="player__card__container"><img class="cards" id="player__card1" src="cards/undefined.png"><img class="cards" id="player__card2" src="cards/undefined.png"></div>';
        var dealerDiv = '<div id="dealer__card__container"><img class="cards" id="dealer__card1" src="cards/undefined.png"><img class="cards" id="dealer__card2" src="cards/undefined.png"></div>';
        //REMOVE OLD CARDS BEFORE ADDING NEW ONES
        if (blackJack.data.hand[0].length > 2 && blackJack.data.hand[1].length > 2) {
            document.getElementById(DOMstrings.playerCardContainer).remove();
            document.getElementById(DOMstrings.dealerCardContainer).remove();
            document.querySelector('.player__cards').insertAdjacentHTML('beforeend', playerDiv);
            document.querySelector('.dealer__cards').insertAdjacentHTML('beforeend', dealerDiv);
        } else if (blackJack.data.hand[0].length > 2) {
            document.getElementById(DOMstrings.playerCardContainer).remove();
            document.querySelector('.player__cards').insertAdjacentHTML('beforeend', playerDiv);
        } else if (blackJack.data.hand[1].length > 2) {
            document.getElementById(DOMstrings.dealerCardContainer).remove();
            document.querySelector('.dealer__cards').insertAdjacentHTML('beforeend', dealerDiv);
        }
    }
    
    return {
        displayDeckCount, displayBet, displayBank, displayChipsBet, displayHand, displayScore, displayCard, resetCards,
        
        getDOMstrings: function() {
            return DOMstrings;
        }
    }
})();




var controller = (function(cardCounter, UI) {
    
    //1. PICK CHIPS OR DELETE CHIPS UPDATES BANK
    var DOM = UI.getDOMstrings();
    var setupEventListeners = function() {
        //NEW GAME
        document.getElementById(DOM.newGame).addEventListener('click', newGame);
        //DECK
        document.getElementById(DOM.deckCount).addEventListener('click', blackJack.addDeck);
        //CHIPS
        document.getElementById(DOM.chip1).addEventListener('click', () => blackJack.calcBet(1));
        document.getElementById(DOM.chip5).addEventListener('click', () => blackJack.calcBet(5));
        document.getElementById(DOM.chip25).addEventListener('click', () => blackJack.calcBet(25));
        document.getElementById(DOM.chip50).addEventListener('click', () => blackJack.calcBet(50));
        document.getElementById(DOM.chip100).addEventListener('click', () => blackJack.calcBet(100));
        document.getElementById(DOM.chip500).addEventListener('click', () => blackJack.calcBet(500));
        document.getElementById(DOM.chip1000).addEventListener('click', () => blackJack.calcBet(1000));
        //ALL IN, RESET, OR DEAL
        document.getElementById(DOM.reset).addEventListener('click', blackJack.clearBet);
        document.getElementById(DOM.allIn).addEventListener('click', blackJack.betAll);
        document.getElementById(DOM.deal).addEventListener('click', play);
        //HIT OR STAND
        document.getElementById(DOM.hit).addEventListener('click', getHit);
        document.getElementById(DOM.stand).addEventListener('click', dealerTurn);
    }
    
    //2. DISABLE BUTTONS ACCORDING TO DEAL PHASE
    var setPhase = function(dealPhase) {
        if (dealPhase) {
            document.getElementById(DOM.chip1).disabled = false;
            document.getElementById(DOM.chip5).disabled = false;
            document.getElementById(DOM.chip25).disabled = false;
            document.getElementById(DOM.chip50).disabled = false;
            document.getElementById(DOM.chip100).disabled = false;
            document.getElementById(DOM.chip500).disabled = false;
            document.getElementById(DOM.chip1000).disabled = false;
            
            document.getElementById(DOM.allIn).disabled = false;
            document.getElementById(DOM.deal).disabled = false;
            document.getElementById(DOM.reset).disabled = false;
            
            document.getElementById(DOM.hit).disabled = true;
            document.getElementById(DOM.stand).disabled = true;
        } else {
            document.getElementById(DOM.chip1).disabled = true;
            document.getElementById(DOM.chip5).disabled = true;
            document.getElementById(DOM.chip25).disabled = true;
            document.getElementById(DOM.chip50).disabled = true;
            document.getElementById(DOM.chip100).disabled = true;
            document.getElementById(DOM.chip500).disabled = true;
            document.getElementById(DOM.chip1000).disabled = true;
            
            document.getElementById(DOM.allIn).disabled = true;
            document.getElementById(DOM.deal).disabled = true;
            document.getElementById(DOM.reset).disabled = true;
            
            document.getElementById(DOM.hit).disabled = false;
            document.getElementById(DOM.stand).disabled = false;
        }
    }
    
    //3. DEAL
    var play = function() {
        setPhase(false);
        if (blackJack.data.bank.bet > 0) {
            getPlayerHand();
        }
    }
    
    //4. DRAW 2 CARDS, HIDE ONE FROM DEALER & UPDATE SCORES & DECK
    var blackJackCondition = function(player) {
        var regex = /[kqj]/;
        if (blackJack.data.hand[player][0].charAt(0) === 'a' && blackJack.data.hand[player][1].charAt(0).match(/[kqj]/)) {
            document.getElementById(DOM.win).textContent = 'BLACK JACK';
            blackJack.data.handValue[player] = 21;
            player === 0 ? document.getElementById(DOM.playerScore).textContent = '21' : document.getElementById(DOM.dealerScore).textContent = '21'; //UI
            player === 0 ? blackJack.data.winCondition = 'win' : blackJack.data.winCondition = 'lose';
            nextRound();
        } else if (blackJack.data.hand[player][0].charAt(0).match(/[kqj]/) && blackJack.data.hand[player][1].charAt(0) === 'a') {
            document.getElementById(DOM.win).textContent = 'BLACK JACK';
            blackJack.data.handValue[player] = 21;
            player === 0 ? document.getElementById(DOM.playerScore).textContent = '21' : document.getElementById(DOM.dealerScore).textContent = '21'; //UI
            player === 0 ? blackJack.data.winCondition = 'win' : blackJack.data.winCondition = 'lose';
            nextRound();
        }
    }
    
    var getPlayerHand = function() {
        blackJack.drawCard(0);
        blackJack.drawCard(0);
        blackJack.drawCard(1);
        UI.displayHand(0);
        UI.displayHand(1);
        blackJackCondition(0);
    }
    
    //5. HIT CONDITIONS
    var getHit = function() {
        setPhase(false);
        blackJack.drawCard(0);
        UI.displayDeckCount();
        var playerHand = blackJack.data.handValue[0];
        if (playerHand === 21) {
            document.getElementById(DOM.win).textContent = 'WIN';
            blackJack.data.winCondition = 'win';
            document.getElementById(DOM.hit).disabled = true;
            nextRound();
        } else if (playerHand > 21) {
            document.getElementById(DOM.win).textContent = 'BUST';
            blackJack.drawCard(1); //DEALER REVEAL CARD2
            document.getElementById(DOM.dealerCard2).src = 'cards/' + blackJack.data.hand[1][1] + '.png';
            blackJack.data.winCondition = 'lose';
            document.getElementById(DOM.hit).disabled = true;
            nextRound();
        }
    }
    
    var dealerTurn = function() {
        document.getElementById(DOM.hit).disabled = true;
        document.getElementById(DOM.stand).disabled = true;
        //6. WHEN STAND, REVEAL DEALER CARD
        blackJack.drawCard(1);
        document.getElementById(DOM.dealerCard2).src = 'cards/' + blackJack.data.hand[1][1] + '.png';
        blackJackCondition(1);
        //7. DEALER ALGORITHM
        var draw = function() {
            if (blackJack.data.handValue[1] !== blackJack.data.handValue[0]) {
                setTimeout(function() {
                    if (blackJack.data.handValue[1] < 17 && blackJack.data.handValue[1] < blackJack.data.handValue[0]) {
                        blackJack.drawCard(1);
                    } else if (blackJack.data.handValue[1] < 21 && blackJack.data.handValue[1] < blackJack.data.handValue[0]) {
                        blackJack.drawCard(1);
                    } else if (blackJack.data.handValue[1] < 21 && blackJack.data.handValue[1] === blackJack.data.handValue[0]) {
                        blackJack.drawCard(1);
                    }
                }, 1000);
            }
        }
        for (let i = 0; i < 10; i++) { draw(); }
        //8. WINNER OF ROUND
        setTimeout(function() {
            if (blackJack.data.handValue[1] === 21) {
                document.getElementById(DOM.win).textContent = 'LOSE';
                blackJack.data.winCondition = 'lose';
            } else if (blackJack.data.handValue[1] < 21 && blackJack.data.handValue[1] > blackJack.data.handValue[0]) {
                document.getElementById(DOM.win).textContent = 'LOSE';
                blackJack.data.winCondition = 'lose';
            } else if (blackJack.data.handValue[1] === blackJack.data.handValue[0]) {
                document.getElementById(DOM.win).textContent = 'PUSH';
                blackJack.data.winCondition = 'push';
            } else if (blackJack.data.handValue[1] < 21 && blackJack.data.handValue[1] < blackJack.data.handValue[0]) {
                document.getElementById(DOM.win).textContent = 'WIN';
                blackJack.data.winCondition = 'win';
            } else if (blackJack.data.handValue[1] > 21) {
                document.getElementById(DOM.win).textContent = 'WIN';
                blackJack.data.winCondition = 'win';
            }
            nextRound();
        }, 1000);
    }
    
    //9. ADD WINNINGS OR SUBTRACT LOSSES & PLAY AGAIN
    var nextRound = function() {
        document.getElementsByTagName('button').disabled = false;
        document.getElementsByTagName('input').disabled = false;
        setTimeout(function() {
            UI.resetCards();
            document.getElementById(DOM.win).textContent = '';
            blackJack.calcBank(blackJack.data.winCondition, blackJack.data.bank.bet);
            blackJack.data.hand = [[], []];
            blackJack.data.handValue = [0, 0];
            UI.displayScore(0);
            UI.displayScore(1);
            UI.displayHand(0);
            UI.displayHand(1);
            //LOW DECK
            if (blackJack.data.decks.length < 10) {
                blackJack.addDeck();
            }
            //BANKRUPT
            if (blackJack.data.bank.total === 0) {
                document.getElementById(DOM.win).textContent = 'BANKRUPT';
            }
            setPhase(true);
        }, 3000);
    }
    
    //10. NEW GAME
    var newGame = function() {
        document.getElementById(DOM.win).textContent = '';
        blackJack.data.bank.bet = 0;
        blackJack.data.bank.total = 1000;
        blackJack.data.hand = [[], []];
        blackJack.data.handValue = [0, 0];
        UI.displayBet();
        UI.displayBank();
        UI.displayHand(0);
        UI.displayHand(1);
        UI.displayScore(0);
        UI.displayScore(1);
        setPhase(true);
    }
    
    return {
        init: function() {
            console.log('Game has started.');
            blackJack.data.decks = [];
            blackJack.addDeck();
            newGame();
            setupEventListeners();
        }
    }
})(blackJack, UI);

console.log('Welcome to Cara\'s first app ever. Hope you enjoy!');
controller.init();