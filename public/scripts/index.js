function dataOmzet() {
	let result = fetch("convertcsvdata.json")
		.then(data => data.json())
		.then(json => {
			const newResults = json.map(result => {
				return {
					id: result.response_ID,
					afkomst: result.Herkomst_def,
					totstand: result.Totstand,
					contact: result.Contact_gehad,
					freqcontact: result.freqcontact,
					cijfer: result.rapportcijfer
				}
			})
			bubbleChart(newResults)
		})
}
dataOmzet()


function removeInvalidRecords(dataset) {
	var dataset_clean = [];

	for (var i = 0; i < dataset.length; i++) {
		var obj = dataset[i];
		if (obj.freqcontact != '99999' && obj.afkomst != 'Onbekend' && obj.afkomst != '#NULL!' && obj.afkomst != undefined) {

			dataset_clean.push(JSON.parse(JSON.stringify(dataset[i])));
		}
	}

	return dataset_clean;
}

function getIWentData(data) {
	return data.filter(item => item.totstand === "Ik ging naar de politie toe")
}

function getToMeData(data) {
	return data.filter(item => item.totstand === "De politie kwam naar mij toe")
}
function bubbleChart(results) {

		//-------------- DATASET 1: ALGEMEEN CONTACT
		 data = removeInvalidRecords(results);
		 
	
		function rollupRecordsByCountry(data) {
			let transformed = d3.nest()
				.key(d => d.afkomst)
				.rollup(function (v) {
					return d3.sum(v, function (d) {
						return d.freqcontact;
					});
				})				
				.entries(data)
			return transformed
		}
	
		data = rollupRecordsByCountry(data)
		console.log("Dataset with sums : ", data)
	
		var total = data.reduce(function (accumulator, currentValue) {
			return accumulator + currentValue.value
		}, 0);
		console.log("total :", total);
	


		function convertValuesToPercentages(data) {
			for (var i = 0; i < data.length; i++) {
				var obj2 = data[i];
				data[i].value = Math.round((obj2.value / total) * 100, 0);
			}
			return data
		}

		var data = convertValuesToPercentages(data);
		console.log("Dataset in % : ", data)

		let datasetSub = JSON.stringify(data);
		dataset = {
			"children": JSON.parse(datasetSub)
		}

	// ------------- DATASET 2 : IK GING NAAR DE POLITIE TOE DATA VOOR UPDATE -----------------

	const ikGing = getIWentData(results)

	let newDataRaw = d3.nest()
		.key(d => d.afkomst)
		.rollup(leaves => leaves.length)
		.entries(ikGing)

	newDataRaw = newDataRaw.flat()

	var total2 = newDataRaw.reduce(function (accumulator, currentValue) {
		return accumulator + currentValue.value
	}, 0);

	for (var i = 0; i < newDataRaw.length; i++) {
		var obj2 = newDataRaw[i];
		newDataRaw[i].value = Math.round((obj2.value / total2) * 100, 0);
	}

	let newDataRawTemp = JSON.stringify(newDataRaw);
	newData = {
		"children": JSON.parse(newDataRawTemp)
	}

	// ------------- DATASET 3 :  POLITIE KWAM NAAR MIJ TOE DATA VOOR UPDATE -----------------

	const naarMij = getToMeData(results)

	let newDataRaw2 = d3.nest()
		.key(d => d.afkomst)
		.rollup(leaves => leaves.length)
		.entries(naarMij)

	newDataRaw2 = newDataRaw2.flat()

	var total2 = newDataRaw2.reduce(function (accumulator, currentValue) {
		return accumulator + currentValue.value
	}, 0);

	for (var i = 0; i < newDataRaw2.length; i++) {
		var obj2 = newDataRaw2[i];
		newDataRaw2[i].value = Math.round((obj2.value / total2) * 100, 0);
	}

	let newDataRawTemp2 = JSON.stringify(newDataRaw2);
	newData2 = {
		children: JSON.parse(newDataRawTemp2)
	}
	console.log(newData2);


	// -------------------- LEGENDA ----------------------------

	function setFontSizeLegenda(country, direction) {
		if (direction == 'ON') {
			document.getElementById(country).style.color = "white";
		} else {
			document.getElementById(country).style.color = "grey";
		}
		return
	}

	// -------------------- BEGIN VAN BUBBLE CHART ----------------------------
	var diameter = 600;

	var color = d3.scaleOrdinal(d3.schemeCategory20);

	var bubble = d3.pack(dataset)
		.size([diameter, diameter])
		.padding(1.5);

	var animation = d3.transition()
		.duration(700)
		.ease(d3.easePoly);

	var svg = d3.select(".chart")
		.append("svg")
		.attr("width", diameter)
		.attr("height", diameter)
		.attr("class", "bubble");

	var div = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

	var nodes = d3.hierarchy(dataset)
		.sum(function (d) {
			return Math.sqrt(d.value);
		});
	console.log('nodes :', dataset)

	var nodes2 = d3.hierarchy(newData)
	.sum(function(d) { return Math.sqrt(d.value); });
	console.log('nodes2 :', newData)

	var nodes3 = d3.hierarchy(newData2)
		.sum(function (d) {
			return Math.sqrt(d.value);
		});
	console.log('nodes3 :', newData2)

	var node = svg.selectAll(".node")
		.data(bubble(nodes).leaves())
		.enter()
		.append("g")
		.attr("class", "node")
		.attr("transform", function (d) {
			return "translate(" + d.x + "," + d.y + ")";
		})
		.on("mouseover", function (d) {
			div.transition()
				.duration(200)
				.style("opacity", .9);
			div.html("<b>Culturele afkomst: </b>" + d.data.key + "<br/>" + "<br/>" + "<b>Percentage contact: </b>" + "<br/>" + d.data.value + "%")
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
			setFontSizeLegenda(d.data.key, 'ON');
		})

		.on("mouseout", function (d) {
			div.transition()
				.duration(500)
				.style("opacity", 0);
			setFontSizeLegenda(d.data.key, 'OUT');
		});

	node.append("title")
		.text(function (d) {
			return d.key + ": " + d.value;
		});

	    node.append("circle")
		.attr("class", "dataCircle")
		.transition(animation)
		.attr("r", function (d) {
			return d.r;
		})
		.style("fill", function (d) {
			if (d.data.key == "Nederlands") {
				return "#fd8b00"
			} else if (d.data.key == "Marokkaans") {
				return "#36e77f"
			} else if (d.data.key == "Surinaams") {
				return "#f2ca00"
			} else if (d.data.key == "Turks") {
				return "#f30000"
			} else if (d.data.key == "Voormalig Nederlandse Antillen") {
				return "#4a38f4"
			} else if (d.data.key == "Westers") {
				return "#df00ff"
			} else {
				return "#30f5ff"
			}
		});
		
	node.append("text")
		.attr("dy", ".3em")
		.attr("class", "textbubble")
		.style("text-anchor", "middle")
		.style("fill", "white")
		.text(function (d) {
			return d.data.value + "% ";
		});

	d3.select(self.frameElement)
		.style("height", diameter + "px");

// ------------- UPDATE FUNCTIE IN BUBBLE CHART -----------------
function update2() {
		
	var bubble2 = d3.pack(newData)
	.size([diameter, diameter])
	.padding(1.5);
	console.log('23', newData)

	var node2 = svg.selectAll("g")
		.remove();

	var nodes2 = d3.hierarchy(newData)
		.sum(function(d) { return Math.sqrt(d.value); });
	
	var node = svg.selectAll(".node")
		.data(bubble2(nodes2).leaves())
		.enter()
		.append("g")
		.attr("class", "node")
		.attr("transform", function (d) {
			return "translate(" + d.x + "," + d.y + ")";
		})
		.on("mouseover", function (d) {
			div.transition()
				.duration(200)
				.style("opacity", .9);
			div.html("<b>Culturele afkomst: </b>" + d.data.key + "<br/>" + "<br/>" + "<b>Percentage contact: </b>" + "<br/>" + d.data.value + "%")
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
			setFontSizeLegenda(d.data.key, 'ON');
		})
		.on("mouseout", function (d) {
			div.transition()
				.duration(500)
				.style("opacity", 0);
			setFontSizeLegenda(d.data.key, 'OUT');
		});

	node.append("circle")
		.attr("class", "dataCircle")
		.transition(animation)
		.attr("r", function (d) {
			return d.r;
		})
		.style("fill", function (d) {
			if (d.data.key == "Nederlands") {
				return "#fd8b00"
			} else if (d.data.key == "Marokkaans") {
				return "#36e77f"
			} else if (d.data.key == "Surinaams") {
				return "#f2ca00"
			} else if (d.data.key == "Turks") {
				return "#f30000"
			} else if (d.data.key == "Voormalig Nederlandse Antillen") {
				return "#4a38f4"
			} else if (d.data.key == "Westers") {
				return "#df00ff"
			} else {
				return "#30f5ff"
			}
	});

	node.append("text")
		.attr("dy", ".3em")
		.attr("class", "textbubble")
		.style("text-anchor", "middle")
		.style("fill", "white")
		.text(function (d) {
			return d.data.value + "% ";
		})

	}

	function update3() {
		
		var bubble3 = d3.pack(newData2)
		.size([diameter, diameter])
		.padding(1.5);
		console.log('23', newData2)
	
		var node3 = svg.selectAll("g")
			.remove();
	
		var nodes3 = d3.hierarchy(newData2)
			.sum(function(d) { return Math.sqrt(d.value); });
		
		var node = svg.selectAll(".node")
			.data(bubble3(nodes3).leaves())
			.enter()
			.append("g")
			.attr("class", "node")
			.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")";
			})
			.on("mouseover", function (d) {
				div.transition()
					.duration(200)
					.style("opacity", .9);
				div.html("<b>Culturele afkomst: </b>" + d.data.key + "<br/>" + "<br/>" + "<b>Percentage contact: </b>" + "<br/>" + d.data.value + "%")
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 28) + "px");
				setFontSizeLegenda(d.data.key, 'ON');
			})
			.on("mouseout", function (d) {
				div.transition()
					.duration(500)
					.style("opacity", 0);
				setFontSizeLegenda(d.data.key, 'OUT');
			});
	
		node.append("circle")
			.attr("class", "dataCircle")
			.transition(animation)
			.attr("r", function (d) {
				return d.r;
			})
			.style("fill", function (d) {
				if (d.data.key == "Nederlands") {
					return "#fd8b00"
				} else if (d.data.key == "Marokkaans") {
					return "#36e77f"
				} else if (d.data.key == "Surinaams") {
					return "#f2ca00"
				} else if (d.data.key == "Turks") {
					return "#f30000"
				} else if (d.data.key == "Voormalig Nederlandse Antillen") {
					return "#4a38f4"
				} else if (d.data.key == "Westers") {
					return "#df00ff"
				} else {
					return "#30f5ff"
				}
		});
	
		node.append("text")
			.attr("dy", ".3em")
			.attr("class", "textbubble")
			.style("text-anchor", "middle")
			.style("fill", "white")
			.text(function (d) {
				return d.data.value + "% ";
			});
	
		}

		function update4() {

		var bubble = d3.pack(dataset)
		.size([diameter, diameter])
		.padding(1.5);
		console.log('23', dataset)
	
		var node = svg.selectAll("g")
			.remove();
	
		var nodes = d3.hierarchy(dataset)
			.sum(function(d) { return Math.sqrt(d.value); });
		
		var node = svg.selectAll(".node")
			.data(bubble(nodes).leaves())
			.enter()
			.append("g")
			.attr("class", "node")
			.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")";
			})
			.on("mouseover", function (d) {
				div.transition()
					.duration(200)
					.style("opacity", .9);
				div.html("<b>Culturele afkomst: </b>" + d.data.key + "<br/>" + "<br/>" + "<b>Percentage contact: </b>" + "<br/>" + d.data.value + "%")
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 28) + "px");
				setFontSizeLegenda(d.data.key, 'ON');
			})
			.on("mouseout", function (d) {
				div.transition()
					.duration(500)
					.style("opacity", 0);
				setFontSizeLegenda(d.data.key, 'OUT');
			});
	
		node.append("circle")
			.attr("class", "dataCircle")
			.transition(animation)
			.attr("r", function (d) {
				return d.r;
			})
			.style("fill", function (d) {
				if (d.data.key == "Nederlands") {
					return "#fd8b00"
				} else if (d.data.key == "Marokkaans") {
					return "#36e77f"
				} else if (d.data.key == "Surinaams") {
					return "#f2ca00"
				} else if (d.data.key == "Turks") {
					return "#f30000"
				} else if (d.data.key == "Voormalig Nederlandse Antillen") {
					return "#4a38f4"
				} else if (d.data.key == "Westers") {
					return "#df00ff"
				} else {
					return "#30f5ff"
				}
		});
	
		node.append("text")
			.attr("dy", ".3em")
			.attr("class", "textbubble")
			.style("text-anchor", "middle")
			.style("fill", "white")
			.text(function (d) {
				return d.data.value + "% ";
			});
	
		}
	//EINDE UPDATE FUNCTIONS

	let buttonAlgemeen = d3.select('.buttons').append('button')
	let button = d3.select('.buttons').append('button')
	let button2 = d3.select('.buttons').append('button')

	buttonAlgemeen
	.text('Algemeen contact')
	.on('click', update4)

	button
	.text('Contact door Amsterdammers')
	.on('click', update2)

	button2
	.text('Contact door de politie')
	.on('click', update3)


}
//---------------------------------------------- EINDE VAN BUBBLE CHART ------------------------------------------------------
