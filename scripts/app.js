// jshint esversion: 6

"use strict";

import { Player } from "./scripts/player.js" ;
import { GameObject } from "./scripts/game_object.js" ;
import { Clock } from "./scripts/clock.js";
import { Score } from "./scripts/score.js";
import * as Physics from "./scripts/physics.js";
import { UPDATE_RATE, RPS, TOTAL_OF_IMAGES } from "./interface.js";

window.onload = function()
{      
    var clock = new Clock(
        72, // Clock.x
        72, // Clock.y
        64, // Clock.r
        48  // Clock.seconds
    );     
    
    var score = new Score(
        900, // Score.x
        72,  // Score.y
        0   // Score.points
    );

    var rpsObj = []; // Array of the GameObjects (Rock, Paper and Scissor).
    var rpsImg = []; // Array of the Images of the GameObjects.
    var spawnRate = 3000; // Time to Create a GameObject

    var player;
    var playerFrames = []; // Array of the Images of the Player Animation.

    var elapsedTime = 0; // Time Elapsed After the Creation of the Latest GameObject.

    var requestID = 0; // ID of the 'requestAnimationFrame' Callback.

    // Hold the Canvas and its Context.
    var canvas = document.getElementById("rpsCanvas");
    var context = canvas.getContext("2d");

    // ### Event Listeners/Handlers ###
    // Mouse Control Over the Player    
    // >>> Move Player Along the X Axis.
    canvas.addEventListener("mousemove", (event) =>
    {
        if (event.offsetX - (player.width/2) > 0 && 
            event.offsetX + (player.width/2) < canvas.width)
            player.x = event.offsetX - (player.width/2);
    });

    // >>> Animate the Player Among Rock, Paper and Scissor.
    canvas.addEventListener("mousedown", () =>
    {
        player.isAnimated = true;
    });
 
    // Keyboard Control Over Player
    document.addEventListener("keydown", (event) =>
    {
        // >>> Move Player to the Right
        if (event.key == "ArrowRight" && player.x + (canvas.width/64) + (player.width) < canvas.width)
        {
            player.x += (canvas.width/32);
            event.preventDefault();
        }
        // >>> Move Player to the Left
        else if (event.key == "ArrowLeft" && player.x - (canvas.width/64) > 0)
        {
            player.x -= (canvas.width/32);
            event.preventDefault();
        }
        // >>> Animate the Player Among Rock, Paper and Scissor.
        else if (event.key == " ")    
        {
            player.isAnimated = true;
        }
    }); 

    // ### Load Images: Rock, Paper, Scissor ###
    var numLoaded = 0; // Number of Images Loaded.

    // Load Paper GameObject's Image.
    var paper = new Image();
    paper.src = "images/paper.png";
    rpsImg.push(paper);
    paper.onload = function()
    {
        numLoaded++;
    };

    // Load Rock GameObject's Image.
    var rock = new Image();
    rock.src = "images/rock.png";
    rpsImg.push(rock);
    rock.onload = function()
    {
        numLoaded++;
    };

    // Load Scissor GameObject's Image.
    var scissor = new Image();
    scissor.src = "images/scissor.png";
    rpsImg.push(scissor);
    scissor.onload = function()
    {
        numLoaded++;
    };  

    // ### (Animation) Load Images: Player's Rock Paper and Scissors ###
    for (let i = 0; i < 3; i++) 
    {
        let src = ""; // Path of the Image.
        switch (i) {
        case 0: // Frames: Paper from/to Rock
            src = "images/paper_rock/paper_rock_"; 
            break;
        case 1: // Frames: Rock from/to Scissor
            src = "images/rock_scissor/rock_scissor_";
            break;
        case 2: // Frames: Scissor from/to Paper
            src = "images/scissor_paper/scissor_paper_";
            break;
        default:
            break;
        }

        // Loads the Frames of the Animation of the Player.
        // Starts the Game After Loading ALL the Frames.
        for (let j = 0; j < 11; j++)
        {
            let img = new Image();
            img.src = src + j + ".png"; 
            playerFrames.push(img);
            img.onload = function()
            {
                numLoaded++;
                if (numLoaded >= TOTAL_OF_IMAGES)
                {
                    player = new Player(
                        0,      // Player.x
                        672,    // Player.y
                        96,     // Player.width
                        96,     // Player.height
                        playerFrames);  // Player.arrayOfFrames
                    
                    main();
                }
            };
        }
    }

    function main()
    {
        startGame();
    }

    function startGame()
    {
        updateGame();
        window.requestAnimationFrame(drawGame);
    }

    function updateGame()
    {
        if (clock.getSeconds() > 0)
        {
            rpsObj.forEach((obj, idx) => {              
                if (Physics.isColliding(obj,player))
                {           
                    // Player 'Catches' the GameObject.         
                    switch (getOutcome(obj, player)) {
                    case -1: // GameObject and Player doesn't Match.
                        clock.update(-4); // -4 Seconds.
                        break;
        
                    case 0: // // GameObject and Player are the same.
                        clock.update(-1); // -1 Second.
                        break;

                    case 1: // GameObject and Player Match.
                        clock.update(4); // +4 Second.
                        score.update(1); // +1 Point.
                        break;
                    }

                    // Remove the GameObject from the Array to Release Memory.
                    rpsObj.splice(idx, 1); 
                }
                
                // Player Misses the GameObject.
                if (obj.y + 64 >= canvas.height) 
                {
                    // Remove the GameObject from the Array to Release Memory.
                    rpsObj.splice(idx, 1);                      
                    clock.update(-2); // -2 Second.
                }            
                obj.move(); // Update GameObject X and Y Position.
            });

            Physics.gravity(rpsObj); // Applies Gravity to GameObjects.

            // Creates a New GameObject (Rock, Paper, or Scissor).
            if (elapsedTime >= spawnRate) 
            {
                let index = Math.floor(Math.random() * 3); // Randomly Selects Rock, paper, or Scissor.
                let rps = new GameObject(
                    Math.random() * (canvas.width - 64), // GameObject.x
                    0, // GameObject.y 
                    64, // GameObject.width
                    64, // GameObject.height
                    0, // GameObject.vx
                    0, // GameObject.vy
                    index,
                    rpsImg[index]); // GameObject.img
                
                rpsObj.push(rps);

                // Increases the Number of GameObjects Created per Unit of Time
                if (spawnRate > 1000)
                    spawnRate -= 25;

                elapsedTime = 0;
            }

            // Update Game Clock After Every Second
            if (elapsedTime % 1000 == 0)
                clock.update(-1);

            elapsedTime += UPDATE_RATE;            
            window.setTimeout(updateGame, UPDATE_RATE);
        }
        else // Game Over
        {
            drawGameOver();
        }
    }

    function drawGame()
    {            
        context.clearRect(0,0,canvas.width,canvas.height);

        // Render the Game Heading - Clock and Score
        clock.render(context);
        score.render(context);

        // Render the GameObjects.
        rpsObj.forEach(element => {
            element.render(context);        
        });

        // Render the Player.
        player.render(context);

        requestID = window.requestAnimationFrame(drawGame);
    }

    function drawGameOver()
    {
        window.cancelAnimationFrame(requestID);

        context.clearRect(0,0,canvas.width,canvas.height);

        // Game Over Message
        context.save(); 

        context.textAlign = "center"; 
        context.textBaseline = "middle";
        context.font = "96px Times New Roman";
        context.fillStyle = "black";
        context.fillText("Game Over", canvas.width / 2, canvas.height / 2);

        context.restore(); // End of Game Over Message
    }
};// end window.onload

// Returns the Outcome of a Rock, Paper and Scissor game.
function getOutcome(obj, player)
{        
    switch (obj.rps) {
    case RPS.PAPER:        
        if (player.rps == RPS.PAPER)
            return 0;
        
        else if (player.rps == RPS.ROCK)
            return -1;
        
        else
            return 1;

    case RPS.ROCK:
        if (player.rps == RPS.PAPER)
            return 1;
    
        else if (player.rps == RPS.ROCK)
            return 0;
    
        else
            return -1;


    case RPS.SCISSOR:
        if (player.rps == RPS.PAPER)
            return -1;

        else if (player.rps == RPS.ROCK)
            return 1;

        else
            return 0;
    }
}