
function dataOmzet() {
	let result = fetch('../convertcsvdata.json') 
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
		bubbleChart2(newResults)
		//chart3(newResults)
})
}
dataOmzet() 

function bubbleChart(results) {


// ------------- IK GING NAAR DE POLITIE TOE DATA VOOR UPDATE -----------------

const ikGing = results.filter(item => {
	if(item.totstand == "Ik ging naar de politie toe"){
		return item
	}
})

let newData = d3.nest()
	.key(d => d.afkomst)
	.key(d => d.totstand)
	.rollup(leaves => leaves.length)
	.entries(ikGing)

newData = newData.flat()
console.log(newData)

// ------------- POLITIE KWAM NAAR MIJ TOE DATA VOOR UPDATE -----------------

const popoNaarMij = results.filter(item => {
	if(item.totstand == "De politie kwam naar mij toe"){
		return item
	}
})
 //console.log('Naar mij', popoNaarMij)
 let newData2 = d3.nest()
	.key(d => d.afkomst)
	.key(d => d.totstand)
	.rollup(leaves => leaves.length)
	.entries(popoNaarMij)

newData2 = newData2.flat()

console.log(newData2)

// ------------- WEGHALEN VAN 99999 WAARDES EN TRANSFORMEREN VAN DATA VOOR CONTACT MET POLITIE -----------------
	function remove99999(data){
		data.forEach(data => {
			for (let key in data) {
				if (data[key] == '99999') {
				delete data[key];
				}
			}
		});
		return data;
	}
	data = remove99999(results);

		function transformData(data){
			let transformed =  d3.nest()
				  .key(d => d.afkomst)
				.rollup(function(v) { 
						return d3.sum(v, function(d) { return d.freqcontact; });
					 })
				.entries(data)
			return transformed
		}

		data = transformData(data)

		// console.log("transformed: ", data)

		let datasetSub = JSON.stringify(data);
		dataset = {"children": JSON.parse(datasetSub)}
		// console.log(dataset)	

// -------------------- BEGIN VAN BUBBLE CHART ----------------------------
		var diameter = 600;

		var color = d3.scaleOrdinal(d3.schemeCategory20);
		var bubble = d3.pack(dataset)
		.size([diameter, diameter])
		.padding(1.5);

		var bubble2 = d3.pack(newData.map(d => d.values))
		.size([diameter, diameter])
		.padding(1.5);
		console.log('23', newData)

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
		.sum(function(d) { return Math.sqrt(d.value); });

		var nodes2 = d3.hierarchy(newData)
		.sum(function(d) { return Math.sqrt(d.value); });
		console.log('node2', nodes2)

		var node = svg.selectAll(".node")
		.data(bubble(nodes).leaves())
		.enter()
		.append("g")
		.attr("class", "node")
		.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")";
		})
		.on("mouseover", function(d) {
			div.transition()
				.duration(200)
				.style("opacity", .9);
			div.html(d.data.key + "<br/>" + d.data.value)
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px")
			})
		.on("mouseout", function(d) {
			div.transition()
				.duration(500)
				.style("opacity", 0);
			});

		node.append("title")
		.text(function(d) {
			return d.key + ": " + d.value;
		});

		node.append("circle")
		.transition(animation)
		.attr("r", function(d) {
			return d.r ;
		})
		.style("fill", function(d) {
			return color(Math.random());
		});

		// 		var cs = [];
		// data.forEach(function(d){
		// 		//if(!cs.contains(d.group)) {
		// 		//	cs.push(d.group);
		// 		//}
		// });

		node.append("text")
		.attr("dy", ".3em")
		.style("text-anchor", "middle")
		.text(function(d) {
			return d.data.key.substring(0, d.r ) + ": " + d.data.value;
		});

		d3.select(self.frameElement)
		.style("height", diameter + "px");

		node.exit().remove()

