import GameObject from "./gameObject.js";

class Player extends GameObject {
    constructor(context, x, y, width, height, CONFIG) {
        super(context, x, y, width, height, CONFIG);
        this.dx = 0;
        this.dy = 0;
        this.velocity = 0.5;
        this.gravity = 1;
        this.currentKeys = {};
    }

    init() {
        // Set up keys
        document.addEventListener('keydown', (event) => {
            this.currentKeys[event.code] = true;
            if(this.currentKeys['Space'] === true) {
                event.preventDefault();
            }
        });

        document.addEventListener('keyup', (event) => {
            this.currentKeys[event.code] = false;
        });

        // Get image
        this.image = new Image();
        this.image.src = './Assets/player.png';
    }

    update(timePassedSinceLastRender) {
        // Movement settings
        if(this.currentKeys['Space']) {
            this.dy = -2;
        } else {
            this.dy = this.gravity;
        }
        this.y += timePassedSinceLastRender * this.dy * this.velocity;

        // Check top boundary
        if(this.y < 0) {
            this.y = 0;
        }
    }

    render() {
        this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    getBoundingBox() {
        return {
            x: this.x,
            y: this.y + 5,
            w: this.width - 8,
            h: this.height - 10,
        }
    }
}

export default Player;