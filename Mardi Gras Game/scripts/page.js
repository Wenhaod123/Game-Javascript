// ===================== Winter 2021 EECS 493 Assignment 2 =====================
// This starter code provides a structure and helper functions for implementing
// the game functionality. It is a suggestion meant to help you, and you are not
// required to use all parts of it. You can (and should) add additional functions
// as needed or change existing functions.

// ==============================================
// ============ Page Scoped Globals Here ========
// ==============================================

// Counters
let throwingItemIdx = 1;

// Size Constants
const FLOAT_1_WIDTH = 149;
const FLOAT_2_WIDTH = 101;
const FLOAT_SPEED = 2;
const PERSON_SPEED = 25;
const PERSON_SPEED2 = 10;
const OBJECT_REFRESH_RATE = 50;  //ms
const SCORE_UNIT = 100;  // scoring is in 100-point units
// Size vars
let maxPersonPosX, maxPersonPosY;
let maxItemPosX;
let maxItemPosY;

// Global Window Handles (gwh__)
let gwhGame, gwhStatus, gwhScore;

// Global Object Handles
let player;
let paradeRoute;
let paradeFloat1;
let paradeFloat2;
let paradeTimer;

/*
 * This is a handy little container trick: use objects as constants to collect
 * vals for easier (and more understandable) reference to later.
 */
const KEYS = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  shift: 16,
  spacebar: 32
};

let createThrowingItemIntervalHandle;
let currentThrowingFrequency = 2000;

// ==============================================
// ============ Functional Code Here ============
// ==============================================

// Main
$(document).ready( function() {
  console.log("Ready!");

  // TODO: Event handlers for the settings panel
 $('.panel').hide();
  // TODO: Add a splash screen and delay starting the game
  
  // Set global handles (now that the page is loaded)
  // Allows us to quickly access parts of the DOM tree later
  gwhGame = $('#actualGame');
  gwhStatus = $('.status-window');
  gwhScore = $('#score-box');
  player = $('#player');  // set the global player handle
  paradeRoute = $("#paradeRoute");
  paradeFloat1 = $("#paradeFloat1");
  paradeFloat2 = $("#paradeFloat2");

  // Set global positions for thrown items
  maxItemPosX = $('.game-window').width() - 50;
  maxItemPosY = $('.game-window').height() - 40;

  // Set global positions for the player
  maxPersonPosX = $('.game-window').width() - player.width();
  maxPersonPosY = $('.game-window').height() - player.height();
  
  $('#actualGame').hide();
  setTimeout(function() {$('#splash').hide();}, 3000);
  setTimeout(function() {$('#actualGame').show();}, 3000);
  // Keypress event handler
  setTimeout(function() {$(window).keydown(keydownRouter);}, 3000);
  
  // Periodically check for collisions with thrown items (instead of checking every position-update)
  setInterval( function() {
    checkCollisions();
  }, 100);

  // Move the parade floats
   setTimeout(startParade, 3000);

  // Throw items onto the route at the specified frequency
  
  function loop() {
    createThrowingItem();
    setTimeout(loop, currentThrowingFrequency);
  }
  loop();
});

// Key down event handler
// Check which key is pressed and call the associated function
function keydownRouter(e) {
  switch (e.which) {
    case KEYS.shift:
      break;
    case KEYS.spacebar:
      break;
    case KEYS.left:
    case KEYS.right:
    case KEYS.up:
    case KEYS.down:
      movePerson(e.which);
      break;
    default:
      console.log("Invalid input!");
  }
}

