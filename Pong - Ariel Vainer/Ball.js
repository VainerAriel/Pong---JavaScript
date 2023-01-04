class Ball {
    constructor(diff) {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.s = 4 + diff * 2;
        this.vx = getRndNumRestrictions(-this.s, this.s, -this.s * 0.8, this.s * 0.8);
        this.vy = getRndNumRestrictions(-this.s, this.s, -this.s * 0.2, this.s * 0.2);
        this.radius = ballR;

        this.diff = diff;

        this.wait = FPS * 1.5;

        this.sound = leftHit;
    }

    // show the ball
    show() {
        context.drawImage(balls[ballState], this.x - ballR, this.y - ballR, ballR * 2, ballR * 2)
    }

    // update the ball
    update() {
        // facing left/right
        ballState = (this.vx > 0) ? 0 : 1;

        // waiting a few seconds before starting
        this.wait--;
        if (this.wait < 0) {
            this.x += this.vx;
            this.y += this.vy;
        }

        if (this.sound.ended) song.volume = 1;
    }

    ceiling() {
        // check for collision with the ceiling
        if (this.y - this.radius <= 0) {
            this.y = this.radius;
            return true;
        }
    }

    floor() {
        // check for collision with the floor
        if (this.y + this.radius >= canvas.height) {
            this.y = canvas.height - this.radius;
            return true;
        }
    }

    leftWall(leftPaddle) {
        // check for collision with the left paddle
        return (rectCollision(leftPaddle.x, leftPaddle.y, leftPaddle.w, leftPaddle.h, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2))
    }

    rightWall(rightPaddle) {
        // check for collision with the right paddle
        return (rectCollision(rightPaddle.x, rightPaddle.y, rightPaddle.w, rightPaddle.h, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2))
    }

    collision(leftPaddle, rightPaddle) {
        // bounce of floor/ceiling
        if (this.floor() || this.ceiling()) {
            this.vy = -this.vy;
        }

        // I used trigonometry to determine the new velocity of the ball after hitting the paddles
        if (this.leftWall(leftPaddle) || this.rightWall(rightPaddle)) {
            let player = (this.x + this.radius < canvas.width / 2) ? leftPaddle : rightPaddle;

            let collidePoint = this.y - (player.y + player.h / 2);
            collidePoint /= player.h / 2;

            let direction = (ball.x < canvas.width / 2) ? 1 : -1;

            let angleRad = collidePoint * Math.PI / 4;

            this.vx = direction * this.s * Math.cos(angleRad);
            this.vy = this.s * Math.sin(angleRad);

            // increasing difficulty
            this.s += 0.1 * this.diff;

            // playing the hitting sound
            this.sound = (player === leftPaddle) ? leftHit : rightHit;

            song.volume = 0.3;
            this.sound.play();
        }
    }

    // check for dying
    outOfScreen() {
        if (this.x + this.radius < -this.radius || this.x - this.radius > canvas.width + this.radius) {
            if (this.x < canvas.width / 2) {
                scoreR++;
            } else {
                scoreL++;
            }
            return true;
        }
    }
}

