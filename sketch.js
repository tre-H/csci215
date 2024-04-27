let catcher;    // One catcher object
let timer;      // One timer object
let drops = []; // An array of drop objects
let totalDrops = 0; // totalDrops

// A boolean to let us know if the game is over
let gameOver = false;

// Variables to keep track of score, level, lives left
let score = 0;      // User's score
let level = 1;      // What level are we on
let lives = 10;     // 10 lives per level (10 raindrops can hit the bottom)
let levelCounter = 0;

// Preload function to load images before the game starts
function preload() {
    catcherImage = loadImage('https://upload.wikimedia.org/wikipedia/commons/f/fd/Broom_icon_1.svg'); // Load the catcher image
    dropImage = loadImage('https://png.pngtree.com/png-vector/20240123/ourmid/pngtree-pile-of-soil-element-png-image_11466832.png'); // Load the drop image
}

function setup() {
  // Hides the canvas initially
  let canvas = createCanvas(480, 270);
  canvas.id('game-canvas'); // Set id for canvas
  noLoop(); // Pauses draw function until 'Start' button is clicked
  document.getElementById('start-button').addEventListener('click', startGame);
  document.getElementById('retry-button').addEventListener('click', retryGame);
}

function startGame() {
  gameOver = false;
  score = 0;
  level = 1;
  lives = 20;
  levelCounter = 0;
  drops = [];
  totalDrops = 0;

  // Create catcher and timer objects
  catcher = new Catcher(16); // Create the catcher with a radius of 16
  timer = new Timer(300);    // Create a timer that goes off every 300 milliseconds
  timer.start();             // Starting the timer
  loop(); // Resumes draw function after 'Start' button is clicked
}

function retryGame() {
  location.reload(); // Reload the page to retry the game
}

function draw() {
  background(255);

  // If the game is over
  if (gameOver) {
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(0);
    text("GAME OVER", width / 2, height / 2);
    textSize(18);
    text("Your score is: " + score, width / 2, height / 2 + 50);
    document.getElementById('retry-button').style.display = 'block'; // Show retry button
  } else {
    // Set catcher location
    catcher.setLocation(mouseX, mouseY); 
    // Display the catcher
    catcher.display(); 

    // Check the timer
    if (timer.isFinished()) {
      // Deal with raindrops
      // Initialize one drop
      if (totalDrops < 50) {
        drops.push(new Drop());
        // Increment totalDrops
        totalDrops++;
      }
      timer.start();
    }

    // Move and display all drops
    for (let i = drops.length - 1; i >= 0; i--) {
      if (!drops[i].finished) {
        drops[i].move();
        drops[i].display();
        if (drops[i].reachedBottom()) {
          levelCounter++;
          drops.splice(i, 1); 
          // If the drop reaches the bottom a live is lost
          lives--;
          // If lives reach 0 the game is over
          if (lives <= 0) {
            gameOver = true;
          }
        } 

        // Every time you catch a drop, the score goes up
        if (catcher.intersect(drops[i])) {
          drops.splice(i, 1);
          levelCounter++;
          score++;
        }
      }
    }

    // If all the drops are done, that level is over!
    if (levelCounter >= 50) {
      // Go up a level
      level++;
      // Reset all game elements
      levelCounter = 0;
      lives = 10;
      timer.setTime(constrain(300 - level * 25, 0, 300));
      totalDrops = 0;
    }

    // Display number of lives left
    textSize(14);
    fill(0);
    text("Lives left: " + lives, 10, 20);
    rect(10, 24, lives * 10, 10);

    text("Level: " + level, 300, 20);
    text("Score: " + score, 300, 40);
  }
}

class Catcher {
    constructor() {
      this.r = 10;
      this.col = color(50, 10, 10, 150);
      this.x = 0;
      this.y = 0;
    }
  
    setLocation(tempX, tempY) {
      this.x = tempX;
      this.y = tempY;
    }
  
    display() {
      image(catcherImage, this.x - this.r * 4, this.y - this.r, this.r * 10, this.r * 6); // Draw catcher image
    }
  
    // A function that returns true or false based on
    // if the catcher intersects a raindrop
    intersect(d) {
      // Calculate distance
      let distance = dist(this.x, this.y, d.x, d.y); 
  
      // Compare distance to sum of radii
      return distance < this.r + d.r;
    }
}

class Drop {
    constructor() {
      this.r = 4;                   // All drop hitboxes are the same size
      this.x = random(width);       // Start with a random x location
      this.y = -this.r * 6;         // Start a little above the window
      this.speed = random(1, 2);    // Pick a random speed
      this.c = color(50, 100, 150); // Color
      this.finished = false;        // New variable to keep track of whether drop is still being used
    }
  
    // Move the raindrop down
    move() {
      // Increment by speed
      this.y += this.speed;
    }
  
    // Check if it hits the bottom
    reachedBottom() {
      // If we go a little beyond the bottom
      return this.y > height + this.r * 4;
    }
  
    // Display the raindrop
    display() {
      // Display the drop
      image(dropImage, this.x - this.r, this.y - this.r * 4, this.r * 8, this.r * 8); // Draw drop image
    }
}

class Timer {
  constructor(tempTotalTime) {
    this.savedTime; // When Timer started
    this.totalTime = tempTotalTime; // How long Timer should last
  }

  setTime(t) {
    this.totalTime = t;
  }

  // Starting the timer
  start() {
    // When the timer starts it stores the current time in milliseconds.
    this.savedTime = millis();
  }

  // The function isFinished() returns true if 5,000 ms have passed. 
  // The work of the timer is farmed out to this method.
  isFinished() { 
    // Check how much time has passed
    let passedTime = millis() - this.savedTime;
    return passedTime > this.totalTime;
  }
}
