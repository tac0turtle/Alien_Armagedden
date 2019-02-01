const assert = require("chai").assert;

const Alien = require("../helpers/alien");

const alien = new Alien(1);

describe("Alien Tests", () => {
	it("should return a Alien with id: 1", () => {
		assert.equal(alien.id,  1);
	});
	it("should return true is moves are grater than 0", () => {
		assert.isTrue(alien.canMove(), "The alien has greater than 0 moves" );
	});
	it("should should deduct from the total amount of movevs left", () => {
		alien.move();
		assert.isBelow(alien.movesLeft, 10000);
	});
	it("should set the aliens moves to 0 and isLiving is false", () => {
		alien.destroy();
		assert.equal(alien.movesLeft, 0 , "The alien has 0 moves and has died" );
	});
});