// ------------- UPDATE FUNCTIE IN BUBBLE CHART -----------------
	function update(){

			node
			.data(bubble2(nodes2).leaves())
			.transition(animation)
			.attr("r", function(d) {
				console.log( d)
						})

		}

		let button = d3.select('body').append('button')
		//let button = d3.select('body').append('button2')

		button
		.text('Contact door Amsterdammers')
		.on('click', update)

		// button2
		// .text('Contact door de politie')
		// .on('click', update)

}

	function bubbleChart2(results) {

		function remove99999(data){
			data.forEach(data => {
				for (let key in data) {
					if (data[key] == '99999') {
					delete data[key];
					}
				}
			});
			return data;
		}
		data = remove99999(results);
	
			function transformData(data){
				let transformed =  d3.nest()
					  .key(d => d.afkomst)
					.rollup(function(v) { 
							return d3.sum(v, function(d) { return d.freqcontact; });
						 })
					.entries(data)
				return transformed
			}
	
			data = transformData(data)
	
			console.log("transformed: ", data)
	
			let datasetSub = JSON.stringify(data);
			dataset = {"children": JSON.parse(datasetSub)}
			console.log(dataset)	
	
	
			var diameter = 600;
	
			var color = d3.scaleOrdinal(d3.schemeCategory20);
			var bubble = d3.pack(dataset)
			.size([diameter, diameter])
			.padding(1.5);
	
			var svg = d3.select(".chart2")
			.append("svg")
			.attr("width", diameter)
			.attr("height", diameter)
			.attr("class", "bubble");
	
			var div = d3.select("body").append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);	
	
			var nodes = d3.hierarchy(dataset)
			.sum(function(d) { return Math.sqrt(d.value); });
			
	
			var node = svg.selectAll(".node")
			.data(bubble(nodes).leaves())
			.enter()
			.filter(function(d){
				return  !d.children
			})
			.append("g")
			.attr("class", "node")
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			})
			.on("mouseover", function(d) {
				console.log(d)
				div.transition()
					.duration(200)
					.style("opacity", .9);
				div.html(d.data.key + "<br/>" + d.data.value)
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 28) + "px")
				})
			.on("mouseout", function(d) {
				div.transition()
					.duration(500)
					.style("opacity", 0);
				});
	
			node.append("title")
			.text(function(d) {
				return d.key + ": " + d.value;
			});
	
			node.append("circle")
			.attr("r", function(d) {
				return (d.r) ;
			})
			.style("fill", function(d) {
				return color(Math.random());
			});
	
					var cs = [];
			data.forEach(function(d){
					if(!cs.contains(d.group)) {
						cs.push(d.group);
					}
			});
	
			node.append("text")
			.attr("dy", ".3em")
			.style("text-anchor", "middle")
			.text(function(d) {
				return d.data.key.substring(0, d.r ) + ": " + d.data.value;
			});
	
			d3.select(self.frameElement)
			.style("height", diameter + "px");
		}

	 
		(function($) {
			"use strict"; 
			
			/* Navbar Scripts */
			// jQuery to collapse the navbar on scroll
			$(window).on('scroll load', function() {
				if ($(".navbar").offset().top > 20) {
					$(".fixed-top").addClass("top-nav-collapse");
				} else {
					$(".fixed-top").removeClass("top-nav-collapse");
				}
			});
		
			// jQuery for page scrolling feature - requires jQuery Easing plugin
			$(function() {
				$(document).on('click', 'a.page-scroll', function(event) {
					var $anchor = $(this);
					$('html, body').stop().animate({
						scrollTop: $($anchor.attr('href')).offset().top
					}, 600, 'easeInOutExpo');
					event.preventDefault();
				});
			});
		
			// closes the responsive menu on menu item click
			$(".navbar-nav li a").on("click", function(event) {
			if (!$(this).parent().hasClass('dropdown'))
				$(".navbar-collapse").collapse('hide');
			});
		})


		// dataset2 = {
