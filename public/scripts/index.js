function dataOmzet() {
	let result = fetch("../convertcsvdata.json")
		.then(data => data.json())
		.then(json => {
			// console.log(json)
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

function bubbleChart(results) {

	// ------------- WEGHALEN VAN 99999 WAARDES EN TRANSFORMEREN VAN DATA VOOR CONTACT MET POLITIE -----------------
	function removeInvalidRecords(dataset) {

		var dataset_clean = [];
		var total = 0

		for (var i = 0; i < dataset.length; i++) {
			var obj = dataset[i];
			if (obj.freqcontact != '99999' && obj.afkomst != 'Onbekend' && obj.afkomst != '#NULL!' && obj.afkomst != undefined) {

				dataset_clean.push(JSON.parse(JSON.stringify(dataset[i])));
				//total = total + obj.freqcontact;
			}
		}

		return dataset_clean;
	}
	data = removeInvalidRecords(results);

	// ------------- IK GING NAAR DE POLITIE TOE DATA VOOR UPDATE -----------------
	const ikGing = data.filter(item => {
		if (item.totstand == "Ik ging naar de politie toe") {
			return item
		}
	})

	let newDataRaw = d3.nest()
		.key(d => d.afkomst)
		.rollup(leaves => leaves.length)
		.entries(ikGing)

	newDataRaw = newDataRaw.flat()

	let newDataRawTemp = JSON.stringify(newDataRaw);
	newData = {
		"children": JSON.parse(newDataRawTemp)
	}

	// ------------- POLITIE KWAM NAAR MIJ TOE DATA VOOR UPDATE -----------------

	const naarMij = data.filter(item => {
		if (item.totstand == "De politie kwam naar mij toe") {
			return item
		}
	})

	let newDataRaw2 = d3.nest()
		.key(d => d.afkomst)
		.rollup(leaves => leaves.length)
		.entries(naarMij)

	newDataRaw2 = newDataRaw2.flat()
	let newDataRawTemp2 = JSON.stringify(newDataRaw2);
	newData2 = {
		"children": JSON.parse(newDataRawTemp2)
	}
	console.log(newData2);

	function rollupRecordsByCountry(data) {
		let transformed = d3.nest()
			.key(d => d.afkomst)
			.rollup(function (v) {
				return d3.sum(v, function (d) {
					return d.freqcontact;
				});
			})
			//.rollup(leaves => leaves.length)				
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

	color.range(['red', 'yellow', 'green', 'blue', 'orange']);

	var bubble = d3.pack(dataset)
		.size([diameter, diameter])
		.padding(1.5);

	var bubble2 = d3.pack(newData)
		.size([diameter, diameter])
		.padding(1.5);
	console.log('23', newData)

	var bubble3 = d3.pack(newData2)
		.size([diameter, diameter])
		.padding(1.5);
	console.log('23', newData2)

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

	// var nodes2 = d3.hierarchy(newData)
	// .sum(function(d) { return Math.sqrt(d.value); });
	// console.log('nodes2 :', newData)

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
			div.html(d.data.key + "<br/>" + d.data.value)
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
			//return d.value;	
		});

	node.append("circle")
		.attr("class", "dataCircle")
		.transition(animation)
		.attr("r", function (d) {
			return d.r;
		})
		.style("fill", function (d) {
			if (d.data.key == "Nederlands") {
				return "#ef8133"
			} else if (d.data.key == "Marokkaans") {
				return "#66b770"
			} else if (d.data.key == "Surinaams") {
				return "#f3cc31"
			} else if (d.data.key == "Turks") {
				return "#e63e32"
			} else if (d.data.key == "Voormalig Nederlandse Antillen") {
				return "#494496"
			} else if (d.data.key == "Westers") {
				return "#a54f9a"
			} else {
				return "#61c5db"
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

	// node.exit().remove()

	// ------------- UPDATE FUNCTIE IN BUBBLE CHART -----------------
	function update() {

		var nodes2 = d3.hierarchy(newData)
			.sum(function (d) {
				return Math.sqrt(d.value);
			});
		console.log('nodes2 :', newData)
		//console.log(node)
		var nodes = node
			.selectAll('node')
		console.log("nodes", nodes)
		var circles = svg.selectAll('dataCircle')
		// var texts = nodes.selectAll('text')

		console.log("circc", circles)

		circles
			.data(newData)
			.transition(animation)
			.attr("r", function (d) {
				return d.value;
			})

		// .enter()


		// node.exit().remove(); //remove unneeded circles
		// node.enter().append("circle")
		// 	.attr("r", 0); //create any new circles needed
		// node
		// .data(bubble3(nodes3).leaves())
		// .transition(animation)
		// .attr("r", function(d) {
		// //	console.log( d)
		// 			})
		// .text(function(d) {
		// 	//console.log(d.data)
		// 	console.log(d.data)
		// return d.data;

		// });
	}

	let buttonAlgemeen = d3.select('.buttons').append('button')
	let button = d3.select('.buttons').append('button')
	let button2 = d3.select('.buttons').append('button')

	buttonAlgemeen
		.text('Algemeen contact')
		.on('click', update)

	button
		.text('Contact door Amsterdammers')
		.on('click', update)

	button2
		.text('Contact door de politie')
		.on('click', update)

}


(function ($) {
	"use strict";

	/* Navbar Scripts */
	// jQuery to collapse the navbar on scroll
	$(window).on('scroll load', function () {
		if ($(".navbar").offset().top > 20) {
			$(".fixed-top").addClass("top-nav-collapse");
		} else {
			$(".fixed-top").removeClass("top-nav-collapse");
		}
	});

	// jQuery for page scrolling feature - requires jQuery Easing plugin
	$(function () {
		$(document).on('click', 'a.page-scroll', function (event) {
			var $anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $($anchor.attr('href')).offset().top
			}, 600, 'easeInOutExpo');
			event.preventDefault();
		});
	});

	// closes the responsive menu on menu item click
	$(".navbar-nav li a").on("click", function (event) {
		if (!$(this).parent().hasClass('dropdown'))
			$(".navbar-collapse").collapse('hide');
	});
})


// //-------SCATTERPLOT DOOR LAURENS-------
// const width = 600
// const height = 600

// let svg = d3.select("#chart3")
//   .append("svg")

// //const svg = d3.select('svg')
// //console.log(svg)
// svg.attr('width', width + "px")
// svg.attr('height', height + "px")
// const x = d3.scaleLinear()
// 	.domain([0, 10])
// 	.range([0, width]);
// const y = d3.scaleLinear()
// 	.domain(["Ik ging naar de politie", "De politie kwam naar mij"])         // This is what is written on the Axis: from 0 to 100
// 	.range([ height, 0]);

// const color = d3.scaleOrdinal(d3.schemeDark2)

// //d3.json(dataSource)
// let dataSource = fetch('../convertcsvdata.json') 
// 	.then(data => data.json())
// 	.then(json => {
//   	console.log("starting with data length", json.length)
//   	const filtered = json.filter(item => checkInvalid(item))
//     console.log("data length after filtering 99999", filtered.length)
//     const data = filtered.map(result => {
//       return {
//         id: result.response_ID,
//         afkomst: result.Herkomst_def,
//         totstand: result.Totstand == "De politie kwam naar mij toe" ? 1 : 0,
//         contact: result.Contact_gehad,
//         freqcontact: result.freqcontact,
//         rapportcijfer: result.rapportcijfer
//     	}
// 		})
//     const transformed = transformData(data)
//    // console.log(transformed)

//   	addScales(transformed)
//   	drawScatterPlot(transformed)
//   })

// function transformData(data){
// 	const transformed = d3.nest()
//   	//first group all respondents by afkomst
//     .key(d => d.afkomst)
//     .rollup(d => {
//       return {
//       	amount: d.length,
//         benaderdTotaal: d.filter(respondent => respondent.totstand == 1).length,
//         nietBenaderdTotaal: d.filter(respondent => respondent.totstand == 0).length,
// 				//Create an array of 0s for each rapportcijfer percentage we will fill in later
//         rapportCijfersBenaderd: [0,0,0,0,0,0,0,0,0,0],
//         rapportCijfersNietBenaderd: [0,0,0,0,0,0,0,0,0,0],
//       }
//   	})
//   	.entries(data)
//   //For each respondent, check if they approached the police and increment the amount of respondents that
//   // had a certain rapportcijfer
//   data.forEach(respondent => {
//   	const land = transformed.find(afkomst => afkomst.key == respondent.afkomst)
//     //console.log(land)
//     if (respondent.totstand == 1){
//       land.value.rapportCijfersBenaderd[respondent.rapportcijfer - 1] ++
//     } else if (respondent.totstand == 0){
//       land.value.rapportCijfersNietBenaderd[respondent.rapportcijfer - 1] ++
//     }		
//   })
//   //For each country, convert the amount of people that had a certain rapportcijfer to a percentage
//   transformed.forEach(land => {
//     // console.log(land.value.rapportCijfersBenaderd)
//     land.value.rapportCijfersBenaderd.forEach( (cijfer, index, array) => {
//       array[index] = Math.round((cijfer / land.value.benaderdTotaal) * 100)
//     })
//     land.value.rapportCijfersNietBenaderd.forEach( (cijfer, index, array) => {
//       array[index] = Math.round((cijfer / land.value.nietBenaderdTotaal) * 100)
//     })
//   })
//   return transformed
// }

// //This function removes any items that have 99999 as an answer to any of the questions we're using for this viz!
// function checkInvalid(item){
//   const importantKeys = ["Herkomst_def", "Totstand", "Contact_gehad", "freqcontact" ,"rapportcijfer"]
// 	for (let key of importantKeys) {
//   	if (item[key] == '99999') {
//       // console.log("removing invalid item because", key)
//     	return false
//     }
//   }
//   return true
// }
// function drawScatterPlot(data){  
//   data.forEach( (country, index) => {
//     //console.log(country)
//     //Add all the circles for approached by police
//   	let circlesTop = svg.selectAll(".top")
//       .data(country.value.rapportCijfersBenaderd)
//       .enter()
//       .append("circle")
//         .attr("class", country)
//         .attr("r", d => circleSize(d))
//         .attr("cx", (d, i) => x(i + 1))
//         .attr("cy", (10 * index) + 100)
// 			.attr("fill", color(index))
// 		// .on("mouseover", function(d) {
// 		// 	div.transition()
// 		// 		.duration(200)
// 		// 		.style("opacity", .9);
// 		// 	div.html(d.data.key + "<br/>" + d.data.value)
// 		// 		.style("left", (d3.event.pageX) + "px")
// 		// 		.style("top", (d3.event.pageY - 28) + "px")
// 		// 	})
// 		// .on("mouseout", function(d) {
// 		// 	div.transition()
// 		// 		.duration(500)
// 		// 		.style("opacity", 0);
// 		// 	});

//     //Add all the circles for approached police themselves
//     let circlesBottom = svg.selectAll(".bottom")
//       .data(country.value.rapportCijfersNietBenaderd)
//       .enter()
//       .append("circle")
//         .attr("class", country)
//         .attr("r", d => circleSize(d))
//         .attr("cx", (d, i) => x(i + 1))
//         .attr("cy", (10 * index) + 300)
//     		.attr("fill", color(index))
//   })
// }

// function addScales(data){
//  	x.domain([1,10])	//From lowest to highest cijfer
//   	.range([0, width])
//   y.domain([0,255])
//   	//By putting height first, we're fixing the inverse effect of y
//   	.range([height,0])
// }

// //Determine the circlesize. I've tweaked this by hand  but there are nicer ways
// function circleSize(item){
// 	if (item == 0){
//    return 0.5
//   }
//   else if (item < 5){
//    return 2 
//   }
//   else if (item < 15){
//    return 3 
//   }
//   else if (item < 25){
//    return 4 
//   }
//   else if (item < 35){
//    return 5 
//   }
//   else if (item < 45){
//    return 6 
//   }
//   else return 100
// }
// //}());