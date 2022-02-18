import GameObject from "./gameObject.js";   

class Particle extends GameObject {
    constructor(context, x, y, CONFIG) {
        super(context, x, y, CONFIG);
        this.radius = Math.random() * 7 + 5;
        this.velocity = Math.random() * 0.25;
        this.color = 25;
    }

    update(timePassedSinceLastRender) {
        this.x -= timePassedSinceLastRender * 0.4;
        this.y += timePassedSinceLastRender * this.velocity;
        this.color += timePassedSinceLastRender * 0.065;

    }

    render() {
        this.context.fillStyle = 'hsla(' + this.color + ', 100%, 50%, 0.8)';

        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.context.fill();
    }
}

export default Particle;