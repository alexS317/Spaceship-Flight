import GameObject from "./gameObject.js";

class Background extends GameObject {
    constructor(context, x, y, CONFIG) {
        super(context, x, y, CONFIG);
        this.width = CONFIG.width;
        this.height = CONFIG.height;
        this.x1 = this.width * 2;
        this.velocity = 0.2;
    }

    init() {
        this.image = new Image();
        this.image.src = './Assets/background.png';
    }

    update(timePassedSinceLastRender) {
        if(this.x < -this.width * 2) this.x = this.width * 2 + this.x1 - timePassedSinceLastRender/2;
        else this.x -= timePassedSinceLastRender * this.velocity;
        if(this.x1 < -this.width * 2) this.x1 = this.width * 2 + this.x - timePassedSinceLastRender/2;
        else this.x1 -= timePassedSinceLastRender * this.velocity;
    }

    render() {
        this.context.drawImage(this.image, this.x, this.y, this.width * 2, this.height);
        this.context.drawImage(this.image, this.x1, this.y, this.width * 2, this.height);
    }
}

export default Background;