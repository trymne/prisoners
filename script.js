//setting up the settings
const NUM_PRISONERS = 100;
const MAX_GUESSES = 50;
let gameOn = true;
let prisoner = 1;
let guesses = MAX_GUESSES;
let activeSimulation = false;

//define the game interface
const guessLeft = document.getElementById("attempts-display");
const currentPrisoner = document.getElementById("prisoner-display");
const lastGuess = document.getElementById("last-guess-display");

//Add the start button
const startButton = document.getElementById('start-simulation');
startButton.addEventListener('click', startSimulation);

//set the html
guessLeft.innerHTML = `Guesses left: ${guesses}`;
currentPrisoner.innerHTML = `Current prisoner: ${prisoner}`;
lastGuess.innerHTML = `Last guess: `;



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
  console.log(boxes)
  for (let i = 0; i < NUM_PRISONERS; i++) {
    const box = boxes[i];
    box.setAttribute("data-random", numbers[i]);
  }
}

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



function revealIndexes() {
  const boxes = document.querySelectorAll(".box");
  boxes.forEach((box) => {
    const boxNumber = box.getAttribute("data-number");
    const randomNumber = box.getAttribute("data-random");
    if (boxNumber === randomNumber) {
      box.classList.add("correct");
    } else {
      box.classList.add("wrong");
      box.innerHTML = randomNumber;
    }
  });
}

createBoxes();
assignNumbers();


const boxes = document.querySelectorAll(".box");
boxes.forEach((box) => {
  box.addEventListener("click", boxClick);
});

//------------------------------




function boxClick(e) {
  if (!gameOn) {
    return;
  }
  const box = e.target;
  if (box.classList.contains("clicked")) {
    return;
  }
  box.classList.add('clicked');
  guesses --;
  guessLeft.innerHTML = `Guesses left: ${guesses}`;

  if (guesses == 0) {
    resetSimulation()
    handleGameLoss();
    gameOn = false;
    
  }
}

function handleGuess(box) {
  guesses--;
  const randomNumber = box.getAttribute("data-random");

  if (randomNumber === prisoner.toString()) {
    handleCorrectGuess();
  } else if (guesses === 0) {
    handleGameLoss(box);
  } else {
    handleIncorrectGuess(box);
  }
}

function handleCorrectGuess() {
  prisoner++;
  currentPrisoner.innerHTML = `Current prisoner: ${prisoner}`;
  guessLeft.innerHTML = `Guesses left: ${guesses}`;
  lastGuess.innerHTML = `Last guess: `;
  const clickedBoxes = document.querySelectorAll(".clicked");
  clickedBoxes.forEach((box) => {
    box.classList.remove("clicked");
  });
  guesses = MAX_GUESSES;
  if (prisoner === NUM_PRISONERS + 1) {
    handleGameWon();
  }
}

function handleIncorrectGuess(box) {
  box.classList.add("clicked");
  guessLeft.innerHTML = `Guesses left: ${guesses}`;
  currentPrisoner.innerHTML = `Current prisoner: ${prisoner}`;
  lastGuess.innerHTML = `Last guess: ${box.innerHTML}`;
}

function handleGameLoss() {
  alert('Game over, you lose');
  const message = document.getElementById("message");
  message.innerHTML = "Game over, you lose.";
  revealIndexes();
  clearInterval(runSim);
}

function handleGameWon() {
  gameOn = false;
  alert('you win');  
  const message = document.getElementById("message");
  message.innerHTML = "Congratulations, you win!";
}

//used to reset the game
function resetSimulation() {
  currentPrisoner.innerHTML = `Current prisoner: 1`;
  let boxes = document.querySelectorAll('.box');
  guessLeft.innerHTML = `Guesses left: 50`;
  resetBoxes(boxes);
}


function startSimulation(){
  activeSimulation = !activeSimulation;
  
  if (!activeSimulation) {
    startButton.innerHTML = 'Start simulation';
    resetSimulation()
    return;
  }

  //setting all parameters back to default
  startButton.innerHTML = 'Stop simulation';
  let prisoner = 1;
  let currentBox = getCurrentBox(prisoner);
  resetSimulation()

  let started = false;

  //run the simulation
  const runSim = setInterval(() => {
    if(!activeSimulation) clearInterval(runSim);
    num = parseInt(currentBox.innerHTML);
    console.log(num, prisoner);

    if (prisoner === num && started === true) {
      if(prisoner === 100) {
        handleGameWon();
        return
      }
      prisoner ++;
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
  }, 300);
}

/*
    function startSimulation() {
      let prisoner = 1;
      let boxes = document.querySelectorAll('.box');
      guesses = MAX_GUESSES
      guessLeft.innerHTML = `Guesses left: ${guesses}`;;
    
      resetBoxes(boxes);
    
      
    
      // Start interval to click boxes every second
      let intervalId = setInterval(() => {
        // Check if current box has already been clicked
        if (!currentBox.classList.contains('clicked')) {
          // Get the random number of the current box
          console.log('test');
          let randomNumber = parseInt(currentBox.getAttribute('data-random'));
          console.log('141:', randomNumber);
          // Click current box
          currentBox.click();
          // Mark current box as clicked
          currentBox.classList.add('clicked');
    
          currentBox = getNextBox(randomNumber);
    
          // Find next box to be clicked by the next prisoner
          let nextBox = getNextBox(randomNumber);
    
          // Click next box if it hasn't been clicked already
          clickBoxIfNotClicked(nextBox);
          currentBox = nextBox;

        }
    
        // Increment prisoner or reset to 1 if all prisoners have guessed
        if (prisoner === NUM_PRISONERS) {
          prisoner = 1;
          clearInterval(intervalId);
        } else {
          prisoner++;
        }
      }, 1000);
    }
  */  
    function resetBoxes(boxes) {
      boxes.forEach(box => {
        box.classList.remove('clicked', 'wrong', 'correct');
        box.innerHTML = box.getAttribute('data-number');
      });
      assignNumbers();
    }
    
    function getCurrentBox(prisoner) {
      return document.querySelector(`.box[data-number="${prisoner}"]`);
    }
    
    function getNextBox(boxNumber) {
      let thisBox = document.querySelector(`.box[data-number="${boxNumber}"]`);
      return thisBox
    }
    
    function clickBoxIfNotClicked(box) {
      if (!box.classList.contains('clicked')) {
        box.click();
      }
    }

    function SimCorrectGuess(box, num) {
      guesses = MAX_GUESSES
      guessLeft.innerHTML = `Guesses left: ${guesses}`;
      currentPrisoner.innerHTML = `Current prisoner: ${prisoner}`;
      const clickedBoxes = document.querySelectorAll(".clicked");
      lastGuess.innerHTML = `Last guess: `;
      clickedBoxes.forEach((box) => {
        box.classList.remove("clicked");
      });
    }
    


function runNextBox(boxA, rNumber){
  setTimeout(() => {
    console.log(randomNumber);
  }, 1000);
}