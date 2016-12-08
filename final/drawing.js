// This file contains all functions drawing components

// called by "drawBox"
// function drawHoverBox(content, w, h, x, y) {
//   this.myWidth = 200;
//   this.myHeight = 20;
//   this.x = x + this.myWidth/2;
//   this.y = y + this.myHeight/2;
//   fill(0, 50);
//   rect(x, y, this.myWidth, this.myHeight);
//   textAlign(CENTER, CENTER);
//   // textSize(20);
//   fill(255);
//   text(content, this.x, this.y);
// }

var attColor = "#cd5c5c";
var defColor = "#538370";

function drawShield(x, y, w, h) {
  beginShape();
  vertex(x, y);
  vertex(x+w, y);
  vertex(x+w, y+h*0.66);
  vertex(x+w/2, y+h);
  vertex(x, y+h*0.66);
  endShape();
}

function drawBattleField(x, y, w, h) {
  push();
  fill(157, 121, 90, 100);
  // fill(255, 100);
  drawShield(x, y, w, h);
  noStroke();
  fill(255, 20);
  textSize(50);
  textAlign(CENTER, CENTER);
  text("#", circleCenterX, circleCenterY);
  pop();
}

function drawBattleBar(left, top, myWidth, myHeight) {
  var attSize = parseInt(data.getColumn("attacker_size")[time]);
  var defSize = parseInt(data.getColumn("defender_size")[time]);
  var total = attSize + defSize;
  if (attSize && defSize) {
    var attSize1 = map(attSize, 0, total, 0, myWidth);
    var defSize1 = map(defSize, 0, total, 0, myWidth);

    // draw bars
    push();
    stroke(255, 200);
    strokeWeight(0.5);
    fill(HEXtoRGB(attColor).r, HEXtoRGB(attColor).g, HEXtoRGB(attColor).b, 180);
    rect(left, top, attSize1, myHeight);
    fill(HEXtoRGB(defColor).r, HEXtoRGB(defColor).g, HEXtoRGB(defColor).b, 180);
    rect(left+myWidth-defSize1, top, defSize1, myHeight);

    noStroke();
    textSize(10);
    textAlign(LEFT, TOP);
    fill(255, 200);
    text(attSize + " ("+ nf(attSize/total*100, 0, 1) +"%)", left, top+myHeight+6);
    textAlign(RIGHT, TOP);
    fill(255, 200);
    text(defSize + " ("+ nf(defSize/total*100, 0, 1) +"%)", left+myWidth, top+myHeight+6);
    pop();

  } else {
    push();
    noFill();
    stroke(255, 100);
    rect(left, top, myWidth, myHeight);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(10);
    fill(255);
    text("no  size  info  available", left + myWidth/2, top+myHeight/2);
    pop();
  }
  // draw title - battle type
  push();
  stroke(255, 100);
  textSize(12);
  fill(255);
  textAlign(LEFT, CENTER);
  var info = data.getColumn("battle_type")[time];
  text(info, left, top-12);
  pop();
}

function drawBgOpacity(op) {
  push();
  fill(0, op);
  rect(0, 0, width, height);
  pop();
}

