let screen = 0;
let score = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(102, 0, 0);

  var heartshape = [
    [0, 1, 1, 0, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0]
  ];

  heart = createImage(9, 8);
  heart.loadPixels();

  for (let i = 0; i < heart.width; i++) {
    for (let j = 0; j < heart.height; j++) {
      if (heartshape[j][i] == 1) {
        heart.set(i, j, color(255, 0, 0));
      } else {
        heart.set(i, j, color(102, 0, 0));
      }
    }
  }
  heart.updatePixels();

  player = new Player(3, 3, 10);
  enemies = [];
  lasers = [];

}


class Player {
  constructor(lives, lasers, size) {
    this.lives = lives;
    this.lasers = lasers;
    this.size = size;
  }

  draw(x) {
    draw_plane(this.size, x - this.size * 6, height - (12 * this.size + 20));
    for (let i = 0; i < this.lives; i++) {
      draw_heart(i * 25 + 5, 5);
    }
    for (let i = 0; i < this.lasers; i++) {
      fill(0,250,0);
      rect(i * 25 + 5,height - 10, 15, 2);
    }
  }


}

class Laser {
  constructor(x,y,w,h) {
    this.y = y;
    this.x = x;
    this.color = 'green';
    this.h = h;
    this.w = w;
  }

  draw() {
    fill(this.color);
    rect(this.x,this.y,this.w,this.h);
    this.y -= 2;
  }

  getBounds() {
    return { x: this.x - this.w, y: this.y - this.h, w: this.w, h: this.h };
  }

}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Enemy {
  constructor() {
    this.size = 9;
    this.width = this.size * 12;
    this.height = this.size * 12;
    this.x = randInt(this.width, width - this.width);
    this.color = 'red';
    this.y = -this.height;
    this.speed = randInt(30, 50) / 10;
  }

  draw() {
    this.y += this.speed;
    draw_plane(this.size, this.x, this.y, this.color, false);
  }

  getBounds() {
    return { x: this.x - this.width, y: this.y - this.height, w: this.width, h: this.height };
  }

}

function draw_plane(a, x, y, color = 255, facingUp = true) {
  push();
  fill(color);
  if (facingUp) {
    translate(x, y);
  } else {
    translate(x, y);
    rotate(PI);
  }
  beginShape();
  vertex(a * 6, a * 0);
  vertex(a * 5, a * 2);
  vertex(a * 5, a * 4);
  vertex(a * 0, a * 5);
  vertex(a * 0, a * 6);
  vertex(a * 5, a * 6);
  vertex(a * 5, a * 11);
  vertex(a * 4, a * 12);
  vertex(a * 8, a * 12);
  vertex(a * 7, a * 11);
  vertex(a * 7, a * 6);
  vertex(a * 12, a * 6);
  vertex(a * 12, a * 5);
  vertex(a * 7, a * 4);
  vertex(a * 7, a * 2);
  endShape(CLOSE);
  pop();
}

function draw_heart(x, y) {
  image(heart, x, y, 20, 18);
}

function game_over() {

  textAlign(CENTER);

  textSize(150);
  fill(255, 0, 0);
  text('Game Over', width / 2, 350);

  textSize(25);
  fill(206, 212, 36);
  text('Click to restart', width / 2, 400);

  fill(0);
  stroke(0);
  textAlign(LEFT);

}

function how_to_play() {

  textAlign(CENTER);
  draw_text('How To Play', 75, 0, width / 2, 75);

  draw_text('1. Use the space bar to shoot a laser', 25, 0, width / 2, 0.25 * height);
  draw_text('2. Move the mouse left and right to move the plane', 25, 0, width / 2, 0.325 * height);
  draw_text('Click to start', 25, 0, width / 2, 0.4 * height);


  fill(255);
  stroke(0);
  let planesize = (0.45 * height) / 12;
  let planey = 0.525 * height;
  draw_plane(planesize, mouseX - planesize * 6, 0.5 * height);

  textAlign(LEFT);

}

function draw_text(s, size, color, x, y) {
  fill(color);
  textSize(size);
  while (textWidth(s) > width) {
    size -= 5;
    textSize(size);
  }
  text(s, x, y);
}

function intro() {

  textAlign(CENTER);

  draw_text('Airplane Traffic', 100, 0, width / 2, 0.5 * height);
  draw_text('click to continue', 20, 0, width / 2, 0.2 * height);

  fill(255);
  stroke(0);
  let planesize = (0.45 * height) / 12;
  let planey = 0.525 * height;
  draw_plane(planesize, width / 2 - 6 * planesize, planey);

  textAlign(LEFT);

}

function draw() {

  background(102, 0, 0);

  switch (screen) {
    case 0: // intro screen
      intro();
      break;
    case 1: // instructions
      how_to_play();
      break;
    case 2: // playing the game

      // clear the screen
      background(102, 0, 0);

      // Draw the player
      player.draw(mouseX);

      // Draw the Score
      draw_text('Score: ' + score, 25, 255, width - 150, height - 25);

      // Draw the enemies
      for(let i = 0; i < enemies.length; i++) {
        if (enemies[i].y > height + 108) {
          enemies.splice(i, 1);
          score++;
        } else {
          enemies[i].draw();
          let b = enemies[i].getBounds();
          fill(0, 0, 0, 0);
          rect(b.x, b.y, b.w, b.h);
        }
      }

      // Draw the lasers
      for(let i = 0; i < lasers.length; i++) {
        lasers[i].draw();
      }

      let create_new_enemy = randInt(1,60);
      if (create_new_enemy == 6) {
        enemies.push(new Enemy());
      }


      break;
    case 3: // game over
      game_over();
      break;
  }

}

function keyPressed() {
  if (keyCode === 32) {
    lasers.push(new Laser(20,450,5,25));
  }
}

function mouseReleased() {
  if (screen == 0 || screen == 1) {
    screen++;
  } else if (screen == 3) {
    screen = 0;
  }
}
