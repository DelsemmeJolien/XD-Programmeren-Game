//details (font - sounds - ...)
let gameFont;
let catSound;
let jumpSound;
let collectSound;
let loseSound;
let winSound;
let hasPlayed = false; 

//screen
let stage = 0;

//objecten 
let mouse;
let finish;

//gravity --- gemaakt met behulp van youtube Jason Erdreich : programming a retro-style video game in p5.js - Part 4
let jump = false; //jumping

let direction = 1; //force of gravity in y direction
let velocity = 2; //Speed player
let jumpPower = 13; //hoogte sprong player
let fallingSpeed = 2; //=velocity

let minHeight = 350; //hoogte grond
let maxHeight = 50; //max hoogte sprong
let jumpCounter = 0;

//arrays
let cats = [];
let points = [];
let clouds = [];

function setup() {
    createCanvas(800, 400);

    preLoad(); //geluid inladen

    //objecten aanmaken
    cats = [
        new Enemy(400, 350),
        new Enemy(650, 350)
    ];

    points = [
        new Point(550, 350),
        new Point(750, 250)
    ];

    clouds = [
        new Cloud(75, 120),
        new Cloud(300, 60),
        new Cloud(500, 110),
        new Cloud(700, 70)
    ];

    mouse = new Player(100, 350);
    finish = new Finish(640, 340);
}

function draw() {
    // game fases
    if(stage == 0){
       start();
    }

    if(stage == 1){
        game();
    }

    if(mouse.lives <= 0){
        stage = 2;
    }

    if(stage == 2){
        loseGame();
    }

    if(stage == 3){
        winGame();
    }
}

//game screens
function start(){ //teken start scherm
    background(0, 155, 255);

    fill(93, 140, 91);
    rect(0, 350, width, height);

    //draw cheese
    noStroke();
    fill(252, 186, 3)
    rect(655, 315, 25, 25, 5);

    fill(214, 160, 11);
    circle(655 + 5, 315 + 19, 10);
    circle(655 + 16, 315 + 6, 12);

    fill(252, 186, 3)
    rect(640, 340, 25, 25, 5);

    fill(214, 160, 11);
    circle(640 + 5, 340 + 19, 10);
    circle(640 + 16, 340 + 6, 12);

    fill(252, 186, 3)
    rect(670, 340, 25, 25, 5);
    fill(214, 160, 11);
    circle(670 + 5, 340 + 19, 10);
    circle(670 + 16, 340 + 6, 12);

    //draw mouse
    mouse.drawPlayer();

    //draw clouds
    for(let i = 0; i < clouds.length; i++){
        clouds[i].drawCloud();
    }
    
    //text
    noStroke();
    fill(252, 186, 3)
    rect(350, 290, 100, 50, 5);  //start button

    textFont(gameFont);
    fill(0);
    textSize(50);
    text('MAC & CHEESE', 295, 50);

    textSize(40);
    text('GET MAC THE MOUSE HOME TO HIS FAMILY,', 150, 125);
    text('AVOID THE CATS AND COLLECT CHEESE ON THE WAY HOME', 35, 175);

    text('HOW TO PLAY:', 325, 230);
    text('PRESS THE SPACEBAR TO JUMP', 210, 275);

    textSize(30);
    text('START', 372, 323);
    textSize(24);
    text('BY: JOLIEN DELSEMME', 310, 380);
}