// 	"children": [{
// 		"facilityId": "NL",
// 		"responseCount": 2
// 	}, {
// 		"facilityId": "Arubaans",
// 		"responseCount": 2
// 	}, {
// 		"facilityId": "Marokkaans",
// 		"responseCount": 1
// 	}, {
// 		"facilityId": "Indonesisch",
// 		"responseCount": 2
// 	}, {
// 		"facilityId": "Curacaos",
// 		"responseCount": 3
// 	}, {
// 		"facilityId": "Anders",
// 		"responseCount": 1
// 	}]
// };
//console.log(dataset2)
	
//function chart3 (results){

		// function remove99999(data){
		// 	data.forEach(data => {
		// 		for (let key in data) {
		// 			if (data[key] == '99999') {
		// 			delete data[key];
		// 			}
		// 		}
		// 	});
		// 	return data;
		// }
		// data = remove99999(results);
	
		// 	function transformData(data){
		// 		let transformed =  d3.nest()
		// 			  .key(d => d.afkomst)
		// 			.rollup(function(v) { 
		// 					return d3.sum(v, function(d) { return d.freqcontact; });
		// 				 })
		// 			.entries(data)
		// 		return transformed
		// 	}
	
		// 	data = transformData(data)
	
		// 	console.log("transformed: ", data)
	
		// 	let datasetSub = JSON.stringify(data);
		// 	dataset = {"children": JSON.parse(datasetSub)}
		// 	console.log(dataset)	
// // set the dimensions and margins of the graph
// var margin = {top: 10, right: 30, bottom: 30, left: 60},
//     width = 460 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;

// // append the svg object to the body of the page
// var svg = d3.select("#chart3")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");

//   // Add X axis
//   var x = d3.scaleLinear()
//     .domain([0, 4000])
//     .range([ 0, width ]);
//   svg.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x));

//   // Add Y axis
//   var y = d3.scaleLinear()
//     .domain([0, 500000])
//     .range([ height, 0]);
//   svg.append("g")
//     .call(d3.axisLeft(y));

//   // Add dots
//   svg.append('g')
//     .selectAll("dot")
//     .data(dataset)
//     .enter()
//     .append("circle")
//       .attr("cx", function (d) { return x(d.key); } )
//       .attr("cy", function (d) { return y(d.value); } )
//       .attr("r", 1.5)
//       .style("fill", "#69b3a2")

// }
// set the dimensions and margins of the graph
// var margin = {top: 10, right: 30, bottom: 40, left: 50},
//     width = 520 - margin.left - margin.right,
//     height = 520 - margin.top - margin.bottom;

// // append the svg object to the body of the page
// var svg = d3.select("#chart3")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")")

// // Add the grey background that makes ggplot2 famous
// svg
//   .append("rect")
//     .attr("x",0)
//     .attr("y",0)
//     .attr("height", height)
//     .attr("width", height)
//     .style("fill", "EBEBEB")

// //Read the data
// var dataset = [
	
// ]
// function data(data) {

//   // Add X axis
//   var x = d3.scaleLinear()
//     .domain([4*0.95, 8*1.001])
//     .range([ 0, width ])
//   svg.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x).tickSize(-height*1.3).ticks(10))
//     .select(".domain").remove()

//   // Add Y axis
//   var y = d3.scaleLinear()
//     .domain([-0.001, 9*1.01])
//     .range([ height, 0])
//     .nice()
//   svg.append("g")
//     .call(d3.axisLeft(y).tickSize(-width*1.3).ticks(7))
//     .select(".domain").remove()

//   // Customization
//   svg.selectAll(".tick line").attr("stroke", "white")

//   // Add X axis label:
//   svg.append("text")
//       .attr("text-anchor", "end")
//       .attr("x", width/2 + margin.left)
//       .attr("y", height + margin.top + 20)
//       .text("Sepal Length");