function drawTimeSlider() {
  var grayColor = color(200);
  push();
  translate(sliderSize.play.centerX, sliderSize.play.centerY);
  noFill();
  stroke(grayColor);
  ellipse(0, 0, sliderSize.play.width, sliderSize.play.width);
  noStroke();
  fill(grayColor);
  if (animating) {
    // pause icon
    rect(-4, -5, 3, 10);
    rect(1, -5, 3, 10);
  } else {
    // play icon
    triangle(-3, -5, 5, 0, -3, 6);
  }
  pop();

  // play bar
  push();
  stroke(grayColor);
  line(sliderSize.left, (sliderSize.top + sliderSize.bottom) / 2, sliderSize.right, (sliderSize.top + sliderSize.bottom) / 2);
  for (i = 0; i < TimeBarXs.length; i++) {
    if (i == time) {
      fill(241, 188, 48);
      noStroke();
      ellipse(TimeBarXs[i], (sliderSize.top + sliderSize.bottom) / 2, 8, 8);
    } else if (i == timeMouseOver) {
      stroke(0, 50);
      fill(255);
      // strokeWeight(3);
      ellipse(TimeBarXs[i], (sliderSize.top + sliderSize.bottom) / 2, 6, 6);
    } else {
      fill(grayColor);
      stroke(grayColor);
      strokeWeight(1);
      ellipse(TimeBarXs[i], (sliderSize.top + sliderSize.bottom) / 2, 3, 3);
    }
  }
  pop();

  // current time label
  push();
  textAlign(CENTER, TOP);
  textSize(15);
  fill(255, 200);
  text(data.getColumn("name")[time], sliderSize.left + sliderSize.width/2, sliderSize.top-5);
  pop();

  // year: axis label
  push();
  fill(255, 200);
  textSize(9);
  textAlign(RIGHT);
  text("YEAR", sliderSize.left-4, sliderSize.bottom);
  pop();
  // year: time label
  push();
  noStroke();
  textSize(10);
  textAlign(LEFT);
  var temp;
  for (var i = 0; i < years.length; i++) {
    if (temp !== years[i]) {
      temp = years[i];
      stroke(255, 100);
      line(TimeBarXs[i], (sliderSize.top + sliderSize.bottom) / 2, TimeBarXs[i], sliderSize.bottom - sliderSize.play.width/3);
      noStroke();
      if (temp == years[time]) {
        fill(241, 188, 48);
      } else {
        fill(grayColor);
      }
      text(temp, TimeBarXs[i], sliderSize.bottom);
    }
  }
  pop();
}

function drawCircle(index) {
  textSize(15);
  noStroke();

  // identify who's involved in the battle
  var housesInBattle = getHousesInBattle(index);
  var attackers = housesInBattle["attackers"];
  var defenders = housesInBattle["defenders"];

  // draw all houses
  push();
  textFont(fontFrankGotRom);
  houseList.forEach(function(house, i) {
    textAlign(CENTER, BOTTOM);
    if (house.getIsGreat() || house["involved"]) {
      // if (house["involved"]) stroke(100 + house["involved"]/34 * 400);
      fill((house["involved"]) ? 150 + house["involved"]/34 * 100 : 150);

      if (house.getCurrentInBattle() === 1) {
        // fill(attColor);
        fill(255);
        textSize(15);
        text((house["name"] === "Brave Companions") ? "Brave\nCompanions" : house['name'], house['x'], house['y']-20-20*house.getIsGreat());
        if (house["img"]) image(house["img"], house['x']-20-20*house.getIsGreat(), house['y']-20-20*house.getIsGreat(), 40 + 40*house.getIsGreat(), 40 + 40*house.getIsGreat());
      } else if (house.getCurrentInBattle() === -1) {
        // fill(defColor);
        fill(255);
        textSize(15);
        text((house["name"] === "Brave Companions") ? "Brave\nCompanions" : house['name'], house['x'], house['y']-20-20*house.getIsGreat());
        if (house["img"]) image(house["img"], house['x']-20-20*house.getIsGreat(), house['y']-20-20*house.getIsGreat(), 40 + 40*house.getIsGreat(), 40 + 40*house.getIsGreat());
      } else {
        textSize(10);
        fill(255, 100);
        text((house["name"] === "Brave Companions") ? "Brave\nCompanions" : house['name'], house['x'], house['y']-20-20*house.getIsGreat());
        push();
        tint(255, 80);
        if (house["img"]) image(house["img"], house['x']-20-20*house.getIsGreat(), house['y']-20-20*house.getIsGreat(), 40 + 40*house.getIsGreat(), 40 + 40*house.getIsGreat());
        pop();
        // fill(51, 150);
        // rect(house['x']-20-20*house.getIsGreat(), house['y']-20-20*house.getIsGreat(), 40 + 40*house.getIsGreat(), 40 + 40*house.getIsGreat());
      }
      // ellipse(house['x'], house['y'], 40);
    }
  });
  pop();

  // draw line (and arrows)
  stroke(255);
  strokeWeight(1);
  for (var i = 0; i < attackers.length; i++) {
    for (var j = 0; j < defenders.length; j++) {
      noFill();
      var att = findItemByValue(houseList, 'name', attackers[i]);
      var def = findItemByValue(houseList, 'name', defenders[j]);
      // if (att && def) line(att['x'], att['y'], def['x'], def['y']);
      if (att && def) {
        var x1 = att['x']+20+12*att.getIsGreat();
        var y1 = att['y'];
        var x2 = def['x']-20-12*def.getIsGreat();
        var y2 = def['y'];
        var dx = x2 - x1;
        var dy = y2 - y1;
        bezier(x1, y1
              , x1 + dx/10, y1 + dy/3
              , x1 + dx/3*2, y1 + dy/10*9
              , x2, y2);
        // push();
        // fill(255);
        // beginShape();
        // // console.log((dx > 0) ? x2-10 : x2+10, y2
        // //             , x2, y2
        // //           , );
        // vertex((dx > 0) ? x2-10 : x2+10, y2);
        // vertex(x2, y2)
        // vertex(x2, (dy > 0) ? y2-10 : y2+10);
        // endShape();
        // pop();
      }
    }
  }
  noStroke();
  strokeWeight(1);
}