function game() { //teken game scherm
    let x = 600;
    let y = 350;

    //background
    background(0, 155, 255);

    fill(93, 140, 91);
    rect(0, 350, width, height);
    
    //move player
    keyPressed();
    gravity();

    //draw mouse
    mouse.drawPlayer();

    //draw clouds
    for(let i = 0; i < clouds.length; i++){
        clouds[i].drawCloud();
        clouds[i].move();

        if(clouds[i].x + 75 < 0) {
            clouds[i].x = 800;
            clouds[i].y = random(55, 130);
        }
    }

    //check score? -> draw cats and chesse --> collision?
    if(mouse.score < 3){
        //cats/enemys
        for(let i = 0; i < cats.length; i++){
            cats[i].drawEnemy();
            //collision
            if(cats[i].checkCollision(mouse.x, mouse.y)){
                mouse.lives--;
                cats.shift();

                mouse.x = 100;
                mouse.y = 350;

                cats.push(new Enemy(random((450), 800), 350));
                
            } else if (cats[i].x <= 0){
                cats.shift();
                cats.push(new Enemy(random((600), 800), 350));
            }
            cats[i].move();
        }

        //cheese/points
        for(let i = 0; i < points.length; i++){
            points[i].drawPoint();
            //collisions
            if (points[i].checkCollision(mouse.x, mouse.y)){
                mouse.score++;
                points[i].removePoint();

                points.shift();
                points.push(new Point(random(500, 800), random(250, 350)));
                
                
            } else if(points[i].x <= 0){
                points.shift();
                points.push(new Point(random(650, 800), random(250, 350)));
            }

            points[i].move(); 
        }
    }

    //check score groter dan 3 -> draw finish, move player, check collision -> win screen
    if(mouse.score >= 3){
        finish.drawFinish();

        mouse.move();

        if(finish.checkCollision(mouse.x, mouse.y)){
            stage = 3;
        }
    }

    //text
    textFont(gameFont);
    fill(0);
    textSize(25);
    text('POINTS:', 15, 30);
    text(mouse.score, 83, 30);
    text('LIVES:', 15, 55);
    text(mouse.lives, 70, 55);

}

function winGame(){ //teken win scherm
    //x y mouse
    let m1x = 580;
    let m1y = 350;

    //eenmalig win geluid
    if(!winSound.isPlaying() && !hasPlayed){
        winSound.play();  
        hasPlayed = true;
    }

    background(0, 155, 255);

    fill(93, 140, 91);
    rect(0, 350, width, height);

    //draw cheese
    noStroke();
    fill(252, 186, 3)
    rect(655, 315, 25, 25, 5);

    fill(214, 160, 11);
    circle(655 + 5, 315 + 19, 10);
    circle(655 + 16, 315 + 6, 12);

    fill(252, 186, 3)
    rect(640, 340, 25, 25, 5);

    fill(214, 160, 11);
    circle(640 + 5, 340 + 19, 10);
    circle(640 + 16, 340 + 6, 12);

    fill(252, 186, 3)
    rect(670, 340, 25, 25, 5);
    fill(214, 160, 11);
    circle(670 + 5, 340 + 19, 10);
    circle(670 + 16, 340 + 6, 12);

    //draw mouse 1
    stroke(232, 181, 212);
    strokeWeight(2);
    line(m1x - 15, m1y + 20, m1x - 40, m1y + 15);
    
    stroke(134, 140, 133);
    fill(134, 140, 133);
    circle(m1x + 10, m1y - 25, 30);
    fill(232, 181, 212);
    circle(m1x + 10, m1y - 25, 20);

    fill(134, 140, 133); //grijs
    triangle(m1x + 5, m1y + 25, m1x  + 10, m1y - 22, m1x + 50, m1y + 25);
    circle(m1x, m1y, 50);

    circle(m1x - 7, m1y - 23, 30);
    fill(232, 181, 212);
    circle(m1x - 7, m1y - 23, 20);

    fill(232, 181, 212);
    circle(m1x + 45, m1y + 20, 10);
    
    fill(0);
    circle(m1x + 25, m1y + 5, 6);

    //draw mouse 2
    stroke(232, 181, 212);
    strokeWeight(2);
    line(765, 370, 790, 365);
    
    stroke(134, 140, 133);

    fill(134, 140, 133);
    circle(760, 325, 30);

    fill(232, 181, 212);
    circle(760, 325, 20);

    fill(134, 140, 133);
    triangle(745, 375, 700, 375, 740, 325);
    circle(750, 350, 50);

    circle(743, 327, 30);
    fill(232, 181, 212);
    circle(743, 327, 20);

    fill(232, 181, 212);
    circle(703, 372, 10);

    fill(0);
    circle(725, 355, 6);

    //clouds
    for(let i = 0; i < clouds.length; i++){
        clouds[i].drawCloud();
    }

    //text
    noStroke();

    fill(252, 186, 3)
    rect(325, 290, 140, 50, 5);  //start button

    textFont(gameFont);
    fill(0);
    textSize(50);
    text('YAAAY!', 340, 180);
    text('MAC IS SAFELY HOME', 225, 230);
    textSize(30);
    text('POINTS:', 350, 270);
    text(mouse.score, 430, 270);
    text('PLAY AGAIN', 340, 325);
}

