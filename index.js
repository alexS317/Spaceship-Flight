import Background from "./Background.js";
import Player from "./Player.js";
import Obstacle from "./Obstacle.js";
import UpgradeItem from './UpgradeItem.js';
import Particle from "./Particle.js";

// Global variables
let canvas;
let context;
let lastTickTimestamp = 0;
let points = 0;

let background;
let topObstacle;
let bottomObstacle;
let upgradeItem;
let player;
let particle;

let gameObjects = [];
let obstacles = [];
let items = [];
let particles = [];

const CONFIG = {
    width: 1200,
    height: 750
}

// Global function to create random values
function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Audios (from freesfx.co.uk)
let music = new Audio('./Assets/distressed.mp3');
let click = new Audio('./Assets/mouse_click.mp3');
let collect = new Audio('./Assets/layered_medium_beep.mp3');
let death = new Audio('./Assets/electric_siren_buzzer.mp3');
music.volume = 0.3;

let dead = false;


// Initialize, set up game elements
const init = () => {
    canvas = document.querySelector('#canvas');
    context = canvas.getContext('2d');

    canvas.setAttribute('width', CONFIG.width);
    canvas.setAttribute('height', CONFIG.height);

    // Create background
    background = new Background(context, 0, 0, CONFIG);

    // Create obstacles
    function obstaclePlacer() {
        let randomYTop = randomNumberBetween(-CONFIG.height/2 + 75, - 75);
        let randomYBottom = randomNumberBetween(CONFIG.height - CONFIG.height/3, CONFIG.height - 75);
        topObstacle = new Obstacle(context, 1300, randomYTop, 60, CONFIG.height/2, CONFIG);
        bottomObstacle = new Obstacle(context, 1300, randomYBottom, 60, CONFIG.height/2, CONFIG);
        gameObjects.push(topObstacle, bottomObstacle);
        obstacles.push(topObstacle, bottomObstacle);
    }
    setInterval(() => {
        obstaclePlacer();
    }, 900);

    // Create upgrade items
    function itemPlacer() {
        let randomX = randomNumberBetween(1300, 1500);
        let randomY = randomNumberBetween(CONFIG.height/3, CONFIG.height - CONFIG.height/3);
        upgradeItem = new UpgradeItem(context, randomX, randomY, 40, 40, CONFIG);
        gameObjects.push(upgradeItem);
        items.push(upgradeItem);
    }
    setInterval(() => {
        itemPlacer();
    }, 6000);

    // Create particles
    function particleCreator() {
        particle = new Particle(context, player.x + player.width/4, player.y + player.height/2, CONFIG);
        particles.push(particle);
    }
    setInterval(() => {
        particleCreator();
    }, 10);

    // Create player
    player = new Player(context, 140, 400, 120, 80, CONFIG);
    gameObjects.push(player);

    music.play();
    music.loop = true;

    // Call first iteration
    lastTickTimestamp = performance.now();
    requestAnimationFrame(gameLoop);
}


// Update object properties
const update = (timePassedSinceLastRender) => {
    background.update(timePassedSinceLastRender);
    
    particles.forEach((particle) => {
        particle.update(timePassedSinceLastRender);
    });
    // Remove particles so there aren't too many (would slow down the game)
    if(particles.length > 100) {
        for(let i = 0; i < 40; i++) {
            particles.shift(particles[i]);
        }
    }

    gameObjects.forEach((gameObject) => {
        gameObject.update(timePassedSinceLastRender);

        // Removing gameobjects after they moved off the canvas
        if(gameObject.x < -100) {
            gameObjects.splice(gameObjects.indexOf(gameObject), 1);
        }
    });

    // Death when falling
    if(player.y >= CONFIG.height && dead === false) {
        music.pause();
        death.play();
        gameOverScreen.style.display = 'block';
        canvas.style.display = 'none';
        dead = true;
    }

    obstacles.forEach((obstacle) => {
        // Death when colliding with obstacle
        if(checkCollisionBetween(player, obstacle) === true && dead === false) {
            music.pause();
            death.play();
            gameOverScreen.style.display = 'block';
            canvas.style.display = 'none';
            dead = true;
        }

        // Counting passed obstacles
        if(obstacle.counted === false && obstacle.x < player.x - player.width/2) {
            points++;
            obstacle.counted = true;
            if(gameOverScreen.style.display === 'block') {
                points--;
                score.textContent = points/2;
            }
        }

        // Removing obstacles after they moved off the canvas
        if(obstacle.x < -100) {
            obstacles.shift(obstacle);
        }
    });


    items.forEach((item) => {
        if(checkCollisionBetween(player, item) === true) {
            collect.play();
            player.velocity = 0.1;          // Player velocity slowing down when collecting upgrade item
            setTimeout(() => {
                player.velocity = 0.5;      // Return to normal speed after time has run out (2 seconds)
            }, 2000);

            // Make items disappear when they're collected
            items.splice(items.indexOf(item), 1);
            gameObjects.splice(gameObjects.indexOf(item), 1);
        }

        // Make sure items can't be drawn on obstacles
        if(checkCollisionBetween(topObstacle, item) === true || checkCollisionBetween(bottomObstacle, item) === true) {
            items.splice(items.indexOf(item), 1);
            gameObjects.splice(gameObjects.indexOf(item), 1);
        }
    });
}


// Draw objects on canvas
const render = () => {
    // Clear previous drawings
    context.clearRect(0, 0, CONFIG.width, CONFIG.height);

    background.render();

    particles.forEach((particle) => {
        particle.render();
    });

    gameObjects.forEach((gameObject) => {
        gameObject.render();
    });
}


// Repeat update and render
const gameLoop = () => {
    // Calculate how much time passes between the iterations, value will be used as a constant to keep the game at the same speed on screens with different refresh rates
    let timePassedSinceLastRender = performance.now() - lastTickTimestamp;
    update(timePassedSinceLastRender);
    render();

    // Call next iteration (gameLoop calls itself from within itself)
    lastTickTimestamp = performance.now();
    requestAnimationFrame(gameLoop);
}



// Check for collision between objects
let checkCollisionBetween = (gameObjectA, gameObjectB) => {
    let bbA = gameObjectA.getBoundingBox();
    let bbB = gameObjectB.getBoundingBox();
    if(
        bbA.x < bbB.x + bbB.w &&
        bbA.x + bbA.w > bbB.x &&
        bbA.y < bbB.y + bbB.h &&
        bbA.y + bbA.h > bbB.y
    ) {
        // Collision happened
        return true;
    }
    else return false;
}





// DOM manipulations
let score = document.querySelector('#score');
let startScreen = document.querySelector('#start-screen');
let howToPlayScreen = document.querySelector('#how-to-play-screen');
let gameOverScreen = document.querySelector('#game-over-screen');

let start = document.querySelector('#start');
let howToPlay = document.querySelector('#how-to-play');
let back = document.querySelector('#back');
let backToMenu = document.querySelector('#back-to-menu');

// Start screen
start.addEventListener('click', () => {
    click.play();
    startScreen.style.display = 'none';
    init();
});
howToPlay.addEventListener('click', () => {
    click.play();
    startScreen.style.display = 'none';
    howToPlayScreen.style.display = 'block';
});

// How to play screen
back.addEventListener('click', () => {
    click.play();
    howToPlayScreen.style.display = 'none';
    startScreen.style.display = 'block';
});

// Game over screen
backToMenu.addEventListener('click', () => {
    click.play();
    // Short timeout so the click sound can play before loading the page
    setTimeout(() => {
        document.location.reload(true);
    }, 240);
});