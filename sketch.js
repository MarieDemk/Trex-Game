
var trex ,trex_running, trex_standing, trex_dead;
var ground,groundImg;
var cloud,cloudImg;
var cactus;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score = 0;
var cloudsGroup, cactiGroup;
var gamestate = "serve";
var gameover, gameoverImg;
var restart, restartImg;
var checkpoint, jump, die;
var cf = 25;
var hscore = 0;
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_standing = loadAnimation("trex1.png");
  trex_dead = loadAnimation("trex_collided.png");
  groundImg = loadImage("ground2.png");
  cloudImg = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameoverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  checkpoint = loadSound("checkpoint.mp3");
  jump = loadSound("jump.mp3");
  die = loadSound("die.mp3");
}

function setup(){
  createCanvas(600,200)
  
  //create a trex sprite
  ground = createSprite(300,180,600,5);
  ground.addImage(groundImg);
  fakeGround = createSprite(300,190,600,5);
  fakeGround.visible = false;
  trex = createSprite(50,190,20,50);
  trex.scale = 0.5;
  trex.addAnimation("run",trex_running);
  trex.addAnimation("stand",trex_standing);
  trex.addAnimation("dead",trex_dead);
  var a = Math.round(random(30,400));
  console.log(a);
  cloudsGroup = new Group();
  cactiGroup = createGroup();
 // trex.debug = true;
  trex.setCollider("circle", 0, 0, 40);
  gameover = createSprite(300,100,200,20);
  gameover.addImage(gameoverImg);
  gameover.scale = 0.8;
  restart = createSprite(300,150,10,10);
  restart.addImage(restartImg);
  restart.scale = 0.5;
}

function draw(){
  background("steelblue");

  if (gamestate == "serve") {
    if (hscore > 0) {
      highscore();
    }
    fill("white");
    textSize(30);
    text("Press space to start", 165,100);
    trex.changeAnimation("stand");
    if (keyDown("space")) {
      gamestate = "play";
    }
    gameover.visible = false;
    restart.visible = false;
  }
  if (gamestate == "play") {
    if (hscore > 0) {
      highscore();
    }
    trex.changeAnimation("run");
    if (trex.collide(fakeGround) && keyDown("space")) { 
      trex.velocityY = -23;
      jump.play();
    }
    if (ground.x < -400) {
      ground.x = 700;
    }
    trex.velocityY = trex.velocityY + 2.8;
    ground.velocityX = -15;
    score = score + Math.round(getFrameRate() / 30);
    clouds();
    cacti();
    gameover.visible = false;
    restart.visible = false;
    if (score % 200 == 0) {
      checkpoint.play();
    }
    if (trex.isTouching(cactiGroup)) {
      die.play();
      gamestate = "end";
    }
  }
  if (gamestate == "end") {
    trex.velocityY = 0;
    ground.velocityX = 0;
    trex.changeAnimation("dead");
    // freezing everything
    cloudsGroup.setVelocityXEach(0);
    cactiGroup.setVelocityXEach(0);
    // fixing the disapearing objects issue
    cloudsGroup.setLifetimeEach(-1);
    cactiGroup.setLifetimeEach(-1);
    gameover.visible = true;
    restart.visible = true;
    if (mousePressedOver(restart)) {
      reset();
    }
    if (score > 0) {
      highscore();
    }
  }
  
  trex.collide(fakeGround);
  fill("white");
  textSize(17);
  text("Score:"+score,470,20);
  drawSprites();
}
function clouds(){
  if(frameCount % 30 == 0) {
    cloud = createSprite(600,100,40,10);
    cloud.addImage(cloudImg);
    cloud.scale = 0.5;
    cloud.y = Math.round(random(20,140));
    cloud.velocityX = -8;
    // adjusting the depth to avoid overlapping issues
    trex.depth = cloud.depth + 1;
    cloud.depth = gameover.depth - 1;
    // fixing memory leak issue for the clouds
    cloud.lifetime = 210;
    cloudsGroup.add(cloud);
  }
}
function cacti(){
  if(frameCount % 25 == 0) {
    cactus = createSprite(600,160,20,60);
    cactus.velocityX = -(15 + score / 50);
   // cf = cf - Math.round(score / 20);
    cactus.scale = 0.55;
    cactus.lifetime = 200;
    cactiGroup.add(cactus);
    cactus.depth = restart.depth - 1;
    var numbers = Math.round(random(1,6));
    switch (numbers) {
      case 1: cactus.addImage(obstacle1);
      break;
      case 2: cactus.addImage(obstacle2);
      break;
      case 3: cactus.addImage(obstacle3);
      break;
      case 4: cactus.addImage(obstacle4);
      break;
      case 5: cactus.addImage(obstacle5);
      break;
      case 6: cactus.addImage(obstacle6);
      break;
      default: 
      break;
    }
  }
}
function reset(){
  gamestate = "play";
  score = 0;
  cactiGroup.destroyEach();
  cloudsGroup.destroyEach();
  cactiGroup.x = 600;
  cloudsGroup.x = 600;

}
function highscore(){
  if (score > hscore && gamestate == "end"){
    hscore = score;
  }
  
  fill("white");
  textSize(17);
  text("High Score:"+hscore,330,20);
}
