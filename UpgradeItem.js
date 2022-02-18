import GameObject from "./gameObject.js";

class UpgradeItem extends GameObject {
    constructor(context, x, y, width, height, CONFIG) {
        super(context, x, y, width, height, CONFIG);
        this.dx = -1.5;
        this.dy = 0;
        this.velocity = 0.25;
    }

    init() {
        this.image = new Image();
        this.image.src = './Assets/item.png';
    }

    update(timePassedSinceLastRender) {
        this.x += timePassedSinceLastRender * this.dx * this.velocity;
    }

    render() {
        this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

export default UpgradeItem;