//   // Y axis label:
//   svg.append("text")
//       .attr("text-anchor", "end")
//       .attr("transform", "rotate(-90)")
//       .attr("y", -margin.left + 20)
//       .attr("x", -margin.top - height/2 + 20)
//       .text("Petal Length")

//   // Color scale: give me a specie name, I return a color
//   var color = d3.scaleOrdinal()
//     .domain(["setosa", "versicolor", "virginica" ])
//     .range([ "#F8766D", "#00BA38", "#619CFF"])

//   // Add dots
//   svg.append('g')
//     .selectAll("dot")
//     .data(data)
//     .enter()
//     .append("circle")
//       .attr("cx", function (d) { return x(d.Sepal_Length); } )
//       .attr("cy", function (d) { return y(d.Petal_Length); } )
//       .attr("r", 5)
//       .style("fill", function (d) { return color(d.Species) } )


//}}
// var data = [
// 	[10, 20], [20, 100], [200, 50],
// 	[25, 80], [10, 200], [150, 75],
// 	[10, 70], [30, 150], [100, 15]
//   ]
//   // set the dimensions and margins of the graph
// var margin = {top: 10, right: 20, bottom: 40, left: 200},
// width = 1000 - margin.left - margin.right,
// height = 600 - margin.top - margin.bottom;

// // create svg element, respecting margins
// var svg = d3.select("#chart3")
// 	.append("svg")
// 	.attr("width", width + margin.left + margin.right)
// 	.attr("height", height + margin.top + margin.bottom)
// 	.append("g")
// 	.attr("transform",
// 		"translate(" + margin.left + "," + margin.top + ")");

// // Add X axis
// var x = d3.scaleLinear()
// 	.domain([0, 10])
// 	.range([0, width]);

// svg.append("g")
// .attr("transform", "translate(0," + height + ")")
// .attr("class", "axisWhite")
// .call(d3.axisBottom(x))


// // Add Y axis
// var y = d3.scaleBand()
// 	.domain(["Ik ging naar de politie", "De politie kwam naar mij"])         // This is what is written on the Axis: from 0 to 100
// 	.range([ height, 0]);

// svg.append("g")
// 	.attr("class", "axisWhite")
// 	.call(d3.axisLeft(y))
// 	.selectAll("text")
// 		.style("text-anchor", "end")
// 		.style("font-size", 10)
// 		.style("fill", "white")

// // Add X axis label:
// svg.append("text")
// .attr("text-anchor", "end")
// .attr("x", width)
// .attr("y", height + margin.top + 20)
// .text("Wat voor cijfers geven amsterdammers de politie?");

// // Y axis label:
// svg.append("text")
// .attr("text-anchor", "end")
// .attr("transform", "rotate(-90)")
// .attr("y", -margin.left+20)
// .attr("x", -margin.top)
// .text("Ik ging naar de politie")


//   svg.selectAll("circle")
// 	 .data(data).enter()
// 	 .append("circle")
// 	 .attr("cx", function(d) {return d[0]})
// 	 .attr("cy", function(d) {return d[1]})
// 	 .attr("r", 6)
// 	 .attr("fill", function(d) {
// 		return "rgb("+d[0]+","+d[1]+",0)"
// 	  })

// // var w = 940,
// //     h = 300,
// //     pad = 20,
// //     left_pad = 100,
// // 	Data_url = '/data.json';
	
// // 	var svg = d3.select("#chart3")
// //         .append("svg")
// //         .attr("width", w)
// // 		.attr("height", h);
	
	
	
// // 	svg.append("g")
// //     .attr("class", "axis")
// //     .attr("transform", "translate(0, "+(h-pad)+")")
// //     .call(xAxis);
 
// // svg.append("g")
// //     .attr("class", "axis")
// //     .attr("transform", "translate("+(left_pad-pad)+", 0)")
// //     .call(yAxis);
// // }
// 	}
