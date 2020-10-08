let particles = [];
let qtreeEnabled = false;
let numberOfChecks = 0;

const setParticles = (n) => {
	particles.length = 0;
	for (let i = 0; i < n; i++) {
		particles.push(new Particle(Math.range(Room.w), Math.range(Room.h), 4));
	}
};

Game.start = () => {
	setParticles(2000);
};

Game.render = () => {
	numberOfChecks = 0;

	if (Input.keyDown(KeyCode.Space)) qtreeEnabled = !qtreeEnabled;

	let qtree = new QuadTree(new Rectangle(0, 0, Room.w, Room.h), 4);

	for (const p of particles) {
		p.update();
		qtree.insert(new Point(p.x, p.y, p));
		p.setHighlight(false);
		numberOfChecks++;
	}

	for (const p of particles) {
		if (qtreeEnabled) {
			const points = qtree.query(p.range);
			for (const point of points) {
				const other = point.userData;
				if (other !== p) {
					if (p.intersects(other)) {
						p.setHighlight(true);
					}
				}
				numberOfChecks++;
			}
		}
		else {
			for (const other of particles) {
				if (other !== p) {
					if (p.intersects(other)) {
						p.setHighlight(true);
					}
				}
				numberOfChecks++;
			}
		}

		p.render();
	}

	Draw.setFont(Font.m, Font.bold);
	Draw.setHVAlign(Align.l, Align.t);
	const text = `QuadTree: ${qtreeEnabled? 'Enabled' : 'Disabled'} (Press Space)\nNumber of checks: ${numberOfChecks}\n${Time.FPS}`;
	Draw.setColor(C.black);
	Draw.text(17, 17, text);
	Draw.setColor(qtreeEnabled? C.white : C.red);
	Draw.text(16, 16, text);

};