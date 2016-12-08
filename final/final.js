/*****
TODO:
3) (maybe not) Bolton betrayed
6) change stupid drawing box -> put them into an array?
7) (maybe not)  major_death & major_capture
8) (maybe not) move house icons all the time
  - Distance bewteen each other could be based on relationship (distant / close)
13) (maybe not)  whether use "currentInBattle"
14) (maybe not) change houses to be not hard coding in "data.js"
19) change font - number
20) att vs def - 2 sides along the battle field


DONE
1) arrow - bezier() & line
2) lesser houses emerge after they first involved
  - if house involved a battle, set "involved" as 1
  - only display house whose "involved" == 1
  - houses' #battle -> color
4) crawler: get icon image for each house
5) time slider not equally divided
8) move house icons all the time
  - at first, all Greater houses are shown in a row
  - move who's involved to the screen center, and move others to corner (and opacity)
  - matrix, house m vs house n
9) hover box to explain info
10) image
  - get rid of errors -> found images for all houses
  - size correctly
11) format text size/align
12) change to Class
15) animation
16) formatting
  - not show all labels
  - team together
  - non-battle ones stepback/smaller -> transparency
  - sheild mask
17) time - display year and current time
18) att vs def

*****/

/***
NOTE:
1) current_index = slider.value() - 1
***/

// global variables
var if_data_print = 0;
var slider;
var data;
var img = [];
var circleCenterX, circleCenterY, circleR
  , titleX, titleY, shieldLeft, shieldWidth;
var boxList = [];
var houseList = [];
var time = 0;
var pTime = time;

var matrix = [];
var animating = false;
var TimeBarXs;
var sliderSize;
var timeMouseOver = 0;
var speed = 20;
var years;
var yearIndex = {};
var kingsImg;
var boxLeft, boxTop;
var fontTrajaReg, fontFrankGotRom;
function preload() {
  data = loadTable("data/battles.csv", "csv", "header");
  font28 = loadFont('fonts/28DaysLater.ttf');
  fontGOT = loadFont('fonts/GameOfThrones.ttf');
  fontTrueLies = loadFont('fonts/TrueLies.ttf');
  fontFrankGotRom = loadFont('fonts/FRABK.TTF');
  fontTrajaReg = loadFont('fonts/Trajan-Regular.ttf');
  bg = loadImage("img/bg.jpg");

  // put all House instance into houseList
  var counter = 0;
  for (var key in houses) {
    houses[key]["index"] = counter;
    houseList.push(new House(key, houses[key]["great"] == 1, 0, 0));
  }

  // load house images
  houseList.forEach(function(house, i) {
    var img;
    var path = "img/house/" + house.name.replace(/ /g,"") +".png";
    $.get(path)
    .done(function() {
      house.setImage(loadImage(path));
    }).fail(function() {
      house.setImage(loadImage("img/house/NA.png"));
    });
  });

}

function setup() {
  createCanvas(displayWidth, windowHeight);
  textFont(fontTrajaReg);
  // build a [m x n] matrix of relations, m = n = #houses
  // cell (x, y) = {enemy: #times houseX and houseY were against each other
  //              , ally: #times houseX and houseY were at the same side}
  // initMatrix();

  initYears();

  // init variables about sizes
  initSlider(width*0.5, width*0.25, height*0.9, 20);

  titleX = width*0.02;
  titleY = height*0.2;
  circleCenterX = width*0.5;
  circleCenterY = height*0.5;
  circleR = height*0.3;


  shieldWidth = width*0.25;
  shieldLeft = (width - shieldWidth)/2;

  TimeBarXs = preProcessTimeBar();

  // boxLeft = width*0.77;
  // boxTop = height*0.15;
  // boxList.push(new Box("Battle Type"
  //             , width*0.2, height*0.04, boxLeft, boxTop+height*0.07
  //             , ["battle_type"]
  //             , -1));
  // boxList.push(new Box("Attackers vs Defenders"
  //             , width*0.2, height*0.36, boxLeft, boxTop+height*0.12
  //             , ["attacker_king", "defender_king"
  //               ,	"attacker_1",	"attacker_2",	"attacker_3",	"attacker_4"
  //               ,	"defender_1",	"defender_2",	"defender_3",	"defender_4"]
  //             , -1));
  // boxList.push(new Box("size"
  //             , width*0.2, height*0.05, boxLeft, boxTop+height*(0.12+0.36+0.01)
  //             , ["attacker_size", "defender_size"]
  //             , -1));

  // setup Greater Houses' positions
  initHousePosition();
  moveHousePositionToInit();
}
function draw() {
  if (pTime !== time) {
    // move once
    moveToBattlefield();
    fillCurrentInBattle(time);
    pTime = time;
  }

  // keep tracking updating
  updateHousePosition();
  moveTimeCursor();

  // draw background
  background(bg);
  drawBgOpacity(100);

  drawBattleField(shieldLeft, height*0.2, shieldWidth, height*0.6);

  // draw time slider
  drawTimeSlider();

  // draw circle
  if (data.getRowCount()) drawCircle(time);

  drawBattleBar(shieldLeft, height*0.1, shieldWidth, height*0.03);
  drawAttDefInfo(shieldLeft - width*0.08, shieldLeft + shieldWidth + width*0.08, height*0.2, height*0.11);
  // fill involoved
  if (data.getRowCount()) fillInvoloved(time);
  // draw boxes
  // boxList.forEach(function(box) {
  //   drawBox(box);
  // });
  // drawRightSec(boxLeft, boxTop, width*0.2, height*0.55);
  // draw title
  // drawTitle();
  // drawText(titleX, titleY + height*0.05);
  // draw info
  // drawInfo(slider.value() - 1);

}
