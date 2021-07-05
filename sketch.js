//dimension zone de jeu
var LARGEUR = 700;
var HAUTEUR = 500;
var speedlaser = 10;
var speed = 1;
var timer = 0;
var pointt = 0;
var best = 0;
// variables pour les scores
var lives = 5;
//variables pour créer les sprites
var vaisseau;
var play;
//variables pour les images
var nebulaImg, vaisseauImg, rockImg;
var explosionImg;
var laserImg;
var playImg;

//gamestate
var gamestate = 0;

//variables pour les groupes
var rockgroup;
var lasergroup;

function preload() {
  //télécharger les images ici
  nebulaImg = loadImage("nebula.png");
  vaisseauImg = loadImage("spaceship.png");
  rockImg = loadImage("rock.png");
  explosionImg = loadAnimation(
    "e0.png",
    "e1.png",
    "e2.png",
    "e3.png",
    "e4.png",
    "e5.png",
    "e6.png",
    "e7.png",
    "e8.png",
    "e9.png",
    "e10.png",
    "e11.png",
    "e12.png",
    "e13.png",
    "e14.png",
    "e15.png"
  );
  playImg = loadImage("play.png");
  laserImg = loadImage("laser.png");
}

function setup() {
  createCanvas(LARGEUR, HAUTEUR);
  vaisseau = createSprite(LARGEUR / 2, HAUTEUR / 2);
  vaisseau.addImage(vaisseauImg);
  vaisseau.scale = 0.1;
  rockgroup = createGroup();
  vaisseau.debug = false;
  vaisseau.setCollider("rectangle", 0, 0, 450, 500);
  lasergroup = createGroup();
  play = createSprite(LARGEUR / 2, HAUTEUR / 1.3);
  play.addImage(playImg);
  play.scale = 0.09;
}

function draw() {
  background(nebulaImg);
  drawSprites();

  if (gamestate === 0) {
    if (mousePressedOver(play)) {
      gamestate = 1;
      play.visible = false;
    }
  }

  if (gamestate === 1) {
    timer++;
    //tourner le vaisseau

    if (keyDown("q")) {
      vaisseau.rotation -= 11;
    }

    if (keyDown("d")) {
      vaisseau.rotation += 11;
    }

    //faire avancer le vaisseau

    if (keyDown("z")) {
      vaisseau.velocityX += Math.cos(radians(vaisseau.rotation)) * speed;
      vaisseau.velocityY += Math.sin(radians(vaisseau.rotation)) * speed;
    }

    //faire ralentir le vaisseau

    vaisseau.velocityX *= 0.9;
    vaisseau.velocityY *= 0.9;
    //traverser l'écran
    throughscreen(vaisseau);

    // PLAY

    //générer rocks et lasers
    spawnRocks();
    spawnLaser();

    //collision rocher-vaisseau
    for (var i = 0; i < rockgroup.length; i++) {
      if (rockgroup.get(i).isTouching(vaisseau)) {
        var explosion;
        explosion = createSprite(rockgroup.get(i).x, rockgroup.get(i).y);
        explosion.addAnimation("explosion", explosionImg);
        explosion.scale = 1.5;
        rockgroup.get(i).destroy();
        explosion.lifetime = 20;
        lives -= 1;
      }
    }

    //collision rocher-laser
    for (var k = 0; k < lasergroup.length; k++) {
      for (var j = 0; j < rockgroup.length; j++)
        if (lasergroup.get(k).isTouching(rockgroup.get(j))) {
          var explosion2;
          explosion2 = createSprite(rockgroup.get(j).x, rockgroup.get(j).y);
          explosion2.addAnimation("explosion", explosionImg);
          explosion2.scale = 1.5;
          rockgroup.get(j).destroy();
          explosion2.lifetime = 20;
          lasergroup.get(k).destroy();
          pointt += 100;
        }
    }
  }
  for (var l = 0; l < rockgroup.length; l++) {
    throughscreen(rockgroup.get(l));
  }
  // GAME OVER
  if (lives === 0) {
    gamestate = 2;
  }
  if (gamestate === 2) {
    play.visible = true;
    textFont("georgia");
    textSize(HAUTEUR / 5);
    fill("red");
    text("GAME OVER😂", LARGEUR / 12, HAUTEUR / 2);
    if (pointt > best) {
      best = pointt;
    }
    if (mousePressedOver(play)) {
      gamestate = 1;
      play.visible = false;
      lives = 5;
      pointt = 0;
      vaisseau.x = LARGEUR / 2;
      vaisseau.y = HAUTEUR / 2;
    }
  }
  //vies et score

  textFont("georgia");
  textSize(LARGEUR * 0.05);
  fill("red");
  text("lives: " + lives, LARGEUR * 0.1, HAUTEUR * 0.1);
  text("points:  " + pointt, LARGEUR * 0.7, HAUTEUR * 0.1);
  text("best: " + best, LARGEUR * 0.7, HAUTEUR * 0.2);
}

function throughscreen(sprites) {
  if (sprites.y > HAUTEUR) {
    sprites.y = 0;
  }
  if (sprites.y < 0) {
    sprites.y = HAUTEUR;
  }
  if (sprites.x > LARGEUR) {
    sprites.x = 0;
  }
  if (sprites.x < 0) {
    sprites.x = LARGEUR;
  }
}

function spawnRocks() {
  if (timer % 50 === 0) {
    var x = Math.random() * LARGEUR;
    var y = Math.random() * HAUTEUR;
    while (Math.abs(x - vaisseau.x) < 200 && Math.abs(y - vaisseau.y) < 200) {
      x = Math.random() * LARGEUR;
      y = Math.random() * HAUTEUR;
    }
    var rock = createSprite(x, y);
    rock.addImage(rockImg);
    rock.scale = 0.1;
    rock.velocityX = Math.random() * (10 + pointt / 100) - (5 + pointt / 200);
    rock.velocityY = Math.random() * (10 + pointt / 100) - (5 + pointt / 200);
    rock.rotationSpeed = 5;
    rockgroup.add(rock);
    rock.lifetime = 160;
    rock.debug = false;
    rock.setCollider("circle", 0, 0, 200);
  }
}

function spawnLaser() {
  if (mouseDown("leftButton")) {
    var laser;
    laser = createSprite(
      vaisseau.x + 40 * Math.cos(radians(vaisseau.rotation)),
      vaisseau.y + 40 * Math.sin(radians(vaisseau.rotation))
    );
    laser.addImage(laserImg);
    laser.scale = 0.3;
    laser.rotation = vaisseau.rotation;
    laser.velocityX += Math.cos(radians(vaisseau.rotation)) * speedlaser;
    laser.velocityY += Math.sin(radians(vaisseau.rotation)) * speedlaser;
    laser.lifetime = 100;
    lasergroup.add(laser);
    laser.debug = false;
    laser.setCollider("rectangle", -10, 0, 120, 30);
  }
}
