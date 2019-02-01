"use strict";

const MAX_MOVES = 10000;

module.exports = class Alien {
	constructor(id, city) {
		this.id = id;
		this.movesLeft = MAX_MOVES;
		this.city = city;
		this.isLiving = true;
	}

	canMove() {
		return this.movesLeft > 0;
	}

	destroyed() {
		this.movesLeft = 0;
		this.isLiving = false;
	}

	random(links) {
		var index = Math.floor(Math.random() * links.length);
		return links[index];
	}

	traverseTheWorld(map) {
		if (this.canMove() && this.isLiving) {
			if (this.city.isDestroyed == true) {
				console.log(`${this.id} was killed in the cross fire.`);
				return this.destroyed();
			} else if (this.city.links.length > 0) {
				let newDestination = this.random(this.city.links);
				newDestination = newDestination.split("=")[1];
				for (let dest of map) {
					if (dest.cityName == newDestination) {
						this.movesLeft = this.movesLeft - 1;
						return this.city = dest;
					}
				}
			} 
			this.movesLeft = this.movesLeft - 1;
			console.log(`${this.id} is stuck`);
		}
	}
};