function drawAttDefInfo(leftC, rightC, top, width) {
  // var height = box.height*0.9;
  // var top = box.bottom - height;
  // var width = box.width*0.4;
  var left = leftC - width/2;
  var right = rightC - width/2;
  var imageWidth = width;

  var attKing = data.getColumn("attacker_king")[time];
  var defKing = data.getColumn("defender_king")[time];
  var attCom = data.getColumn("attacker_commander")[time].split(', ');
  var defCom = data.getColumn("defender_commander")[time].split(', ');
  var ifAttWin = data.getColumn("attacker_outcome")[time] === "win";

  // left box
  push();
  stroke(attColor);
  strokeWeight(0.5);
  textAlign(CENTER, TOP);
  textSize(20);
  fill(attColor);
  text("Attackers", left + width/2, top-20);
  pop();

  // left info
  if (attKing) {
    push();
    stroke(255, 100);
    noFill();
    image(kingsImg[attKing], left+(width - imageWidth)/2, top+20, imageWidth, imageWidth);
    rect(left+(width - imageWidth)/2, top+20, imageWidth, imageWidth);
    pop();

    push();
    textAlign(CENTER, TOP);
    textSize(10);
    // stroke(253, 201, 68);
    fill(253, 201, 68);
    text(attKing, left+width/2, top+imageWidth+35);
    pop();
    fill(255, 200);
    if (attCom[0] != "") {
      push();
      textFont(fontFrankGotRom);
      textAlign(CENTER, TOP);
      textSize(10);
      fill(255, 200);
      attCom.forEach(function(com, i) {
        text(com, left+width/2, top+imageWidth+35 + (i+1) * 15);
      });
      pop();
    } else {
      push();
      textFont(fontFrankGotRom);
      textAlign(CENTER, TOP);
      textSize(10);
      fill(255, 200);
      text("No Commander", left+width/2, top+imageWidth+55);
      pop();
    }
  } else {
    push();
    textFont(fontFrankGotRom);
    textAlign(CENTER, TOP);
    textSize(20);
    fill(255, 200);
    text("No King", left+width/2, top+imageWidth/2);
    pop();
  }

  // right box
  push();
  stroke(defColor);
  strokeWeight(0.5);
  textAlign(CENTER, TOP);
  textSize(20);
  fill(color(defColor));
  text("Defenders", right + width/2, top-20);
  pop();
  // right info
  if (defKing) {
    push();
    stroke(255, 100);
    noFill();
    image(kingsImg[defKing], right+(width - imageWidth)/2, top+20, imageWidth, imageWidth);
    rect(right+(width - imageWidth)/2, top+20, imageWidth, imageWidth);
    pop();

    push();
    textAlign(CENTER, TOP);
    textSize(10);
    fill(253, 201, 68);
    text(defKing, right+width/2, top+imageWidth+35);
    pop();
    if (defCom[0] != "") {
      push();
      textFont(fontFrankGotRom);
      textAlign(CENTER, TOP);
      textSize(10);
      fill(255, 200);
      defCom.forEach(function(com, i) {
        text(com, right+width/2, top+imageWidth+35 + (i+1) * 15);
      });
      pop();
    } else {
      push();
      textFont(fontFrankGotRom);
      textAlign(CENTER, TOP);
      textSize(10);
      fill(255, 200);
      text("No Commander", right+width/2, top+imageWidth+55);
      pop();
    }
  } else {
    push();
    textFont(fontFrankGotRom);
    textAlign(CENTER, TOP);
    textSize(20);
    fill(255, 200);
    text("No King", right+width/2, top+imageWidth/2);
    pop();
  }

  // win label
  push();
  textFont(font28);
  textSize(25);
  translate((ifAttWin) ? left : right, top+40);
  rotate(-PI/5);
  fill(253, 201, 68);
  text("WIN", 0, 0);
  pop();
}

