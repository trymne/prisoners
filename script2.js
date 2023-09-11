//setting up 
const NUM_PRISONERS = 100;
const MAX_GUESSES = 50;
let gameOn = true;
let prisoner = 1;
let guesses = MAX_GUESSES;
//let activeSimulation = false;

//Add the start button
const startButton = document.getElementById('start-simulation');
startButton.addEventListener('click', startSimulation);

//define the game interface
const guessLeft = document.getElementById("attempts-display");
const currentPrisoner = document.getElementById("prisoner-display");
const lastGuess = document.getElementById("last-guess-display");
//setting the html
guessLeft.innerHTML = `Guesses left: ${guesses}`;
currentPrisoner.innerHTML = `Current prisoner: ${prisoner}`;
lastGuess.innerHTML = `Last guess: `;

let started = false;

createBoxes();
assignNumbers();

const boxes = document.querySelectorAll(".box");
boxes.forEach((box) => {
  box.addEventListener("click", boxClick);
});



//running the simulation
function startSimulation() {
    gameOn = !gameOn;
    console.log('start')

    //if the game is stopped
    if(!gameOn) {
        startButton.innerHTML = 'Start simulation';
        console.log('--')
        resetSimulation();
    }

    //setting all parameters back to default
    startButton.innerHTML = 'Stop simulation';
    

    const runSim = setInterval(() => {
        checkBox()
        if(!gameOn) clearInterval(runSim)
        prisoner++;

    }, 300);
}

//check if the box is correct, and do actions based on result
function checkBox(){
    //if the game is not active - return
    if(!gameOn) return;
    let currentBox = getCurrentBox(prisoner);


    num = parseInt(currentBox.innerHTML);
    console.log(num, prisoner);

    if (prisoner === num && started === true) {
      if(prisoner === 100) {
        handleGameWon();
        return
      }
      currentBox = document.querySelector(`.box[data-number="${prisoner}"]`);
      SimCorrectGuess();
      currentPrisoner.innerHTML = `Current prisoner: ${prisoner}`;
    }
    if(!gameOn) clearInterval(runSim);
    started = true;
    currentBox.click();
    lastGuess.innerHTML = `Last guess: ${num}`
    let randomNumber = parseInt(currentBox.getAttribute('data-random'));
    nextBox = getNextBox(randomNumber);
    currentBox = nextBox;


    if(prisoner >= NUM_PRISONERS +1) clearInterval(runSim);

    console.log('test')
}

//clicking the current box
function boxClick(e) {
    if (!gameOn) {
        return;
      }
      const box = e.target;
      if (box.classList.contains("clicked")) {
        console.log('clicked')
        return;
      }
      box.classList.add('clicked');
      console.log('test')
}


//create the boxes
function createBoxes() {
    const container = document.querySelector(".container");
    container.innerHTML = '';
    for (let i = 1; i <= NUM_PRISONERS; i++) {
      const box = document.createElement("div");
      box.classList.add("box");
      box.setAttribute("data-number", i);
      box.innerHTML = i;
      container.appendChild(box);
    }
}

//assign the numbers to the boxes
function assignNumbers() {
    const boxes = document.querySelectorAll(".box");
    const numbers = shuffleNumbers();
    console.log(numbers)
    for (let i = 0; i < NUM_PRISONERS; i++) {
      const box = boxes[i];
      box.setAttribute("data-random", numbers[i]);
    }
  }

  function getNextBox(boxNumber) {
    let thisBox = document.querySelector(`.box[data-number="${boxNumber}"]`);
    return thisBox
  }

  function getCurrentBox(prisoner) {
    return document.querySelector(`.box[data-number="${prisoner}"]`);
  }
  
  //shuffle the 100 numbers
function shuffleNumbers() {
    const numbers = [];
    for (let i = 1; i <= NUM_PRISONERS; i++) {
        numbers.push(i);
    }
    for (let i = 0; i < NUM_PRISONERS; i++) {
        const j = Math.floor(Math.random() * NUM_PRISONERS);
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers;
}

//used to reset the game
function resetSimulation() {
    currentPrisoner.innerHTML = `Current prisoner: 1`;
    let boxes = document.querySelectorAll('.box');
    guessLeft.innerHTML = `Guesses left: 50`;
    resetBoxes(boxes);
  }

  function resetBoxes(boxes) {
    boxes.forEach(box => {
      box.classList.remove('clicked');
      box.innerHTML = box.getAttribute('data-number')
      
    });
    assignNumbers();
  }

  function SimCorrectGuess() {
    guesses = MAX_GUESSES
    guessLeft.innerHTML = `Guesses left: ${guesses}`;
    currentPrisoner.innerHTML = `Current prisoner: ${prisoner}`;
    const clickedBoxes = document.querySelectorAll(".clicked");
    lastGuess.innerHTML = `Last guess: `;
    clickedBoxes.forEach((box) => {
      box.classList.remove("clicked");
    });
  }
