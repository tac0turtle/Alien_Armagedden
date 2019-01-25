"use strict";

module.exports = class City {
	constructor(cityName, links) {
		this.cityName = cityName;
		this.links = links;
		this.aliens = [];
		this.isDestroyed = false;
	}

	checkIn(alien) {
		this.aliens.push(alien);
		console.log(`alien ${alien.id} check into ${this.cityName}`);
	}

	checkOut(alienId) {
		this.aliens = this.aliens.filter((alien) => { return alien.id !== alienId; });
		console.log(`alien ${alienId} check out of ${this.cityName}`);
	}

	cityCleaner(worldMap) {
		if (this.aliens.length > 1) {
			if (this.links.length >= 1) {
				this.links.forEach(city => {
					city = city.split("=")[1];
					worldMap[city].links = worldMap[city].links.filter(link => link.split("=")[1] !== this.cityName.replace(/\s/g, ""));
				});
			}

			this.links = [];
			this.isDestroyed = true;

			this.aliens.forEach(alien => {
				alien.destroy();
				console.log(`Alien ${alien.id} was killed in ${this.cityName}`);
			});

			this.aliens = [];
			console.log(`${this.cityName} was destroyed.`);
			delete worldMap[this.cityName];
			return;
		} else if (this.aliens.length == 1) {
			const keys = Object.keys(worldMap);
			const randomCity = worldMap[keys[keys.length * Math.random() << 0]];

			randomCity.checkIn(this.aliens[0]);
			this.aliens[0].move();
			this.checkOut(this.aliens[0].id);
		}
	}
};