const City = require("./city");

const join_unique = (a, b) => {
	let c = a.concat(b);
	return c.filter((item, pos) => c.indexOf(item) == pos);
};

const addEdge = (origin, link) => {
	direction = link.split("=")[0];
	destination = link.split("=")[1];
	switch (direction) {
	case "north":
		return join_unique(worldMap[destination].links, [`south=${origin}`]);
	case "west":
		return join_unique(worldMap[destination].links, [`east=${origin}`]);
	case "south":
		return join_unique(worldMap[destination].links, [`north=${origin}`]);
	case "east":
		return join_unique(worldMap[destination].links, [`west=${origin}`]);
	default:
		break;
	}
};

let worldMap = {};
module.exports = (data) => {
	// generate vertices
	for (let city in data) {
		worldMap[city] = new City(city, data[city]);
		data[city].forEach((direction) => {
			let dest = direction.split("=")[1];
			if (!worldMap[dest]) {
				worldMap[dest] = new City(dest, []);
			}
		});
	}
	// add edges to both vertices, making a road	
	for (let city in worldMap) {
		worldMap[city].links.forEach((link) => {
			let destination = link.split("=")[1];
			let edges = addEdge(city, link);
			worldMap[destination].links = edges;
		});
	}

	return worldMap;
};
