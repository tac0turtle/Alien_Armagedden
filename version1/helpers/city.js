"use strict";

class City {
	constructor(cityName) {
		this.cityName = cityName;
		this.links = [];
		this.isDestroyed = false;
	}

	addLink(city) {
		return this.links.push(city);
	}

	getDirections() {
		return this.links;
	}

	removeLink(location) {
		for (let index = 0; index < this.links.length; index++) {
			if (this.links[index].split("=")[1] == location.cityName) this.links.splice(index, 1);
		}
	}

	destroy() {
		this.isDestroyed = true;
		return this.links.length = 0;
	}
}

module.exports = (data) => {
	const line = data.split(/\n/);
	let map = [];
	line.map(line => {
		let cityName = line.substring(0, line.indexOf(" ") + 1);
		cityName = cityName.replace(/\s/g, "");
		let city = new City(cityName);
		let directions = line.substring(line.indexOf(" ") + 1, line.length);
		let regexp = /(north|south|east|west)=([^\s]+)/g;
		if (directions.match(regexp) == null) {
			return "";
		}
		directions.match(regexp).map((pair) => {
			city.addLink(pair);
		});
		map.push(city);
	});
	return map;
};