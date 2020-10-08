let particleID = 0;

class Particle {
	constructor(x, y, r) {
		this.id = particleID++;
		this.x = x;
		this.y = y;
		this.r = r;
		this.vel = 0;
		this.acc = 0;
		this.polar = Vector2.zero;
		this.ang = Math.range(360);
		this.angVel = 0;
		this.angAcc = 0;
		this.range = new Rectangle(this.x - this.r * 2, this.y - this.r * 2, this.r * 4, this.r * 4);
		this.highlight = false;
		this.timer = 0;
	}

	intersects(other) {
		return (Math.pointdis(this, other) < this.r + other.r);
	}

	setHighlight(value) {
		this.highlight = value;
	}

	wrapOnBound() {
		if (this.x < -this.r) this.x = Room.w + this.r;
		if (this.x + this.r > Room.w) this.x = -this.r;
		if (this.y < -this.r) this.y = Room.h + this.r;
		if (this.y + this.r > Room.h) this.y = -this.r;
	}

	update() {
		this.polar = Math.lendir(this.vel, this.ang);

		this.x += this.polar.x;
		this.y += this.polar.y;

		this.wrapOnBound();

		this.range.x = this.x - this.r * 2;
		this.range.y = this.y - this.r * 2;

		this.acc = (1 + Math.cos(Time.time * 0.001 + this.id)) * 0.5;

		this.vel += this.acc;
		this.vel = Math.clamp(this.vel, -2, 2);

		this.ang += this.angVel;

		if (Time.time > this.timer) {
			this.angAcc = Math.choose(Math.range(-0.2, 0.2), 0, 0, 0);
			this.timer = Time.time + 1000;
		}

		this.angVel += this.angAcc;
		this.angVel = Math.clamp(this.angVel, -3, 3);
	}

	render() {
		Draw.setColor(this.highlight? C.white : C.gray);
		Draw.circle(this.x, this.y, this.r);
	}
}