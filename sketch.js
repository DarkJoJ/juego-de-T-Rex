var PLAY=1;
var END=0;
var gameState=PLAY;

var trex ,trex_running, groundImage, Ground2, gameOverImage, gameOver, restartImage, restart;
var invisibleGround;
var cloudImage, cloud;
var score;
//declarar variable de forma global
//var message="esto es un mensaje";

function preload(){
  //sprites trex
  trex_running=loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided=loadImage("trex_collided.png");
  //imagenes de game over y restart
  restartImage=loadImage("restart.png");
  gameOverImage=loadImage("gameOver.png")
  //elementos del escenario
  groundImage=loadImage("ground2.png");
  cloudImage=loadImage("cloud.png");
  obstaculo1=loadImage("obstacle1.png");
  obstaculo2=loadImage("obstacle2.png");
  obstaculo3=loadImage("obstacle3.png");
  obstaculo4=loadImage("obstacle4.png");
  obstaculo5=loadImage("obstacle5.png");
  obstaculo6=loadImage("obstacle6.png");
  //sonidos
  sound=loadSound("jump.mp3");
  sound1=loadSound("die.mp3");
  sound2=loadSound("checkpoint.mp3");

}

function setup(){
  //declarar variable de forma local
  //var message="esto es un mensaje";
  //console.log(message)

  createCanvas(windowWidth,windowHeight)
  
  //crear sprite de Trex
  trex=createSprite(50,height-40,20,100);
  trex.addAnimation("running",trex_running);
  trex.scale=0.5;
  //sprite game over
  gameOver=createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImage);
  gameOver.visible=false;
  //sprite restart
  restart=createSprite(width/2,height/2);
  restart.addImage(restartImage);
  restart.visible=false;

  trex.x=50;
  //suelo
  ground=createSprite(width/2, height-10,width,125);
  ground.addImage(groundImage);

  trex.addAnimation("collided",trex_collided);
  //suelo invisible
  invisibleGround=createSprite(width/2,height-5,width,1);
  invisibleGround.visible=false;
  var rand=Math.round(random(1,100));
  console.log(rand);
  score=0;

  obstacleGroup=createGroup();
  cloudGroup=createGroup();

  trex.setCollider("circle",0,0,40);
  //trex.debug=true;
  //Inteligencia artificial
  //trex.setCollider("rectangle",0,0,200,trex.height);
  //trex.debug=true;
 
}

function draw(){
  background("white");

  //console.log(message);

  text("Score " +score,width-100,50);
if(gameState===PLAY){
  ground.velocityX=-(2+3*score/100);
   //cambiar en caso de no poder saltar los obstaculos
   if((touches.lenght>0 || keyDown("space")) && trex.y>= height-100){
    trex.velocityY=-10;
    sound.play();
    touches=[];
  }
  trex.velocityY=trex.velocityY+0.5;
  if(ground.x<0){
    ground.x=ground.width/2
  }
  score=score+Math.round(getFrameRate()/60);
  if(score>0 && score%100===0){
    sound2.play();
  }
  aparecerNubes();
  aparecerObstaculos();

  if(obstacleGroup.isTouching(trex)){
    gameState=END
    //trex.velocityY=-9;
    sound1.play();
  }

}
else if(gameState===END){
  ground.velocityX=0;
  trex.velocityY=0;
  gameOver.visible=true;
  restart.visible=true;
  trex.changeAnimation("collided",trex_collided);
  obstacleGroup.setLifetimeEach(-1);
  cloudGroup.setLifetimeEach(-1);

  if((touches.lenght>0 || mousePressedOver(restart))){
    //console.log("reinicia el juego");
    reset();
    touches=[];
  }
  if(mousePressedOver()){

  }

  obstacleGroup.setVelocityXEach(0);
  cloudGroup.setVelocityXEach(0);
}


 
  //console.log(trex.velocityY)
  trex.collide(invisibleGround)
  drawSprites()

  function reset(){
    gameState=PLAY;
    gameOver.visible=false;
    restart.visible=false;
    trex.changeAnimation("running",trex_running);
    obstacleGroup.destroyEach();
    cloudGroup.destroyEach();
    score=0;
  }
  

}
function aparecerNubes(){
  if(frameCount%60===0){
    cloud=createSprite(width,100,40,10)
    cloud.velocityX=-4
    cloud.addImage(cloudImage);
    //cloud.scale=0.4
    cloud.y=Math.round(random(10,height-200))
    cloud.depth=trex.depth
    trex.depth=cloud.depth+1
    cloud.lifetime=350;
    cloudGroup.add(cloud);
  }
  
}
function aparecerObstaculos(){
  if(frameCount%60===0){
    var obstaculo=createSprite(width,height-20,width,125)
    obstaculo.velocityX=-(6+score/100);
    var rand=Math.round(random(1,6))
    switch(rand){
      case 1:obstaculo.addImage(obstaculo1)
      break;
      case 2:obstaculo.addImage(obstaculo2)
      break;
      case 3:obstaculo.addImage(obstaculo3)
      break;
      case 4:obstaculo.addImage(obstaculo4)
      break;
      case 5:obstaculo.addImage(obstaculo5)
      break;
      case 6:obstaculo.addImage(obstaculo6)
      break;
      default:break
    }
    obstaculo.scale=0.6
    obstaculo.lifetime=200
    obstacleGroup.add(obstaculo);
  }
}