function loseGame(){ //teken verlies scherm
    let x = 100;
    let y = 350;

    //eenmalig verlies geluid
    if(!loseSound.isPlaying() && !hasPlayed){
        loseSound.play();
        hasPlayed = true;
    }

    background(0, 155, 255);

    fill(93, 140, 91);
    rect(0, 350, width, height);

    //draw cheese
    noStroke();
    fill(252, 186, 3)
    rect(655, 315, 25, 25, 5);

    fill(214, 160, 11);
    circle(655 + 5, 315 + 19, 10);
    circle(655 + 16, 315 + 6, 12);

    fill(252, 186, 3)
    rect(640, 340, 25, 25, 5);

    fill(214, 160, 11);
    circle(640 + 5, 340 + 19, 10);
    circle(640 + 16, 340 + 6, 12);

    fill(252, 186, 3)
    rect(670, 340, 25, 25, 5);
    fill(214, 160, 11);
    circle(670 + 5, 340 + 19, 10);
    circle(670 + 16, 340 + 6, 12);

    //draw mouse
    stroke(232, 181, 212);
    strokeWeight(2);
    line(x - 15, y + 20, x - 40, y + 15);
    
    stroke(134, 140, 133);
    fill(134, 140, 133);
    circle(x + 10, y - 25, 30);
    fill(232, 181, 212);
    circle(x + 10, y - 25, 20);

    fill(134, 140, 133); //grijs
    triangle(x + 5, y + 25, x  + 10, y - 22, x + 50, y + 25);
    circle(x, y, 50);

    circle(x - 7, y - 23, 30);
    fill(232, 181, 212);
    circle(x - 7, y - 23, 20);

    fill(232, 181, 212);
    circle(x + 45, y + 20, 10);

    fill(0);
    circle(x + 25, y + 5, 6);

    //clouds
    for(let i = 0; i < clouds.length; i++){
        clouds[i].drawCloud();
    }

    //text
    noStroke();

    fill(252, 186, 3)
    rect(325, 255, 140, 50, 5);  //start button

    textFont(gameFont);
    fill(0);
    textSize(50);
    text('GAME OVER', 310, 200);
    textSize(30);
    text('POINTS:', 350, 240);
    text(mouse.score, 430, 240);
    text('TRY AGAIN', 345, 290);
}

function resetGame(){ //reset de game scores en arrays -> naar start scherm
    mouse.score = 0;
    mouse.lives = 3;
    mouse.x = 100;
    mouse.y = 350;

    for(let i = 0 ; i < cats.length; i++){
        cats.shift();
    }

    for(let i = 0 ; i < points.length; i++){
        points.shift();
    }

    cats.push(new Enemy(725, 350));
    points.push(new Point(800, 350));

    stage = 0;
}

