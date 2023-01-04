class Paddle{
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = "white";
    }

    // drawing the paddles
    show(){
        drawRect(this.x, this.y, this.w, this.h, this.color);
    }

    // player
    update(){
        this.y = mouseY - this.h / 2;
    }

    // ai
    updateAI(){
        this.y += ((ball.y - (this.y + this.h/2)))*0.1;
    }

    // refresh paddle location
    refresh(){
        this.y = canvas.height / 2;
    }
}