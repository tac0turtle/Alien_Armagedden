#!/usr/bin/env node

const Chance = require("chance");

const chance = new Chance();

const matrixSize = !process.argv[2] ?
	Math.floor(Math.random() * 100) :
	process.argv[2];
const citiesN = Math.pow(matrixSize, 2); // 3, would be a 3x3 so max 9 cities
const cities = chance.unique(chance.city, citiesN);
const dir = ["north", "east", "south", "west"];

const rand_roads = () => {
	let n1 = Math.floor(Math.random() * (dir.length + 1));
	let n2 = Math.floor(Math.random() * (dir.length + 1));
	return dir.slice(n1 < n2 ? n1 : n2, n1 > n2 ? n1 : n2);
};

const join_unique = (a, b) => {
	let c = a.concat(b);
	return c.filter(function (item, pos) {
		return c.indexOf(item) == pos;
	});
};

//generate cities (vertices)
let matrix = new Array(citiesN - 1);
for (let row = matrixSize - 1; row >= 0; row--) {
	//build row
	if (!matrix[row]) {
		matrix[row] = new Array(matrixSize - 1);
	}
	for (let col = matrixSize - 1; col >= 0; col--) {
		roads = rand_roads(row, col);
		matrix[row][col] = {
			city: cities.pop(),
			roads: []
		};
	}
}

//generate roads (edges)
for (let row = matrixSize - 1; row >= 0; row--) {
	for (let col = matrixSize - 1; col >= 0; col--) {
		matrix[row][col].roads = join_unique(rand_roads(row, col), matrix[row][col].roads);
		//roads are both ways, so need to add direction on the destination
		matrix[row][col].roads.forEach((r) => {
			switch (r) {
			case "north":
				neighbor = matrix[row - 1] ? matrix[row - 1][col] : undefined;
				if (neighbor != undefined) {
					neighbor.roads = join_unique(neighbor.roads, ["south"]); // roads are both ways
					//console.log("add south to neighbor", neighbor.city)
				}
				break;
			case "west":
				neighbor = matrix[row][col - 1];
				if (neighbor != undefined) {
					neighbor.roads = join_unique(neighbor.roads, ["east"]); // roads are both ways
					//console.log("add east to neighbor", neighbor.city)
				}
				break;
			case "south":
				neighbor = matrix[row + 1] ? matrix[row + 1][col] : undefined;
				if (neighbor != undefined) {
					neighbor.roads = join_unique(neighbor.roads, ["north"]); // roads are both ways
					//console.log("add north to neighbor", neighbor.city)
				}
				break;
			case "east":
				neighbor = matrix[row][col + 1];
				if (neighbor != undefined) {
					neighbor.roads = join_unique(neighbor.roads, ["west"]); // roads are both ways
					//console.log("add west to neighbor", neighbor.city)
				}
				break;
			default:
				break;
			}
		});
	}
}

//follow roads and set correct cities
const get_neighbors = (row, col, roads) => {
	let d = {};
	roads.forEach(direction => {
		let neighbor;
		switch (direction) {
		case "north":
			neighbor = matrix[row - 1] ? matrix[row - 1][col] : undefined;
			if (neighbor != undefined) {
				d["north"] = neighbor.city;
			}
			break;
		case "west":
			neighbor = matrix[row][col - 1];
			if (neighbor != undefined) {
				d["west"] = neighbor.city;
			}
			break;
		case "south":
			neighbor = matrix[row + 1] ? matrix[row + 1][col] : undefined;
			if (neighbor != undefined) {
				d["south"] = neighbor.city;
			}
			break;
		case "east":
			neighbor = matrix[row][col + 1];
			if (neighbor != undefined) {
				d["east"] = neighbor.city;
			}
			break;
		default:
			break;
		}
	});
	return d;
};

//build full descriptor map
map = {};
let vertices = [];
for (let row = matrixSize - 1; row >= 0; row--) {
	for (let col = matrixSize - 1; col >= 0; col--) {
		let city = matrix[row][col].city;
		map[city] = get_neighbors(row, col, matrix[row][col].roads);
		let directions = Object.keys(map[city])
			.map(d => {
				return `${d}=${map[city][d]}`;
			});
		vertices.push({
			city: city,
			directions: directions
		});
		// console.log(`${city} ${directions}`); // console log for full map
	}
}

// get adjency matrix to have the min descriptor of a full map
const getAdjacencyMatrix = (vertices) => {
	const adjacencyMatrix = Array(vertices.length).fill(null).map(() => {
		return Array(vertices.length).fill(0);
	});

	// Fill the columns.
	vertices.forEach((vertex, vertexIndex) => {
		vertex.directions.forEach((dir) => {
			neighbor = dir.split("=")[1];
			const neighborIndex = vertices.findIndex((x) => {
				return x.city == neighbor;
			});
			adjacencyMatrix[vertexIndex][neighborIndex] = 1;
		});
	});

	return adjacencyMatrix;
};
const adj = getAdjacencyMatrix(vertices);

vertices.forEach((vertex, vertexIndex) => {
	directions = [];
	for (let index = vertexIndex; index < vertices.length; index++) {
		if (adj[vertexIndex][index] == 1) { // there is a unique direction
			directions = directions.concat(vertex.directions.filter((dir) => {
				city = dir.split("=")[1];
				return city == vertices[index].city;
			}));
		}
	}

	if (directions.length) {
		console.log(`${vertex.city} ${directions.join(" ")}`); // console.log for partial map
	}
});