//springen?
//gemaakt met behulp van youtube Jason Erdreich : programming a retro-style video game in p5.js - Part 4
function gravity() {
    //stop vallen door de grond
    if(mouse.y >= minHeight && jump == false){
        mouse.y = mouse.y;
        jumpCounter = 0; //reset jumpCounter bij het landen
    }else{
        mouse.y = mouse.y + (direction * velocity);
    }

    //springen
    if(jump == true){
        if(mouse.y <= maxHeight || jumpCounter >= jumpPower){ //maxheigt of maximum jumppower
            velocity = fallingSpeed; //vallen
        } else {
            velocity ++;
            velocity = -jumpPower; //y-as minderen, springen
            jumpCounter++;
        } 
    } else{
        velocity = fallingSpeed;
    }
   
}

//spacebar ingedrukt?
function keyPressed(){
    if(keyIsDown(32) && stage == 1) {
        if(!jumpSound.isPlaying()){
            jumpSound.play();
        }
        jump = true; //spring

    }else{
        jump = false;
    } 
}

//start, try again knop ingedrukt?
function mousePressed(){
    //start
    if(stage == 0 && mouseX > 350 && mouseX < 450 && mouseY > 290 && mouseY < 340){
        stage = 1;
    }

    //lose game
    if(stage == 2 && mouseX > 325 && mouseX < 465 && mouseY > 255 && mouseY < 305){
        resetGame();
        stage = 0;
    }

    //win game
    if(stage == 3 && mouseX > 325 && mouseX < 465 && mouseY > 290 && mouseY < 340){
        resetGame();
        stage = 0;
    }
}

//preload sound
function preLoad(){
    //custom font
    gameFont = loadFont('./media/Jersey10-Regular.ttf');
    catSound = loadSound('/media/cat.mp3');
    jumpSound = loadSound('/media/jump.mp3');
    collectSound = loadSound('/media/collect.mp3');
    loseSound = loadSound('/media/youlose.mp3');
    winSound = loadSound('/media/youwin.mp3');
}

//klasses

class Finish{ //finish lijn
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 25;
    }

    drawFinish(){
        //draw cheese
        noStroke();

        fill(252, 186, 3)
        rect(this.x, this.y, this.w, this.w, 5);

        fill(214, 160, 11);
        circle(this.x + 5, this.y + 19, 10);
        circle(this.x + 16, this.y + 6, 12);

        fill(252, 186, 3)
        rect(655, 315, 25, 25, 5);

        fill(214, 160, 11);
        circle(655 + 5, 315 + 19, 10);
        circle(655 + 16, 315 + 6, 12);

        fill(252, 186, 3)
        rect(670, 340, 25, 25, 5);

        fill(214, 160, 11);
        circle(670 + 5, 340 + 19, 10);
        circle(670 + 16, 340 + 6, 12);

        //draw mouse
        //tail
        stroke(232, 181, 212);
        strokeWeight(2);
        line(765, 370, 790, 365);
        
        //achterste oor
        stroke(134, 140, 133);

        fill(134, 140, 133);
        circle(760, 325, 30);

        fill(232, 181, 212);
        circle(760, 325, 20);

        //lichaam
        fill(134, 140, 133);
        triangle(745, 375, 700, 375, 740, 325);
        circle(750, 350, 50);

        //voorste oor
        circle(743, 327, 30);

        fill(232, 181, 212);
        circle(743, 327, 20);

        // neus
        fill(232, 181, 212);
        circle(703, 372, 10);

        //oog
        fill(0);
        circle(725, 355, 6);
        noStroke();

    }

    checkCollision(playerX, playerY){
        if(playerX + 45 >= this.x - this.w / 2 && playerX <= this.x + this.w / 2 && playerY >= this.y - this.w / 2 && playerY - 25 <= this.y + this.w / 2 ) { 
            return true;
        }
        return false;
    }
}