// function drawBox(box) {
//   fill(255, 20);
//   strokeWeight(.7);
//   stroke(255, 50);
//   rect(box.left, box.top, box.width, box.height);
//   textAlign(CENTER, TOP);
//   fill(255);
//   noStroke();
//
//   // if the box is not clickable: always display info
//   if (!box.clickable) {
//     if (box.title == "Battle Type") {
//       push();
//       textFont(font28);
//       textSize(15);
//       textAlign(LEFT, CENTER);
//       var info = "This is a " + data.getColumn(box.feature[0])[time];
//       text(info, box.left + 23, box.top + box.height/2);
//       pop();
//     } else if (box.title == "Attackers vs Defenders") {
//       drawAttDefInfo(box);
//     } else if (box.title == "size") {
//       drawSizeInfo(box);
//     }
//   } else {
//     // if clickable: display title
//     text(box.title, box.left + box.width / 2, box.top + 5);
//     // if the box is open: display details
//     if (box.open && box.feature) {
//       textAlign(LEFT, TOP);
//       // console.log(data.getColumn(box.feature));
//       var info = "";
//       if (box.feature[0] == "house") {
//         houseList.forEach(function(house) {
//           if (house.involved) info += house.name + ": " + house.involved + "\n";
//         });
//       } else {
//         for (var i = 0; i < box.feature.length; i++) {
//           info += data.getColumn(box.feature[i])[time] + "\n";
//         }
//       }
//       text(info, box.left+5, box.top+30);
//     }
//   }
//   // hover: display details
//   // if (isInsideBox(box)) {
//   //   drawHoverBox(box.title, box.width, box.height, mouseX, mouseY);
//   // }
// }
//
// function drawTitle() {
//   push();
//   textAlign(LEFT, CENTER);
//   textSize(20);
//   fill(255);
//   textFont(fontGOT);
//   text("GAME  OF  THRONES  BATTLES", titleX, titleY);
//   pop();
// }
//
// function drawText(x, y) {
//   textAlign(LEFT, TOP);
//   fill(255, 150);
//   textSize(12);
//   text("Untorem dolut que et ratiant isimaio nsecab\n" +
//         "ceptu restia conet ab im fugitis ut auta s\n" +
//         "renda dolum quia ventia provid mo- luptati\n" +
//         "odici endestior mo et pero blabori o ctis \n" +
//         "eum audae imoloris con restia delicid\n" +
//         "ceptu restia conet ab im fugitis ut auta s\n" +
//         "renda dolum quia ventia provid mo- luptati\n" +
//         "odici endestior mo et pero blabori o ctis \n" +
//         "eum audae imoloris con restia delicid\n" +
//         "quam as dolendi berum nihitatum"
//     , x, y);
// }
//
//
// function drawRightSec(x, y, w, h) {
//   // draw a info board
//   push();
//   fill(0, 50);
//   stroke(255, 100);
//   strokeWeight(0.5);
//   rect(x, y, w, h);
//   pop();
//
//   // draw board title
//   push();
//   textAlign(CENTER, TOP);
//   textFont(font28);
//   textSize(30);
//   text("INFORMATION", x+w/2, y+h/30);
//   pop();
// }
