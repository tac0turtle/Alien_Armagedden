#!/usr/bin/env node
"use strict";
const readline = require("readline");
const createWorldMap = require("./helpers/map");
const Alien = require("./helpers/alien");

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

const spreadAliensAround = (alienCount, map) => {
	for (let index = 0; index < alienCount; index++) {
		const keys = Object.keys(map);
		const randomCity = map[keys[keys.length * Math.random() << 0]];
		const alienId = index;
		const alien = new Alien(alienId);
		randomCity.checkIn(alien);
	}
};

const movesPossible = (worldMap) => {
	for (let city in worldMap) {
		if (worldMap[city].aliens.length > 0) {
			return worldMap[city].aliens.some((alien) => alien.canMove());
		}
	}
	return false;
};

const recreateFile = (worldMap) => {
	for (let city in worldMap) {
		let cityType = worldMap[city];
		if (cityType.links.length > 0) {
			console.log(cityType.cityName, ...cityType.links);
		} else if (cityType.links.length == 0) {
			console.log(cityType.cityName);
		}
	}
};

const main = (alienCount, map) => {
	console.time("time");
	let worldMap = createWorldMap(map);
	spreadAliensAround(alienCount, worldMap);
	while (movesPossible(worldMap)) {
		for (let city in worldMap) {
			worldMap[city].cityCleaner(worldMap);
		}
	}
	if (Object.keys(worldMap) == 0) {
		console.log("All cities were destroyed, time to migrate planets, All aboard the Voyager.");
		return;
	}
	console.log("We managed to stop the aliens, no need to voyage the cosmos.\n");
	console.log("OutPut of cities still standing");
	recreateFile(worldMap);
	console.timeEnd("time");
	return worldMap;
};


const count = process.argv[2].split("=")[1];
let map = {};
rl.on("line", function (line) {
	let city = line.substring(0, line.indexOf(" ") + 1);
	city = city.replace(/\s/g, "");
	map[city] = [];
	let directions = line.substring(line.indexOf(" ") + 1, line.length);
	let regexp = /(north|south|east|west)=([^\s]+)/g;
	directions.match(regexp).map((pair) => {
		map[city].push(pair);
	});
});

rl.on("close", () => { main(count, map); });