class Cloud{ //wolken achtergrond
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = 60;
    }

    drawCloud(){
        noStroke();
        fill(255);
        circle(this.x, this.y, this.r);
        circle(this.x + 32, this.y - 20, this.r);
        circle(this.x + 40, this.y + 10, this.r);
        circle(this.x + 70, this.y -5, this.r);
    }

    move() {
        this.x = this.x - 0.5;

        if(this.x < 0){

        }
    }

}

class Player { //speler - mouse
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 2; 
        this.score = 0;
        this.lives = 3;
    }

    drawPlayer(){
        //tail
        stroke(232, 181, 212);
        strokeWeight(2);
        line(this.x - 15, this.y + 20, this.x - 40, this.y + 15);
        
        //achterste oor
        stroke(134, 140, 133);

        fill(134, 140, 133);
        circle(this.x + 10, this.y - 25, 30);

        fill(232, 181, 212);
        circle(this.x + 10, this.y - 25, 20);

        //lichaam
        fill(134, 140, 133);
        triangle(this.x + 5, this.y + 25, this.x + 10, this.y - 22, this.x + 50, this.y + 25);
        circle(this.x, this.y, 50);

        //voorste oor
        circle(this.x - 7, this.y - 23, 30);

        fill(232, 181, 212);
        circle(this.x -7, this.y - 23, 20);

        // neus
        fill(232, 181, 212);
        circle(this.x + 47, this.y + 22, 10);

        //oog
        fill(0);
        circle(this.x + 25, this.y + 5, 6);
    }

    move() {
        this.x = this.x + this.speed;
    }
}

class Enemy extends Player { //vijand - cat
    constructor(x, y) {
        super(x, y);
        this.speed = 2;
        this.enemyW = 60;
        this.touched = false;
    }

    drawEnemy() {
        //draw cat - enemy
        stroke(80);
        fill(36, 27, 2);
        //oren
        triangle(this.x - 28, this.y - 25, this.x - 22, this.y - 40, this.x - 17, this.y - 30);
        triangle(this.x - 12, this.y - 30, this.x - 6, this.y - 40, this.x - 1, this.y - 25);
        //lichaam
        ellipse(this.x, this.y, this.enemyW, 40);
        ellipse(this.x - 15, this.y - 15, 35, 32);

        fill(240);
        noStroke();
        //ogen
        circle(this.x - 10, this.y - 20, 4);
        circle(this.x - 22, this.y - 20, 4);
        fill(232, 181, 212)
        //neus
        triangle(this.x - 19, this.y - 10, this.x - 13, this.y - 10,  this.x - 16, this.y - 7);
    }

    checkCollision(playerX, playerY){
        if(playerX + 45 >= this.x - this.enemyW / 2 && playerX  <= this.x + this.enemyW / 2 && playerY >= (this.y - 20) - this.enemyW / 2 && playerY <= (this.y - 20) + this.enemyW / 2 ) { 
            if(!catSound.isPlaying()){
                catSound.play();
            }
            return true;
        }
        return false;
    }

    move() {
        this.x = this.x - this.speed;
    }
}

class Point extends Player { //punten - cheese
    constructor(x, y) {
        super(x, y);
        this.speed = 2;
        this.pointW = 25;
        this.collected = false;
    }

    drawPoint() {
        noStroke();
        fill(252, 186, 3)
        rect(this.x, this.y, this.pointW, this.pointW, 5);
 
        fill(214, 160, 11);
        circle(this.x + 5, this.y + 19, 10);
        circle(this.x + 16, this.y + 6, 12);
    }

    checkCollision(playerX, playerY){
        if(playerX + 45 >= this.x - this.pointW / 2 && playerX <= this.x + this.pointW / 2 && playerY >= this.y - this.pointW/2 && playerY -25 <= this.y + this.pointW/2 ) {
            if(!collectSound.isPlaying()){
                collectSound.play();
            }
            collectSound.play();
            return true;
        }
        return false;
    }

    removePoint() {
        this.x = -1000;
        this.y = -1000;
    }

    move() {
        this.x = this.x - this.speed;
    }
}
