class Car {
    constructor ( x, y, width, height, controlType, maxSpeed = 35 ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        if (controlType === "DUMMY") {
            this.acceleration = Infinity * 1000;
        } else {
            this.acceleration = 0.1;
        }
        this.maxSpeed = maxSpeed;
        this.friction = 0;
        this.angle = 0;
        this.damaged = false;
        this.rocketBoost = false; // Initialize rocketBoost

        this.controls = new Controls(controlType);
    };

    update(roadBorders, traffic) {
        if (!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        } else {
            this.controls.rocketBoost = false; // Reset rocketBoost when damaged
        }
        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
        }
    };

    #assessDamage(roadBorders, traffic) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            };
        };

        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            };
        };

        return false;
    };

    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad,
        });
        return points;
    };

    #move() {
        if (this.controls.nitrous) {
            this.speed += this.acceleration * 10;
        };
        if (this.controls.rocketBoost) {
            this.speed += this.acceleration * 25;
        }
        if (this.controls.forward) {
            this.speed += this.acceleration;
        };
        if (this.controls.reverse) {
            this.speed -= this.acceleration * 3;
        };

        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        } else if (this.speed < -(this.maxSpeed / 2)) {
            this.speed = -(this.maxSpeed / 2);
        };

        if (this.speed > 0) {
            this.speed -= this.friction;
        } else if (this.speed < 0) {
            this.speed += this.friction;
        } else if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        };

        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1;
            if (this.controls.left) {
                this.angle += 0.03 * flip; // Increased steering sensitivity
            } else if (this.controls.right) {
                this.angle -= 0.03 * flip; // Increased steering sensitivity
            };
        };

        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    };

    draw(ctx, color) {
        if (!this.polygon) return;
        if (this.x < Road.left || this.x > Road.right) {
            this.damaged = true;
        };
    
        ctx.fillStyle = this.damaged ? 'gray' : color;
        
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
    };
};
