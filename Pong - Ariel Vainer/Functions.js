const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

const FPS = 60;

const ballR = 35;

const paddleW = 25;
const paddleH = 150;

const winScore = 3;

let screen = 1;

let difficulty = 2;

let mouseX = 0, mouseY = 0, click;

let scoreL = 0, scoreR = 0;

let ballState = 0, side = 0;

// function to draw rectangle
function drawRect(x, y, w, h, color, mode) {
    context.fillStyle = color;
    if (mode === "center") {
        context.fillRect(x - w / 2, y - h / 2, w, h)
    } else {
        context.fillRect(x, y, w, h);
    }
}

// function to draw circle
function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

// function to draw text
function drawText(text, font, x, y, color) {
    context.fillStyle = color;
    context.font = font;
    context.textAlign = "center";
    context.fillText(text, x, y);
}

// function to check collision between to rectangles
function rectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return (x1 + w1 > x2 && x1 < x2 + w2 && y1 + h1 > y2 && y1 < y2 + h2)
}

// function to get a random number between the min and the max
function getRndNum(min, max) {
    return (Math.random() * (max - min + 1)) + min;
}

// function to get a random number between min and max, excluding a certain range near the 0
function getRndNumRestrictions(min, max, minr, maxr) {
    let value = 0;
    while (value > minr && value < maxr) {
        value = getRndNum(min, max);
    }
    return value;
}

// function to check if mouse is inside a certain rectangle and if it is clicked
function mouseInside(x, y, w, h, mode, mouse) {
    let value;
    if (mode === "center") {
        value = (mouseX >= x - w / 2 && mouseX <= x + w / 2 && mouseY >= y - h / 2 && mouseY <= y + h / 2)
    } else {
        value = (mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h)
    }

    if (mouse === 0) {
        return value;
    } else {
        return (value && click);
    }
}

// function to make a button using 2 rectangle, text, 2 different colors - one default, and one when hovering
function makeButton(x, y, w, h, color1, color2, mode, text, font, tx, ty, diff, s) {
    let buttonColor = color1;
    if (mouseInside(x, y, w, h, mode, 0) || difficulty == diff || side == s) {
        buttonColor = color2;
    }

    drawRect(x, y, w, h, "black", mode);

    if (mode === "center") drawRect(x, y, w - 5, h - 5, buttonColor, mode);
    else drawRect(x + 2.5, y + 2.5, w - 5, h - 5, buttonColor, mode);

    drawText(text, font, tx, ty, "black");
}

// get mouse coordinates and put them into values
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt) {
    let rect = canvas.getBoundingClientRect();

    let pos = {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };

    mouseX = pos.x;
    mouseY = pos.y;
}

// get mouse click state and put it into a boolean
canvas.addEventListener("mousedown", getClick);

function getClick() {
    click = true;
}

// load all data
const song = new Audio();
song.src = "sounds/song.ogg";

const intro = new Audio();
intro.src = "sounds/intro.ogg";

const finish = new Audio();
finish.src = "sounds/finish.ogg";

const leftHit = new Audio();
leftHit.src = "sounds/leftHit.ogg";

const rightHit = new Audio();
rightHit.src = "sounds/rightHit.ogg";

const opening = new Image(canvas.width, canvas.height);
opening.src = "images/opening.png";

const bg = new Image(canvas.width, canvas.height);
bg.src = "images/bg1.png";

const ending = new Image(canvas.width, canvas.height);
ending.src = "images/ending.png";

const balls = [new Image(ballR * 2, ballR * 2), new Image(ballR * 2, ballR * 2)];
balls[0].src = "images/ballRight.png";
balls[1].src = "images/ballLeft.png";
