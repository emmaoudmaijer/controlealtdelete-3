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

	const ikGing2 = getIWentData(results)
	var ikGing = removeInvalidRecords(ikGing2);

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

	const naarMij2 = getToMeData(results)
	var naarMij = removeInvalidRecords(naarMij2);
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
	//color = d3.scale.category20c();

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
	document.getElementById("titelchart").innerHTML = "Wie ging er zelf naar de politie?" 
	document.getElementById("omsch-chart").innerHTML = "We kijken ook naar hoe het contact met de politie en de respondent tot stand is gekomen. Zo zie je dat alleen Nederlanders met een westerse migratie achtergrond en Nederlandse Nederlanders over het algemeen vaker zelf naar de politie stappen en dat de rest van de culturele afkomsten vaker worden aangesproken door de politie."
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
		button
		.style('background-color', 'yellow')
		.style('color', 'black')

		button2
		.style('background-color', 'transparent')
		.style('color', 'white')


		buttonAlgemeen
		.style('background-color', 'transparent')
		.style('color', 'white')

	}

	function update3() {
		
		document.getElementById("titelchart").innerHTML = "Naar wie kwam de politie het meest toe?" 
		document.getElementById("omsch-chart").innerHTML = "We kijken ook naar hoe het contact met de politie en de respondent tot stand is gekomen. Zo zie je dat alleen Nederlanders met een westerse migratie achtergrond en Nederlandse Nederlanders over het algemeen vaker zelf naar de politie stappen en dat de rest van de culturele afkomsten vaker worden aangesproken door de politie."

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
			
		button2
		.style('background-color', 'yellow')

		button
		.style('background-color', 'transparent')
		.style('color', 'white')

		buttonAlgemeen
		.style('background-color', 'transparent')
		.style('color', 'white')	
		}

		function update4() {
			document.getElementById("titelchart").innerHTML = "Welke Amsterdammers hebben het meest contact <br>gehad met de politie?"
			document.getElementById("omsch-chart").innerHTML = "In totaal zijn er 1934 respondenten geweest met verschillende culturele afkomsten, hiervan zijn er 794 in contact geweest met de politie in de afgelopen 12 maanden. Zoals je hierboven ziet zijn Nederlandse Nederlanders het meest in contact geweest met de politie, gevolgd door overige Nederlanders met een niet Westerse migratieachtergrond en Surinaamse Nederlanders. Je zou hieruit kunnen opmaken dat de kans aanwezig is dat de politie etnisch profileert."
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
	
	buttonAlgemeen
	.style('background-color', 'yellow')
	.style('color', 'white')
	//.style('color', 'black')

	button2
	.style('background-color', 'transparent')
	.style('color', 'white')
	button
	.style('background-color', 'transparent')
	.style('color', 'white')
	}
	//EINDE UPDATE FUNCTIONS

	let buttonAlgemeen = d3.select('.buttons').append('button')
	let button = d3.select('.buttons').append('button')
	let button2 = d3.select('.buttons').append('button')

	buttonAlgemeen
	.text('Algemeen contact')
	.style('background-color', 'yellow')
	.style('color', 'black')
	.on('click', update4)

	button
	.text('Contact door Amsterdammers')
	.on('click', update2)

	button2
	.text('Contact door de politie')
	.on('click', update3)
	


}
//---------------------------------------------- EINDE VAN BUBBLE CHART ------------------------------------------------------

function sliderText1(className){
		//var el = document.getElementsByClassName(className)[0]

		//var newone = el.cloneNode(true);
		//el.parentNode.replaceChild(newone, el);
		var el1 = document.getElementsByClassName('item-1')[0];
		var el2 = document.getElementsByClassName('item-2')[0];
		var el3 = document.getElementsByClassName('item-3')[0];


		if(className == 'item-1'){
			el1.style.WebkitAnimationName = 'anim-1';
			el2.style.WebkitAnimationName = 'anim-2';
			el3.style.WebkitAnimationName = 'anim-3';
		}

		/*
		var txtblock1 = 'item-1';
		var txtblock2 = 'item-2';
		var txtblock3 = 'item-3';

		if(className == 'item-2'){
			txtblock1 = 'item-2';
			txtblock2 = 'item-3';
			txtblock3 = 'item-1';
		}

		if(className == 'item-3'){
			txtblock1 = 'item-3';
			txtblock2 = 'item-1';
			txtblock3 = 'item-2';
		}
		*/

		// var el1 = document.getElementsByClassName(txtblock1)[0];
		// var newone1 = el1.cloneNode(true);
		// el1.parentNode.replaceChild(newone1, el1);

		// var el2 = document.getElementsByClassName(txtblock2)[0];
		// var newone2 = el2.cloneNode(true);
		// el2.parentNode.replaceChild(newone2, el2);

		// var el3 = document.getElementsByClassName(txtblock3)[0];
		// var newone3 = el3.cloneNode(true);
		// el3.parentNode.replaceChild(newone3, el3);

}