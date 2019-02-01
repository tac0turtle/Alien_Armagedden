const assert = require("chai").assert;

const Alien = require("../helpers/alien");
const City = require("../helpers/city");

let aliens = [];
for (let index = 0; index < 5; index++) {
	const alien = new Alien(index);
	aliens.push(alien);
}

const cityName = "Foo";
const links = [ "north=Bar" ];

const cities = [
	{ cityName: "Foo", links: [ "north=Bar"]},
	{ cityName: "Bar", links: [ "south=Foo" ]}
];
let worldMap = {};
cities.map(city => {
	worldMap[city.cityName] = {};
	worldMap[city.cityName] = new City(city.cityName, city.links);
});

const city = new City(cityName, links);

describe("City Test", () => {
	it("should init a city with a name of Foo, and 3 links", () => {
		assert.equal(city.cityName, "Foo", "sets city name to Foo");
		assert.isAbove(city.links.length, 0, "Foo", "sets city name to Foo");
	});
	it("should check an Alien in", () => {
		city.checkIn(aliens[0]);
		assert.isAbove(city.aliens.length, 0, "have greater than 0 aliens visiting");
	});
	it("should check an Alien out", () => {
		city.checkOut(aliens[0].id);
		assert.lengthOf(city.aliens, 0, "should not have an alien anymore");
	});
	it("should move the alien", () => {
		city.checkIn(aliens[0]);
		city.cityCleaner(worldMap);
		assert.equal(city.aliens.length, 0, "should not have an alien anymore");
		assert.isBelow(aliens[0].movesLeft, 10000, "alien is deducted one move as he has moved cities" );
	});
	it("should detory itself and all aliens inside", () => {
		aliens.map(alien => city.checkIn(alien));
		city.cityCleaner(worldMap);
		assert.isTrue(city.isDestroyed, true, "isDestroyed should be set to true");
		assert.lengthOf(city.links, 0, "all links out of this city should be destroyed");
		assert.lengthOf(worldMap["Bar"].links, 0, "all cities with links to the destroyed city must be destroyed");
		assert.lengthOf(city.aliens, 0, "all aliens in the city must be destroyed");
		assert.equal(aliens[0].movesLeft, 0, "alien moves is set to zero as it is dead");
		assert.isUndefined(worldMap["Foo"], "destroyed city is no more on the worldMap");
	});
});