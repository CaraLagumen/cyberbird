/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var scores, roundScore, activePlayer, gamePlaying, lastDice1, lastDice2, winScore;

winScore = 100;
gamePlaying = false;

//SET WIN SCORE
document.querySelector('.btn-win').addEventListener('click', function() {
    winScore = document.getElementById('win').value;
    document.querySelector('.btn-win').style.display = 'none';
    document.querySelector('.btn-set').style.display = 'block';
})

function init() {
    scores = [0, 0];
    activePlayer = 0;
    roundScore = 0;
    gamePlaying = true;
    
    document.querySelector('.btn-win').style.display = 'block';
    document.querySelector('.btn-set').style.display = 'none';
    document.querySelector('.dice-1').style.display = 'none';
    document.querySelector('.dice-2').style.display = 'none';

    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-' + activePlayer + '-panel').classList.add('active');

    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';
}

init();

//ROLL DICE
document.querySelector('.btn-roll').addEventListener('click', function() {
    if (gamePlaying) {
        //CREATE RANDOM NUM
        document.querySelector('.btn-win').style.display = 'none';
        document.querySelector('.btn-set').style.display = 'block';
        var dice1 = Math.floor(Math.random() * 6) + 1;
        var dice2 = Math.floor(Math.random() * 6) + 1;
        //DISPLAY RESULT
        var dice1DOM = document.querySelector('.dice-1');
        dice1DOM.style.display = 'block';
        dice1DOM.src = 'dice-' + dice1 + '.png';
        var dice2DOM = document.querySelector('.dice-2');
        dice2DOM.style.display = 'block';
        dice2DOM.src = 'dice-' + dice2 + '.png';
        //MAIN STATEMENT
        console.log(dice1, lastDice1, dice2, lastDice2, activePlayer);
        if ((dice1 === 6 && lastDice1 === 6)
            || (dice2 === 6 && lastDice2 === 6)
            || (dice1 === 6 && lastDice2 === 6)
            || (dice2 === 6 && lastDice1 === 6)) {
            //RESET SCORE & NEXT PLAYER IF SIXES
            scores[activePlayer] = 0;
            document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
            nextPlayer();
        } else if (dice1 === 1 || dice2 ===1) {
            //NEXT PLAYER IF ONE ON EITHER
            nextPlayer();
        } else {
            //UPDATE ROUND SCORE IF NUM !== 1
            roundScore += dice1 + dice2;
            lastDice1 = dice1;
            lastDice2 = dice2;
            document.querySelector('#current-' + activePlayer).textContent = roundScore;
            
        }
    }
});

function nextPlayer() {
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
    roundScore = 0;
        
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
        
    document.querySelector('.dice-1').style.display = 'none';
    document.querySelector('.dice-2').style.display = 'none';
}

//HOLD
document.querySelector('.btn-hold').addEventListener('click', function() {
    if (gamePlaying) {
        //ADD CURRENT SCORE TO GLOBAL SCORE
        scores[activePlayer] += roundScore;
        //UPDATE UI
        document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
        //CHECK IF PLAYER WON THE GAME
        if (scores[activePlayer] >= winScore) {
            document.querySelector('#name-' + activePlayer).textContent = 'WINNER!';
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            document.querySelector('.player-' + activePlayer + '-panel').classList.toggle('active');
            document.querySelector('.dice-1').style.display = 'none';
            document.querySelector('.dice-2').style.display = 'none';
            gamePlaying = false;
        } else {
            //NEXT PLAYER
            nextPlayer();
        }
    }
})

//NEW GAME
document.querySelector('.btn-new').addEventListener('click', init);