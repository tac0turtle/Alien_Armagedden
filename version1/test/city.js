const assert = require("chai").assert;

const { City } = require("../helpers/city");

const oneCity = new City("Portland");
const secondCity = new City("Seattle");

describe("City class Tests", () => {
	it("should create a city with name Portland", () => {
		assert.equal(oneCity.cityName, "Portland", "The city name must be Portland");
	});
	it("should add a link to the city", () => {
		oneCity.addLink("north=Seattle");
		assert.lengthOf(oneCity.links, 1, "The city has one link");
	});
	it("should remove Seattle as a link from the city", () => {
		oneCity.removeLink(secondCity);
		assert.lengthOf(oneCity.links, 0, "The city has 0 link");
	});
	it("should destroy Portland", () => {
		oneCity.destroy();
		assert.isTrue(oneCity.isDestroyed, "the city is destroyed");
		assert.lengthOf(oneCity.links, 0, "the city has no links");
	});
} );