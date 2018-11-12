'use strict';

//gather all the list under <ul> LI
const deck = document.querySelector('.deck');
//gather all cards into array
const card = document.getElementsByClassName('card');
const allCards = [...card]; 
//access to all open cards
let openCards = [];
//access to the matching cards
let cardMatch = [];

//variable for timer
let timer = document.querySelector('.timer');

//prepping moves & rename .moves
let moves = 0;
let countMoves = document.querySelector('.moves');
moves = countMoves.innerHTML;

//set stars 
const stars = document.querySelector('.stars').children;
let starCount = 3;

//set timer and moves
let minute = 0;
let second = 0;
let start;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//shuffle deck, new deck 
function startGame () {
	//shuffle deck
	let shuffles = shuffle(allCards);
	for (let i = 0; i < allCards.length; i++) {
		deck.innerHTML = "";
		[].forEach.call(shuffles, function(cardsAA) {
			deck.appendChild(cardsAA);
		});
		allCards[i].classList.remove('show', 'open', 'match', 'disabled');
	}
	// reset moves
    moves = 0;
    countMoves.innerHTML = moves;

    // reset rating
    for (var i= 0; i < stars.length; i++) {
        stars[i].style.display = "inline-block";
    }

    //reset timer
    second = 0;
    minute = 0; 
    timer.innerHTML = "00:00 ";
    clearInterval(start);

}

//loading page for game to start
window.onload = startGame();

//flip & open cards
function showCard (card) {
	card.classList.toggle ('open');
	card.classList.toggle ('show');
	card.classList.toggle ('disabled');
}

//click cards
//add eventListenerloop where each card will show 
for (let i = 0; i < allCards.length; i++) {
	allCards[i].addEventListener('click', cardClicked);
}


function cardClicked(e) {
	//do nothing when 2 cards open
	if (openCards.length >= 2 || e.target.classList.contains('open') || e.target.nodeName !== 'LI') {
		return;
	}
	
	//do nothing when card match
	if (e.target.classList.contains('match')) {
		return;
	}
	
    if (moves === 0) {
    	startTimer();
    }
	
	addMoves();
	showCard(e.target);
	checkCard(e.target);
	adjustStars();
	congrats();
}

function checkCard(card) {
	if (openCards.length === 1) {
		//prevent other cards been clicked
		openCards[0].style.pointerEvents = "none;"
	}

	openCards.push(card); 
	if (openCards.length >= 2) {
		if (openCards[0].firstElementChild.classList[1] === openCards[1].firstElementChild.classList[1]) {
   		yesMatch();
	   	}
	   	else {
	   		noMatch();
	   		//return it to normal
	   		openCards[0].style.pointerEvents = "auto;"
	   	}  
	}
}



function yesMatch () {
	openCards[0].classList.add('match');
    openCards[1].classList.add('match');
    openCards[0].classList.remove('show', 'open');
    openCards[1].classList.remove('show', 'open');
    cardMatch.push(openCards[0]);
	cardMatch.push(openCards[1]);
    openCards = [];
}

function noMatch() {
    openCards[0].classList.add('unmatch');
    openCards[1].classList.add('unmatch');

    setTimeout(function() {
        openCards[0].classList.remove('show', 'open', 'unmatch');
        openCards[1].classList.remove('show', 'open', 'unmatch');
        openCards = [];
    }, 1000);
}

//add moves 
function addMoves () {
	moves++;
	countMoves.innerHTML = moves;
}

//to start time and moves
function startTimer () {
    start = setInterval (function () {
    if (moves >= 1) {
      timer.innerHTML = minute+ "0:"+second;
      second++;
      if (second == 60) {
        minute++;
        second = 0;
      }
      if (minute == 60) {
        minute = 0; 
      }
    }
  }, 1000);
}


//drease stars when move count increase
function adjustStars () {
	if (moves === 30 ) {
		starCount = 2;
		stars[0].style.display = "none";
	}
	if (moves === 50) {
		starCount = 1;
    	stars[1].style.display = "none";
  }
}

//congrats modal
function congrats () {
	if (cardMatch.length === 16) {
		stopTimer();
		popUp();
	}
}

function popUp () {
	//popup modal
	let popUp = document.querySelector('.pop-up');
	
	document.querySelector('.pop-up').style.display = 'block';
	
	const finalTime = document.querySelector('.final-time');
	const finalMoves = document.querySelector('.final-move');
	document.querySelector('.final-stars').innerHTML = document.querySelector('.stars').innerHTML;

	//final score 
	finalTime.innerText = "time: "+timer.innerText;
	finalMoves.innerText = "moves: " +moves;
	
	exitPop();
}

function stopTimer () {
	clearInterval(start);
}

//reset game
function exitPop () {
	document.querySelector('.restart-game').addEventListener("click", function(){
		document.querySelector('.pop-up').style.display = 'none';
		//empty cards 
		cardMatch = [];
		openCards = [];
    	startGame();
	});
}

//reset buttom next to timer
document.querySelector('.restart').addEventListener("click", function(){
    startGame();
});