// Handle player movement events
// TODO: Stop the player from moving into the parade float. Only update if
// there won't be a collision
function movePerson(arrow) {
  
  switch (arrow) {
    case KEYS.left: { // left arrow
      let newPos = parseInt(player.css('left'))-PERSON_SPEED;
      if (newPos < 0) {
        newPos = 0;
      }
      if (isOrWillCollide(player,paradeFloat2,-PERSON_SPEED,0)) {
        newPos = parseInt(player.css('left'));
      }
      player.css('left', newPos);
      break;
    }
    case KEYS.right: { // right arrow
      let newPos = parseInt(player.css('left'))+PERSON_SPEED;
      if (newPos > maxPersonPosX) {
        newPos = maxPersonPosX;
      }
      if (isOrWillCollide(player,paradeFloat1,PERSON_SPEED,0)) {
        newPos = parseInt(player.css('left'));
      }
      player.css('left', newPos);
      break;
    }
    case KEYS.up: { // up arrow
      let newPos = parseInt(player.css('top'))-PERSON_SPEED;
      if (newPos < 0) {
        newPos = 0;
      }
      if (isOrWillCollide(player, paradeFloat2, 0, -PERSON_SPEED)) {
        newPos = parseInt(player.css('top'));
      }
      if (isOrWillCollide(player, paradeFloat1, 0, -PERSON_SPEED)) {
        newPos = parseInt(player.css('top'));
      }
      
      player.css('top', newPos);
      break;
    }
    case KEYS.down: { // down arrow
      let newPos = parseInt(player.css('top'))+PERSON_SPEED;
      if (newPos > maxPersonPosY) {
        newPos = maxPersonPosY;
      }
      if (isOrWillCollide(player, paradeFloat2, 0, PERSON_SPEED)) {
        newPos = parseInt(player.css('top'));
      }
      if (isOrWillCollide(player, paradeFloat1, 0, PERSON_SPEED)) {
        newPos = parseInt(player.css('top'));
      }
      player.css('top', newPos);
      break;
    }
  }
}

// Check for any collisions with thrown items
// If needed, score and remove the appropriate item
function checkCollisions() {
  // TODO
  $('.throwingItemcandy').each(function() {
    var curcandy = $(this);
    if(isColliding(player, curcandy) && curcandy.css("opacity") > 0.9999) {
       curcandy.css("background-color", "yellow");
       curcandy.css("border-radius", "90%");
       curcandy.css("opacity","0.9999");
       var x = parseInt(document.getElementById("candyCounter").innerHTML);
       x++;
       document.getElementById("candyCounter").innerHTML = x;
       var y = parseInt(document.getElementById("score-box").innerHTML);
       y = y + 100;
       document.getElementById("score-box").innerHTML = y;
       graduallyFadeAndRemoveElement(curcandy);
       
    }
  });
    $('.throwingItembeads').each(function() {
    var curbeads = $(this);
    if(isColliding(player, curbeads) && curbeads.css("opacity") > 0.9999) {
       curbeads.css("background-color", "yellow");
       curbeads.css("border-radius", "90%");
       curbeads.css("opacity","0.9999");
       var x = parseInt(document.getElementById("beadsCounter").innerHTML);
       x++;
       document.getElementById("beadsCounter").innerHTML = x;
       var y = parseInt(document.getElementById("score-box").innerHTML);
       y = y + 100;
       document.getElementById("score-box").innerHTML = y;
       graduallyFadeAndRemoveElement(curbeads);
       
    }
  });

}

// Move the parade floats (Unless they are about to collide with the player)
function startParade(){
  console.log("Starting parade...");
  paradeTimer = setInterval( function() {
  var newPos = parseInt(paradeFloat1.css("left")) + FLOAT_SPEED;
  var newPos2 = parseInt(paradeFloat2.css("left")) + FLOAT_SPEED;
  if(isOrWillCollide(paradeFloat2,player,FLOAT_SPEED,0)) {
    newPos = parseInt(paradeFloat1.css("left"));
    newPos2 = parseInt(paradeFloat2.css("left"));
  }
  if(isOrWillCollide(paradeFloat1,player,FLOAT_SPEED,0)) {
    newPos = parseInt(paradeFloat1.css("left"));
    newPos2 = parseInt(paradeFloat2.css("left"));
  }
  if(parseInt(paradeFloat1.css("left")) == 500) {
    newPos = -300;
    newPos2 = -150;
  }
  paradeFloat1.css("left", newPos);
  paradeFloat2.css("left", newPos2);
      // TODO: (Depending on current position) update left value for each 
      // parade float, check for collision with player, etc.

  }, OBJECT_REFRESH_RATE);
}

// Get random position to throw object to, create the item, begin throwing
function createThrowingItem(){
  // TODO
  
  if(parseInt(paradeFloat2.css("left")) < 400 && parseInt(paradeFloat2.css("left")) > -100) { 
  var Item;
  if(throwingItemIdx % 3 == 0) { 
  Item = "<div id='i-" + throwingItemIdx + "' class='throwingItemcandy'><img src='img/candy.png'/></div>";}
  else {
  Item = "<div id='i-" + throwingItemIdx + "' class='throwingItembeads'><img src='img/beads.png'/></div>";
  }
  
  gwhGame.append(Item);
  var curItem = $('#i-' + throwingItemIdx);
  throwingItemIdx++;
  var itesPosY = parseInt(paradeFloat2.css("top"))  + 225;
  curItem.css("top", itesPosY);
  var itesPosX = parseInt(paradeFloat2.css("left")) + (paradeFloat2.width()) - 20;
  curItem.css('left', (250 +"px"));
  var n1 = getRandomNumber(-300,300);
  var n3 = getRandomNumber(-300,300);
  var n2 = 5;
  var n4 = n1/5;
  var n5 = n3/5;
  updateThrownItemPosition(curItem, n4, n5, n2);
  }
  

}

