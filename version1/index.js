#!/usr/bin/env node
"use strict";

const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const fs = require("fs");
const Chance = require("chance");

const { createMap } = require("./helpers/city");
const Alien = require("./helpers/alien");

const chance = new Chance();

const init = () => {
	console.log(
		chalk.green(
			figlet.textSync("Alien Invasion", {
				horizontalLayout: "default",
				verticalLayout: "default"
			})
		)
	);
};

const askQuestions = () => {
	const questions = [
		{
			name: "MAP",
			type: "input",
			message: "Where is the world map located? <FilePath>",
			filter(fileLocation) {
				return fileLocation;
			}
		},
		{
			type: "input",
			name: "ALIENCOUNT",
			message: "How many Aliens are ATTACKING?",
			filter(count) {
				return count;
			}
		}
	];

	return inquirer.prompt(questions);
};


const spreadAliensAround = (alienCount, map) => {
	let aliens = [];
	for (let index = 0; index < alienCount; index++) {
		const randomCity = map[Math.floor(Math.random() * map.length)];
		const alienId = chance.name();
		aliens.push(new Alien(alienId, randomCity));
	}
	return aliens;
};

const checkForAliens = (aliens) => {
	for (let alien of aliens) {
		return alien.isLiving;
	}
};

const checkAlienMovesCount = (aliens) => {
	for (let alien of aliens) {
		return alien.canMove();
	}
};

const worldMapGenerator = async (alienCount, fileLocation) => {
	await fs.readFile(fileLocation, "utf8", (err, data) => {
		if (err) {
			throw err;
		}
		const worldMap = createMap(data);
		main(alienCount, worldMap);
	});
};

const recreateFile = (worldMap) => {
	worldMap.map(city => {
		if (city.links.length > 0) {
			console.log(city.cityName, ...city.links);
			return;
		}
		console.log(city.cityName);
		return;
	});
};

const main = async (alienCount, map) => {
	console.time("time");
	let alienPopulation = spreadAliensAround(alienCount, map);
	while (checkForAliens(alienPopulation) && checkAlienMovesCount(alienPopulation)) {

		alienPopulation.map(alien => {
			alien.traverseTheWorld(map);
			let collisions = [];
			alienPopulation.map(a => {
				const check = collisions[alien.city];
				if (check && check.city.isDestroyed == false) {
					a.city.destroy();
					a.destroyed();
					check.destroyed();
					console.log(`${a.id} destroyed ${check.id}, and in the process destroyed ${a.city.cityName}\n`);
					for (let index = 0; index < map.length; index++) {
						map[index].removeLink(alien.city);
					}
				}
				collisions[a.city] = alien;
			});
			alienPopulation = alienPopulation.filter(alien => alien.isLiving == true);
			map = map.filter(city => city.isDestroyed == false);
		});
		console.timeEnd("time");

		if (map.length == 0) {
			console.log(
				chalk.white.bgBlue.bold("All cities were destroyed, time to migrate planets, All aboard the Voyager.")
			);
			return;
		}
		console.log(
			chalk.white.bgBlue.bold("We managed to stop the aliens, no need to voyage the cosmos.\n")
		);
		console.log(
			chalk.white.bgCyan.bold("OutPut of cities still standing")
		);
		recreateFile(map);
		return map;
	}
};


const run = async () => {
	init();
	const answers = await askQuestions();
	const { ALIENCOUNT, MAP } = answers;
	await worldMapGenerator(ALIENCOUNT, MAP);
};
run();

