const assert = require("chai").assert;

const Alien = require("../helpers/alien");

const map = [ 
	{ cityName: "Foo", links: [ "north=Bar", "west=Baz", "south=Qu-ux" ], isDestroyed: false },
	{ cityName: "Bar", links: [ "south=Foo" ], isDestroyed: false },
	{ cityName: "Bee", links: [ "east=Bar" ], isDestroyed: true },
	{ cityName: "Qu-ux", links: [], isDestroyed: false }
];


describe("Alien Tests", () => {
	it("should return a Alien with name: John McAfee and set city to Foo", () => {
		const alien = new Alien("John McAfee", map[0]);
		assert.equal(alien.id,  "John McAfee");
		assert.equal(alien.city.cityName,  "Foo");
	});
	it("should return true is moves are grater than 0", () => {
		const alien = new Alien("John McAfee", map[0]);
		assert.isTrue(alien.canMove(), "The alien has greater than 0 moves" );
	});
	it("should make the alien be stuck", () => {
		const alien = new Alien("Martin Mcfly", map[3]);
		alien.traverseTheWorld(map);
		assert.equal(alien.movesLeft, 9999 , "The alien has one less move" );
	});
	it("should move the alien from one city to another", () => {
		const alien = new Alien("Martin Mcfly", map[1]);
		const originalLocation = alien.city.cityName;
		alien.traverseTheWorld(map);
		assert.notEqual(originalLocation, alien.city.cityName , "The alien has moved cities" );
	});
	it("should kill the alien becasue the city is destroyed", () => {
		const alien = new Alien("Martin Mcfly", map[2]);
		alien.traverseTheWorld(map);
		assert.equal(alien.movesLeft, 0, "The alien has 0 moves" );
		assert.isNotTrue(alien.isLiving, "The alien has died" );
	});
	it("should set the aliens moves to 0 and isLiving is false", () => {
		const alien = new Alien("John McAfee", map[0]);
		alien.destroyed();
		assert.equal(alien.movesLeft, 0 , "The alien has 0 moves" );
		assert.isNotTrue(alien.isLiving, 0 , "The alien has died" );
	});
});