// Helper function for creating items
// throwingItemIdx - index of the item (a unique identifier)
// type - beads or candy
// imageString - beads.png or candy.png
function createItemDivString(itemIndex, type, imageString){
  return "<div id='i-" + itemIndex + "' class='throwingItem " + type + "'><img src='img/" + imageString + "'/></div>";
}

// Throw the item. Meant to be run recursively using setTimeout, decreasing the 
// number of iterationsLeft each time. You can also use your own implementation.
// If the item is at it's final postion, start removing it.
function updateThrownItemPosition(elementObj, xChange, yChange, iterationsLeft){
  // TODO
  if(iterationsLeft == 0) {
   setTimeout(function() {graduallyFadeAndRemoveElement(elementObj);},5000);
  } else { 
  var index = iterationsLeft - 1;
  var newPos = parseInt(elementObj.css('top')) + yChange;
  var newPos2 = parseInt(elementObj.css('left')) + xChange;
  if (newPos < 0) {
        newPos = 0;
        newPos2 = parseInt(elementObj.css('left'));
        index = 0;
      }
  if (newPos2 < 0) {
        newPos2 = 0;
        newPos = parseInt(elementObj.css('top'));
        index = 0;
      }
  if (newPos2 > maxItemPosX) {
        newPos2 = maxItemPosX;
        newPos = parseInt(elementObj.css('top'));
        index = 0;
      }
  if (newPos > maxItemPosY) {
        newPos = maxItemPosY;
        newPos2 = parseInt(elementObj.css('left'));
        index = 0;
      }    

  elementObj.css('top', newPos);
  elementObj.css('left', newPos2);
  setTimeout(function() {updateThrownItemPosition(elementObj, xChange, yChange, index);}, 50);
  }
  
}

function graduallyFadeAndRemoveElement(elementObj){
  // Fade to 0 opacity over 2 seconds
  elementObj.fadeTo(2000, 0, function(){
    $(this).remove();
  });
}

// ==============================================
// =========== Utility Functions Here ===========
// ==============================================

// Are two elements currently colliding?
function isColliding(o1, o2) {
  return isOrWillCollide(o1, o2, 0, 0);
}

// Will two elements collide soon?
// Input: Two elements, upcoming change in position for the moving element
function willCollide(o1, o2, o1_xChange, o1_yChange){
  return isOrWillCollide(o1, o2, o1_xChange, o1_yChange);
}

// Are two elements colliding or will they collide soon?
// Input: Two elements, upcoming change in position for the moving element
// Use example: isOrWillCollide(paradeFloat2, person, FLOAT_SPEED, 0)
function isOrWillCollide(o1, o2, o1_xChange, o1_yChange){
  const o1D = { 'left': o1.offset().left + o1_xChange,
        'right': o1.offset().left + o1.width() + o1_xChange,
        'top': o1.offset().top + o1_yChange,
        'bottom': o1.offset().top + o1.height() + o1_yChange
  };
  const o2D = { 'left': o2.offset().left,
        'right': o2.offset().left + o2.width(),
        'top': o2.offset().top,
        'bottom': o2.offset().top + o2.height()
  };
  // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  if (o1D.left < o2D.right &&
    o1D.right > o2D.left &&
    o1D.top < o2D.bottom &&
    o1D.bottom > o2D.top) {
     // collision detected!
     return true;
  }
  return false;
}

// Get random number between min and max integer
function getRandomNumber(min, max){
  return (Math.random() * (max - min)) + min;
}

function opensetting(){
  $('.button1').hide();
  $('.panel').show();
}
function opensetting2(){
  var x = document.getElementById("input1").value;
  if(x < 100) {
    alert("Frequency must be a number greater than or equal to 100");
  }
  else if(isNaN(x)) {
    alert("Frequency must be a number greater than or equal to 100");
  }
  else { 
  currentThrowingFrequency = x;
  $('.button1').show();
  $('.panel').hide();
}}
function opensetting3(){
  $('.button1').show();
  $('.panel').hide();
  document.getElementById("input1").value = currentThrowingFrequency;
}