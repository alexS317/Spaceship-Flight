class GameObject {
    constructor(context, x, y, width, height, CONFIG) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.CONFIG = CONFIG;

        this.init();
    }

    init() {

    }

    update() {

    }

    render() {

    }

    getBoundingBox() {
        return {
            x: this.x,
            y: this.y,
            w: this.width,
            h: this.height,
        }
    }
}

export default GameObject;