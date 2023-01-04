// define the objects
let ball = new Ball(difficulty);

let leftPaddle = new Paddle(10, canvas.height / 2 - paddleH / 2, paddleW, paddleH);
let rightPaddle = new Paddle(canvas.width - paddleW - 10, canvas.height / 2 - paddleH / 2, paddleW, paddleH);

// everything rendered on screen 1 - starting screen
function render1() {
    context.drawImage(opening, 0, 0);
    drawRect(110, 50, 170, 50, "black", "center");
    drawRect(110, 50, 165, 45, "#E3C5A9", "center");
    drawText("DIFFICULTY", "35px AngryBird", 110, 65, "black");

    for (let i = 0; i < 3; i++) {
        makeButton(50 + 60 * i, 110, 50, 50, "#e3c5a9", "#d60028", "center", (i + 1).toString(), "45px AngryBird", 50 + 60 * i, 127, (i + 1).toString());
    }

    makeButton(745, 600, 170, 75, "#e3c5a9", "#d60028", "corner", "LEFT", "50px AngryBird", 830, 657, 4, 0);
    makeButton(925, 600, 170, 75, "#e3c5a9", "#d60028", "corner", "RIGHT", "50px AngryBird", 1010, 657, 4, 1);

    makeButton(920, 730, 350, 100, "#e3c5a9", "#d60028", "center", "START", "80px AngryBird", 920, 760);
}

// everything updated on screen 1 - starting screen
function update1() {
    // changing difficulty with clicking
    for (let i = 0; i < 3; i++) {
        if (mouseInside(50 + 60 * i, 110, 50, 50, "center", 1)) {
            difficulty = i + 1
        }
    }

    // changing player side
    for (let i = 0; i < 2; i++) {
        if (mouseInside(745 + 180 * i, 600, 170, 75, "corner", 1)) {
            side = i;
        }
    }

    // starting the game
    if (mouseInside(920, 730, 350, 100, "center", 1)) {
        screen = 2;
        ball = new Ball(difficulty);
        leftPaddle.refresh();
        rightPaddle.refresh();
        song.play();
        song.loop = true;
        intro.pause();
    }
}

// everything rendered on screen 1 - game
function render2() {
    context.drawImage(bg, 0, 0);

    drawRect(canvas.width / 2 - 1.5, 0, 3, canvas.height, "#FFFFFF", "corner");

    ball.show();

    leftPaddle.show();
    rightPaddle.show();

    drawText(scoreL, "80px AngryBird", 80, 120, "white");
    drawText(scoreR, "80px AngryBird", canvas.width - 80, 120, "white");
}

// everything updated on screen 2 - game
function update2() {
    // moving the ball and checking for collision
    ball.update();
    ball.collision(leftPaddle, rightPaddle);

    // moving the paddles
    if (side === 0) {
        leftPaddle.update();
        rightPaddle.updateAI();
    } else {
        rightPaddle.update();
        leftPaddle.updateAI();
    }

    // checking for ball out of screen
    if (ball.outOfScreen()) {
        ball = new Ball(difficulty);
    }

    // checking for winning or losing
    if (scoreR === winScore || scoreL === winScore) {
        screen = 3;
        finish.play();
        song.pause();
        song.currentTime = 0;
    }
}

// everything rendered on screen 3 - end screen
function render3() {
    context.drawImage(ending, 0, 0)

    if (scoreL === winScore) {
        drawText("LEFT PLAYER", "65px AngryBird", 1000, 700, "black");
        drawText("WINS!", "65px AngryBird", 1000, 770, "black");
    }
    if (scoreR === winScore) {
        drawText("RIGHT PLAYER", "65px AngryBird", 1000, 700, "black");
        drawText("WINS!", "65px AngryBird", 1000, 770, "black");
    }

    makeButton(75, 650, 220, 100, "#e3c5a9", "#d60028", "corner", "HOME", "55px AngryBird", 185, 720);
}

// everything updated on screen 3 - end screen
function update3() {
    // checking for home button pressed
    if (mouseInside(75, 650, 220, 100, "corner", 1)) {
        screen = 1;
        scoreR = 0;
        scoreL = 0;
        intro.play();
        finish.pause();
    }
}

function game() {
    // the actual game
    if (screen === 1) {
        render1();
        update1()
    } else if (screen === 2) {
        render2();
        update2();
    } else if (screen === 3) {
        render3();
        update3()
    }

    // resetting the click to false every frame
    click = false;
}

// running the game in a loop
setInterval(game, 1000 / FPS);