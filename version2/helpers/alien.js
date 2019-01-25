"use strict";

const MAX_MOVES = 10000;

module.exports = class Alien {
	constructor(id) {
		this.id = id;
		this.movesLeft = MAX_MOVES; // if alien has no moves it is considered dead
	}

	canMove() {
		return this.movesLeft > 0;
	}

	move() {
		--this.movesLeft;
	}

	destroy() {
		this.movesLeft = 0;
	}
};