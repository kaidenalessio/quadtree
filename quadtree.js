class Point {
	constructor(x, y, userData) {
		this.x = x;
		this.y = y;
		this.userData = userData;
	}
}

class Rectangle {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	get left() {
		return this.x;
	}

	get right() {
		return this.x + this.w;
	}

	get top() {
		return this.y;
	}

	get bottom() {
		return this.y + this.h;
	}

	contains(point) {
		return (
			point.x >= this.x &&
			point.x <= this.x + this.w &&
			point.y >= this.y &&
			point.y <= this.y + this.h
		);
	}

	intersects(other) {
		return (
			this.left <= other.right &&
			this.right >= other.left &&
			this.top <= other.bottom &&
			this.bottom >= other.top
		);
	}
}

class QuadTree {
	constructor(boundary, capacity) {
		this.boundary = boundary;
		this.capacity = capacity;
		this.northwest = null;
		this.northeast = null;
		this.southeast = null;
		this.southwest = null;
		this.points = [];
		this.divided = false;
	}

	subdivide() {
		const x = this.boundary.x;
		const y = this.boundary.y;
		const w = this.boundary.w * 0.5;
		const h = this.boundary.h * 0.5;
		this.northwest = new QuadTree(new Rectangle(x		, y		, w, h), this.capacity); // Top left
		this.northeast = new QuadTree(new Rectangle(x + w	, y		, w, h), this.capacity); // Top right
		this.southeast = new QuadTree(new Rectangle(x + w	, y + h	, w, h), this.capacity); // Bottom right
		this.southwest = new QuadTree(new Rectangle(x		, y + h	, w, h), this.capacity); // Bottom left
		this.divided = true;
	}

	insert(point) {
		if (!this.boundary.contains(point)) return false;

		if (this.points.length < this.capacity) {
			this.points.push(point);
			return true;
		}
		else {
			if (!this.divided) {
				this.subdivide();
			}
			if (this.northwest.insert(point)) return true;
			else if (this.northeast.insert(point)) return true;
			else if (this.southeast.insert(point)) return true;
			else if (this.southwest.insert(point)) return true;
		}
	}

	query(range, result) {
		if (!result) {
			result = [];
		}

		if (!this.boundary.intersects(range)) return result;

		for (let i = this.points.length - 1; i >= 0; --i) {
			if (range.contains(this.points[i])) {
				result.push(this.points[i]);
			}
		}

		if (!this.divided) return result;

		result = result.concat(this.northwest.query(range));
		result = result.concat(this.northeast.query(range));
		result = result.concat(this.southeast.query(range));
		result = result.concat(this.southwest.query(range));

		return result;
	}

	show() {
		const c = Object.values(C);
		Draw.setColor(C.white);
		Draw.rect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h, true);
		for (let i = this.points.length - 1; i >= 0; --i) {
			const p = this.points[i];
			Draw.setColor(c[i%c.length]);
			Draw.circle(p.x, p.y, 2);
		}
		if (!this.subdivide) return;
		this.northwest.show();
		this.northeast.show();
		this.southeast.show();
		this.southwest.show();
	}
}